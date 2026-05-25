## ADDED Requirements

### Requirement: Display project name
The StatusBarLeft component SHALL display the current project name using the `statusBar.project` i18n key.

#### Scenario: Project is loaded
- **WHEN** a project is open in the editor
- **THEN** the left status bar section SHALL display the project name

#### Scenario: No project is loaded
- **WHEN** no project is open
- **THEN** the left status bar section SHALL display an empty project name (empty string fallback)

### Requirement: Display file count
The StatusBarLeft component SHALL display a file count using the `statusBar.files` i18n key, separated from the project name by a pipe character.

#### Scenario: File count displayed
- **WHEN** the status bar is rendered
- **THEN** a pipe separator and file count SHALL appear after the project name

### Requirement: Data source
The StatusBarLeft component SHALL read the project name from `useProjectStore`.

#### Scenario: Store subscription
- **WHEN** the project name changes in the store
- **THEN** the component SHALL re-render with the updated name
