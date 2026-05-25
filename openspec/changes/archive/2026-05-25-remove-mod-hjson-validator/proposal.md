## Why

`modHjsonValidator` is redundant — the `ModHjsonPanel` form component already validates `mod.hjson` fields inline using `ModHjsonSchema`. The file-level validator duplicates this logic, adds unnecessary validation overhead on every keystroke, and requires maintaining translation keys (`validation.modHjson.*`) that are only used by the validator.

## What Changes

- **BREAKING**: Remove `modHjsonValidator` function from `packages/file-validation/src/validators.ts`
- Remove `mod-hjson` registration from `createDefaultValidators()`
- Remove `ModHjsonSchema` import (no longer needed in validators.ts)
- Remove `validation.modHjson.*` translation keys from both `en/translation.json` and `vi/translation.json`
- Delete `file-validation-mod-hjson` spec (the validator no longer exists)

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `file-validation-mod-hjson` (deleted): The `mod.hjson` file-level validator is removed — mod.hjson validation is now handled exclusively by the ModHjsonPanel form component

## Impact

**Files removed:**
- `openspec/specs/file-validation-mod-hjson/spec.md` (main spec)

**Files modified:**
- `packages/file-validation/src/validators.ts` — remove `modHjsonValidator`, `ModHjsonSchema` import, and `mod-hjson` registration
- `apps/web/src/i18n/locales/en/translation.json` — remove 10 `validation.modHjson.*` keys
- `apps/web/src/i18n/locales/vi/translation.json` — remove 10 `validation.modHjson.*` keys

**Dependencies:**
- `@project/validation` — `ModHjsonSchema` is still used by `ModHjsonPanel.tsx`, no change to the validation package
