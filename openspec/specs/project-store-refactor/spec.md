## Requirements

### Requirement: ProjectContext extracted to dedicated store file
The system SHALL rename `ProjectState` to `AppState` and `useProjectStore` to `useAppStore`, and move session-specific state (`projectContext`, `treeSnapshot`, `recentlyOpenedFiles`) into a separate `useProjectSession` store at `packages/state/src/stores/session.ts`.

#### Scenario: App store exists with renamed types
- **WHEN** importing from `@project/state`
- **THEN** a `useAppStore` SHALL be importable that includes `projects`, `lastProjectId`, `settings`, and `hydrated` (but NOT `projectContext`, `treeSnapshot`, or `recentlyOpenedFiles`)

#### Scenario: Existing imports continue to work with new name
- **WHEN** code previously imported `useProjectStore` from `@project/state`
- **THEN** the code SHALL be updated to import `useAppStore` instead
- **AND** `useAppStore` SHALL preserve the same selector API for remaining fields (`settings`, `projects`, `lastProjectId`, `hydrated`, `updateSettings`)

#### Scenario: App store persist is unchanged
- **WHEN** the app is reloaded
- **THEN** `useAppStore` SHALL restore `settings`, `projects`, and `lastProjectId` from localStorage
- **AND** `recentlyOpenedFiles` SHALL be restored from the session store's persistence

### Requirement: AppSettings remains accessible
The `AppSettings` type, `updateSettings` action, and `hydrated` flag SHALL remain importable from `@project/state` after the rename.

#### Scenario: Settings still work after rename
- **WHEN** code accesses `useAppStore((s) => s.settings)`
- **THEN** it SHALL return the same `AppSettings` object as before
- **AND** `updateSettings` SHALL update it correctly

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
The `ProjectRecord` interface SHALL be exported from `@project/state` after `@project/storage` is removed.

#### Scenario: ProjectRecord importable from @project/state
- **WHEN** code imports `ProjectRecord` from `@project/state`
- **THEN** it SHALL contain `id: string`, `name: string`, `language?: string`, `createdAt: Date`, `updatedAt: Date` (no `data` field — it was always `""` and unused)
