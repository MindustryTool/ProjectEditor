## MODIFIED Requirements

### Requirement: Translation framework initialized
The system SHALL initialize i18next with `react-i18next` on app startup, loading locale JSON files and setting the active language.

#### Scenario: Initialization on mount
- **WHEN** the app starts
- **THEN** i18next SHALL be initialized with English as the default locale and browser language detection enabled
- **AND** the language SHALL also be detectable from the URL path prefix

#### Scenario: Loads locale file
- **WHEN** the active language is set to a supported locale
- **THEN** the corresponding `locales/{lang}/translation.json` SHALL be loaded and available for translations

### Requirement: String interpolation
The system SHALL support simple string interpolation in translations using `{{variable}}` syntax.

#### Scenario: Interpolated translation renders
- **WHEN** a component calls `t("key", { name: "test" })`
- **THEN** the rendered text SHALL replace `{{name}}` with "test"

### Requirement: Locale switching
The system SHALL allow switching the active language at runtime.

#### Scenario: Switch language
- **WHEN** the locale is changed programmatically
- **THEN** all components using `useTranslation()` SHALL re-render with the new locale's strings

### Requirement: Fallback to default locale
The system SHALL fall back to English when a translation key is missing in the active locale.

#### Scenario: Missing key fallback
- **WHEN** `t("missing.key")` is called and the key does not exist in the active locale
- **THEN** the English value for that key SHALL be returned

### Requirement: Browser language detection
The system SHALL detect the user's preferred language from the browser and apply it on first visit.

#### Scenario: Auto-detect on first visit
- **WHEN** a user visits the app for the first time and their browser language is a supported locale
- **THEN** the app SHALL display UI in that locale

## ADDED Requirements

### Requirement: Locale from URL on SSR
The system SHALL initialize the active language from the URL path prefix during server-side rendering.

#### Scenario: SSR uses URL locale
- **WHEN** the server receives a request for `/vi/about`
- **THEN** i18n SHALL be initialized with `vi` as the active language before rendering
