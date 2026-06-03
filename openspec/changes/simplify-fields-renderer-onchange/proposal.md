## Why

The current `onChange` pattern in `FieldsRenderer.tsx` has two problems: (1) it's created per-render inside `.map()`, causing unnecessary re-renders of every field editor, and (2) leaf renderers need to convert between raw values and HJSON serialization, duplicating logic. A single stable `onChange(jsonPath, updater)` that gives the updater direct access to the HjsonNode and source string eliminates both issues.

## What Changes

- **`HjsonValueNode.patchValue(original, newValue)`** — new method for surgically replacing a value node's content in the source string, mirroring `FieldInfo.replaceValue`.
- **Stable `onChange`** — created once via `useRef` + `useCallback` with empty deps; identity never changes.
- **New `onChange` signature**: `(jsonPath: string, updater: (node: HjsonNode, original: string) => string | undefined) => void`. Returns `undefined` to signal field removal.
- **Removal on default**: when updater returns `undefined` AND the current value equals the schema default AND the schema is not nullable, the field is surgically removed from the source.
- **Remove `original` and `onPatch` from `SchemaRendererProps`** — these are no longer passed to renderers.
- **All renderers simplified** — leaf renderers use `(node as HjsonValueNode).patchValue(original, HJSON.stringify(newVal))`; complex renderers use the node's surgical methods directly.
- **Remove `FieldWriteContext` and `createFieldValueReplacer`** — no longer needed.
- **Add unit tests for `HjsonValueNode.patchValue`**.

## Capabilities

### New Capabilities
- `hjson-value-node-patch`: Add `patchValue(original, newValue)` to `HjsonValueNode` for source-string-level value replacement
- `stable-onchange-pattern`: Single stable `onChange(jsonPath, updater)` function with (node, original) updater signature

### Modified Capabilities
- `schema-renderer`: `onChange` signature changes; `original`/`onPatch` removed from `SchemaRendererProps`
- `array-field-editor`: ArrayField operations use `onChange` updater pattern instead of separate `handleRemove`/`handleItemChange`/`handleAdd` with surgical patching helpers

## Impact

- `packages/hjson/src/structured.ts`: Add ~7 lines for `patchValue`
- `apps/web/src/components/editor/panel/FieldsRenderer.tsx`: Major refactor (~100 lines removed, ~60 changed)
- All renderers (StringField, NumberField, BooleanField, ColorField, PickListField, LiquidsListField, ArrayField, ObjectField, ResearchField, EffectField, SchemaArrayItemEditor): signature-compatible changes
- No breaking changes to panel consumers
