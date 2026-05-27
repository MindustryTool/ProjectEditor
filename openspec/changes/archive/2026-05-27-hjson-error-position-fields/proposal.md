## Why

`HJSONError` uses ambiguous field names `row`/`col` that don't clarify they refer to the start position, and lacks `endLine`/`endColumn` for errors spanning multiple characters (multi-line strings, long tokens). The file validation system needs end positions to highlight the full error range in the UI. This change aligns the error API with modern conventions (e.g., `SyntaxError` in V8 uses `lineNumber`/`columnNumber`, TypeScript diagnostics use `start`/`length`).

## What Changes

- **BREAKING**: Rename `HJSONError.row` → `HJSONError.startLine`
- **BREAKING**: Rename `HJSONError.col` → `HJSONError.startColumn`
- Add `HJSONError.endLine` and `HJSONError.endColumn` fields
- Update `HJSONError` constructor signature to accept optional `endLine`/`endColumn` (defaults to start values)
- Update all construction sites in `tokenizer.ts` and `parser.ts` to pass end positions
- Update external consumer `packages/state/src/validation/validators.ts`
- Update tests

## Capabilities

### New Capabilities
- `hjson-error-enhanced`: `HJSONError` with `startLine`/`startColumn`/`endLine`/`endColumn` fields replacing `row`/`col`

### Modified Capabilities

*(None — no existing main spec for hjson-error.)*

## Impact

- `packages/hjson/src/errors.ts` — class property renames + additions, constructor change
- `packages/hjson/src/tokenizer.ts` — `error()` method updated to pass end positions
- `packages/hjson/src/parser.ts` — all 9 error construction calls updated
- `packages/hjson/tests/errors.test.ts` — property access updated to new names
- `packages/hjson/tests/integration.test.ts` — property access updated
- `packages/state/src/validation/validators.ts` — destructure renamed fields
- **BREAKING**: Any external consumers using `.row`/`.col` on HJSONError must migrate to `.startLine`/`.startColumn`
