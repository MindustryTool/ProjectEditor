## ADDED Requirements

### Requirement: Schema namespace available for translations

The system SHALL provide a `schema` namespace alongside the default `common` namespace, accessible via `t("key", { ns: "schema" })`.

#### Scenario: Lookup key in schema namespace

- **WHEN** a component calls `t("editor.unit.speed", { ns: "schema" })`
- **THEN** the system SHALL return the translation value from the `schema` namespace

#### Scenario: Schema namespace fallback

- **WHEN** `t("editor.unit.speed", { ns: "schema" })` is called and the key does not exist in the active locale
- **THEN** the system SHALL fall back to the English value for that key

### Requirement: Common namespace as default

The system SHALL use `common` as the default namespace, so existing `useTranslation()` and `t("key")` calls without explicit namespace continue to work.

#### Scenario: Default namespace resolves

- **WHEN** a component calls `t("app.title")` without specifying a namespace
- **THEN** the system SHALL return the translation from the `common` namespace

### Requirement: Both namespaces initialized on startup

The system SHALL initialize both `common` and `schema` namespaces during app startup for all supported locales.

#### Scenario: Namespace loading on init

- **WHEN** i18next initializes
- **THEN** both `common` and `schema` namespaces SHALL be registered in the resource bundle for each locale
- **AND** translations from both namespaces SHALL be immediately available via `t()`
