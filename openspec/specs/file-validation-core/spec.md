## MODIFIED Requirements

### Requirement: Validation engine provides registry and runner
The system SHALL provide a validation engine with a registry for validators, a runner that executes validators against file content, and a worker adapter that executes validation through structured-clone-safe requests.

#### Scenario: Register a validator
- **WHEN** a validator function is registered with a name and a file path pattern (glob)
- **THEN** the validator SHALL be stored in the registry and available for execution

#### Scenario: Run validation on a file
- **WHEN** a file validation request containing path, content, and validation context snapshot is passed to the worker
- **THEN** the runner SHALL match the path against all registered validators and execute matching ones, returning aggregated results

#### Scenario: No validators match a file
- **WHEN** a file path does not match any registered validator pattern
- **THEN** the runner SHALL return an empty results array

#### Scenario: Batch validation reuses same worker adapter
- **WHEN** a batch validation request is passed to the worker
- **THEN** the worker SHALL validate each file with same registry and snapshot-backed context and return results for all requested paths

### Requirement: Validation worker uses type-safe threads.js APIs
The system SHALL provide a validation worker implemented with `threads.js` type-safe workers so the web app can call validation methods through typed request and response contracts.

#### Scenario: Worker exposes typed single-file validation
- **WHEN** the web app creates the validation worker client
- **THEN** it SHALL be able to call a typed `validateFile` method that returns plain validation results

#### Scenario: Worker exposes typed batch validation
- **WHEN** export preflight or other batch validation runs
- **THEN** the web app SHALL be able to call a typed `validateFiles` method that returns plain results grouped by path

### Requirement: Validation context is reconstructed from serializable snapshot
The validation engine SHALL accept a serializable validation context snapshot and reconstruct lookup helpers used by schema validators inside the worker.

#### Scenario: Snapshot provides cross-file lookup data
- **WHEN** validation requires schema lookups for items, blocks, liquids, units, statuses, or other project content references
- **THEN** the worker SHALL resolve those lookups from snapshot data included in the request

#### Scenario: Worker boundary excludes live main-thread objects
- **WHEN** validation work is sent to worker
- **THEN** the request SHALL NOT include Zustand stores, filesystem handles, event bus objects, or function closures

### Requirement: Validation responses are structured-clone-safe
Validation responses returned from worker SHALL contain only structured-clone-safe data that can be consumed by existing validation UI and export flows.

#### Scenario: Worker returns plain validation results
- **WHEN** validation completes in worker
- **THEN** each result SHALL be serialized as plain data containing severity, message metadata, optional path, optional field, and optional source range data

### Requirement: Validation results use string severity
The system SHALL define severity levels as string values: `"error"`, `"warning"`, `"info"`, `"deprecated"`.

#### Scenario: Severity is a string
- **WHEN** validation results are returned
- **THEN** each result SHALL include a `severity` field of type `"error" | "warning" | "info" | "deprecated"`

#### Scenario: Filter by severity
- **WHEN** the runner or consumer filters results by minimum severity
- **THEN** only results at or above that severity SHALL be included

### Requirement: Validation result includes location, field, message, and optional fixes
Each validation result SHALL include a typed message key (for i18n), optional message params, optional source location (line, column), optional field name, and optional fix suggestions.

#### Scenario: Basic result
- **WHEN** a validator detects an issue
- **THEN** the result SHALL contain `{severity, messageKey, messageParams?, startLine?, startColumn?, path?, field?, fixs?}`

#### Scenario: No location for file-level issues
- **WHEN** a validator detects a file-level issue (e.g., "file is empty")
- **THEN** the result SHALL omit line and column fields

#### Scenario: File-level validation result
- **WHEN** a validator detects a file-level issue (e.g., "file is empty")
- **THEN** the result SHALL omit the `field` property

#### Scenario: Field-level validation result
- **WHEN** a validator detects an issue on a specific field
- **THEN** the result SHALL include the `field` property set to the field name

#### Scenario: Result with fix suggestions
- **WHEN** a validator can provide auto-fix actions
- **THEN** the result SHALL include a `fixs` array with `{messageKey, messageParams?, action}` items
- **AND** `messageKey` SHALL be of type `Tkey` (generic key type)

## REMOVED Requirements

### Requirement: Validation results use typed severity levels
**Reason**: Replaced by string severity values
**Migration**: All `Severity.error` → `"error"`, `Severity.warning` → `"warning"`, etc.

### Requirement: Validation result includes location, field, and message
**Reason**: Replaced by the updated requirement above (now includes fixs, uses generic Tkey, removes code field)
**Migration**: Update `ValidationResult` interface, remove `code` field, add `fixs` field, add generic `Tkey` parameter
