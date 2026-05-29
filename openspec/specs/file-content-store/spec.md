## Requirements

### Requirement: File content Zustand store slice
The system SHALL provide a Zustand store slice within `@project/state` that caches file contents in memory keyed by `(projectId, path)` tuple. Each entry SHALL have `data`, `currentVersion`, `savedVersion`, `savedAt`, `error`, and `loading` fields. Derived state (`isDirty`, `isSaving`, `isLoading`, `isError`) SHALL be computed from these fields. The store SHALL be the single source of truth; filesystem is an async persistence layer only.

#### Scenario: Store holds file contents with version pair
- **WHEN** the store slice is initialized
- **THEN** it SHALL expose a `fileContents` record mapping cache keys (string) to entries containing `data` (`ArrayBuffer | null | undefined`), `currentVersion` (number), `savedVersion` (number), `savedAt` (number | null), `error` (string | null), and `loading` (boolean)

#### Scenario: writeBuffer sets buffer content
- **WHEN** `writeBuffer("mod.hjson", '{"name":"test"}')` is called with text content
- **THEN** `data` SHALL be set to the `TextEncoder.encode()` result (an `ArrayBuffer`), `currentVersion` SHALL increment by 1, `savedVersion` SHALL remain unchanged, `error` SHALL be cleared, and `loading` SHALL be set to `false`

#### Scenario: markPersisted syncs savedVersion
- **WHEN** `markPersisted("mod.hjson")` is called
- **THEN** `savedVersion` SHALL be set to `currentVersion` and `savedAt` SHALL be updated

#### Scenario: setBufferError sets error without touching versions
- **WHEN** `setBufferError("mod.hjson", "Write failed")` is called
- **THEN** `error` SHALL be set to "Write failed", but `currentVersion` and `savedVersion` SHALL remain unchanged

#### Scenario: clearFileContent removes cached entry
- **WHEN** `clearFileContent("mod.hjson")` is called
- **THEN** the entry SHALL be removed from `fileContents`

### Requirement: useFileContent hook
The system SHALL provide a `useFileContent(path)` React hook that returns `{ data, currentVersion, savedVersion, savedAt, error, isDirty, isSaving, isLoading, isError, update }`.

#### Scenario: Returns derived state
- **WHEN** the hook is called with `"mod.hjson"`
- **THEN** it SHALL return `{ data: ArrayBuffer | null, currentVersion: number, savedVersion: number, savedAt: number | null, error: string | null, isDirty: boolean, isSaving: boolean, isLoading: boolean, isError: boolean, update: (content: ArrayBuffer | string) => void }`

#### Scenario: Loads from disk on first access
- **WHEN** the hook is called with a path that has no cached entry
- **THEN** it SHALL call `ProjectFileSystem.readFile(path)` and populate the cache

#### Scenario: Sets loading flag during fetch
- **WHEN** the file is being loaded from disk
- **THEN** `isLoading` SHALL be `true` until the read completes

#### Scenario: Sets error on read failure
- **WHEN** `readFile` throws an error
- **THEN** `error` SHALL be set and `isError` SHALL be `true`

#### Scenario: Stale read result discarded
- **WHEN** a read completes but the file's `currentVersion` has changed since the read was initiated
- **THEN** the result SHALL be discarded and the store SHALL NOT be updated

#### Scenario: Cancels in-flight read on path change
- **WHEN** `path` changes and a read for the previous path is still in-flight
- **THEN** the previous read SHALL be aborted via AbortController

### Requirement: Update triggers buffer write and enqueues persist
The hook's `update` action SHALL write to the in-memory buffer and enqueue a disk write independently.

#### Scenario: update writes buffer and enqueues
- **WHEN** `update("new content")` is called
- **THEN** the value SHALL immediately be set in the buffer via `writeBuffer`, `currentVersion` incremented, and a write SHALL be enqueued in the WriteQueue

