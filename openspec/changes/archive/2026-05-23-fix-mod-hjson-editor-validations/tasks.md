## 1. Schema Updates

- [x] 1.1 Add `ModNameSchema` as a reusable Valibot pipe: lowercase `a-z`, digits `0-9`, hyphens `-`, min length 1
- [x] 1.2 Update `ModHjsonSchema.name` to use `ModNameSchema`
- [x] 1.3 Update `ModHjsonSchema.displayName` with `v.minLength(2)` and `v.maxLength(127)`
- [x] 1.4 Update `ModHjsonSchema.author` with `v.minLength(2)` and `v.maxLength(127)`
- [x] 1.5 Update `ModHjsonSchema.description` with `v.maxLength(9999)`
- [x] 1.6 Update `ModHjsonSchema.version` with `v.maxLength(127)` (remove semver regex)
- [x] 1.7 Update `ModHjsonSchema.minGameVersion` with custom validation: must parse to a number > 145
- [x] 1.8 Update `ModHjsonSchema.dependencies` to use `v.array(ModNameSchema)` with default of one empty string

## 2. Editor Component Updates

- [x] 2.1 Import `Textarea` from UI components
- [x] 2.2 No longer needed — dependency field count managed via form state
- [x] 2.3 Change `description` field to render a `Textarea` instead of `Input`
- [x] 2.4 Replace comma-separated dependencies input with dynamic list of inputs, each validating against `ModNameSchema`
- [x] 2.5 Add "Add" button below dependencies list to append new empty dependency field
- [x] 2.6 Add "X" remove button on each dependency field (disabled when only one remains)
- [x] 2.7 Remove save and reset buttons from the form
- [x] 2.8 Verify validation error messages display correctly for all field types

## 3. Cleanup

- [x] 3.1 `Button` still used for Add/X buttons — import kept
- [x] 3.2 Verify form renders and validates correctly via type check
