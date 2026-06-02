## ADDED Requirements

### Requirement: Translation keys constrained to lowercase alphanumeric and hyphens
The system SHALL enforce that all translation keys match the pattern `^[a-z][a-z0-9-]*$` (start with lowercase letter, followed by lowercase letters, digits, or hyphens).

#### Scenario: Valid key passes
- **WHEN** a translation key like `editor-mod-hjson-name` or `app-title` is used
- **THEN** the TypeScript compiler SHALL accept it

#### Scenario: Key with dots rejected
- **WHEN** a translation key like `editor.modHjson.name` is used
- **THEN** the TypeScript compiler SHALL produce a type error

#### Scenario: Key with underscores rejected
- **WHEN** a translation key like `editor_mod_hjson_name` is used
- **THEN** the TypeScript compiler SHALL produce a type error

#### Scenario: Key with uppercase rejected
- **WHEN** a translation key like `editor-ModHjson-name` is used
- **THEN** the TypeScript compiler SHALL produce a type error

### Requirement: Translation source files use .ts format
The system SHALL store translation resources as `.ts` files exporting a typed const object instead of `.json` files.

#### Scenario: Translation file exports const object
- **WHEN** a translation file `locales/en/translation.ts` is imported
- **THEN** it SHALL export a `const` object with all keys typed as readonly string literals

#### Scenario: No .json translation files remain
- **WHEN** the project builds
- **THEN** no `translation.json` files SHALL exist under `apps/web/src/i18n/locales/`

### Requirement: Type-safe TranslationKey type
The system SHALL provide a `TranslationKey` type that is a string union of all valid translation keys from the English locale file.

#### Scenario: TranslationKey used in ValidationResult
- **WHEN** `ValidationResult` is constructed with a `messageKey`
- **THEN** the type system SHALL enforce that the key is a valid `TranslationKey`

#### Scenario: Invalid key causes compile error
- **WHEN** code uses `t("non-existent-key")`
- **THEN** the TypeScript compiler SHALL produce a type error

### Requirement: i18next type augmentation uses .ts resource type
The `i18nxt.d.ts` type augmentation SHALL reference the `.ts` export type instead of the `.json` import type.

#### Scenario: t() function is fully typed
- **WHEN** a component calls `t("some-key")`
- **THEN** the TypeScript compiler SHALL validate that the key exists in the translation object
