## Requirements

### Requirement: Project picker welcome screen
When no project is open, the EditorPage SHALL render a full-screen welcome view with options to create a new project or open an existing one, instead of the SplitView.

#### Scenario: Welcome screen shown when no project
- **WHEN** the EditorPage mounts and `projectContext` is null
- **THEN** a centered welcome view SHALL be displayed with a heading (e.g. "Mindustry Mod Editor"), a "Create New Project" section with a name input and create button, and a list of recent/saved projects

#### Scenario: Welcome screen hidden when project opens
- **WHEN** a project is opened (create or open action)
- **THEN** the welcome screen SHALL be replaced by the SplitView layout

### Requirement: Recent projects list in welcome screen
The welcome screen SHALL list saved projects from IndexedDB with name, last modified date, and a click-to-open action.

#### Scenario: Recent projects listed
- **WHEN** the welcome screen is displayed
- **THEN** it SHALL query `getAllProjects()` and display each project as a clickable row showing the project name and last updated date

#### Scenario: Click project to open
- **WHEN** user clicks on a project row in the recent projects list
- **THEN** the system SHALL open that project (calling `setCurrentProject` with the project context) and navigate to the editor layout

### Requirement: Reusable project picker dialog
The system SHALL provide a dialog component that lists all saved projects from IndexedDB, allowing the user to select and open one.

#### Scenario: Dialog opens with project list
- **WHEN** the project picker dialog is opened
- **THEN** it SHALL query `getAllProjects()` and display each project with its name and last updated date

#### Scenario: Select and open project
- **WHEN** user clicks a project row in the dialog and clicks "Open"
- **THEN** the system SHALL open that project and close the dialog

#### Scenario: Double-click to open
- **WHEN** user double-clicks a project row in the dialog
- **THEN** the system SHALL open that project and close the dialog

#### Scenario: Cancel closes dialog
- **WHEN** user clicks "Cancel" or outside the dialog
- **THEN** the dialog SHALL close without opening any project
