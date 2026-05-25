## ADDED Requirements

### Requirement: Store provides readFile action
The file-content-store SHALL provide a `readFile(path)` action that reads file content from disk, manages abort coordination, and updates the store.

#### Scenario: readFile loads from disk
- **WHEN** `readFile("mod.hjson")` is called
- **THEN** the store SHALL set status to `loading`, call `ProjectFileSystem.readTextFile("mod.hjson")`, and on success set status to `idle` with the file data
- **AND** if a previous read for the same path is in-flight, it SHALL be aborted

#### Scenario: readFile handles error
- **WHEN** `readFile("mod.hjson")` is called and `readTextFile` throws
- **THEN** the store SHALL set status to `error` with the error message

#### Scenario: readFile handles not found
- **WHEN** `readTextFile` throws a `NotFoundError`
- **THEN** the store SHALL set the file content to empty string with status `idle`

#### Scenario: readFile discards stale results
- **WHEN** a read completes but the file's version has been incremented since the read started
- **THEN** the result SHALL be discarded and the store SHALL NOT be updated

### Requirement: Store provides subscribeToEvents action
The file-content-store SHALL provide a `subscribeToEvents(path)` action that subscribes to `file:changed` events for a given path and returns an unsubscribe function.

#### Scenario: Reload on external change
- **WHEN** a `file:changed` event is emitted with event kind "write" and matching path, and the current status is `idle`
- **THEN** the store SHALL reload the file from disk

#### Scenario: Skip reload if dirty
- **WHEN** a `file:changed` event is emitted with matching path, but the current status is `dirty` or `saving`
- **THEN** the store SHALL NOT reload from disk

#### Scenario: Clear on external delete
- **WHEN** a `file:changed` event is emitted with event kind "delete" and matching path
- **THEN** the store SHALL clear the cached entry for that path

#### Scenario: Unsubscribe stops listening
- **WHEN** the returned unsubscribe function is called
- **THEN** the store SHALL stop processing `file:changed` events for that path

### Requirement: Store provides cleanup action
The file-content-store SHALL provide a `cleanup(path)` action that aborts in-flight reads, unsubscribes event listeners, and clears validation results for that path.

#### Scenario: Cleanup aborts reads and unsubscribes
- **WHEN** `cleanup("mod.hjson")` is called
- **THEN** any in-flight read for that path SHALL be aborted
- **AND** event listeners for that path SHALL be unsubscribed
- **AND** validation results for that path SHALL be cleared

### Requirement: Store provides initialize/registerValidationListener action
The file-content-store SHALL provide a function that registers a validation subscriber on the store.

#### Scenario: Subscriber registered
- **WHEN** `registerValidationListener()` is called
- **THEN** it SHALL subscribe to `fileContents` changes and trigger validation on each dirty transition

## MODIFIED Requirements

### Requirement: Cache cleanup on project close
The system SHALL clear validation results when clearing file content cache. `clearAllFileContents` SHALL also clear validation results and dispose validation subscribers.

#### Scenario: Flush and clear on project close
- **WHEN** `closeProject()` is called on the Zustand store
- **THEN** the WriteQueue SHALL flush all pending writes
- **AND** `clearAllFileContents()` SHALL clear `fileContents`
- **AND** validation results for all paths SHALL be cleared

#### Scenario: Clear on project switch
- **WHEN** `setCurrentProject(newContext)` is called with a different project ID
- **THEN** the WriteQueue for the old project SHALL be flushed and disposed
- **AND** `clearAllFileContents()` SHALL clear all entries
- **AND** validation results for all paths SHALL be cleared
