## ADDED Requirements

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
