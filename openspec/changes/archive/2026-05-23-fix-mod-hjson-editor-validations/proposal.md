## Why

The mod.hjson editor lacks proper field-level validation constraints matching Mindustry mod metadata requirements. This leads to invalid mod.hjson files being created, and the form UX doesn't match the expected patterns (no textarea for description, comma-separated dependencies instead of individual inputs, unnecessary save/reset buttons in an auto-saving editor).

## What Changes

- Update `name` field validation: only lowercase letters and hyphens allowed
- Update `displayName` and `author` validation: 2-127 characters
- Update `description` field: use a Textarea component, max 9999 characters
- Update `author` field: same constraints as `displayName`
- Update `version` validation: max 127 characters (remove semver regex)
- Update `minGameVersion` validation: must be a number greater than 145
- Replace comma-separated `dependencies` input with individual mod-name inputs, one default, with an "Add" button
- Remove save and reset buttons from the form

## Capabilities

### New Capabilities

- `mod-name-schema`: Reusable Valibot schema for mod name strings (lowercase + hyphens, 1+ chars)

### Modified Capabilities

- `mod-hjson-editor`: Field validation requirements are changing for all fields, description uses textarea, dependencies uses dynamic input list, save/reset buttons removed

## Impact

- Schema file: `apps/web/src/components/editor/mod-hjson/schema.ts` updated
- Editor file: `apps/web/src/components/editor/mod-hjson/ModHjsonEditor.tsx` restructured
- A new `Textarea` UI component import needed
- i18n keys may need minor updates for new error messages
