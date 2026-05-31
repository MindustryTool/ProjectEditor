# file-validation-navigation Specification

## Purpose
TBD - created by archiving change better-validation-system. Update Purpose after archive.
## Requirements
### Requirement: Clickable validation errors navigate to file
The system SHALL allow users to click on validation error entries to navigate to the errored file in the editor.

#### Scenario: Export dialog error is clickable
- **WHEN** the user clicks on an error entry in the ExportMenu validation dialog
- **THEN** the dialog closes and the editor navigates to the file at the error's path

#### Scenario: StatusBar error count click opens dialog
- **WHEN** the user clicks on the error count in StatusBarRight
- **THEN** a dialog SHALL open showing a list of all errors with file paths

#### Scenario: StatusBar warning count click opens dialog
- **WHEN** the user clicks on the warning count in StatusBarRight
- **THEN** a dialog SHALL open showing a list of all warnings with file paths

#### Scenario: Error list item navigates to file
- **WHEN** the user clicks on a file path in the status bar validation dialog
- **THEN** the dialog closes and the editor navigates to the file at the error's path

### Requirement: Shared error list component
The system SHALL provide a shared `ValidationErrorList` component used by both the ExportMenu and StatusBar for consistent error display and navigation behavior.

#### Scenario: ExportMenu uses shared component
- **WHEN** ExportMenu validation dialog renders errors
- **THEN** it SHALL use the shared `ValidationErrorList` component

#### Scenario: StatusBar uses shared component
- **WHEN** StatusBar validation dialog renders errors
- **THEN** it SHALL use the shared `ValidationErrorList` component

#### Scenario: Error items render with clickable file paths
- **WHEN** a validation error or warning is displayed
- **THEN** the file path SHALL be rendered as a clickable element

### Requirement: File navigation via URL path state
The system SHALL navigate to files by updating the URL path query parameter.

#### Scenario: Click error navigates via usePath
- **WHEN** a clickable file path is clicked in ExportMenu or StatusBar dialog
- **THEN** the dialog closes and `setPath(filePath)` is called to update the URL, switching the editor to that file

