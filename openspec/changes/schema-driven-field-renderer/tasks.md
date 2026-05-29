## 1. Schema Utilities

- [x] 1.1 Create `unwrapSchema()` function that strips v.nullish/v.optional/v.nullable wrappers recursively
- [x] 1.2 Create `detectSchemaType(schema)` that returns a discriminator string (`"string"`, `"number"`, `"boolean"`, `"hex-color"`, `"research"`, `"array"`, `"object"`, `"unknown"`)
- [x] 1.3 Integrate special schema detection by identity for MindustryHexColorSchema and ResearchSchema

## 2. Rewrite FieldRenderer Core

- [x] 2.1 Add `schema` prop to `FieldsRendererProps` (valibot `ObjectSchema`) alongside existing `fields` prop (transitional)
- [x] 2.2 Create `schemaRenderers` map keyed by discriminator string, replacing `fieldRenderers` map
- [x] 2.3 Implement `deriveFieldsFromSchema(schema, node)` that iterates schema entries, strips wrappers, detects type, and builds field metadata
- [x] 2.4 Remove Int/Float/Double renderers, add unified Number renderer
- [x] 2.5 Migrate existing renderers (String, Boolean, HexColor, Research, Array, Object) to new schema-driven system

## 3. Update Consumers

- [x] 3.1 Update `ItemPanel.tsx` to pass `ItemHjsonSchema` instead of the `Field[]` array
- [ ] 3.2 Update `ModHjsonPanel.tsx` to use schema-driven renderer (kept custom rendering - has i18n labels and custom array handling not suited for schema-driven)
- [x] 3.3 Remove `Field` interface, `FieldType`, `FieldTypes`, `inferFieldType()`, `defaultForType()`
- [x] 4.1 Run type-check for `@app/web` and all dependent packages
- [x] 4.2 Run tests for `@app/web` and dependent packages
- [x] 4.3 Remove transitional dual-prop support (keep only schema prop)
