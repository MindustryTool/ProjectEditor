## MODIFIED Requirements

### Requirement: Status bar displays live project info
The StatusBar component SHALL render a horizontal bar at the bottom showing the active project name, file count, a status indicator, and validation error/warning counts, with all text rendered via translation keys.

#### Scenario: Status bar with project data
- **WHEN** a project is open and the StatusBar receives projectName and fileCount props derived from the store
- **THEN** it SHALL display the project name on the left via `t("statusBar.project", { name })`, files count on the right via `t("statusBar.files", { count })`, "Ready" status in the center via `t("statusBar.ready")`, and validation counts on the right via `t("statusBar.validationErrors", { count })` and `t("statusBar.validationWarnings", { count })`

#### Scenario: Status bar with no project
- **WHEN** no project is open (`projectContext === null`)
- **THEN** the StatusBar SHALL display "No project" on the left via `t("statusBar.noProject")` and SHALL NOT show validation counts

#### Scenario: Validation counts shown on right
- **WHEN** the validation store has errors or warnings
- **THEN** the StatusBar SHALL display error count and warning count on the right side, each as a clickable or non-clickable label
