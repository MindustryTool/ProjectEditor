## Why

The HJSON structured node API (`HjsonNode`, `FieldInfo`, `ElementInfo`) relies heavily on `any` types throughout — `value: any`, `valueOf(): any`, and untyped generics make it impossible for consumers to safely access data without manual casts. Meanwhile, the field renderer system (`FieldRenderer.tsx`) only supports flat primitive fields and cannot render or patch arrays or nested objects, limiting the editor to only the simplest content types.

## What Changes

1. **Add generics to `FieldInfo` and `ElementInfo`** — `FieldInfo<T>` and `ElementInfo<T>` with typed `value: T` so consumers can safely access typed values
2. **Add primitive type guard methods to `HjsonNode`** — `isString(): this is HjsonValueNode<string>`, `isNumber(): this is HjsonValueNode<number>`, `isBoolean(): this is HjsonValueNode<boolean>` for compile-time narrowing without manual casting
3. **Make `HjsonValueNode<T>` generic** — typed over its primitive value so `valueOf()` returns `T`, `asValue<T>()` is properly generic
4. **Pass `HjsonNode` to `FieldsRenderer` instead of raw values** — renderer receives the parsed `HjsonObjectNode` directly, navigates `fields()` for sub-fields and `get()` for nested nodes, giving full access to positional metadata and typed values
5. **Add `Array` and `Object` field types** to `FieldTypes` in `FieldRenderer.tsx` — supports rendering and patching array items and nested object/array structures through the node tree
6. **Add array item editing** — add/remove array items using `HjsonArrayNode` patching
7. **Add nested object navigation** — render sub-fields by iterating `HjsonObjectNode.fields()` with recursive type-aware rendering

## Capabilities

### New Capabilities
- `typed-hjson-node`: Generic type-safe HJSON structured nodes with typed FieldInfo/ElementInfo and primitive type guard methods
- `array-field-editor`: Editor panel that renders and patches array fields using HjsonArrayNode
- `nested-object-editor`: Editor panel that renders and patches nested objects using HjsonObjectNode

### Modified Capabilities
- `hjson-structured-parsing`: Enhanced — FieldInfo/ElementInfo become generic, HjsonValueNode<T> generic, primitive type guards added (`isString`, `isNumber`, `isBoolean`). Only type-level strengthening, no behavioral changes to parsing.

## Impact

- `packages/hjson/src/structured.ts` — type parameters on `FieldInfo`, `ElementInfo`; generic `HjsonValueNode<T>`; new `isString/isNumber/isBoolean` type guards
- `packages/hjson/src/index.ts` — update exported types if signatures change
- `packages/hjson/src/parser.ts` — may need minor updates for generic `HjsonValueNode<T>` creation
- `packages/hjson/tests/patching.test.ts` — update type assertions
- `apps/web/src/components/editor/panel/FieldRenderer.tsx` — props take `HjsonObjectNode` instead of `Record<string, string>`; new array/object field renderers
- `apps/web/src/components/editor/panel/ItemPanel.tsx` — pass parsed `HjsonObjectNode` to renderer; updater uses node path patching
- Breaking: `FieldInfo`/`ElementInfo` become generic — existing consumers may need type annotations; `FieldsRenderer` props change from value-object to node-object
