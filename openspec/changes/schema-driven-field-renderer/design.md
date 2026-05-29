## Context

FieldRenderer currently uses a `Field[]` array with stringly-typed `FieldType` values (`"Int"`, `"Float"`, `"HexColor"`) to generate form UI for HJSON objects. Each schema like `ItemHjsonSchema` requires manually authoring a `Field[]` array that duplicates the schema's structure. The ModHjsonPanel bypasses FieldRenderer entirely, hand-writing 7 form fields with custom JSX.

The `@project/validation` package defines schemas using valibot (`v.object()`, `v.string()`, `v.number()`, etc.). The `findUnknownProperties()` function in `@project/state` demonstrates how to traverse valibot schemas programmatically by checking for known properties (`entries`, `item`, `items`).

The goal is to make FieldRenderer accept valibot schemas directly, deriving form fields from the schema structure instead of from a manually-authored `Field[]`.

## Goals / Non-Goals

**Goals:**
- `FieldsRenderer` accepts a valibot `ObjectSchema` instead of `Field[]`
- All field types in `ItemHjsonSchema` render correctly: string, number, boolean, hex color, research, array, nested object
- `MindustryHexColorSchema` triggers the color picker UI
- `ResearchSchema` triggers the research editor UI (parent input + requirement list with item icons)
- Int/Float/Double merged into a single Number renderer
- Backward-compatible item editing experience (same visual output)
- `ItemPanel.tsx` passes `ItemHjsonSchema` directly
- `ModHjsonPanel.tsx` uses schema-driven renderer for its basic fields (name, displayName, author, description, version, minGameVersion, hidden)

**Non-Goals:**
- Automatic form generation for *all* possible valibot schemas (e.g., recursive unions, discriminated unions, tuples)
- Full ModHjsonPanel replacement — dependencies array still uses custom rendering
- Schema-aware validation display (validation issues already work via `useValidationStore`)
- i18n label/description derivation from schemas (labels still come from the panel component)

## Decisions

### 1. Schema traversal pattern: property-based checking

**Decision**: Detect schema types by checking for valibot's internal properties (`type`, `entries`, `item`, `items`, `pipe`) rather than using `v.is()` or schema branding.

**Rationale**: Valibot's `v.is()` checks runtime values, not schema definitions. The `findUnknownProperties()` approach of checking `"entries" in schema` for objects, `"item" in schema` for arrays, and `"items" in schema` for tuples is already proven in the codebase. For wrappers (`v.nullish`, `v.optional`, `v.nullable`), the schema has a `wrapper` property — we can check `schema.type === "optional"` or `schema.type === "nullish"` and unwrap to the inner schema.

**Alternative considered**: Using `v.safeParse()` with sentinel values to infer type. Rejected because it requires actual data to test against and can't distinguish between schemas with the same input type (e.g., HexColor vs regular string).

### 2. Special schema detection: identity check only

**Decision**: Detect `MindustryHexColorSchema` and `ResearchSchema` exclusively by reference identity (comparing the imported schema object). No structural fallback detection.

**Rationale**: Reference identity is the most reliable mechanism. Other schemas may share similar structure (e.g., other `v.pipe(v.string(), v.regex(...))` schemas like `ContentNameSchema`) and structural heuristics would produce false positives. If a new schema needs a custom renderer, it should be explicitly registered by identity.

**Alternative considered**: Adding a custom metadata field or branded schema type. Rejected as it would require changing every schema definition.

### 3. Wrapper stripping: recursive unwrap

**Decision**: Create a `unwrapSchema(schema)` function that recursively strips `v.nullish()`, `v.optional()`, `v.nullable()` wrappers to reveal the inner schema for type detection.

**Rationale**: All nullable fields in `ItemHjsonSchema` use `v.nullish(...)`. Without stripping, every field would appear wrapped and the inner type (string, number, etc.) wouldn't be visible. The function checks `schema.type === "optional"` or `schema.type === "nullish"` and recurses into `schema.wrapped` (valibot's internal property for wrapper schemas).

### 4. Piped schema type inference: check `pipe` items

**Decision**: For `v.pipe()` schemas (e.g., `v.pipe(v.number(), v.minValue(0), v.integer())`), inspect the first pipe item (`schema.pipe[0]` or `schema.items[0]`) to determine the base type. Then apply special detection on the full pipe (e.g., check if any pipe item is a regex matching hex color).

**Rationale**: `v.pipe()` in valibot wraps the base schema and validation steps. The first element is always the base type. `MindustryHexColorSchema` and `ContentNameSchema` both use `v.pipe()`, but only the hex color one should trigger the color picker.

### 5. Number unification: single renderer for all numeric inputs

**Decision**: Map `v.number()` to a single Number renderer with `type="number"` input. Remove Int/Float/Double from `FieldTypes`.

**Rationale**: Int, Float, and Double all render identical `<Input type="number">` elements. The distinction is meaningless at the UI level — valibot's `v.integer()` or `v.minValue(0)` constraints handle validation separately. Removing them simplifies the renderer map from 9 to 7 entries (String, Number, Boolean, HexColor, Research, Array, Object).

### 6. Schema registration: runtime renderer map keyed by valibot schema type

**Decision**: Replace the `fieldRenderers: Record<FieldType, FieldRenderer>` map with a `schemaRenderers` map keyed by valibot schema detection results (a string discriminator: `"string"`, `"number"`, `"boolean"`, `"hex-color"`, `"research"`, `"array"`, `"object"`).

**Rationale**: The string discriminator approach keeps the same registry pattern but decouples it from the `FieldType` string union. New schemas can be supported by adding entries to the discriminator map.

## Migration Plan

1. Add `unwrapSchema()` utility to strip wrapper types
2. Add `detectSchemaType(schema)` that returns a discriminator string
3. Create new `schemaRenderers` map keyed by discriminator
4. Refactor `FieldsRenderer` to accept a schema prop and derive fields from schema entries
5. Update renderer implementations: remove Int/Float/Double, add Number; keep Research, HexColor, Array, Object; add fallback for unknown types
6. Update `ItemPanel.tsx` to pass `ItemHjsonSchema` instead of `Field[]`
7. Update `ModHjsonPanel.tsx` to use schema renderer for basic fields
8. Remove `Field` interface, `FieldType`, `FieldTypes`, `inferFieldType()`, `defaultForType()`
9. Run type-check and tests

## Risks / Trade-offs

- **[Valibot internal property access]** The schema traversal relies on valibot's internal properties (`wrapped`, `pipe` items, `entries`, `type`). These are not part of valibot's public API and could change in a future version. → Mitigation: Pin valibot version; add a regression test that validates schema structure detection.
- **[Union type rendering]** `ResearchSchema` includes a union with two branches (string and object). The renderer must handle both shapes. → Mitigation: Check the runtime HJSON node type to determine which branch of the union to render (string value → parent input only; object value → parent + requirements).
- **[Loss of defaultValue behavior]** The current Field interface supports `defaultValue` which triggers field removal when the value matches. After migration, defaults are implicit in the schema's structure (e.g., `v.optional()` implies the field can be absent). → Mitigation: For `v.optional()` fields, treat empty/undefined values as "remove field from HJSON".
- **[Performance]** Schema traversal on every render could be expensive for deeply nested schemas. → Mitigation: Memoize field derivation from schema (`useMemo`) so it runs only when the schema reference changes.
