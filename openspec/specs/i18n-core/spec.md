## Purpose
Internationalization (i18n) framework for the mod editor, providing locale loading, switching, routing, and translation key management.
## Requirements
### Requirement: Translation framework initialized

The system SHALL initialize i18next with `react-i18next` on app startup, loading locale `.ts` files, registering both `common` and `schema` namespaces, and setting the active language.

#### Scenario: Initialization on mount

- **WHEN** the app starts
- **THEN** i18next SHALL be initialized with English as the default locale and browser language detection enabled
- **AND** the language SHALL also be detectable from the URL path prefix

#### Scenario: Loads namespace files

- **WHEN** the active language is set to a supported locale
- **THEN** the corresponding `locales/{lang}/common.ts` and `locales/{lang}/schema.ts` SHALL be loaded and available for translations

#### Scenario: Schema namespace usage

- **WHEN** a component calls `useTranslation("schema")`
- **THEN** the `t` function SHALL resolve keys from the `schema` namespace by default

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
- **AND** both `common` and `schema` namespaces SHALL reflect the new locale

### Requirement: Fallback to default locale

The system SHALL fall back to English when a translation key is missing in the active locale.

#### Scenario: Missing key fallback

- **WHEN** `t("missing-key")` is called and the key does not exist in the active locale
- **THEN** the English value for that key SHALL be returned

### Requirement: Browser language detection

The system SHALL detect the user's preferred language from the browser and apply it on first visit.

#### Scenario: Auto-detect on first visit

- **WHEN** a user visits the app for the first time and their browser language is a supported locale
- **THEN** the app SHALL display UI in that locale

### Requirement: Locale from URL on SSR

The system SHALL initialize the active language from the URL path prefix during server-side rendering.

#### Scenario: SSR uses URL locale

- **WHEN** the server receives a request for `/vi/about`
- **THEN** i18n SHALL be initialized with `vi` as the active language before rendering

### Requirement: Locale-prefixed routes

The system SHALL serve all application routes under a locale path prefix that identifies the display language.

#### Scenario: Routes are prefixed

- **WHEN** the user visits `/en/about`
- **THEN** the about page SHALL render with English locale
- **WHEN** the user visits `/vi/about`
- **THEN** the about page SHALL render with Vietnamese locale

#### Scenario: Validate locale param

- **WHEN** the user visits `/fr/editor` (unsupported locale)
- **THEN** the system SHALL redirect to `/en/editor`

### Requirement: Bare path redirect

The system SHALL redirect requests to bare paths (without locale prefix) to the user's preferred locale.

#### Scenario: Redirect bare path

- **WHEN** a user with English browser settings visits `/editor`
- **THEN** the system SHALL redirect to `/en/editor`
- **WHEN** a user with Vietnamese browser settings visits `/editor`
- **THEN** the system SHALL redirect to `/vi/editor`

### Requirement: Dynamic HTML lang attribute

The system SHALL set the `<html lang>` attribute to match the current locale from the URL.

#### Scenario: lang attribute matches URL locale

- **WHEN** the user visits `/vi/about`
- **THEN** the `<html>` element SHALL have `lang="vi"`
- **WHEN** the user visits `/en/about`
- **THEN** the `<html>` element SHALL have `lang="en"`

### Requirement: Weapon translation keys in schema namespace

The `schema` namespace SHALL contain `editor.weapon.*` translation keys in both `en` and `vi` locale files.

#### Scenario: English weapon keys available

- **WHEN** `t("editor.weapon.reload", { ns: "schema" })` is called with English locale
- **THEN** it SHALL return the string `"Reload"`

#### Scenario: Vietnamese weapon keys available

- **WHEN** `t("editor.weapon.reload", { ns: "schema" })` is called with Vietnamese locale
- **THEN** it SHALL return the string `"Nạp đạn"`

#### Scenario: All weapon fields have translation keys

- **WHEN** the `schema` namespace is loaded for either locale
- **THEN** every field in `weaponObjectSchema` with metadata SHALL have a corresponding `editor.weapon.<field>` key and `editor.weapon.<field>-description` key in the translation file

