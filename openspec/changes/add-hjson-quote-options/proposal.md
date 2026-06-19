## Why

The HJSON structured node system (`HjsonNode` tree) currently hard-codes quote behavior in its serializer calls — when patching values via `replaceValue`, `patchValue`, `insertField`, or `insertElement`, there is no way to control whether strings are quoted, unquoted, or use a specific quote style. Downstream consumers (like the HJSON editor UI) need the ability to control quoting when serializing patched values so that output matches user preferences. Additionally, `parseWithCache` does not distinguish cache entries by stringify options, causing stale results when options differ.

## What Changes

- Add `quote?: boolean` option to `HJSONParseOptions` — `true` forces all strings to be quoted (JSON mode), `false`/omitted keeps default HJSON bareword behavior
- Propagate `quote` through `parse` / `parseAsync` / `parseStructured` / `parseStructuredAsync` / `parseWithCache`
- Make options object immutable and shared by all `HjsonNode` instances via a shared readonly options reference
- Update `serializeValue` calls in `structured.ts` (`FieldInfo.replaceValue`, `ElementInfo.replaceValue`, `HjsonObjectNode.insertField`, `HjsonArrayNode.insertElement`, `HjsonValueNode.patchValue`) to respect `quote` setting
- Extend `parseWithCache` cache key to include stringify options so different options produce distinct cached results
- Update all tests to exercise and validate new quoting behavior
- Run typecheck and lint; fix all errors

## Capabilities

### New Capabilities
- `hjson-quote-options`: Control string quoting style in HJSON parsing and structured node serialization

### Modified Capabilities
- `hjson-structured-parsing`: `HJSONParseOptions` gains a `quote` field; structured node methods now respect serialization options

## Impact

- `packages/hjson/src/`: `parser.ts`, `structured.ts`, `serializer.ts`, `hjson.ts`, `index.ts` — all need modifications
- `packages/hjson/tests/`: All test files may need updates for new quote behavior
- **BREAKING**: `HjsonNode` and related classes gain a shared options reference; downstream code creating raw nodes may need updates
- **BREAKING**: `HJSONParseOptions` interface gains `quote` field; existing parse calls without it use default behavior (backward compatible)