#### Scenario: Write success syncs savedVersion
- **WHEN** a write succeeds
- **THEN** `markPersisted(path)` SHALL be called, syncing `savedVersion` to `currentVersion` and updating `savedAt`

#### Scenario: Write error sets error (preserves buffer)
- **WHEN** a write fails
- **THEN** `setBufferError(path, err)` SHALL be called, but `data`, `currentVersion`, and `savedVersion` SHALL remain unchanged

#### Scenario: Stale write completion discarded
- **WHEN** a write promise resolves but `currentVersion` has changed since it was enqueued
- **THEN** the completion SHALL be discarded (no state update)

### Requirement: EventBus integration for external changes
The hook SHALL respond to `file:changed` events emitted via the project's EventBus.

#### Scenario: Reload on external change (if buffer not dirty)
- **WHEN** a `file:changed` event is emitted with kind "write" and `isDirty` is `false`
- **THEN** the store SHALL reload the file from disk

#### Scenario: Skip reload if buffer is dirty
- **WHEN** a `file:changed` event is emitted and `isDirty` is `true`
- **THEN** the store SHALL NOT reload from disk (local edits take precedence)

#### Scenario: Clear on external delete
- **WHEN** a `file:changed` event is emitted with kind "delete"
- **THEN** the cached entry for that path SHALL be cleared

### Requirement: Cache cleanup on project close
The system SHALL flush pending writes and clear per-project buffers when closing a project, but SHALL NOT clear buffers on project switch.

#### Scenario: Flush and clear on project close
- **WHEN** `closeProject()` is called
- **THEN** the WriteQueue for that project SHALL flush all pending writes
- **AND** all buffer entries for that project SHALL be removed from the cache
- **AND** validation results for that project SHALL be cleared

#### Scenario: Buffers NOT cleared on project switch
- **WHEN** `setCurrentProject(newContext)` is called with a different project ID
- **THEN** the WriteQueue for the old project SHALL be flushed and disposed
- **BUT** the file buffer entries for the old project SHALL remain in the cache

### Requirement: Store provides readFile action
The file-content-store SHALL provide a `readFile(projectId, path, fs)` action that reads file content from disk, manages abort coordination, and does NOT reset versions.

#### Scenario: readFile loads from disk without resetting version
- **WHEN** `readFile(projectId, "mod.hjson", fs)` is called
- **THEN** the store SHALL set `loading` to `true`, call `ProjectFileSystem.readFile("mod.hjson")`, and on success set `data` to the `ArrayBuffer` content, set `loading` to `false`, and set `savedVersion = currentVersion` (currentVersion is NOT reset)
- **AND** if a previous read for the same path is in-flight, it SHALL be aborted

#### Scenario: readFile handles not found
- **WHEN** `ProjectFileSystem.readFile` throws a `NotFoundError`
- **THEN** the store SHALL set `data` to an empty `ArrayBuffer` (byte length 0), `loading` to `false`, and `savedVersion = currentVersion`

#### Scenario: readFile discards stale results
- **WHEN** a read completes but `currentVersion` has been incremented since the read started
- **THEN** the result SHALL be discarded and the store SHALL NOT be updated

### Requirement: Store provides subscribeToEvents action
The file-content-store SHALL provide a `subscribeToEvents(projectId, path, events, fs)` action that subscribes to `file:changed` events for a given path and returns an unsubscribe function.

#### Scenario: Reload on external change
- **WHEN** a `file:changed` event is emitted with event kind "write" and matching path, and `isDirty` is `false`
- **THEN** the store SHALL reload the file from disk

#### Scenario: Skip reload if dirty
- **WHEN** a `file:changed` event is emitted with matching path, but `isDirty` is `true`
- **THEN** the store SHALL NOT reload from disk

#### Scenario: Clear on external delete
- **WHEN** a `file:changed` event is emitted with event kind "delete" and matching path
- **THEN** the store SHALL clear the cached entry for that path

#### Scenario: Unsubscribe stops listening
- **WHEN** the returned unsubscribe function is called
- **THEN** the store SHALL stop processing `file:changed` events for that path

