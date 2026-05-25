## MODIFIED Requirements

### Requirement: File content Zustand store slice
The system SHALL provide a Zustand store slice within `@project/state` that caches file contents in memory keyed by file path, with per-path state tracking including status (idle/dirty/saving/error), version counter, and savedAt timestamp. The store SHALL be the single source of truth; filesystem is an async persistence layer only.

#### Scenario: Store holds file contents map with extended fields
- **WHEN** the store slice is initialized
- **THEN** it SHALL expose a `fileContents` record mapping file paths (string) to entries containing `data` (string | null), `status` (FileStatus), `error` (string | null), `version` (number), and `savedAt` (number | null)

#### Scenario: setFileContent sets cached content
- **WHEN** `setFileContent("mod.hjson", '{"name":"test"}', 0)` is called
- **THEN** `fileContents["mod.hjson"]` SHALL have `data` equal to given content, `status` idle, `version` equal to given version, `savedAt` set, and `error` null

#### Scenario: setFileLoading transitions to loading state
- **WHEN** `setFileLoading("mod.hjson")` is called
- **THEN** `fileContents["mod.hjson"].status` SHALL be `loading` (a transient state before idle)

#### Scenario: setFileError preserves data
- **WHEN** `setFileError("mod.hjson", "Not found")` is called
- **THEN** `fileContents["mod.hjson"].status` SHALL be `error`, `error` SHALL equal "Not found", and `data` SHALL remain unchanged (not null)

#### Scenario: clearFileContent removes cached entry
- **WHEN** `clearFileContent("mod.hjson")` is called
- **THEN** the `mod.hjson` entry SHALL be removed from `fileContents`

### Requirement: useFileContent hook
The system SHALL provide a `useFileContent(path)` React hook that returns `{ data, status, error, version, savedAt, update }` and acts as the single source of truth for that file's content.

#### Scenario: Returns current state with status
- **WHEN** the hook is called with `"mod.hjson"`
- **THEN** it SHALL return `{ data: string | null, status: FileStatus, error: string | null, version: number, savedAt: number | null, update: (content: string) => void }`

#### Scenario: Loads from disk on first access
- **WHEN** the hook is called with a path that has no cached entry
- **THEN** it SHALL call `ProjectFileSystem.readTextFile(path)`, set version to 0, and populate the cache with status `idle`

#### Scenario: Sets loading status during fetch
- **WHEN** the file is being loaded from disk
- **THEN** `status` SHALL be `loading` until the read completes

#### Scenario: Sets error status on read failure (preserves data)
- **WHEN** `readTextFile` throws an error
- **THEN** `status` SHALL be `error` containing the error message and data SHALL remain null (no prior data to preserve)

#### Scenario: Stale read result discarded
- **WHEN** a read completes but the file's version has changed since the read was initiated
- **THEN** the result SHALL be discarded and the store SHALL NOT be updated

#### Scenario: Cancels in-flight read on path change
- **WHEN** `path` changes and a read for the previous path is still in-flight
- **THEN** the previous read SHALL be aborted via AbortController

### Requirement: Centralized debounced write queue
The system SHALL use a centralized `WriteQueue` to persist file content changes, instead of each hook managing its own debounce timer.

#### Scenario: Update triggers dirty status and enqueues write
- **WHEN** `update("new content")` is called
- **THEN** the value SHALL immediately be set in memory with status `dirty`, version incremented, and a write SHALL be enqueued in the centralized WriteQueue

#### Scenario: Consecutive updates debounce
- **WHEN** `update` is called multiple times within the debounce window
- **THEN** only the last value SHALL be written to disk (previous enqueued writes for the path are replaced)

#### Scenario: Write success updates savedAt
- **WHEN** a write succeeds
- **THEN** the file's status SHALL become `idle`, `savedAt` SHALL update, and version remains unchanged

#### Scenario: Write error sets error status (preserves data)
- **WHEN** a write fails
- **THEN** the file's status SHALL become `error`, error message set, but `data` SHALL remain unchanged

#### Scenario: Stale write completion discarded
- **WHEN** a write promise resolves but the version has changed since it was enqueued
- **THEN** the completion SHALL be discarded (a newer version already superseded it)

### Requirement: EventBus integration for external changes
The hook SHALL respond to `file:changed` events emitted via the project's EventBus, but SHALL skip reload if the file is dirty.

#### Scenario: Reload on external change (if not dirty)
- **WHEN** a `file:changed` event is emitted with the same path and kind "write", and the file's status is `idle`
- **THEN** the hook SHALL reload the file content from disk

#### Scenario: Skip reload if dirty
- **WHEN** a `file:changed` event is emitted with the same path and kind "write", and the file's status is `dirty` or `saving`
- **THEN** the hook SHALL NOT reload from disk (local edits take precedence)

#### Scenario: Clear on external delete
- **WHEN** a `file:changed` event is emitted with the same path and kind "delete"
- **THEN** the cached entry for that path SHALL be cleared and `data` SHALL be null

### Requirement: Cache cleanup on project close
The system SHALL flush all pending writes and clear the file content cache when the active project changes.

#### Scenario: Flush and clear on project close
- **WHEN** `closeProject()` is called on the Zustand store
- **THEN** the WriteQueue SHALL flush all pending writes, then all entries in `fileContents` SHALL be cleared

#### Scenario: Clear on project switch
- **WHEN** `setCurrentProject(newContext)` is called with a different project ID
- **THEN** the WriteQueue for the old project SHALL be flushed and disposed, and entries from the previous project SHALL be cleared from `fileContents`

#### Scenario: Cache preserved when same project re-opened
- **WHEN** the same project is set as current again (same project ID)
- **THEN** existing cached file contents SHALL NOT be cleared

### Requirement: Selector optimization
The store SHALL provide optimized selectors that prevent re-render when unrelated file entries change.

#### Scenario: Per-path selector with shallow equality
- **WHEN** a component subscribes to `fileContents["mod.hjson"]`
- **THEN** it SHALL only re-render when the specific entry for `mod.hjson` changes, not when other paths change
