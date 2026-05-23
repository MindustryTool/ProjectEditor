## Why

Mindustry mods support a `hidden` field in `mod.hjson` that, when `true`, hides the mod from the in-game mod list. The current form editor does not expose this field, forcing users to manually edit the file to toggle visibility. Adding a checkbox makes this functionality accessible through the UI.

## What Changes

- Add `hidden` as an optional boolean field to the `ModHjsonSchema` Valibot schema
- Add a checkbox field to the `ModHjsonPanel` form for the `hidden` property
- Add i18n translation keys for the hidden field label and description
- Update the `mod-hjson-editor` spec to reflect eight fields instead of seven

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `mod-hjson-editor`: Add `hidden` checkbox field to the form and update field count from 7 to 8

## Impact

Affects `@project/validation` (schema), `apps/web` (form component), and locale files (translation keys).
