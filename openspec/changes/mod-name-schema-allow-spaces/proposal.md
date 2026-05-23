## Why

The `ModNameSchema` regex `/^[a-z][a-z0-9-]*$/` rejects space characters, but Mindustry mod names (`name` field in `mod.hjson`) should allow spaces as valid identifiers.

## What Changes

- Modify `ModNameSchema` regex to allow spaces: `/^[a-z][a-z0-9- ]*$/`
- Update the validation error message to reflect the new allowed character set
- Update the existing spec for `mod-name-schema` to reflect that spaces are now valid

## Capabilities

### New Capabilities
*(none)*

### Modified Capabilities
- `mod-name-schema`: The "Mod name schema validates lowercase letters and hyphens" requirement changes — spaces are now allowed in the pattern

## Impact

- **Modified**: `packages/validation/src/mod-hjson/schema.ts` — update regex and error message
- **Unchanged**: `ModHjsonPanel.tsx`, `ModHjsonSchema` — no UI or structural changes needed
