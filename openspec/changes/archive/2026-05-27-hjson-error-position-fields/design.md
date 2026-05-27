## Context

The `HJSONError` class currently exposes `.row` and `.col` for error positions. These names are ambiguous (don't clarify "start") and lack end-position tracking. The tokenizer tracks current position via `this.row`/`this.col`/`this.pos`, and the token `Token` interface provides `.row`/`.col`/`.index` for each token's start position. Errors are constructed by passing these values directly. The only external consumer (`validators.ts` in `@project/state`) destructures `.row` and `.col` to produce line/column for validation diagnostics.

The `AST` types (`SourceLocation`) and `StructuredObject` types (`Position`) use `row`/`col`/`index` for position data — these are NOT being renamed in this change, only the `HJSONError` class.

## Goals / Non-Goals

**Goals:**
- Rename `HJSONError.row` → `HJSONError.startLine`
- Rename `HJSONError.col` → `HJSONError.startColumn`
- Add `HJSONError.endLine`, `HJSONError.endColumn` (default to start values when not specified)
- Update all construction sites in tokenizer and parser to pass end positions
- Update the single external consumer in `@project/state`
- Full backward-compatible message string (still shows `startLine:startColumn`)
- 1-based numbering (matching current `row`/`col` convention)

**Non-Goals:**
- Renaming `row`/`col` in `Token`, `SourceLocation`, or `Position` types
- Changing the error message format
- Adding `endIndex` field (index is an internal detail; consumers use line/column)
- Modifying AST or StructuredObject types

## Decisions

1. **Rename only HJSONError fields, not Token/AST types** — The `Token.row`/`.col` and AST `SourceLocation.row`/`.col` serve different purposes (position tracking vs public API). Renaming those would be a much larger change with no consumer benefit. Keep the rename focused on the public error API.

2. **`endLine`/`endColumn` default to start values** — For single-position errors (most tokenizer errors), the end equals the start. The constructor defaults `endLine = startLine` and `endColumn = startColumn` when not provided. This minimizes changes to existing construction sites.

3. **Parser errors compute end from token** — For parser errors where a `Token` is available, compute `endColumn = startColumn + value.length` and `endLine = startLine + newlinesInValue`. This gives meaningful end positions for multi-character tokens like numbers and strings.

4. **Error message preserves `startLine:startColumn`** — The super() message string uses `startLine:startColumn` in place of the old `row:col` pattern. Consumers parsing the message string won't break.

5. **External consumer update** — `validators.ts` destructures `startLine`/`startColumn` instead of `row`/`col`, and continues to convert `startLine - 1` to 0-based line.

## Risks / Trade-offs

- **Breaking change** — Any code accessing `err.row` or `err.col` will break. Mitigation: grep confirms only one external consumer (`validators.ts`). The change is worth the API clarity.
- **End position accuracy** — For multi-line tokens, computing endLine requires counting newlines in the value. Mitigation: Simple computation using `(value.match(/\n/g) || []).length` for endLine delta.
- **Token value length mismatch** — For quoted strings, `Token.value` is the unquoted content, so `startColumn + value.length` undercounts the end. Mitigation: For string errors, `endColumn` uses `startColumn + (token.raw?.length ?? value.length)` or just defaults to start for simplicity. The primary use case for end positions is the validation UI highlighting the error range, so estimates are acceptable.
