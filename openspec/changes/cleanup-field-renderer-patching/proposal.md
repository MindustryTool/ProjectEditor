## Why

`FieldRenderer.tsx` currently passes a generic `patchValue` callback through every renderer, including nested object and array flows. That makes simple primitive edits easy, but it also leaves complex nodes with paths that can replace whole objects or arrays instead of performing surgical HJSON patches, which risks losing structure and violates expected editor behavior.

## What Changes

- Remove generic renderer-level `patchValue` prop from `FieldRenderer.tsx`
- Introduce helper dedicated to primitive `HjsonValueNode` edits so string, number, boolean, color, picklist, and similar scalar fields still patch from simple raw values
- Require object and array renderers to perform structural updates through `patchField`, `patchElement`, `insertElement`, and `removeElement` instead of whole-value replacement
- Keep existing editor behavior and UI intact while tightening update boundaries for nested data

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `schema-renderer`: Primitive field renderers use a dedicated helper for scalar HJSON value updates instead of receiving a generic whole-node replacement callback
- `nested-object-editor`: Nested object fields patch child properties structurally and never replace an entire object value during normal editing flows
- `array-field-editor`: Array fields and array item editors preserve surgical patch semantics and never replace an entire array value for structural edits

## Impact

- Affects `apps/web/src/components/editor/panel/FieldRenderer.tsx`
- May refine renderer prop contracts and helper boundaries used by primitive, object, array, effect, and research field renderers
- Keeps current panel layout, visible controls, and user-facing editing flow unchanged
