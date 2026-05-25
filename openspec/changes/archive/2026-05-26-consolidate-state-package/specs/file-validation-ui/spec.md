## MODIFIED Requirements

### Requirement: Validation state store holds per-file results
The system SHALL provide a zustand store (`useValidationStore`) that maps file paths to their validation results and tracks the total error/warning count. The store SHALL be exported from `@project/state` instead of `@project/file-validation`.

#### Scenario: Import from @project/state
- **WHEN** a consumer imports `useValidationStore`
- **THEN** it SHALL import from `@project/state` instead of `@project/file-validation`

#### Scenario: Results stored per path
- **WHEN** a file is validated
- **THEN** its results SHALL be stored in the validation store under its file path key

#### Scenario: Counts are reactive
- **WHEN** validation results change
- **THEN** the store SHALL update derived counts (total errors, warnings, infos) that components can subscribe to

#### Scenario: Clear results on file delete
- **WHEN** a file is deleted from the project
- **THEN** its validation results SHALL be removed from the store

### Requirement: MonacoEditor shows inline validation markers
MonacoEditor SHALL display markers from the validation store. The imports for `Severity` and `useValidationStore` SHALL come from `@project/state`.

#### Scenario: Imports from @project/state
- **WHEN** EditorContext or MonacoEditor needs `useValidationStore` or `Severity`
- **THEN** it SHALL import from `@project/state`

### Requirement: FileExplorer shows validation badges per file
The FileExplorer SHALL import `useValidationStore` from `@project/state`.

#### Scenario: Import path updated
- **WHEN** FileExplorer accesses validation results
- **THEN** it SHALL import from `@project/state`

### Requirement: StatusBar shows total error/warning count
The StatusBar SHALL import `useValidationStore` from `@project/state`.

#### Scenario: Import path updated
- **WHEN** EditorShell accesses validation summary
- **THEN** it SHALL import from `@project/state`

### Requirement: ExportMenu shows validation preflight
The ExportMenu SHALL import `useValidationStore` from `@project/state`.

#### Scenario: Import path updated
- **WHEN** ExportMenu checks validation results
- **THEN** it SHALL import from `@project/state`
