## Context

The app uses `i18next` with JSON translation files loaded at build time via static imports. Translation keys are dot-separated strings (e.g., `editor.modHjson.name`). Type safety is achieved by augmenting `i18next.CustomTypeOptions` with `typeof en` from the JSON import. The `ValidationResult` interface uses a numeric `SeverityLevel` type (0-3), a plain `string` messageKey, and an unused `code` field. No quick-fix mechanism exists.

The change must update the entire i18n pipeline and validation type system while maintaining backward compatibility for runtime behavior (translated strings must continue to work).

## Goals / Non-Goals

**Goals:**
- Convert all `translation.json` files to `translation.ts` files exporting typed const objects
- Enforce translation key format `[a-z0-9-]+` (dash-separated only, no dots/underscores/capitals)
- Make `ValidationResult<Tkey>` generic with `messageKey: Tkey`
- Replace `severity: SeverityLevel` with `severity: string`
- Remove `code` field from `ValidationResult`
- Add `fixs?: {messageKey: Tkey; messageParams?: Record<string,unknown>; action: () => Promise<void>}[]`
- Load valibot i18n translation package dynamically via `import()`
- Update all consumers (18 components, validators, runner, store) to use new types

**Non-Goals:**
- No changes to the i18next library, react-i18next API, or `useTranslation` hook signature
- No changes to the valibot validation logic itself (only i18n message localization)
- No runtime behavior changes for existing translation rendering (only key format)
- No changes to the `ValidationResults` class method signatures (only internal type updates)

## Decisions

**1. Translation key format: dash-separated flat keys**
Dots in keys (`editor.modHjson.name`) are convenient but conflict with the `[a-z0-9-]` constraint. Convert to a flat structure using only hyphens: `editor-mod-hjson-name`. This is enforced at the type level via a literal union `TranslationKey`.

**2. Translation TS files: `as const` objects with `satisfies`**
Use `export const en = { ... } as const satisfies Record<string, string>` to get narrow literal key types while ensuring values remain strings. The type augmentation in `i18nxt.d.ts` will reference the const object type.

**3. `ValidationResult<Tkey>` as a generic interface**
Adding `<Tkey extends string = string>` to `ValidationResult` allows consumers to optionally specify the key type while maintaining backward compatibility with `string` default. At creation sites, `Tkey` will be inferred from the literal `messageKey` value.

**4. `severity: string` with a `SeverityLevel` type alias**
Replace the numeric enum with `type SeverityLevel = "error" | "warning" | "info" | "deprecated"`. This is a string union for display-friendly values that can be used directly in UI without mapping functions.

**5. Dynamic valibot i18n import**
Use `import("@valibot/i18n")` or dynamic `import()` of the valibot locale package. Check available valibot i18n packages (e.g., `@valibot/i18n/vi`, `@valibot/i18n/en`) and load based on the current locale. Bundle-split to avoid loading all locales.

**6. `fixs` field structure**
```ts
fixs?: {
  messageKey: Tkey;
  messageParams?: Record<string, unknown>;
  action: () => Promise<void>;
}[]
```
The `action` is an async function that performs the fix. The `messageKey` and `messageParams` describe what the fix does (for UI display in a quick-fix menu).

**7. `ValidationSummary` severity keys**
Change from numeric fields (`errors`, `warnings`, etc.) to a `Record<string, number>` with string severity keys matching the `SeverityLevel` type.

## Risks / Trade-offs

- **[Breaking] All translation key references must change**: Every `t("...")` call will need updating. Mitigated by using the strict type system - TypeScript will flag all invalid keys, making migration mechanical.
- **[Risk] Valibot i18n package availability**: The valibot i18n package may not support all locales. Mitigation: fall back to English for unsupported locales.
- **[Trade-off] Verbose key names**: Dash-separated keys like `editor-mod-hjson-name-description` are longer than `editor.modHjson.nameDescription`. Trade-off: readability vs. type safety and parsing simplicity.
- **[Risk] Merge conflicts**: This touches ~20+ files. Mitigation: implement in dependency order (types first, then translation files, then validators, then components).
