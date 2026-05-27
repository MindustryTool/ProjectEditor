## ADDED Requirements

### Requirement: Project record CRUD in app store
The system SHALL provide `saveProject`, `getProject`, `getAllProjects`, and `deleteProject` as actions on `useAppStore`, replacing the previous `@project/storage` API. The store SHALL unify `projects` as a single `Record<string, ProjectRecord>` — not split between a `ProjectInfo[]` array and a separate map.

#### Scenario: Save project stores in persisted state
- **WHEN** `useAppStore.getState().saveProject(record)` is called
- **THEN** the record SHALL be stored in the app store's `projects` map (keyed by `id`)
- **AND** the record SHALL survive page reload via zustand persist middleware

#### Scenario: Get project retrieves by id
- **WHEN** `useAppStore.getState().getProject("abc")` is called
- **THEN** it SHALL return the `ProjectRecord` with id `"abc"` or `undefined` if not found

#### Scenario: Get all projects returns all records
- **WHEN** `useAppStore.getState().getAllProjects()` is called
- **THEN** it SHALL return an array of all stored `ProjectRecord` objects

#### Scenario: Delete project removes record
- **WHEN** `useAppStore.getState().deleteProject("abc")` is called
- **THEN** the record with id `"abc"` SHALL be removed from the `projects` map

### Requirement: ProjectRecord type available from @project/state
The `ProjectRecord` interface SHALL be exported from `@project/state` after `@project/storage` is removed. The unused `data: string` field SHALL be dropped.

#### Scenario: ProjectRecord importable from @project/state
- **WHEN** code imports `ProjectRecord` from `@project/state`
- **THEN** it SHALL contain `id: string`, `name: string`, `language?: string`, `createdAt: Date`, `updatedAt: Date`
