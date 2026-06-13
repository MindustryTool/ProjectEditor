## ADDED Requirements

### Requirement: User can import a file from disk
The system SHALL allow users to import/upload a file from their local machine into the project file system via the CreateFileDialog.

#### Scenario: Import button shown for all types
- **WHEN** the CreateFileDialog is open
- **THEN** an "Import File" button SHALL be visible in the dialog footer

#### Scenario: Import triggers file picker
- **WHEN** the user clicks "Import File"
- **THEN** the native file picker dialog SHALL open, accepting any file type

#### Scenario: Imported file is written to target folder
- **WHEN** the user selects a file from the picker and the type is `file` or a content type with a selected folder
- **THEN** the file SHALL be read via FileReader as text
- **AND** written to `{selectedFolder}/{originalFilename}` in the project FS
- **AND** the dialog SHALL close and navigate to the new file

#### Scenario: Imported file uses original filename
- **WHEN** the user imports a file named `my-unit.hjson`
- **THEN** the file SHALL be created as `{selectedFolder}/my-unit.hjson`
- **AND** the name input SHALL be ignored for imported files

#### Scenario: Import for folder type
- **WHEN** the type is `folder` and the user clicks "Import File"
- **THEN** the system SHALL import the file into the current `targetPath` directory (the parent folder context)

#### Scenario: Import error handling
- **WHEN** the file read fails (e.g., file too large, permission error)
- **THEN** an error message SHALL be displayed in the dialog
- **AND** the dialog SHALL NOT close
