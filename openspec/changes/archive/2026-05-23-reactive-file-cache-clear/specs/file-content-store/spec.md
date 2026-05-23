## MODIFIED Requirements

### Requirement: Cache cleanup on project close
The system SHALL clear all file content cache entries when the active project changes (project closed or switched to a different project), using a reactive `useEffect` that watches the current project ID.

#### Scenario: Clear all on project close
- **WHEN** `closeProject()` is called on the Zustand store
- **THEN** `projectContext` becomes null
- **AND** all entries in `fileContents` SHALL be cleared

#### Scenario: Clear all on project switch
- **WHEN** `setCurrentProject(newContext)` is called with a different project ID
- **THEN** entries from the previous project SHALL be cleared from `fileContents` before new content is loaded

#### Scenario: Cache preserved when same project re-opened
- **WHEN** the same project is set as current again (same project ID)
- **THEN** existing cached file contents SHALL NOT be cleared
