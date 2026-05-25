## MODIFIED Requirements

### Requirement: Validation listener subscribes to file content changes
The system SHALL register a global listener on the file content store that triggers file validation whenever a file's `currentVersion` changes. The listener SHALL use direct imports from `@project/state/src/validation/`. Validation SHALL run against the in-memory buffer data, not disk.

#### Scenario: Validation triggered on version change
- **WHEN** `writeBuffer(path, content)` is called and `currentVersion` increments
- **THEN** the listener SHALL schedule a validation run for that file after a debounce of 500ms

#### Scenario: Validation uses in-memory buffer
- **WHEN** validation runs for a file
- **THEN** it SHALL validate the `data` field from the store entry (not read from disk)

#### Scenario: Debounced validation
- **WHEN** `writeBuffer` is called multiple times within 500ms for the same path
- **THEN** the listener SHALL reset the debounce timer and only run validation once after the last call

#### Scenario: Validation result stored in validation store
- **WHEN** validation runs for a file
- **THEN** the results SHALL be stored via `useValidationStore.getState().setResults(path, results)`

#### Scenario: No validation on readFile
- **WHEN** `readFile` populates a buffer from disk
- **THEN** the listener SHALL NOT trigger validation for that file

### Requirement: Validation listener initializes on app start
The listener SHALL be initialized once and live for the entire app lifetime.

#### Scenario: Listener registered on module load
- **WHEN** the validation/listener module is loaded
- **THEN** a validation listener SHALL be registered via `useFileContentStore.subscribe`
