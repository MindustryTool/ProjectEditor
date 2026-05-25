## ADDED Requirements

### Requirement: Validation triggered by version change
The validation listener SHALL trigger file validation when a file's `currentVersion` changes, instead of monitoring status transitions.

#### Scenario: Validation on version increment
- **WHEN** `writeBuffer(path, content)` is called and `currentVersion` increments
- **THEN** the listener SHALL schedule a validation run for that file after a debounce of 500ms

#### Scenario: Validation uses in-memory buffer
- **WHEN** validation runs for a file
- **THEN** it SHALL validate the in-memory `data` from the store, not read from disk

#### Scenario: No validation on load
- **WHEN** `readFile` populates the buffer with data from disk
- **THEN** the listener SHALL NOT trigger validation (currentVersion does not change on read)

### Requirement: Validation clears on file removal
The listener SHALL clear validation results when a file entry is removed from the store.

#### Scenario: Clear on file delete
- **WHEN** `clearFileContent(path)` is called or a file is deleted externally
- **THEN** the listener SHALL call `useValidationStore.getState().clearResults(path)`
