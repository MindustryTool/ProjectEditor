## ADDED Requirements

### Requirement: Language picker in header
The system SHALL render a locale switcher in the app header that shows available languages.

#### Scenario: Picker renders
- **WHEN** the header is rendered
- **THEN** a language picker button SHALL be visible showing the current language code or flag

#### Scenario: Open language menu
- **WHEN** user clicks the language picker button
- **THEN** a dropdown SHALL appear listing all available locales (English, Vietnamese)

#### Scenario: Switch language from picker
- **WHEN** user selects a language from the picker
- **THEN** the app SHALL switch to that language immediately and persist the choice
