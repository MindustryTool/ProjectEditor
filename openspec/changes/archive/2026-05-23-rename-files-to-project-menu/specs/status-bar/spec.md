## MODIFIED Requirements

### Requirement: Status bar displays live project info
The StatusBar component SHALL render a horizontal bar at the bottom showing the active project name, file count, and a status indicator, with all text rendered via translation keys. The project name and file count SHALL be derived from the current `projectContext` in the Zustand store, not hardcoded.

#### Scenario: Status bar with active project
- **WHEN** a project is open and the StatusBar receives projectName and fileCount props derived from the store
- **THEN** it SHALL display the project name on the left via `t("statusBar.project", { name })`, files count on the right via `t("statusBar.files", { count })`, and "Ready" status in the center via `t("statusBar.ready")`

#### Scenario: Status bar with no project
- **WHEN** no project is open (`projectContext === null`)
- **THEN** the StatusBar SHALL display "No project" on the left via `t("statusBar.noProject")`
