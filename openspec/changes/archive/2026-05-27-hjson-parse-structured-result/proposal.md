## Why

HJSON's `parse()` returns plain JavaScript values via AST-to-JS conversion, discarding all source position information (key start/end, value start/end). Downstream consumers — especially the mod-hjson editor and validation system — need source-level position data to enable precise error highlighting, in-place editing of specific fields, and structured traversal with location context. Without position data, these features require re-parsing or fragile string matching against the raw text.

## What Changes

- `HJSON.parse()` gains a new option `structured: true` that returns a structured result class wrapping each field with key, value, start, end, valueStart, and valueEnd positions
- New `StructuredHjsonValue` class representing the parsed result with typed position metadata
- The new `HJSON.StructuredParseOptions` type extending `HJSONParseOptions` with `structured: true`
- The existing `parse()` behavior (returning plain JS values) remains unchanged when `structured` is not specified — **no breaking change**
- Position tracking aligns with the existing `row`/`col`/`index` coordinate system used by `HJSONError` and AST nodes

## Capabilities

### New Capabilities
- `hjson-parse-structured`: Structured parse result with per-field position metadata — key, value, start, end, valueStart, valueEnd positions in row/col/index format

### Modified Capabilities

*(None — existing parse behavior is unchanged.)*

## Impact

- `packages/hjson/src/` — new files for structured result types and conversion logic
- `packages/hjson/src/index.ts` — new exports for `HJSONStructuredParseOptions`, structured result types
- `packages/hjson/src/hjson.ts` — optional `structured` option in parse method
- No breaking changes to existing API surface
- No new runtime dependencies
