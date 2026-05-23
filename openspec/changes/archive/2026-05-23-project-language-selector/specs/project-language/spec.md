## ADDED Requirements

### Requirement: ProjectInfo includes language field
The `ProjectInfo` interface SHALL include a `language` field typed as `'json' | 'java' | 'javascript'` with a default value of `'json'`.

#### Scenario: ProjectInfo created with explicit language
- **WHEN** `createProjectInfo("My Mod", "java")` is called
- **THEN** the returned `ProjectInfo` has `language` equal to `"java"`

#### Scenario: ProjectInfo created without language defaults to json
- **WHEN** `createProjectInfo("My Mod")` is called (legacy signature)
- **THEN** the returned `ProjectInfo` has `language` equal to `"json"`

#### Scenario: Existing record without language field defaults to json
- **WHEN** a `ProjectRecord` is loaded from IndexedDB without a `language` field
- **THEN** the `language` SHALL default to `"json"` when constructing the `ProjectInfo`

### Requirement: Validation schema accepts language
The `ProjectInfoSchema` SHALL accept `language` as an optional string matching `'json' | 'java' | 'javascript'`.

#### Scenario: Valid language passes validation
- **WHEN** validating an object with `language: "javascript"`
- **THEN** validation succeeds

#### Scenario: Invalid language fails validation
- **WHEN** validating an object with `language: "python"`
- **THEN** validation fails

#### Scenario: Missing language defaults during parse
- **WHEN** validating an object without a `language` field
- **THEN** the parsed result SHALL have `language` equal to `"json"`

### Requirement: Storage record includes language
The `ProjectRecord` interface SHALL include a `language` field of type `string`.

#### Scenario: Project saved with language persists
- **WHEN** a project with `language: "javascript"` is saved via `saveProject()`
- **THEN** the stored record in IndexedDB contains `language` equal to `"javascript"`

#### Scenario: Legacy projects without language are readable
- **WHEN** reading a project saved before this change
- **THEN** `language` SHALL be `undefined` in the raw record and default to `"json"` in application code

### Requirement: Language picker in creation forms
The `ProjectPickerScreen` and `ProjectPickerDialog` SHALL display a language picker control below the project name input when the form is in creation mode.

#### Scenario: User selects a language during creation
- **WHEN** the user picks `"JavaScript"` from the language dropdown and clicks Create
- **THEN** the project is created with `language` set to `"javascript"`

#### Scenario: Default language is selected on mount
- **WHEN** the creation form opens
- **THEN** the language picker SHALL default to `"JSON"`

### Requirement: Language icon in project listings
The project list items in `ProjectPickerScreen` and `ProjectPickerDialog` SHALL display a language badge alongside the project name.

#### Scenario: Project listing shows language badge
- **WHEN** rendering a project item
- **THEN** a small colored badge or text label SHALL appear next to the project name indicating its language (e.g., "JSON", "JS", "Java")
