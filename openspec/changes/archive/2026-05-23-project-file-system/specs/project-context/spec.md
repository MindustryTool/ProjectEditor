## MODIFIED Requirements

### Requirement: ProjectContext interface
The system SHALL provide a `ProjectContext` interface that bundles project metadata, filesystem, and event bus.

#### Scenario: ProjectContext has project, fs, events
- **WHEN** a `ProjectContext` is constructed
- **THEN** it has `project: ProjectInfo`, `fs: ProjectFileSystem`, `events: EventBus`

### Requirement: Zustand store uses ProjectContext
The `@project/state` Zustand store SHALL hold a `projectContext` instead of `currentProject: Project | null` and provide actions for context lifecycle.

#### Scenario: Store initializes context
- **WHEN** `createNewProject("name")` is called
- **THEN** a new `ProjectContext` is created with a fresh `ProjectInfo`, `ProjectFileSystem`, and `EventBus`

#### Scenario: Store actions operate on context
- **WHEN** the store provides actions
- **THEN** they work with `ProjectContext` rather than raw `Project`