### Requirement: Store provides cleanup action
The file-content-store SHALL provide a `cleanup(projectId, path)` action that aborts in-flight reads, unsubscribes event listeners, and clears validation results for that path.

#### Scenario: Cleanup aborts reads and unsubscribes
- **WHEN** `cleanup(projectId, "mod.hjson")` is called
- **THEN** any in-flight read for that path SHALL be aborted
- **AND** event listeners for that path SHALL be unsubscribed
- **AND** validation results for that path SHALL be cleared

### Requirement: Store provides writeBuffer action
The file-content-store SHALL provide a `writeBuffer(projectId, path, content)` action that updates the in-memory buffer, increments `currentVersion`, and clears errors.

#### Scenario: writeBuffer increments version
- **WHEN** `writeBuffer(projectId, "mod.hjson", "new content")` is called
- **THEN** `currentVersion` SHALL increment by 1 relative to its previous value
- **AND** `savedVersion` SHALL remain unchanged

#### Scenario: writeBuffer clears error
- **WHEN** `writeBuffer(projectId, "mod.hjson", "content")` is called and the file has a prior error
- **THEN** `error` SHALL be set to `null`

### Requirement: Store provides markPersisted action
The file-content-store SHALL provide a `markPersisted(projectId, path)` action that syncs `savedVersion` to `currentVersion` after a successful disk write.

#### Scenario: markPersisted after write
- **WHEN** `markPersisted(projectId, "mod.hjson")` is called
- **THEN** `savedVersion` SHALL equal `currentVersion`
- **AND** `savedAt` SHALL be set to `Date.now()`

### Requirement: Store provides setBufferError action
The file-content-store SHALL provide a `setBufferError(projectId, path, error)` action that records a write error without modifying versions.

#### Scenario: setBufferError on write failure
- **WHEN** `setBufferError(projectId, "mod.hjson", "Disk full")` is called
- **THEN** `error` SHALL equal "Disk full"
- **AND** `currentVersion` and `savedVersion` SHALL remain unchanged

### Requirement: LRU eviction
The store SHALL enforce a configurable maximum number of cached file entries (default 100). When the limit is exceeded, the least recently used entry SHALL be evicted.

#### Scenario: Oldest entry evicted on overflow
- **WHEN** a new file buffer is written and the cache size exceeds `maxEntries`
- **THEN** the entry with the oldest access time SHALL be evicted from the store

#### Scenario: WriteBuffer bumps LRU order
- **WHEN** `writeBuffer` is called for an existing cached entry
- **THEN** that entry SHALL be marked as recently used

#### Scenario: Explicit clear removes from LRU
- **WHEN** `clearFileContent` is called
- **THEN** the entry SHALL be removed from the cache and does NOT count toward the LRU limit

### Requirement: Store provides initialize/registerValidationListener action
The file-content-store SHALL provide a function that registers a validation subscriber on the store. The subscriber SHALL trigger validation when `currentVersion` changes.

#### Scenario: Subscriber registered
- **WHEN** `registerValidationListener()` is called
- **THEN** it SHALL subscribe to `fileContents` changes and trigger validation on each `currentVersion` change

### Requirement: Store provides selectEntry, selectIsSaving, and getEntry selector/accessor functions
The file-content-store SHALL export selector factory functions that encapsulate the composite key construction (`cacheKey(projectId, path)`), so consumers do not need to build `${projectId}::${path}` strings manually.

#### Scenario: selectEntry returns entry for given project and path
- **WHEN** `selectEntry(projectId, path)` is passed to `useFileContentStore`
- **THEN** it SHALL return the entry at `fileContents[cacheKey(projectId, path)]`

#### Scenario: selectIsSaving returns saving status for given project and path
- **WHEN** `selectIsSaving(projectId, path)` is passed to `useFileContentStore`
- **THEN** it SHALL return whether `savingPaths` includes `cacheKey(projectId, path)`

