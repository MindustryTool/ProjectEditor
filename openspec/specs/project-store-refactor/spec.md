## ADDED Requirements

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
