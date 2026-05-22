## ADDED Requirements

### Requirement: mod.hjson form editor renders with fields
The system SHALL render a form-based editor in the SplitView center panel when `?path=mod.hjson` is selected, with labeled input fields for each mod metadata property.

#### Scenario: Form renders six fields
- **WHEN** `?path=mod.hjson` is active
- **THEN** the center panel SHALL display a form with labeled inputs for: `name`, `displayName`, `author`, `description`, `version`, `minGameVersion`

#### Scenario: Dependencies field
- **WHEN** `?path=mod.hjson` is active
- **THEN** the form SHALL include a multi-value field or list for `dependencies`

#### Scenario: Field descriptions visible
- **WHEN** the form is rendered
- **THEN** each input SHALL display a description explaining the field's purpose

### Requirement: Form uses TanStack Form with Valibot validation
The mod.hjson form SHALL use `@tanstack/react-form` for form state management and Valibot for field validation.

#### Scenario: Required fields validate
- **WHEN** the user clears a required field (e.g., `name`)
- **THEN** the field SHALL display a validation error message

#### Scenario: Version format validated
- **WHEN** the user enters a non-semver value in `version` or `minGameVersion`
- **THEN** the field SHALL display a validation error

### Requirement: Field labels and descriptions are translated
All mod.hjson form field labels and descriptions SHALL use i18n translation keys.

#### Scenario: Fields show translated labels
- **WHEN** the mod.hjson form renders
- **THEN** each field label SHALL be rendered via `t()` with keys under `editor.modHjson.*`

#### Scenario: Fields show translated descriptions
- **WHEN** the mod.hjson form renders
- **THEN** each field description SHALL be rendered via `t()` with keys under `editor.modHjson.*`
