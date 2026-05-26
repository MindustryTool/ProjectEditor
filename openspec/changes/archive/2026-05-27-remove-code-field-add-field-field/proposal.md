## Why

Validators often need to report which specific field caused an issue (e.g., a missing `"type"` field in a mod hjson file), but currently must hack it into `messageParams`. Adding a proper `field` property makes this capability first-class without relying on message interpolation params.

## What Changes

- Add `field?: string` to `ValidationResult` for identifying which field triggered the validation issue (non-breaking)
- Update existing validators to use `field` instead of `messageParams.field`
- Update the `file-validation-core` spec to include `field` in the result shape

## Capabilities

### New Capabilities
- _(none)_

### Modified Capabilities
- `file-validation-core`: `ValidationResult` gains an optional `field` property

## Impact

- **`packages/state/src/validation/types.ts`** — add `field?: string` to interface
- **`packages/state/src/validation/validators.ts`** — replace `messageParams.field` with `field` property
- **`openspec/specs/file-validation-core/spec.md`** — add `field` to result shape requirement
