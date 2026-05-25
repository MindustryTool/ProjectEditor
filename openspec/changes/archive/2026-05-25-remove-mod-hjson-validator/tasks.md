## 1. Remove modHjsonValidator from source

- [x] 1.1 Remove `ModHjsonSchema` import from `packages/file-validation/src/validators.ts`
- [x] 1.2 Remove the `modHjsonValidator` function definition
- [x] 1.3 Remove `valibot` import if no longer used (check `jsonSyntaxValidator` still uses it)
- [x] 1.4 Remove `mod-hjson` registration from `createDefaultValidators()`

## 2. Remove translation keys

- [x] 2.1 Remove `validation.modHjson.*` keys from `apps/web/src/i18n/locales/en/translation.json` (10 keys: empty, invalidJson, fieldDeprecated, and 7 fieldInvalid keys)
- [x] 2.2 Remove `validation.modHjson.*` keys from `apps/web/src/i18n/locales/vi/translation.json` (same 10 keys)

## 3. Verify

- [x] 3.1 TypeScript: `tsc --noEmit` passes for `packages/file-validation` and `apps/web`
- [x] 3.2 Verify no references to `modHjsonValidator` remain in the codebase
