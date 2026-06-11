## Why

In Mindustry modding, numeric IDs like `0023` are common (e.g., item IDs, block IDs). Currently the HJSON parser converts `0023` to the number `23`, losing the leading-zero formatting. When users write `"0023"` explicitly it round-trips correctly as a string, but the unquoted `0023` form is silently corrupted. This causes mismatches when mods reference `"0023"` in one place and `0023` in another.

## What Changes

- Numbers with leading zeros (e.g., `0023`, `-007`, `0.5`) will be parsed as strings instead of numbers
- The `NumberNode` AST node will no longer be produced for leading-zero literals; they become `StringNode` instead
- Existing pure numbers (`42`, `-10`, `3.14`, `5e2`) and hex literals (`0xFF`) continue to parse as numbers
- A single `0` alone still parses as the number `0`
- Error handling: leading-zero numbers that cannot be represented as strings (e.g., containing non-digit chars after the leading zero) follow existing unquoted-string fallback rules

## Capabilities

### New Capabilities
- `hjson-leading-zero-as-string`: Numbers with leading digit `0` followed by additional digits are parsed as string values rather than numeric values

### Modified Capabilities
<!-- No existing specs' requirements change; this is a new capability -->

## Impact

- **Affected package**: `packages/hjson`
- **Modified files**: `src/tokenizer.ts` (number scanning logic), `src/parser.ts` (number node creation)
- **New tests**: tokenizer, parser, and integration tests for leading-zero behavior
- **No breaking changes** to the public API: `HjsonValueNode<string>` is returned for these values, which is already a supported type
