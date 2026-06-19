## 1. Define types

- [ ] 1.1 Add `HjsonSerializeOptions` interface with `quote: boolean` to `structured.ts`
- [ ] 1.2 Add `quote?: boolean` field to `HJSONParseOptions` in `parser.ts`

## 2. Thread options through parse pipeline

- [ ] 2.1 In `Parser`, extract `HjsonSerializeOptions` from `HJSONParseOptions` and freeze it
- [ ] 2.2 Pass frozen `HjsonSerializeOptions` to `toStructuredValue()` and `convertNodeStructured()`
- [ ] 2.3 Update `HjsonNode` base class to accept and store `#options: HjsonSerializeOptions`
- [ ] 2.4 Update `HjsonObjectNode`, `HjsonArrayNode`, `HjsonValueNode`, `HjsonMissingNode` constructors to pass options through
- [ ] 2.5 Update `convertNodeStructured()` in parser to pass options when constructing structured nodes

## 3. Update serializer to accept options

- [ ] 3.1 Add `quote: boolean` parameter to `serializeString()` in `serializer.ts`
- [ ] 3.2 Implement quote logic: when `true`, always use `JSON.stringify()` for strings; when `false`, use current HJSON bareword logic
- [ ] 3.3 Add optional `HjsonSerializeOptions` parameter to `serializeValue()` and propagate to `serializeString()`
- [ ] 3.4 Thread `HjsonSerializeOptions` through `serializeObject()` and `serializeArray()` internal calls

## 4. Update structured.ts serialization calls

- [ ] 4.1 Update `serializeValue()` helper in `structured.ts` to accept and pass `HjsonSerializeOptions`
- [ ] 4.2 Update `createFieldInfo()` to accept and capture `HjsonSerializeOptions` in `replaceValue` closure
- [ ] 4.3 Update `createElementInfo()` to accept and capture `HjsonSerializeOptions` in `replaceValue` closure
- [ ] 4.4 Update `HjsonObjectNode.insertField()` to pass options when serializing new values
- [ ] 4.5 Update `HjsonArrayNode.insertElement()` to pass options when serializing new values
- [ ] 4.6 Update `HjsonValueNode.patchValue()` to pass options when serializing new values

## 5. Update parseWithCache

- [ ] 5.1 Modify `HJSON.parseWithCache()` to accept optional `HJSONParseOptions` parameter
- [ ] 5.2 Include `quote` option in cache key computation
- [ ] 5.3 Update `HJSON.patch()` to pass options through to `parseWithCache`

## 6. Update tests

- [ ] 6.1 Add `serializer.test.ts` tests for `quote: true` (always JSON-quoted) vs `quote: false`/default (HJSON bareword)
- [ ] 6.2 Add `patching.test.ts` tests for quote-aware `FieldInfo.replaceValue` and `ElementInfo.replaceValue`
- [ ] 6.3 Add `patching.test.ts` tests for quote-aware `HjsonObjectNode.insertField` and `patchValue`
- [ ] 6.4 Add `patching.test.ts` tests for quote-aware `HjsonArrayNode.insertElement` and `patchValue`
- [ ] 6.5 Add `patching.test.ts` tests for quote-aware `HjsonValueNode.patchValue`
- [ ] 6.6 Add `parser.test.ts` or `patching.test.ts` test verifying `parseWithCache` differentiates cache entries by quote option
- [ ] 6.7 Update `integration.test.ts` for any new behavior if needed

## 7. Typecheck and lint

- [ ] 7.1 Run `pnpm --filter @project/hjson typecheck` and fix all errors
- [ ] 7.2 Run `pnpm --filter @project/hjson lint` (or workspace-level lint) and fix all errors
- [ ] 7.3 Ensure all tests pass: `pnpm --filter @project/hjson test`
