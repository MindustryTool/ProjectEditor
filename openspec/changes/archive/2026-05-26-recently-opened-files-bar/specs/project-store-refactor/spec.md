## ADDED Requirements

### Requirement: ProjectContext extracted to dedicated store file
The system SHALL move the `ProjectContext` type, its related state fields, and all project-related actions from the monolithic store in `packages/state/src/index.ts` into a new dedicated file `packages/state/src/stores/project.ts`.

#### Scenario: Project store exists as separate file
- **WHEN** importing from `@project/state`
- **THEN** a `useProjectStore` SHALL be importable that includes `projectContext`, `projects`, `lastProjectId`, `treeSnapshot`, and `recentlyOpenedFiles`

#### Scenario: Existing imports continue to work
- **WHEN** importing `useProjectStore` from `@project/state` in existing code
- **THEN** the same API surface SHALL be available (preserving all existing selectors and actions)

#### Scenario: New recentlyOpenedFiles field in store
- **WHEN** `projectContext` is set (project is open)
- **THEN** `recentlyOpenedFiles` SHALL be a field in the store, keyed by project ID
- **AND** it SHALL be persisted via Zustand persist middleware

### Requirement: AppSettings remains accessible
The `AppSettings` type and `updateSettings` action, along with the `hydrated` flag, SHALL remain importable from `@project/state` after the refactor.

#### Scenario: Settings still work after refactor
- **WHEN** code accesses `useProjectStore((s) => s.settings)`
- **THEN** it SHALL return the same `AppSettings` object as before
- **AND** `updateSettings` SHALL update it correctly
