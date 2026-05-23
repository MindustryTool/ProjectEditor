## Context

The `ModHjsonPanel` component at `apps/web/src/components/editor/ModHjsonPanel.tsx` renders a form for editing `mod.hjson` metadata. The form uses `@tanstack/react-form` with a Valibot schema from `@project/validation`. Currently it displays 7 fields. The `hidden` property is a standard Mindustry mod field that controls whether the mod appears in the in-game mod list.

## Goals / Non-Goals

**Goals:**
- Add `hidden` as an optional boolean field to `ModHjsonSchema`
- Render it as a checkbox in the form
- Add English and Vietnamese translations for the field label and description

**Non-Goals:**
- Changing the save/persistence logic (the form uses `useFileContent` which handles save)
- Adding complex validation (optional boolean needs none)

## Decisions

**Decision 1: Schema type — `v.optional(v.boolean())` vs `v.nullish(v.boolean())`**
`v.optional(v.boolean())`. The Mindustry convention is to omit the field when false — `undefined` means not set, `false` explicitly hides nothing, `true` hides the mod. `nullish` adds null which is not needed.

**Decision 2: Checkbox behavior — explicit true/false over tri-state indeterminate**
Two-state checkbox (checked = true, unchecked = false). The spec allows `undefined` but the checkbox UI only needs true/false — the initial `defaultModHjson` can set it to `false` so the default is visible (unchecked). Users can delete the value if they want it undefined, but the form state uses false as default.

## Risks / Trade-offs

- No risk — this is a straightforward field addition following the existing patterns for the form, schema, and translations.
