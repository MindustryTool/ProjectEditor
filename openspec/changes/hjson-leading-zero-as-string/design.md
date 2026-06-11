## Context

The HJSON parser in `packages/hjson` currently parses all numeric-looking literals as JavaScript `Number` values. When a literal has leading zeros (e.g., `0023`), `Number("0023")` silently drops them, yielding `23`. The `raw` field preserves the original text, but the `value` field loses information.

Mindustry mods commonly use zero-padded numeric IDs (item IDs, block IDs, tile IDs). These appear both as quoted strings (`"0023"`) and as bare literals (`0023`). Currently the two forms produce different values (string vs number), causing hard-to-find bugs.

## Goals / Non-Goals

**Goals:**
- Numbers with leading digit `0` followed by additional digits parse as strings (not numbers)
- Single `0` alone remains the number `0`
- Hex literals (`0xFF`) remain numbers
- Existing number formats (`42`, `-10`, `3.14`, `5e2`, `0xFF`) are unchanged
- All existing tests continue to pass

**Non-Goals:**
- No changes to stringification/serialization
- No changes to the AST node types or public API types
- No octal (`0o77`) or binary (`0b101`) support
- No changes to the structured node API

## Decisions

1. **Token-level change (tokenizer) rather than parser-level**: Detect leading zeros during `readNumber()` in the tokenizer and emit a string token instead. This is cleaner because the tokenizer already has the logic to detect whether a digit sequence should be a string (see existing `isUnquotedStringBody` check at line 388). Alternative considered: parser-level detection in `parseNumberNode()` — rejected because it would require changing the node type after creation and breaks the token/parse separation.

2. **Leading-zero strings become unquoted-string tokens**: When `readNumber()` produces a raw value starting with `0` followed by at least one more digit (and not `0x`/`0X`), the tokenizer emits a `"string"` token instead of a `"number"` token. This reuses the existing unquoted string parsing path in the parser, which already handles strings without quotes.

3. **Decimal leading zeros also included**: `0.5` starts with `0` and has additional digits, so it becomes a string too. This is consistent — any numeric literal starting with `0` followed by more content (except hex) is treated as a string. If users want `0.5` as a number, they write `.5` or remove the leading zero.

4. **Error handling follows existing string rules**: Leading-zero strings that the tokenizer would reject (e.g., containing special chars) follow the existing validation rules for unquoted strings.

## Risks / Trade-offs

- **[Backward compatibility]** Existing configs using `0023` as a numeric value will now get a string. **Mitigation**: This is the desired fix — the old behavior was a bug. The `raw` field already preserves the original text, but the `value` field changes from `23` to `"0023"`.
- **[Edge case: `.0`]** `0.0` becomes a string. **Mitigation**: Users who want a float `0.0` should use `0` (which remains a number) or explicitly use `.0`.
- **[Edge case: `0e5`]** Leading zero with exponent suffix is a string. Unlikely in practice. **Mitigation**: Users write `0` or `0e5` as number by omitting leading zero.
