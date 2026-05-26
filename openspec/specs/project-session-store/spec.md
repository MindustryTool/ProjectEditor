## ADDED Requirements

### Requirement: Project session state extracted to dedicated store
The system SHALL provide a `useProjectSession` store with a `ProjectSession` type that holds `projectContext`, `treeSnapshot`, and `recentlyOpenedFiles`, separate from app-level state.

#### Scenario: Session store exists as separate file
- **WHEN** importing from `@project/state`
- **THEN** a `useProjectSession` SHALL be importable that includes `projectContext`, `treeSnapshot`, and `recentlyOpenedFiles`

#### Scenario: Session store has its own actions
- **WHEN** importing `useProjectSession`
- **THEN** it SHALL expose `setCurrentProject`, `closeProject`, `updateCurrentProject`, `recordFileAccess`, `removeFromRecentFiles`, and `clearRecentFiles` actions

#### Scenario: Session data is not persisted
- **WHEN** the page reloads
- **THEN** `projectContext` and `treeSnapshot` SHALL be empty (null / [])
- **AND** `recentlyOpenedFiles` SHALL still be restored from persistence

### Requirement: useCurrentProject uses session store
The `useCurrentProject` hook SHALL read `projectContext` from the session store instead of the app store.

#### Scenario: Hook returns session projectContext
- **WHEN** code calls `useCurrentProject()`
- **THEN** it SHALL return the `ProjectContext` from `useProjectSession`
- **AND** it SHALL throw if no project is open
