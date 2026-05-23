## ADDED Requirements

### Requirement: ProjectInfo metadata type
The system SHALL provide a `ProjectInfo` type representing project metadata without embedded file data.

#### Scenario: ProjectInfo has id, name, timestamps
- **WHEN** a `ProjectInfo` is created
- **THEN** it has `id` (string), `name` (string), `createdAt` (Date), `updatedAt` (Date)

#### Scenario: ProjectInfo has no files array
- **WHEN** accessing a `ProjectInfo`
- **THEN** it does NOT have a `files` property

#### Scenario: createProjectInfo factory
- **WHEN** `createProjectInfo("My Project")` is called
- **THEN** it returns a `ProjectInfo` with a generated `id`, the given `name`, and current timestamps

### Requirement: ProjectContext interface
The system SHALL provide a `ProjectContext` interface that bundles project metadata, filesystem, and event bus.

#### Scenario: ProjectContext has project, fs, events
- **WHEN** a `ProjectContext` is constructed
- **THEN** it has `project: ProjectInfo`, `fs: VirtualFileSystem`, `events: EventBus`

#### Scenario: ProjectContext is the unit of state
- **WHEN** the Zustand store holds project state
- **THEN** it holds a `ProjectContext | null` instead of a raw `Project`

### Requirement: Zustand store uses ProjectContext
The `@project/state` Zustand store SHALL hold a `projectContext` instead of `currentProject: Project | null` and provide actions for context lifecycle.

#### Scenario: Store initializes context
- **WHEN** `createNewProject("name")` is called
- **THEN** a new `ProjectContext` is created with a fresh `ProjectInfo`, `OPFSAdapter`, and `EventBus`

#### Scenario: Store actions operate on context
- **WHEN** the store provides actions
- **THEN** they work with `ProjectContext` rather than raw `Project`

### Requirement: ProjectInfo validation schema
The `@project/validation` package SHALL provide a `ProjectInfoSchema` without the `files` field.

#### Scenario: ProjectInfoSchema validates metadata
- **WHEN** validating valid project metadata
- **THEN** it accepts id, name, createdAt, updatedAt

#### Scenario: ProjectInfoSchema rejects files field
- **WHEN** validating data with a `files` property
- **THEN** it is rejected (files is not in the schema)
