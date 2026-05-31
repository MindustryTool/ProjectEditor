## Purpose
The system SHALL display live project information and validation status in a status bar at the bottom of the editor.
## Requirements
### Requirement: Status bar displays live project info
The `StatusBar` component SHALL compose three sub-components (`StatusBarLeft`, `StatusBarCenter`, `StatusBarRight`) as slot children. Each sub-component subscribes to its own store slices independently.

#### Scenario: Status bar with project data
- **WHEN** a project is open
- **THEN** the left section SHALL display the project name and file count, the center SHALL display "Ready", and the right SHALL display validation counts and icons

#### Scenario: Status bar with no project
- **WHEN** no project is open
- **THEN** the left section SHALL display an empty project name, the center SHALL display "Ready", and the right SHALL NOT show validation counts

### Requirement: Display project name (StatusBarLeft)
The StatusBarLeft component SHALL display the current project name using the `statusBar.project` i18n key.

#### Scenario: Project is loaded
- **WHEN** a project is open in the editor
- **THEN** the left status bar section SHALL display the project name

#### Scenario: No project is loaded
- **WHEN** no project is open
- **THEN** the left status bar section SHALL display an empty project name (empty string fallback)

### Requirement: Display file count (StatusBarLeft)
The StatusBarLeft component SHALL display a file count using the `statusBar.files` i18n key, separated from the project name by a pipe character.

#### Scenario: File count displayed
- **WHEN** the status bar is rendered
- **THEN** a pipe separator and file count SHALL appear after the project name

### Requirement: Data source (StatusBarLeft)
The StatusBarLeft component SHALL read the project name from `useProjectStore`.

#### Scenario: Store subscription
- **WHEN** the project name changes in the store
- **THEN** the component SHALL re-render with the updated name

### Requirement: Display editor status (StatusBarCenter)
The StatusBarCenter component SHALL display the current editor status message using the `statusBar.ready` i18n key.

#### Scenario: Editor is ready
- **WHEN** the editor is loaded and operational
- **THEN** the center status bar section SHALL display the ready message

### Requirement: Display validation errors (StatusBarRight)
The StatusBarRight component SHALL display the count of validation errors using the `statusBar.validationErrors` i18n key, styled with red text, only when the count is greater than zero. The error count SHALL be clickable.

#### Scenario: Validation errors exist
- **WHEN** `validationSummary.errors` is greater than 0
- **THEN** the error count SHALL be displayed in red text
- **THEN** the error count element SHALL be clickable

#### Scenario: No validation errors
- **WHEN** `validationSummary.errors` is 0
- **THEN** the error count SHALL NOT be displayed

#### Scenario: Clicking error count opens dialog
- **WHEN** the user clicks on the error count
- **THEN** a dialog SHALL open listing all errors with clickable file paths

### Requirement: Display validation warnings (StatusBarRight)
The StatusBarRight component SHALL display the count of validation warnings using the `statusBar.validationWarnings` i18n key, styled with yellow text, only when the count is greater than zero. The warning count SHALL be clickable.

#### Scenario: Validation warnings exist
- **WHEN** `validationSummary.warnings` is greater than 0
- **THEN** the warning count SHALL be displayed in yellow text
- **THEN** the warning count element SHALL be clickable

#### Scenario: No validation warnings
- **WHEN** `validationSummary.warnings` is 0
- **THEN** the warning count SHALL NOT be displayed

#### Scenario: Clicking warning count opens dialog
- **WHEN** the user clicks on the warning count
- **THEN** a dialog SHALL open listing all warnings with clickable file paths

### Requirement: Display document type icons (StatusBarRight)
The StatusBarRight component SHALL display `FileJson` and `Image` icons from lucide-react.

#### Scenario: Icons rendered
- **WHEN** the status bar is rendered
- **THEN** the FileJson and Image icons SHALL appear in the right section

### Requirement: Data source (StatusBarRight)
The StatusBarRight component SHALL read validation data from `useValidationStore`.

#### Scenario: Store subscription
- **WHEN** the validation summary changes in the store
- **THEN** the component SHALL re-render with updated error/warning counts

### Requirement: StatusBar validation dialog uses shared component
The StatusBar SHALL use the shared `ValidationErrorList` component for its validation dialog.

#### Scenario: StatusBar dialog renders shared component
- **WHEN** the status bar validation dialog is open
- **THEN** it SHALL render the shared `ValidationErrorList` component with all errors or warnings

#### Scenario: Click file path in dialog navigates
- **WHEN** the user clicks a file path in the status bar validation dialog
- **THEN** the dialog closes and the editor navigates to the file

