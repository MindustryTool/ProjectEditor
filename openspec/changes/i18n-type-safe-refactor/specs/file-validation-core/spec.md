## MODIFIED Requirements

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
