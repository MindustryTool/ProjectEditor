## Context

`ValidationResult` currently stores `line?: number` and `column?: number` representing a single position. `HJSONError` now exposes `startLine`/`startColumn`/`endLine`/`endColumn` ranges. Monaco markers use `startLineNumber`/`startColumn`/`endLineNumber`/`endColumn` — the current code synthesizes end positions via `endLineNumber: r.line` and `endColumn: (r.column ?? 1) + 1`, which is inaccurate and can't represent multi-line errors.

Only one `ValidatorFn` exists (`jsonSyntaxValidator`), and only one UI consumer uses position data (`MonacoEditor.tsx` — marker rendering). All other consumers (FileExplorer, ExportMenu, StatusBarRight) only use severity/counts.

## Goals / Non-Goals

**Goals:**
- Add `startLine`/`startColumn` (required) and `endLine`/`endColumn` (optional) to `ValidationResult`
- Remove old `line`/`column` fields
- Map `HJSONError` range fields into `ValidationResult` range fields
- Use the range fields directly in Monaco marker construction
- Non-HJSON error fallback sets `endLine`/`endColumn` to start values (no range data available)

**Non-Goals:**
- Changing the `ValidationSummary` or store shape
- Adding range fields to non-positional validators
- Altering the Zustand store internals
- Changing consumer behavior beyond `MonacoEditor.tsx`

## Decisions

1. **Replace `line`/`column` with `startLine`/`startColumn`/`endLine`/`endColumn` (BREAKING)**
   - Clean naming symmetry with `HJSONError` — direct mapping reduces cognitive load
   - `endLine`/`endColumn` optional — defaults to start values when not provided (common for parse errors without range info)
   - All values 1-based to match Monaco convention; validators do the conversion

2. **`startLine`/`startColumn` required, `endLine`/`endColumn` optional**
   - Every validation error should have at least a start position
   - Fallback path in runner already has `line`/`column` as optional — enforcing required start positions improves correctness

3. **MonacoEditor: map directly to marker fields**
   - Remove the `r.line - 1` 0-based conversion and `endLineNumber: r.line` guess
   - Use `startLineNumber: r.startLine`, `startColumn: r.startColumn`, `endLineNumber: r.endLine ?? r.startLine`, `endColumn: r.endColumn ?? (r.startColumn + 1)`
   - This eliminates the pre-existing off-by-one issue and produces accurate underlines

4. **No new validation capabilities — purely a data model improvement**
   - The `validation-result-ranges` spec documents the field semantics
   - No new validators, no new store capabilities

## Risks / Trade-offs

- **BREAKING change**: Any external code consuming `ValidationResult.line`/`column` must update. Mitigation: grep shows only internal usage within this monorepo; no published API consumers.
- **Non-HJSON validators won't provide ranges**: The fallback regex parser and runner error path set end = start. This is acceptable since range data isn't available from generic `Error.message` parsing.
