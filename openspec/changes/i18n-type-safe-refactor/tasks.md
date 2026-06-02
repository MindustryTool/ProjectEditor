## 1. Type System Changes (packages/state)

- [ ] 1.1 Update `ValidationResult` in `types.ts`: add generic `<Tkey extends string = string>`, change `severity` to `string`, remove `code` field, add `fixs` array
- [ ] 1.2 Replace `Severity` const and `SeverityLevel` type with `type SeverityLevel = "error" | "warning" | "info" | "deprecated"`
- [ ] 1.3 Update `severityLabel()` to accept/return `string` instead of `SeverityLevel`
- [ ] 1.4 Update `isErrorOrWarning()` to accept `string` instead of `SeverityLevel`
- [ ] 1.5 Update `ValidationSummary` interface: replace numeric fields (`errors`, `warnings`, etc.) with `Record<string, number>` plus `total`
- [ ] 1.6 Update `computeSummary()` in `ValidationResults` class to use string severity keys (`"error"`, `"warning"`, etc.)
- [ ] 1.7 Update `computeRollup()` to compare against string severity literals
- [ ] 1.8 Update `ValidatorFn` type to use the updated `ValidationResult` (generic Tkey inferred from usage)
- [ ] 1.9 Update exports in `packages/state/src/index.ts` (remove Severity/SeverityLevel exports)

## 2. Translation File Conversion (.json → .ts)

- [ ] 2.1 Create `locales/en/translation.ts` with `as const satisfies Record<string, string>` export, all keys converted to `[a-z0-9-]+` format
- [ ] 2.2 Create `locales/vi/translation.ts` with matching keys and Vietnamese translations
- [ ] 2.3 Delete `locales/en/translation.json` and `locales/vi/translation.json`
- [ ] 2.4 Update `apps/web/src/i18n/i18n.ts` to import from `.ts` files instead of `.json`
- [ ] 2.5 Update `apps/web/src/i18n/i18nxt.d.ts` to reference the `.ts` export type
- [ ] 2.6 Define and export `TranslationKey` type as `keyof typeof en` for use across the app

## 3. Validator Updates (packages/state)

- [ ] 3.1 Update `validators.ts` `jsonSyntaxValidator`: replace `Severity.error` with `"error"`, update all `messageKey` values to new dash-separated format
- [ ] 3.2 Update `validators.ts` `createValibotValidator`: replace `Severity.error` with `"error"`, `Severity.warning` with `"warning"`, update all `messageKey` values
- [ ] 3.3 Update `validators.ts` `createDefaultValidators` (no type changes needed)
- [ ] 3.4 Update `runner.ts` message key references to new format

## 4. Valibot i18n Dynamic Loading

- [ ] 4.1 Research available valibot i18n packages and determine correct import paths
- [ ] 4.2 Add valibot i18n dependency to `apps/web/package.json`
- [ ] 4.3 Create a `loadValibotI18n(locale: string)` utility that dynamically imports the locale-specific valibot i18n module
- [ ] 4.4 Integrate `loadValibotI18n` with the validation provider so it's called when locale changes
- [ ] 4.5 Set valibot's i18n configuration after dynamic import

## 5. UI Component Updates (apps/web)

- [ ] 5.1 Update `MonacoEditor.tsx`: update `t()` calls and severity handling for new types
- [ ] 5.2 Update `ValidationErrorList.tsx`: add fix button rendering, update severity/type usage
- [ ] 5.3 Update `ValidationProvider.tsx`: update error handling messageKey, integrate valibot i18n loading
- [ ] 5.4 Update `ExportMenu.tsx`: update severity and messageKey usage
- [ ] 5.5 Update `FieldRenderer.tsx`: update messageKey and severity references
- [ ] 5.6 Update `ModHjsonPanel.tsx`: update messageKey references
- [ ] 5.7 Update `StatusBarCenter.tsx`, `StatusBarLeft.tsx`, `StatusBarRight.tsx`: update severity/summary usage
- [ ] 5.8 Update `Header.tsx`, `LocalePicker.tsx`, `ViewMenu.tsx`, `ProjectMenu.tsx`, `ProjectSettingsDialog.tsx`, `LocalizationMenu.tsx`, `ProjectPickerScreen.tsx`, `ProjectPickerDialog.tsx`, `EditorPage.tsx`, `EditorLeftPanel.tsx`, `EditorMobileLayout.tsx`: update all `t()` calls to new key format

## 6. Store and Hook Updates

- [ ] 6.1 Update `ValidationProvider.tsx`/`use-project-actions.ts`: ensure store reset works with new `ValidationSummary` shape

## 7. Verification

- [ ] 7.1 Run TypeScript compiler to check for type errors across the entire workspace
- [ ] 7.2 Run tests to verify validation behavior is unchanged
- [ ] 7.3 Verify all translation keys render correctly in both locales