#### Scenario: getEntry returns entry directly via getState
- **WHEN** `getEntry(projectId, path)` is called
- **THEN** it SHALL return the entry at `fileContents[cacheKey(projectId, path)]` using `useFileContentStore.getState()`

### Requirement: FileContentEntry data defaults to undefined for uncached entries
The system SHALL represent uncached (not-yet-loaded) entries as `undefined` in the store's `fileContents` record, while loaded entries use `ArrayBuffer | null`.

#### Scenario: Uncached entry returns undefined
- **WHEN** `selectEntry(projectId, path)` is called for a path that has never been loaded
- **THEN** the selector SHALL return `undefined`

### Requirement: useFileContentString hook wraps useFileContent with string decoding
The system SHALL provide a `useFileContentString(path)` React hook that wraps `useFileContent(path)` and decodes the `ArrayBuffer` data to a string using `TextDecoder`.

#### Scenario: Returns decoded string from ArrayBuffer data
- **WHEN** `useFileContentString("mod.hjson")` is called and the underlying `useFileContent` returns `data` as an `ArrayBuffer` containing UTF-8 encoded text
- **THEN** the returned `data` field SHALL be the decoded string (via `TextDecoder().decode(data)`)

#### Scenario: Returns null when data is null
- **WHEN** `useFileContentString("mod.hjson")` is called and the underlying `useFileContent` returns `data` as `null`
- **THEN** the returned `data` field SHALL be `null`

#### Scenario: Returns empty string when data is zero-length ArrayBuffer
- **WHEN** `useFileContentString("mod.hjson")` is called and `data` is an `ArrayBuffer` with `byteLength` of 0
- **THEN** the returned `data` SHALL be `""`

#### Scenario: write accepts string and encodes to ArrayBuffer
- **WHEN** `write("new content")` is called on the result of `useFileContentString`
- **THEN** it SHALL encode the string to `ArrayBuffer` via `TextEncoder.encode()` and pass it to the underlying `useFileContent().write()`

#### Scenario: All other fields pass through unchanged
- **WHEN** `useFileContentString(path)` is called
- **THEN** `currentVersion`, `savedVersion`, `savedAt`, `error`, `isDirty`, `isSaving`, `isLoading`, `isError` SHALL be the same values as returned by `useFileContent(path)`

### Requirement: useFileContentImageUrl hook manages blob URL lifecycle for images
The system SHALL provide a `useFileContentImageUrl(data)` React hook that creates a `Blob` with `image/png` type from the given `ArrayBuffer` and returns a memoized `blob:` URL, automatically revoking the previous URL on data change and on unmount.

#### Scenario: Returns null when data is null
- **WHEN** `useFileContentImageUrl(null)` is called
- **THEN** the returned value SHALL be `null`

#### Scenario: Returns blob URL when data is provided
- **WHEN** `useFileContentImageUrl(buffer)` is called with a non-null `ArrayBuffer`
- **THEN** the returned value SHALL be a string starting with `"blob:"`

#### Scenario: Revokes previous URL when data changes
- **WHEN** the `data` argument changes from one non-null `ArrayBuffer` to another
- **THEN** the previous object URL SHALL be revoked (via `URL.revokeObjectURL`)
- **AND** a new object URL SHALL be created for the new data

#### Scenario: Revokes URL on unmount
- **WHEN** the component using `useFileContentImageUrl` unmounts
- **THEN** the current object URL SHALL be revoked (via `URL.revokeObjectURL`)

#### Scenario: Blob is always created with image/png type
- **WHEN** `useFileContentImageUrl(buffer)` is called
- **THEN** the `Blob` SHALL be created with `{ type: "image/png" }`

#### Scenario: Returns null when data is zero-length
- **WHEN** `useFileContentImageUrl(buffer)` is called with an `ArrayBuffer` of `byteLength` 0
- **THEN** the returned value SHALL be `null` (no URL created for empty data)
