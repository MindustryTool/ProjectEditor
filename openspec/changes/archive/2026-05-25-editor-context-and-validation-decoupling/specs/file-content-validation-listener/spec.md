## ADDED Requirements

### Requirement: Validation listener subscribes to file content changes
The system SHALL register a global listener on the file-content-store that triggers file validation whenever a file's status transitions to "dirty".

#### Scenario: Validation triggered on content change
- **WHEN** `setFileDirty(path, content, version)` is called
- **THEN** the listener SHALL schedule a validation run for that file after a debounce of 500ms

#### Scenario: Debounced validation
- **WHEN** `setFileDirty` is called multiple times within 500ms for the same path
- **THEN** the listener SHALL reset the debounce timer and only run validation once after the last call

#### Scenario: Validation result stored in validation store
- **WHEN** validation runs for a file
- **THEN** the results SHALL be stored via `useValidationStore.getState().setResults(path, results)`

#### Scenario: Validation cleared on file remove
- **WHEN** `clearFileContent(path)` is called
- **THEN** the listener SHALL also clear validation results for that path via `useValidationStore.getState().clearResults(path)`

### Requirement: Validation listener initializes on app start
The listener SHALL be initialized once when the application starts and live for the entire app lifetime.

#### Scenario: Listener registered on module load
- **WHEN** the file-content-store module is loaded
- **THEN** a validation listener SHALL be registered via `useFileContentStore.subscribe((state) => state.fileContents)`

#### Scenario: Listener handles no validators gracefully
- **WHEN** no validators match the file path
- **THEN** the listener SHALL clear any existing validation results for that path
