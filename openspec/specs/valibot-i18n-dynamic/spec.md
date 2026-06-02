## ADDED Requirements

### Requirement: Valibot i18n loaded dynamically per locale
The system SHALL dynamically import valibot's i18n translation module based on the active locale.

#### Scenario: English locale loads en translations
- **WHEN** the active locale is `en`
- **THEN** the system SHALL dynamically import `@valibot/i18n/en` (or equivalent path)
- **THEN** valibot validation error messages SHALL appear in English

#### Scenario: Vietnamese locale loads vi translations
- **WHEN** the active locale is `vi`
- **THEN** the system SHALL dynamically import `@valibot/i18n/vi` (or equivalent path)
- **THEN** valibot validation error messages SHALL appear in Vietnamese

#### Scenario: Unsupported locale falls back
- **WHEN** the active locale is not supported by the valibot i18n package
- **THEN** the system SHALL fall back to English valibot translations

### Requirement: Valibot i18n loaded lazily
The valibot i18n module SHALL be loaded only when validation schema parsing occurs, not at app startup.

#### Scenario: Dynamic import on first validation
- **WHEN** the first schema validation runs after locale change
- **THEN** the corresponding valibot i18n module SHALL be dynamically imported
- **WHEN** validation runs again with the same locale
- **THEN** the already-imported module SHALL be reused (not re-imported)

### Requirement: valibot i18n dependency in apps/web
The `apps/web/package.json` SHALL include the valibot i18n package as a dependency.

#### Scenario: Package installed
- **WHEN** `pnpm install` is run
- **THEN** the valibot i18n package SHALL be resolved and available
