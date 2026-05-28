# file-content-validation-listener Specification

## Purpose
The system SHALL provide a validation listener via a React `ValidationProvider` component that subscribes to file content changes and triggers validation when a file's `currentVersion` changes. The listener SHALL use `@project/state` stores and be initialized via React lifecycle inside the editor page.

## Requirements
### Requirement: Validation listener subscribes to file content changes
The system SHALL register a global listener on the file content store that triggers file validation whenever a file's `currentVersion` changes. The listener SHALL be initialized via a React `ValidationProvider` component wrapping `EditorShell`.

#### Scenario: Validation triggered on version change
- **WHEN** `writeBuffer(path, content)` is called and `currentVersion` increments
- **THEN** the listener SHALL schedule a validation run for that file after a debounce of 500ms

#### Scenario: Runner created with ValidationContext from React Query
- **WHEN** `ValidationProvider` mounts
- **THEN** it SHALL create a `ValidationRunner` with a `ValidationContext` that reads `getItems()` from the React Query `["items", projectId]` cache

#### Scenario: Direct imports from state package
- **WHEN** the listener needs to run validation
- **THEN** it SHALL import `createDefaultValidators`, `createValidationRunner`, and `useValidationStore` from `@project/state`

#### Scenario: Debounced validation
- **WHEN** `writeBuffer` is called multiple times within 500ms for the same path
- **THEN** the listener SHALL reset the debounce timer and only run validation once after the last call

#### Scenario: Validation result stored in validation store
- **WHEN** validation runs for a file
- **THEN** the results SHALL be stored via `useValidationStore.getState().setResults(path, results)`

#### Scenario: Validation uses in-memory buffer
- **WHEN** validation runs for a file
- **THEN** it SHALL validate the `data` field from the store entry (not read from disk)

#### Scenario: No validation on readFile
- **WHEN** `readFile` populates a buffer from disk
- **THEN** the listener SHALL NOT trigger validation for that file

### Requirement: Validation listener initialized via React lifecycle
The listener SHALL be initialized via React's `useEffect` inside `ValidationProvider`, subscribing on mount and cleaning up on unmount. The `registerValidationListener` function remains exported from `@project/state` for backward compatibility but no longer auto-invokes.

#### Scenario: Provider registers listener on mount
- **WHEN** `ValidationProvider` renders inside `EditorShell`
- **THEN** it SHALL subscribe to `useFileContentStore` and start debounced validation

#### Scenario: Provider cleans up on unmount
- **WHEN** `ValidationProvider` unmounts (navigating away from editor)
- **THEN** it SHALL unsubscribe and clear all pending debounce timers
