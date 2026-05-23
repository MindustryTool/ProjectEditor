## ADDED Requirements

### Requirement: Project settings dialog for current project
The system SHALL provide a Project Settings dialog for the currently opened project, showing the current project name and a destructive “Delete Project” action.

#### Scenario: Dialog shows current project name
- **WHEN** the Project Settings dialog is opened while a project is currently open
- **THEN** it SHALL display a project name input pre-filled with the current project name

#### Scenario: Dialog cannot be opened without a project
- **WHEN** there is no project currently open (`projectContext === null`)
- **THEN** the system SHALL NOT allow opening the Project Settings dialog

### Requirement: Project name edits are auto-saved
The system SHALL automatically persist project name changes from the Project Settings dialog without requiring an explicit Save action.

#### Scenario: Valid name change persists automatically
- **WHEN** the user updates the project name to a valid value
- **THEN** the system SHALL persist the updated project name to project storage
- **THEN** the status bar project name SHALL reflect the updated name

#### Scenario: Invalid name is rejected and not persisted
- **WHEN** the user enters a project name containing characters outside `[a-zA-Z0-9._-]` or an empty string
- **THEN** the dialog SHALL present a validation error
- **THEN** the system SHALL NOT persist the invalid name

### Requirement: Delete project requires confirmation
The system SHALL require a confirmation step before deleting the current project from the Project Settings dialog.

#### Scenario: Delete confirmation dialog is shown
- **WHEN** the user clicks “Delete Project” in the Project Settings dialog
- **THEN** the system SHALL present a confirmation prompt before deletion

#### Scenario: Confirm delete removes project and closes editor project context
- **WHEN** the user confirms deletion for the currently opened project
- **THEN** the system SHALL delete the project from persistent project storage
- **THEN** the system SHALL close the current project context (`projectContext` becomes null)

#### Scenario: Cancel delete keeps project intact
- **WHEN** the user cancels the delete confirmation
- **THEN** the project SHALL remain present in persistent project storage
