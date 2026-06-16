## ADDED Requirements

### Requirement: Project menu with CRUD actions
The ProjectMenu component SHALL render a dropdown with items for Create Project, Open Project, Change Project, Project Settings, and Close Project, with all labels rendered via translation keys.

#### Scenario: Project menu renders with correct items
- **WHEN** the ProjectMenu is rendered
- **THEN** it SHALL display a button labeled via `t("projectMenu.label")` that opens a dropdown with items: "Create Project", "Open Project", "Change Project", "Project Settings", "Close Project"

#### Scenario: Create Project opens creation dialog without closing menu
- **WHEN** user clicks "Create Project" in the ProjectMenu dropdown
- **THEN** the system SHALL open a dialog prompting for a project name
- **THEN** the menu SHALL NOT close

#### Scenario: Open Project opens project picker dialog without closing menu
- **WHEN** user clicks "Open Project" in the ProjectMenu dropdown
- **THEN** the system SHALL open the project picker dialog listing saved projects
- **THEN** the menu SHALL NOT close

#### Scenario: Change Project opens project picker dialog without closing menu
- **WHEN** user clicks "Change Project" in the ProjectMenu dropdown
- **THEN** the system SHALL open the project picker dialog listing saved projects
- **THEN** the menu SHALL NOT close

#### Scenario: Close Project closes current project
- **WHEN** user clicks "Close Project" in the ProjectMenu dropdown
- **THEN** the system SHALL call `closeProject()` on the store, setting `projectContext` to null

### Requirement: Project Settings disabled when no project open
The "Project Settings" menu item SHALL be disabled when `projectContext` is null.

#### Scenario: Project Settings disabled
- **WHEN** no project is currently open (`projectContext === null`)
- **THEN** the "Project Settings" menu item SHALL be disabled (grayed out, non-interactive)

### Requirement: Close Project disabled when no project open
The "Close Project" menu item SHALL be disabled when `projectContext` is null.

#### Scenario: Close Project disabled
- **WHEN** no project is currently open (`projectContext === null`)
- **THEN** the "Close Project" menu item SHALL be disabled (grayed out, non-interactive)

### Requirement: Change Project disabled when no project open
The "Change Project" menu item SHALL be disabled when `projectContext` is null.

#### Scenario: Change Project disabled
- **WHEN** no project is currently open (`projectContext === null`)
- **THEN** the "Change Project" menu item SHALL be disabled (grayed out, non-interactive)

### Requirement: Create project dialog
The system SHALL provide a dialog for creating a new project with a text input for the project name and a "Create" button.

#### Scenario: Create project with valid name
- **WHEN** user enters a non-empty project name and clicks "Create"
- **THEN** the system SHALL call `createNewProject(name)` on the project store, set the new project as current, and close the dialog

#### Scenario: Create project with empty name
- **WHEN** user clicks "Create" with an empty project name
- **THEN** the dialog SHALL show a validation error and not create the project

#### Scenario: Cancel create project
- **WHEN** user clicks "Cancel" in the create project dialog
- **THEN** the dialog SHALL close without creating a project
