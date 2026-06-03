## 1. writeBuffer store action — updater callback overload

- [x] 1.1 Add overload to `writeBuffer` in `packages/core/src/stores/file.ts` accepting `(prev: ArrayBuffer | null) => ArrayBuffer`
- [x] 1.2 Implement type guard to detect function vs direct value in `writeBuffer`
- [x] 1.3 Update the store interface (`FileStore`) to reflect the new overload signature

## 2. useFileString.write — updater callback overload

- [x] 2.1 Add overload to `write` in `packages/core/src/hooks/use-file-content-string.ts` accepting `(prev: string | null) => string`
- [x] 2.2 Implement the updater path: decode current buffer, call updater, encode result, pass to `resultWrite`
- [x] 2.3 Ensure `useFile` in `packages/core/src/hooks/use-file-content.ts` forwards the updater to `writeBuffer`

## 3. Update direct writeBuffer consumers

- [x] 3.1 Update `apps/web/src/components/editor/toolbar/EditMenu.tsx` to work with the new overload (no functional change, just type compatibility)

## 4. Refactor SchemaRenderer type — value prop and reduced surface

- [x] 4.1 Change `SchemaRenderer` type: rename `node` to `value`, replace `writePrimitiveValue`/`replaceFieldValue`/`initializeArrayValue` with single `onChange?: (value: unknown) => void`, remove `original` and `onPatch` from the type
- [x] 4.2 Update `FieldsRenderer` to extract `value` from `childNode.valueOf()` and pass it to renderers
- [x] 4.3 Create stable `onChange` via `useCallback` using updater form of `write`
- [x] 4.4 Keep `original` and `onPatch` still passed to `ObjectField` and `ArrayField` (but remove from the shared type)

## 5. Convert leaf renderers to value prop

- [x] 5.1 `StringField`: read from `value` instead of `node`, call `onChange` instead of `writePrimitiveValue`
- [x] 5.2 `NumberField`: read from `value`, call `onChange`
- [x] 5.3 `BooleanField`: read from `value`, call `onChange`
- [x] 5.4 `ColorField`: read from `value`, call `onChange`
- [x] 5.5 `LiquidsListField`: read from `value`, call `onChange`
- [x] 5.6 `PickListField`: read from `value`, call `onChange`

## 6. Convert complex renderers

- [x] 6.1 `ResearchField`: destructure `value` (which can be string or object), simplify `getCurrentValue()` references
- [x] 6.2 `EffectField`: read from `value`, call `onChange` for string path, still use `onPatch` for object path via ObjectField
- [x] 6.3 `ArrayField`: keep `original`/`onPatch`, but read array items' raw values from `node.elements().map(el => el.value)` for child editors
- [x] 6.4 `ObjectField`: keep `original`/`onPatch`, pass `value` down to child renderers

## 7. Update SchemaArrayItemEditor

- [x] 7.1 Remove `handleOnPatch` full-content re-parse logic
- [x] 7.2 Pass the raw element value to child renderer
- [x] 7.3 Simplify `onChange` to just call parent's `onChange` with the new value

## 8. Remove legacy helpers

- [x] 8.1 Remove `createPrimitiveValueHelper` function
- [x] 8.2 Simplify or keep `createFieldValueReplacer` (can be merged into the `onChange` implementation)

## 9. Type cleanup and exports

- [x] 9.1 Remove `PrimitiveFieldValue` type if no longer needed
- [x] 9.2 Clean up unused imports in `FieldsRenderer.tsx`
- [x] 9.3 Verify `FieldWriteContext` type is still accurate or simplify it
