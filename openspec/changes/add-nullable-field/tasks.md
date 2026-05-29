## 1. HJSON Package – Add `removeField`

- [x] 1.1 Implement `removeField(original, key)` method on `HjsonObjectNode` in `packages/hjson/src/structured.ts` using `FieldInfo` start/end positions, with comma and whitespace cleanup
- [x] 1.2 Export `removeField` from `packages/hjson/src/index.ts`

## 2. FieldRenderer – Add `nullable` Support

- [x] 2.1 Add `nullable?: boolean` to the `Field` interface in `apps/web/src/components/editor/panel/FieldRenderer.tsx`
- [x] 2.2 Update `patchValue` to destructure `nullable` from field and call `node.removeField(original, name)` when value is `undefined` and `nullable` is `true`

## 3. Verify

- [x] 3.1 Check that non-nullable fields still patch to `null` string as before
- [x] 3.2 Check that nullable fields with `undefined` value remove the key from HJSON source
- [x] 3.3 Run type-check and tests for `@project/hjson` and the web app
