## 1. Add patchValue to HjsonValueNode

- [x] 1.1 Add `patchValue(original: string, newValue: string): string` method to `HjsonValueNode` in `packages/hjson/src/structured.ts` — uses `#start.index`/`#end.index` for source-string slicing
- [x] 1.2 Add unit tests for `patchValue` in existing test file (parse → navigate → patch → verify output)

## 2. Create stable onChange in FieldsRenderer

- [x] 2.1 Add `useRef` to React imports in `FieldsRenderer.tsx`
- [x] 2.2 Add `import type { HjsonNode, HjsonValueNode } from "@project/hjson"` (keep HjsonObjectNode/HjsonArrayNode as type-only)
- [x] 2.3 Create `writeRef` (useRef) and update it each render; create `onChange` with `useCallback([], [])` that calls `writeRef.current` with an updater that parses content, navigates via `root.path(jsonPath)`, and calls the user's updater
- [x] 2.4 Implement removal logic: when updater returns `undefined`, extract parent path + field name from jsonPath, navigate to parent via `root.path()`, call `removeField`/`removeElement`
- [x] 3.1 Change `SchemaRendererProps` type: `onChange` signature → `(jsonPath: string, updater: (node: HjsonNode, original: string) => string | undefined) => void`; remove `original` and `onPatch` props
- [x] 3.2 Update `FieldsRenderer` entry rendering to pass `onChange={onChange}` and remove `original={data}` / `onPatch={write}`

## 4. Update leaf renderers

- [x] 4.1 `StringField`: call `onChange(jsonPath, (n, o) => (n as HjsonValueNode).patchValue(o, HJSON.stringify(newVal)))`; check if value equals default + non-nullable → return undefined instead
- [x] 4.2 `NumberField`: same pattern as StringField
- [x] 4.3 `BooleanField`: same pattern
- [x] 4.4 `ColorField`: same pattern
- [x] 4.5 `PickListField`: same pattern
- [x] 4.6 `LiquidsListField`: same pattern

## 5. Simplify ArrayField

- [x] 5.1 Remove `original`, `onPatch` from destructuring; remove `getArrayNode()` function
- [x] 5.2 Update `handleRemove`: call `onChange(jsonPath, (n, o) => (n as HjsonArrayNode).removeElement(o, index))`
- [x] 5.3 Update `handleItemChange`: call `onChange(jsonPath + "[" + index + "]", (n, o) => (n as HjsonValueNode).patchValue(o, HJSON.stringify(rawValue)))`
- [x] 5.4 Update `handleAdd`: call `onChange(jsonPath, (n, o) => (n as HjsonArrayNode).insertElement(o, arrayValue.length, HJSON.stringify(defaultValue)))`

## 6. Simplify ObjectField

- [x] 6.1 Remove `original`, `onPatch` from destructuring
- [x] 6.2 Remove inline `createFieldValueReplacer` wrapper; pass `onChange` directly to child renderers with computed `jsonPath`

## 7. Simplify ResearchField

- [x] 7.1 Remove `original`, `onPatch` from destructuring
- [x] 7.2 Remove all complex `patchField`/`patchElement` surgical chain logic
- [x] 7.3 Update `handleChange`: for string value call `onChange(jsonPath, (n, o) => (n as HjsonValueNode).patchValue(o, HJSON.stringify(newParent)))`; for object value call `onChange(jsonPath, (n, o) => (n as HjsonValueNode).patchValue(o, HJSON.stringify({parent, requirements})))`; for removal call with `undefined` updater

## 8. Simplify EffectField

- [x] 8.1 Remove `original`, `onPatch` from destructuring
- [x] 8.2 For simple string value, use `onChange(jsonPath, updater)` pattern with `patchValue`
- [x] 8.3 For object value, pass `onChange` through to `ObjectField` delegation

## 9. Update SchemaArrayItemEditor

- [x] 9.1 Remove `original` from props
- [x] 9.2 Change `onChange` prop type to match new `SchemaRendererProps.onChange` signature
- [x] 9.3 For string-type items: call `onChange(jsonPath, (n, o) => (n as HjsonValueNode).patchValue(o, HJSON.stringify(e.target.value)))`
- [x] 9.4 For complex-type items: pass `onChange` directly to child `Renderer`
- [x] 9.5 Remove `hasOwnProperty` references from SchemaArrayItemEditor

## 10. Remove legacy code

- [x] 10.1 Remove `FieldWriteContext` type
- [x] 10.2 Remove `createFieldValueReplacer` function
- [x] 10.3 Clean up unused imports: remove `import type { HjsonObjectNode }` (if no longer needed), change `import { HjsonArrayNode }` to type-only import

## 11. Verify

- [x] 11.1 Run `npm run typecheck` — 0 errors
- [x] 11.2 Run `npm run lint` — 0 errors
