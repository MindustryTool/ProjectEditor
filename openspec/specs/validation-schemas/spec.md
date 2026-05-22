## ADDED Requirements

### Requirement: ProjectFile schema
The system SHALL validate a ProjectFile object with a schema that enforces a non-empty path string, a content string, and a non-negative size number.

#### Scenario: Valid project file
- **WHEN** an object with `path: "data.json"`, `content: "{}"`, `size: 42` is validated
- **THEN** the schema SHALL return a valid result with those values

#### Scenario: Empty path rejected
- **WHEN** an object with an empty string `path` is validated
- **THEN** the schema SHALL reject with a validation error

#### Scenario: Negative size rejected
- **WHEN** an object with a negative `size` value is validated
- **THEN** the schema SHALL reject with a validation error

### Requirement: Project schema
The system SHALL validate a Project object with a schema that enforces a UUID id, a 1-100 character name, an array of ProjectFiles, and coerced date timestamps.

#### Scenario: Valid project
- **WHEN** an object with valid `id`, `name`, `files`, `createdAt`, and `updatedAt` is validated
- **THEN** the schema SHALL return a valid result

#### Scenario: Name too long rejected
- **WHEN** a project with a name longer than 100 characters is validated
- **THEN** the schema SHALL reject with a validation error

### Requirement: Settings schema
The system SHALL validate a Settings object with a schema that enforces theme enum, font size 8-32, tab size 1-8, autoSave boolean, and autoSaveDelay 500-10000.

#### Scenario: Valid settings
- **WHEN** an object with `theme: "dark"`, `fontSize: 14`, `tabSize: 4`, `autoSave: true`, `autoSaveDelay: 2000` is validated
- **THEN** the schema SHALL return a valid result

#### Scenario: Invalid theme rejected
- **WHEN** settings with `theme: "blue"` is validated
- **THEN** the schema SHALL reject with a validation error
