## ADDED Requirements

No added requirements for project-export — the existing requirements are modified below.

## MODIFIED Requirements

### Requirement: Export button triggers export and download

The ExportMenu SHALL render a button that opens an export dialog, allowing the user to customize the filename before downloading.

#### Scenario: Single export button renders
- **WHEN** the toolbar is rendered
- **THEN** a single "Export" button SHALL be visible (no dropdown chevron)

#### Scenario: Clicking export opens dialog instead of immediate download
- **WHEN** the user clicks the Export button
- **THEN** a dialog SHALL open with a filename input pre-filled with `<project-name>.zip`, a Download button, and a Cancel button
- **THEN** no download SHALL occur until the user clicks Download in the dialog

#### Scenario: Download button triggers export with custom filename
- **WHEN** the user clicks the Download button in the dialog
- **THEN** the exporter for the current project language SHALL be invoked
- **THEN** the resulting ZIP SHALL be downloaded with the filename specified in the dialog input

#### Scenario: Cancel button closes dialog without download
- **WHEN** the user clicks Cancel in the dialog
- **THEN** the dialog SHALL close
- **THEN** no download SHALL occur

#### Scenario: Export errors are surfaced
- **WHEN** export fails (e.g., unsupported language or filesystem error)
- **THEN** the error SHALL be surfaced to the user
- **THEN** the dialog SHALL remain open
