## MODIFIED Requirements

### Requirement: Pre-export loads and validates all files
Before exporting, the ExportMenu SHALL read all project files from the filesystem directly and validate them. Validation SHALL run when the user clicks the Download button, not when the export dialog opens.

#### Scenario: Export reads and validates on download click
- **WHEN** the user clicks the Download button in the export dialog
- **THEN** the system SHALL iterate over all project files, read each from the filesystem via `fs.readFile()`, and call `validateFile()` directly
- **THEN** validation results SHALL be available after the files are processed
- **WHEN** errors are found
- **THEN** the validation error dialog SHALL open
- **WHEN** no errors are found
- **THEN** the export SHALL proceed and the ZIP SHALL be downloaded

#### Scenario: Export opens dialog without pre-validation
- **WHEN** the user clicks the Export button
- **THEN** the dialog SHALL open immediately without reading or validating any files
- **THEN** the filename input SHALL be pre-filled with a sanitized version of the project name

#### Scenario: Export shows loading indicator during download validation
- **WHEN** files are being read and validated after the user clicks Download
- **THEN** a loading indicator SHALL be shown on the Download button during validation
