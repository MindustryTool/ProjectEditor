## ADDED Requirements

### Requirement: Export dialog opens on button click
The ExportMenu SHALL open a dialog when the export button is clicked, instead of immediately downloading the ZIP.

#### Scenario: Clicking export opens dialog
- **WHEN** the user clicks the Export button in the toolbar
- **THEN** a dialog SHALL open with a filename input, Download button, and Cancel button
- **THEN** no download SHALL occur at this point

### Requirement: Filename input is pre-filled and editable
The dialog SHALL show an input field pre-filled with `<project-name>.zip` that the user can edit.

#### Scenario: Input shows default filename
- **WHEN** the export dialog opens
- **THEN** the input SHALL contain `<project-name>.zip` where `<project-name>` is the current project name

#### Scenario: User can edit filename
- **WHEN** the user types in the filename input
- **THEN** the input value SHALL update to reflect the typed text

#### Scenario: User can append or omit .zip extension
- **WHEN** the user edits the filename
- **THEN** the `.zip` extension MAY be present or absent in the input
- **THEN** the download SHALL always produce a `.zip` file regardless

### Requirement: Download button triggers export with custom filename
The dialog SHALL have a Download button that triggers the export with the user-specified filename.

#### Scenario: Download button exports and downloads
- **WHEN** the user clicks the Download button
- **THEN** the exporter SHALL be invoked with the current project context
- **THEN** the resulting ZIP SHALL be downloaded with the filename from the input (appending `.zip` if not present)

#### Scenario: Download button during export failure
- **WHEN** the user clicks Download and the export fails
- **THEN** the error SHALL be surfaced to the user
- **THEN** the dialog SHALL remain open

### Requirement: Cancel button closes dialog
The dialog SHALL have a Cancel button that closes the dialog without exporting.

#### Scenario: Cancel closes dialog
- **WHEN** the user clicks Cancel
- **THEN** the dialog SHALL close
- **THEN** no download SHALL occur
