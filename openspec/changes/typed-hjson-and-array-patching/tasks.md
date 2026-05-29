## 1. Add generics and type guards to structured.ts

- [ ] 1.1 Make `FieldInfo` generic: `FieldInfo<T = unknown>` — change `value: any` to `value: T`
- [ ] 1.2 Make `ElementInfo` generic: `ElementInfo<T = unknown>` — change `value: any` to `value: T`
- [ ] 1.3 Update `createFieldInfo` factory to pass through type: `createFieldInfo<T>(..., value: T, ...): FieldInfo<T>`
- [ ] 1.4 Update `createElementInfo` factory to pass through type: `createElementInfo<T>(..., value: T, ...): ElementInfo<T>`
- [ ] 1.5 Make `HjsonValueNode` generic: `HjsonValueNode<T = unknown>` — change `#value: any` to `#value: T`
- [ ] 1.6 Update `HjsonValueNode` constructor, `valueOf()`, `asValue<T>()` signatures for generic T
- [ ] 1.7 Add `isString(): this is HjsonValueNode<string>` abstract method to `HjsonNode` base class
- [ ] 1.8 Add `isNumber(): this is HjsonValueNode<number>` abstract method to `HjsonNode`
- [ ] 1.9 Add `isBoolean(): this is HjsonValueNode<boolean>` abstract method to `HjsonNode`
- [ ] 1.10 Implement `isString()`, `isNumber()`, `isBoolean()` in `HjsonValueNode` using `typeof` checks
- [ ] 1.11 Implement `isString()`, `isNumber()`, `isBoolean()` in `HjsonObjectNode`, `HjsonArrayNode`, `HjsonMissingNode` — all returning `false`
- [ ] 1.12 Update `HjsonResult<T>` conditional type to resolve to `HjsonValueNode<T>` for primitives
- [ ] 1.13 Remove all remaining `any` types in the file (check `HjsonNode.valueOf()`, etc.)

## 2. Update parser.ts to work with generic types

- [ ] 2.1 Update `convertNodeStructured` in parser.ts to create `HjsonValueNode<T>` with inferred type
- [ ] 2.2 Ensure FieldInfo/ElementInfo creation in parser passes typed values rather than `any`

## 3. Update package exports and consumers

- [ ] 3.1 Update `packages/hjson/src/index.ts` exports if any generic signatures changed
- [ ] 3.2 Update type annotations in `patching.test.ts` for generic FieldInfo/ElementInfo
- [ ] 3.3 Run `npm test` in `packages/hjson` to verify all existing tests pass

## 4. Rework FieldsRenderer props to accept HjsonObjectNode

- [ ] 4.1 Change `FieldTypes` values to `HjsonNode` subtypes: `String: HjsonValueNode<string>`, `Int: HjsonValueNode<number>`, `Float: HjsonValueNode<number>`, `Double: HjsonValueNode<number>`, `Boolean: HjsonValueNode<boolean>`, `HexColor: HjsonValueNode<string>`, `Research: HjsonValueNode<Research> | HjsonObjectNode`, `Array: HjsonArrayNode`, `Object: HjsonObjectNode`
- [ ] 4.2 Change `FieldRenderer<T>` value prop type from `T` to `HjsonNode` — renderers receive the node and narrow with type guards
- [ ] 4.3 Update `FieldsRendererProps` — replace `values: Record<string, string>` and `updater` with `node: HjsonObjectNode`, `original: string`, `onPatch: (newContent: string) => void`
- [ ] 4.4 Add `itemType?: FieldType` to the `Field` interface for array item type specification
- [ ] 4.5 Update all existing primitive renderers to extract values via `valueOf()` and type guards instead of receiving raw primitives

## 5. Implement Array field renderer

- [ ] 5.1 Add `Array` key to `fieldRenderers` map — renderer iterates `arrayNode.elements()` for items
- [ ] 5.2 Render each array element using the renderer specified by `itemType`, passing the element's `HjsonValueNode`
- [ ] 5.3 Implement "Add" button that calls `arrayNode.insertElement(original, length, default)` and emits via `onPatch`
- [ ] 5.4 Implement per-item "Remove" button that calls `arrayNode.removeElement(original, index)` and emits via `onPatch`
- [ ] 5.5 Implement per-item change handler that calls `arrayNode.patchElement(original, index, HJSON.stringify(value))` and emits via `onPatch`

## 6. Implement Object field renderer

- [ ] 6.1 Add `Object` key to `fieldRenderers` map — renderer iterates `objectNode.fields()` for sub-fields
- [ ] 6.2 Render each sub-field using type guard checks: `node.get(key).isString()` → String renderer, `node.get(key).isNumber()` → Int/Float renderer, `node.get(key).isObject()` → Object renderer (recursive), `node.get(key).isArray()` → Array renderer
- [ ] 6.3 Construct dot-path for nested patches: parent path + "." + sub-field key
- [ ] 6.4 Pass `onPatch` to sub-renderers so mutations propagate up through the callback chain

## 7. Update panels to pass HjsonObjectNode

- [ ] 7.1 Update `ItemPanel.tsx` — parse content with `HJSON.parseStructured()`, pass the result `HjsonObjectNode` and original string to `FieldsRenderer`; implement `onPatch` to update `contentRef` and `write`
- [ ] 7.2 Update `ModHjsonPanel.tsx` — same pattern: parse structured, pass node + original to renderer, update on patch
- [ ] 7.3 Ensure `hiddenIfDefault` logic still works with node-based values — compare `fieldInfo.valueOf()` against default

## 8. Verify

- [ ] 8.1 Run full typecheck: `npm run typecheck` in project root
- [ ] 8.2 Run tests: `npm test` in `packages/hjson`
- [ ] 8.3 Run lint: `npm run lint` in project root
- [ ] 8.4 Verify ItemPanel renders and patches all existing field types correctly
- [ ] 8.5 Verify ModHjsonPanel renders and patches all mod fields correctly
