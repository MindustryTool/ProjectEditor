## ADDED Requirements

### Requirement: Display validation errors
The StatusBarRight component SHALL display the count of validation errors using the `statusBar.validationErrors` i18n key, styled with red text, only when the count is greater than zero.

#### Scenario: Validation errors exist
- **WHEN** `validationSummary.errors` is greater than 0
- **THEN** the error count SHALL be displayed in red text

#### Scenario: No validation errors
- **WHEN** `validationSummary.errors` is 0
- **THEN** the error count SHALL NOT be displayed

### Requirement: Display validation warnings
The StatusBarRight component SHALL display the count of validation warnings using the `statusBar.validationWarnings` i18n key, styled with yellow text, only when the count is greater than zero.

#### Scenario: Validation warnings exist
- **WHEN** `validationSummary.warnings` is greater than 0
- **THEN** the warning count SHALL be displayed in yellow text

#### Scenario: No validation warnings
- **WHEN** `validationSummary.warnings` is 0
- **THEN** the warning count SHALL NOT be displayed

### Requirement: Display document type icons
The StatusBarRight component SHALL display `FileJson` and `Image` icons from lucide-react.

#### Scenario: Icons rendered
- **WHEN** the status bar is rendered
- **THEN** the FileJson and Image icons SHALL appear in the right section

### Requirement: Data source
The StatusBarRight component SHALL read validation data from `useValidationStore`.

#### Scenario: Store subscription
- **WHEN** the validation summary changes in the store
- **THEN** the component SHALL re-render with updated error/warning counts
