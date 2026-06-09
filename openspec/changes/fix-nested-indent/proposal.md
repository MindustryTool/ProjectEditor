## Why

When patching deeply nested Hjson objects/arrays with `patchValue`, `insertField`, or `insertElement`, the indentation of newly inserted fields/elements is wrong. The `#detectIndent()` method in both `HjsonObjectNode` and `HjsonArrayNode` falls back to a hardcoded `"  "` when the container has no existing children, ignoring the actual nesting depth. This produces misaligned output that breaks the file's formatting.

## What Changes

- Fix `HjsonObjectNode.#detectIndent()` to compute correct indent for empty nested objects by walking the parent chain
- Fix `HjsonArrayNode.#detectIndent()` to compute correct indent for empty nested arrays by walking the parent chain
- Make indent step size detection robust by comparing parent key column with its own parent's fields
- Add tests for inserting into empty deeply nested objects and arrays
- No breaking API changes — all existing public signatures remain unchanged

## Capabilities

### New Capabilities

None. This is a bug fix to existing capabilities.

### Modified Capabilities

- `hjson-structured-parsing`: `HjsonObjectNode.insertField` and `HjsonArrayNode.insertElement` SHALL produce correctly indented output when inserting into empty nested containers

## Impact

- **Affected file**: `packages/hjson/src/structured.ts`
- **Changes**: Internal improvements to `#detectIndent()` in `HjsonObjectNode` and `HjsonArrayNode`; may add a protected/abstract method to `HjsonNode` base class for shared indent logic
- **No public API changes**: no exports, interfaces, or method signatures change
- **Tests**: New test cases in `packages/hjson/tests/patching.test.ts`
