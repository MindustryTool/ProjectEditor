## Why

Patching a field to `"null"` when its value is cleared leaves an artifact in the serialized HJSON. Consumers downstream parse the literal string `null` as a value rather than treating the field as absent. For optional properties, the field should be removed from the object entirely.

## What Changes

- Add `nullable?: boolean` (default `false`) to the `Field` interface in `FieldRenderer.tsx`
- Add `removeField` method to `HjsonObjectNode` in `@project/hjson` that surgically removes a key from the source string
- When `nullable` is `true` and the patched value is `undefined`, call `removeField` instead of patching to `"null"`
- Preserve existing behavior for non-nullable fields (patch to `"null"` as before)

## Capabilities

### New Capabilities
- `nullable-fields`: Support for optional HJSON properties that get removed from the source when cleared, rather than being written as `null`.

### Modified Capabilities

<!-- No existing spec-level capabilities are changing. -->

## Impact

- `packages/hjson/src/structured.ts` – new `removeField` method on `HjsonObjectNode`
- `apps/web/src/components/editor/panel/FieldRenderer.tsx` – `Field` interface change + patching logic update
- Any code that defines `Field` objects may optionally use the new `nullable` property
