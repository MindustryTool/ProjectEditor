## Requirements

### Requirement: Validation engine provides registry and runner
The system SHALL provide a validation engine with a registry for validators and a runner that executes validators against file content.

#### Scenario: Register a validator
- **WHEN** a validator function is registered with a name and a file path pattern (glob)
- **THEN** the validator SHALL be stored in the registry and available for execution

#### Scenario: Run validation on a file
- **WHEN** a file path and content are passed to the validation runner
- **THEN** the runner SHALL match the path against all registered validators and execute matching ones, returning aggregated results

#### Scenario: No validators match a file
- **WHEN** a file path does not match any registered validator pattern
- **THEN** the runner SHALL return an empty results array

### Requirement: Validation results use typed severity levels
The system SHALL define four severity levels: error, warning, info, deprecated, ordered by severity.

#### Scenario: Severity ordering
- **WHEN** validation results are returned
- **THEN** each result SHALL include a severity field of type `"error" | "warning" | "info" | "deprecated"`

#### Scenario: Filter by severity
- **WHEN** the runner or consumer filters results by minimum severity
- **THEN** only results at or above that severity SHALL be included

### Requirement: Validation result includes location, field, and message
Each validation result SHALL include a message key (for i18n), optional message params, optional source location (line, column), and optional field name.

#### Scenario: Basic result
- **WHEN** a validator detects an issue
- **THEN** the result SHALL contain `{severity, messageKey, messageParams?, line?, column?, path?, code?, field?}`

#### Scenario: No location for file-level issues
- **WHEN** a validator detects a file-level issue (e.g., "file is empty")
- **THEN** the result SHALL omit line and column fields

#### Scenario: File-level validation result
- **WHEN** a validator detects a file-level issue (e.g., "file is empty")
- **THEN** the result SHALL omit the `field` property

#### Scenario: Field-level validation result
- **WHEN** a validator detects an issue on a specific field
- **THEN** the result SHALL include the `field` property set to the field name

### Requirement: Mod hjson validation
The system SHALL provide a validator for `mod.hjson` files that validates mod metadata fields.
