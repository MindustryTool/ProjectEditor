## Requirements

### Requirement: ProjectMenu has Import Project button
The system SHALL provide an "Import Project" menu item in the ProjectMenu dropdown that opens a file picker filtered to `.zip` files.

#### Scenario: Import button is visible in ProjectMenu
- **WHEN** the user opens the ProjectMenu dropdown
- **THEN** an "Import Project" menu item SHALL be visible alongside "Create Project", "Open Project", etc.

#### Scenario: Clicking Import opens file picker
- **WHEN** the user clicks "Import Project"
- **THEN** a file picker dialog SHALL open accepting only `.zip` files

### Requirement: Import flow creates project and writes files
The system SHALL, after a zip file is selected, extract it, create a new project, write all files to the project filesystem, and activate the project.

#### Scenario: Successful import creates and activates project
- **WHEN** a valid `.zip` file is selected and `importProject` succeeds
- **THEN** a new `ProjectInfo` SHALL be created with the name from `mod.hjson`
- **AND** a `ProjectFileSystem` SHALL be created for the new project
- **AND** all extracted entries SHALL be written to the filesystem
- **AND** the new project SHALL be set as the current active project

#### Scenario: Failed import shows error
- **WHEN** the zip is invalid or `mod.hjson` is missing
- **THEN** an error message SHALL be displayed to the user
- **AND** no project SHALL be created
