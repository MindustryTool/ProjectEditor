## ADDED Requirements

### Requirement: Derived booleans from version comparison
The system SHALL derive `isDirty`, `isSaving`, `isLoading`, and `isError` booleans from `currentVersion`, `savedVersion`, `loading`, and `error` fields instead of storing an explicit `status` enum.

#### Scenario: isDirty is true when versions diverge
- **WHEN** `currentVersion > savedVersion` for a given file entry
- **THEN** `isDirty` SHALL be `true`

#### Scenario: isDirty is false when versions match
- **WHEN** `currentVersion === savedVersion`
- **THEN** `isDirty` SHALL be `false`

#### Scenario: isSaving is true when write is in-flight
- **WHEN** a write to disk is pending or in-flight for the file path
- **THEN** `isSaving` SHALL be `true`

#### Scenario: isLoading is true during readFile
- **WHEN** `loading` field is `true`
- **THEN** `isLoading` SHALL be `true`

#### Scenario: isError is true when error set
- **WHEN** `error` is non-null and `isDirty` is `false`
- **THEN** `isError` SHALL be `true`

#### Scenario: isError cleared on next edit
- **WHEN** `writeBuffer(path, content)` is called on a file with `error` set
- **THEN** the error SHALL be cleared and `isError` SHALL become `false`

### Requirement: Hook returns derived booleans
The `useFileContent` hook SHALL return `{ data, currentVersion, savedVersion, savedAt, error, isDirty, isSaving, isLoading, isError, update }` instead of the previous `{ data, status, error, version, savedAt, update }`.

#### Scenario: Hook returns derived fields
- **WHEN** a component calls `useFileContent("mod.hjson")`
- **THEN** it SHALL receive `isDirty`, `isSaving`, `isLoading`, and `isError` booleans
- **AND** `version` is split into `currentVersion` and `savedVersion`

#### Scenario: Components use derived booleans
- **WHEN** a component needs to check if a file is dirty
- **THEN** it SHALL use `isDirty` instead of `status === "dirty"`
