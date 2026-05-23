## 1. Validation Schema

- [x] 1.1 Add `hidden: v.optional(v.boolean())` to `ModHjsonSchema` in `packages/validation/src/mod-hjson/schema.ts`
- [x] 1.2 Add `hidden: false` to `defaultModHjson`

## 2. Translations

- [x] 2.1 Add `editor.modHjson.hidden` and `editor.modHjson.hiddenDescription` keys to `apps/web/src/i18n/locales/en/translation.json`
- [x] 2.2 Add Vietnamese translations for the same keys in `apps/web/src/i18n/locales/vi/translation.json`

## 3. Form Field

- [x] 3.1 Add `hidden` checkbox field to the `ModHjsonPanel` component using the `Checkbox` UI component and horizontal `Field` layout
