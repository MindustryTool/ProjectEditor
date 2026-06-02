## Why

Translation keys are currently plain `string` values with no type enforcement, allowing typos and invalid keys to compile without error. The `ValidationResult` type uses a numeric `SeverityLevel` enum that requires manual mapping to strings for display, and its `code` field is unused. There is no way to provide quick-fix actions from validation results. Moving translations to `.ts` files enables static analysis, dynamic imports, and strict type safety for all translation keys.

## What Changes

- **BREAKING**: Translation files converted from `.json` to `.ts` format, exporting typed const objects
- **BREAKING**: Translation keys restricted to pattern `[a-z0-9-]+` (no dots, underscores, or capitals)
- **NEW**: `ValidationResult<Tkey>` becomes a generic interface with a typed `messageKey` field
- **NEW**: `fixs` array added to `ValidationResult` for providing auto-fix actions
- **CHANGE**: `severity` field changed from `SeverityLevel` numeric enum to `string` type
- **REMOVED**: `code` field removed from `ValidationResult` (unused)
- **NEW**: Valibot i18n loaded dynamically for localized validation messages
- **CHANGE**: All `t()` calls and `messageKey` references updated to use the new strict key type
- **BREAKING**: `ValidationSummary` updated to use `string` severity keys instead of numeric counts
- **CHANGE**: `severityLabel()` and `isErrorOrWarning()` helpers updated to work with `string` severity

## Capabilities

### New Capabilities
- `type-safe-translation-keys`: Strictly typed translation key system using const objects from `.ts` files, with a union type of all valid keys
- `validation-result-fixs`: Quick-fix infrastructure on `ValidationResult` with typed message keys, params, and async action callbacks
- `valibot-i18n-dynamic`: Dynamic loading of valibot i18n translation package for localized validation error messages

### Modified Capabilities
- `i18n-core`: Translation source format changes from `.json` to `.ts`, key format constraint changes to `[a-z0-9-]+`
- `file-validation-core`: `ValidationResult` interface changes (generic Tkey, string severity, remove code, add fixs); `ValidatorFn` signature changes; `ValidationSummary` severity keys change
- `validation-results-class`: `ValidationResults` class updated for new `ValidationResult` shape (string severity, generic key)
- `validation-provider`: All `messageKey` and `severity` usages updated for new types

## Impact

- **`apps/web/src/i18n/`**: All translation files converted from `.json` to `.ts`; all keys reformatted to `[a-z0-9-]+` pattern; `i18n.ts` setup updated for `.ts` imports and valibot i18n dynamic loading
- **`packages/state/src/validation/types.ts`**: `ValidationResult` interface rewritten with generic `Tkey`, `severity: string`, removed `code`, added `fixs`; `Severity`/`SeverityLevel` types removed; `ValidationSummary` updated
- **`packages/state/src/validation/validators.ts`**: All `messageKey` values updated to new key format; `Severity.error` replaced with `"error"` string literal
- **`packages/state/src/validation/runner.ts`**: Message key references updated
- **`packages/state/src/index.ts`**: Exports updated (no more `Severity`, `SeverityLevel`)
- **`apps/web/src/components/editor/`**: 10+ components updated for new `ValidationResult` types, new translation key format
- **`apps/web/src/i18n/i18nxt.d.ts`**: Type augmentation updated for `.ts` resource type
- **`apps/web/package.json`**: Valibot i18n dependency added
- **All files using `t("...")`**: ~18 components, ~100 call sites updated with new key format
