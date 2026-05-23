## MODIFIED Requirements

### Requirement: Export button triggers export and download
The ExportMenu SHALL render a button that opens an export dialog, allowing the user to customize the filename before downloading.

#### Scenario: Clicking export opens dialog instead of immediate download
- **WHEN** the user clicks the Export button
- **THEN** a dialog SHALL open with a filename input pre-filled with a sanitized version of the project name, a Download button, and a Cancel button
- **THEN** no download SHALL occur until the user clicks Download in the dialog

#### Scenario: Filename input shows validation feedback
- **WHEN** the dialog is open
- **THEN** the filename input SHALL validate characters as the user types
- **THEN** characters outside `[a-zA-Z0-9._-]` SHALL be visually flagged with a warning
