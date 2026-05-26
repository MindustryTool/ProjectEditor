## ADDED Requirements

### Requirement: LocalStorageAdapter implements StorageBackend
The system SHALL provide a `LocalStorageAdapter` class that implements `StorageBackend` using `window.localStorage`.

#### Scenario: Constructor accepts key prefix
- **WHEN** `new LocalStorageAdapter(prefix?)` is called
- **THEN** a custom key prefix MAY be provided; otherwise it defaults to `"pe:"`

### Requirement: Project serialization with date hydration
The `LocalStorageAdapter` SHALL serialize `ProjectRecord` to JSON strings and hydrate `Date` fields on read.

#### Scenario: Save project serializes dates to ISO strings
- **WHEN** `saveProject(project)` is called
- **THEN** the project SHALL be serialized with `createdAt` and `updatedAt` converted to ISO 8601 strings before writing to localStorage

#### Scenario: Get project hydrates dates from ISO strings
- **WHEN** `getProject(id)` retrieves a stored project
- **THEN** `createdAt` and `updatedAt` SHALL be `Date` objects, not strings

### Requirement: Project CRUD with prefixed keys
The `LocalStorageAdapter` SHALL use prefixed keys in localStorage for project operations.

#### Scenario: Save project stores under prefixed key
- **WHEN** `saveProject(project)` is called with `{ id: "abc" }`
- **THEN** the value SHALL be stored at key `<prefix>project:abc`

#### Scenario: Get project retrieves by prefixed key
- **WHEN** `getProject("abc")` is called
- **THEN** it SHALL read from key `<prefix>project:abc` and return the deserialized `ProjectRecord`

#### Scenario: Get all projects iterates matching keys
- **WHEN** `getAllProjects()` is called
- **THEN** it SHALL find all keys matching `<prefix>project:*`, deserialize each, and return them as an array

#### Scenario: Delete project removes prefixed key
- **WHEN** `deleteProject("abc")` is called
- **THEN** the key `<prefix>project:abc` SHALL be removed from localStorage

### Requirement: Settings CRUD with prefixed keys
The `LocalStorageAdapter` SHALL use prefixed keys for settings.

#### Scenario: Save setting stores under prefixed key
- **WHEN** `saveSetting("theme", "dark")` is called
- **THEN** the value SHALL be stored at key `<prefix>setting:theme` as a JSON object `{ key: "theme", value: "dark" }`

#### Scenario: Get setting retrieves by prefixed key
- **WHEN** `getSetting("theme")` is called
- **THEN** it SHALL read from key `<prefix>setting:theme` and return the `value` field

### Requirement: OPFS root delegation
The `LocalStorageAdapter` SHALL delegate `getOPFSRoot()` to `navigator.storage.getDirectory()`.

#### Scenario: getOPFSRoot returns OPFS handle
- **WHEN** `getOPFSRoot()` is called on `LocalStorageAdapter`
- **THEN** it SHALL return `navigator.storage.getDirectory()`
