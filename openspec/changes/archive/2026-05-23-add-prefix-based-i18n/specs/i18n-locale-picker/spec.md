## MODIFIED Requirements

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
- **THEN** the app SHALL navigate to the same page path with the new locale URL prefix
- **AND** persist the choice

## ADDED Requirements

### Requirement: View menu language switch navigates to URL prefix
The View menu language switcher SHALL navigate to the same page with the new locale URL prefix instead of calling `changeLanguage()` directly.

#### Scenario: View menu switches locale via URL
- **WHEN** user selects "Tiếng Việt" in the View menu's language submenu
- **THEN** the app SHALL navigate to the current path with `/vi` prefix
