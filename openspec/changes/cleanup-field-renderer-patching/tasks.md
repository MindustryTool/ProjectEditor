## 1. Renderer Contract

- [x] 1.1 Remove `patchValue` from shared renderer props in `apps/web/src/components/editor/panel/FieldRenderer.tsx`
- [x] 1.2 Add primitive value helper creation at top-level and nested object field mapping scopes, preserving current default/nullish behavior
- [x] 1.3 Update primitive renderers (`StringField`, `NumberField`, `BooleanField`, color/select-like fields) to use primitive helper instead of generic raw-value replacement

## 2. Structural Editors

- [x] 2.1 Refactor `ObjectField` to keep nested primitive edits on targeted child fields and avoid whole-object replacement paths
- [x] 2.2 Refactor `ArrayField` and `SchemaArrayItemEditor` to rely on structural patch operations for item edits, add/remove actions, and array initialization
- [x] 2.3 Review specialized complex renderers such as `ResearchField` and `EffectField` so object-valued edit flows continue through structural patching

## 3. Verification

- [x] 3.1 Run diagnostics for `apps/web/src/components/editor/panel/FieldRenderer.tsx` and fix any type or lint issues introduced by prop-contract changes
- [x] 3.2 Re-read changed code paths to confirm UI output stays same while complex object and array writes no longer depend on generic whole-value replacement
