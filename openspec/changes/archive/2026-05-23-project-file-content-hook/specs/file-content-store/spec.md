## ADDED Requirements

### Requirement: File content Zustand store slice
The system SHALL provide a Zustand store slice within `@project/state` that caches file contents in memory keyed by file path, with per-path loading and error states.

#### Scenario: Store holds file contents map
- **WHEN** the store slice is initialized
- **THEN** it SHALL expose a `fileContents` record mapping file paths (string) to their content (string), loading state (boolean), and error state (string | null)

#### Scenario: setFileContent sets cached content
- **WHEN** `setFileContent("mod.hjson", '{"name":"test"}')` is called
- **THEN** `fileContents["mod.hjson"]` SHALL have `data` equal to the given content, `isLoading` false, and `error` null

#### Scenario: setFileLoading sets loading flag
- **WHEN** `setFileLoading("mod.hjson")` is called
- **THEN** `fileContents["mod.hjson"].isLoading` SHALL be true

#### Scenario: setFileError sets error state
- **WHEN** `setFileError("mod.hjson", "Not found")` is called
- **THEN** `fileContents["mod.hjson"].error` SHALL equal "Not found"

#### Scenario: clearFileContent removes cached entry
- **WHEN** `clearFileContent("mod.hjson")` is called
- **THEN** the `mod.hjson` entry SHALL be removed from `fileContents`

### Requirement: useFileContent hook
The system SHALL provide a `useFileContent(path)` React hook that returns `{ data, isLoading, error, update }` and acts as the single source of truth for that file's content.

#### Scenario: Returns current state
- **WHEN** the hook is called with `"mod.hjson"`
- **THEN** it SHALL return `{ data: string | null, isLoading: boolean, error: string | null, update: (content: string) => void }`

#### Scenario: Loads from disk on first access
- **WHEN** the hook is called with a path that has no cached entry
- **THEN** it SHALL call `ProjectFileSystem.readTextFile(path)` and populate the cache with the result

#### Scenario: Sets loading state during fetch
- **WHEN** the file is being loaded from disk
- **THEN** `isLoading` SHALL be true until the read completes

#### Scenario: Sets error state on read failure
- **WHEN** `readTextFile` throws an error
- **THEN** `error` SHALL contain the error message and `isLoading` SHALL be false

### Requirement: Debounced save to disk
The system SHALL write file content changes to disk with configurable debounce.

#### Scenario: Update triggers debounced write
- **WHEN** `update("new content")` is called
- **THEN** the value SHALL immediately be set in the in-memory cache, and a debounced `ProjectFileSystem.writeTextFile(path, content)` call SHALL be scheduled

#### Scenario: Consecutive updates debounce
- **WHEN** `update` is called multiple times within the debounce window (default 500ms)
- **THEN** only the last value SHALL be written to disk

#### Scenario: Previous debounced write cancelled
- **WHEN** a new `update` call occurs before the debounce timer fires
- **THEN** the previous pending debounced write SHALL be cancelled

### Requirement: EventBus integration for external changes
The hook SHALL respond to `file:changed` events emitted via the project's EventBus.

#### Scenario: Reload on external file change
- **WHEN** a `file:changed` event is emitted with the same path and kind "write"
- **THEN** the hook SHALL reload the file content from disk

#### Scenario: Clear on external delete
- **WHEN** a `file:changed` event is emitted with the same path and kind "delete"
- **THEN** the cached entry for that path SHALL be cleared and `data` SHALL be null

### Requirement: Cache cleanup on project close
The system SHALL clear all file content cache entries when the project is closed.

#### Scenario: Clear all on project close
- **WHEN** `closeProject()` is called on the Zustand store
- **THEN** all entries in `fileContents` SHALL be cleared
