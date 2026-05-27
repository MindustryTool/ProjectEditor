## Why

`ValidationResult` currently has only `line`/`column` (single position), but `HJSONError` now exposes `startLine`/`startColumn`/`endLine`/`endColumn` ranges. The Monaco editor workaround (`endLine: r.line, endColumn: (r.column ?? 1) + 1`) produces inaccurate underlines and cannot represent multi-line error ranges. Adding proper range fields to `ValidationResult` enables precise error highlighting.

## What Changes

- **BREAKING**: Replace `ValidationResult.line`/`column` with `startLine`/`startColumn`/`endLine`/`endColumn`
- `validators.ts`: Map `HJSONError.startLine/startColumn/endLine/endColumn` to `ValidationResult` range fields
- `MonacoEditor.tsx`: Use `startLine`/`startColumn`/`endLine`/`endColumn` directly for Monaco markers (remove workaround math)
- `ValidationResult.startLine`/`startColumn` required, `endLine`/`endColumn` optional (default to start position when absent)
- All line values are 1-based (Monaco convention); the consumer converts as needed
- Non-HJSON error fallback path also captures end position from error messages where possible

## Capabilities

### New Capabilities
- `validation-result-ranges`: Defines the new `startLine`/`startColumn`/`endLine`/`endColumn` fields on `ValidationResult`, their semantics, and conversion rules from `HJSONError`

### Modified Capabilities
<!-- No existing specs change — this is a new capability -->

## Impact

- `packages/state/src/validation/types.ts` — `ValidationResult` interface
- `packages/state/src/validation/validators.ts` — `jsonSyntaxValidator` result construction
- `apps/web/src/components/editor/MonacoEditor.tsx` — marker creation logic
- `packages/state/src/validation/runner.ts` — error fallback result creation
- Any test files referencing `ValidationResult.line`/`column`
