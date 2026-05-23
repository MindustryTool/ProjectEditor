## MODIFIED Requirements

### Requirement: Project menu with CRUD actions
The ProjectMenu component SHALL render a dropdown with items for Create Project, Open Project, Change Project, Project Settings, and Close Project, with all labels rendered via translation keys.

#### Scenario: Project menu renders with correct items
- **WHEN** the ProjectMenu is rendered
- **THEN** it SHALL display a button labeled via `t("projectMenu.label")` that opens a dropdown with items: "Create Project", "Open Project", "Change Project", "Project Settings", "Close Project"

#### Scenario: Create Project opens creation dialog
- **WHEN** user clicks "Create Project" in the ProjectMenu dropdown
- **THEN** the system SHALL open a dialog prompting for a project name

#### Scenario: Open Project opens project picker dialog
- **WHEN** user clicks "Open Project" in the ProjectMenu dropdown
- **THEN** the system SHALL open the project picker dialog listing saved projects

#### Scenario: Change Project opens project picker dialog
- **WHEN** user clicks "Change Project" in the ProjectMenu dropdown
- **THEN** the system SHALL open the project picker dialog listing saved projects

#### Scenario: Project Settings opens settings dialog
- **WHEN** user clicks "Project Settings" in the ProjectMenu dropdown
- **THEN** the system SHALL open the project settings dialog for the current project

#### Scenario: Close Project closes current project
- **WHEN** user clicks "Close Project" in the ProjectMenu dropdown
- **THEN** the system SHALL call `closeProject()` on the store, setting `projectContext` to null

## ADDED Requirements

### Requirement: Project Settings disabled when no project open
The "Project Settings" menu item SHALL be disabled when `projectContext` is null.

#### Scenario: Project Settings disabled
- **WHEN** no project is currently open (`projectContext === null`)
- **THEN** the "Project Settings" menu item SHALL be disabled (grayed out, non-interactive)
