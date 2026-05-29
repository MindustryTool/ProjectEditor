## Why

FieldRenderer currently uses a hand-written `Field[]` array with stringly-typed `FieldType` values (`"Int"`, `"Float"`, `"HexColor"`) that manually duplicate what Valibot schemas already describe. Each new schema requires manually authoring a parallel `Field[]` definition. ModHjsonPanel avoids FieldRenderer entirely, instead hand-writing its 7 form fields with custom JSX—a pattern that doesn't scale. Switching FieldRenderer to accept Valibot schemas directly eliminates duplication, unlocks automatic form generation for any schema, and makes special-cased schemas (Research, HexColor) a first-class capability.

## What Changes

- **BREAKING**: `FieldsRenderer` props change from `fields: Field[]` to accepting a Valibot `v.ObjectSchema` and `HjsonObjectNode`. The `Field` interface and `FieldType` type are removed.
- Merge `Int`, `Float`, `Double` into a single `Number` renderer using `v.number()` detection
- Map Valibot primitive types to renderers: `v.string()` → String, `v.number()` → Number, `v.boolean()` → Boolean, `v.array()` → Array, `v.object()` → Object
- Detect special schemas by identity: `MindustryHexColorSchema` → HexColor color picker, `ResearchSchema` → Research editor (parent input + requirement list)
- Detect `v.union()` for Research-like patterns; detect `v.pipe(v.string(), v.regex(...))` for HexColor-like patterns as fallback
- Strip `v.nullish()`/`v.optional()`/`v.nullable()` wrappers when determining the inner type
- `ItemPanel.tsx` passes `ItemHjsonSchema` directly instead of a `Field[]` array
- `ModHjsonPanel.tsx` optionally adopts the schema-driven renderer for its string/boolean fields

## Capabilities

### New Capabilities
- `schema-renderer`: Core mapping from Valibot schemas to form UI renderers. Handles type detection (string, number, boolean, array, object), wrapper stripping (nullish/optional/nullable), special schema detection (HexColor, Research), and unknown-type fallback.
- `item-hjson-editor`: Item panel that uses `schema-renderer` to render `ItemHjsonSchema`. Replaces the current `ItemPanel.tsx` which manually duplicates the schema.

### Modified Capabilities
- (none — no existing specs for field rendering or item editing)

## Impact

- `apps/web/src/components/editor/panel/FieldRenderer.tsx` — core rewrite
- `apps/web/src/components/editor/panel/ItemPanel.tsx` — schema-driven, remove `fields` array
- `apps/web/src/components/editor/panel/ModHjsonPanel.tsx` — optionally simplified
- `packages/validation/src/base.ts` — may export `MindustryHexColorSchema` detection helper
- `packages/validation/src/item.ts` — no change needed
