## Context

The `@project/hjson` package currently parses HJSON text into an AST (`HjsonNode`) and then converts it to a plain JavaScript value via `toJSValue()`, discarding all source position information. The AST already tracks positions via `SourceLocation` (start/end with `row`/`col`/`index`) on every node including `MemberNode` (which has `key` and `value` sub-nodes). However, this position data is lost when converting to a plain JS value.

Downstream consumers — the mod-hjson editor and file validation system — need to correlate parsed fields back to their source positions for precise error highlighting, in-place field targeting, and structured traversal. Currently they must re-parse or use fragile string matching.

The position tracking infrastructure already exists in the tokenizer and AST; the gap is in the public API surface and the JS-value conversion layer.

## Goals / Non-Goals

**Goals:**
- Provide a `structured: true` option on `HJSON.parse()` that returns a typed structured result
- Every field in the result carries: `key`, `value`, `start`, `end`, `valueStart`, `valueEnd` positions
- Position format: `{ row: number; col: number; index: number }` (matching existing AST `SourceLocation`)
- The default `parse()` behavior (`structured: false`) returns plain JS values — **no breaking change**
- All position data is derived from existing AST node positions; no tokenizer changes needed
- Full TypeScript types exported for the structured result classes

**Non-Goals:**
- Changing the existing `parse()` return type or signature
- Adding position data to primitive values (strings, numbers, booleans, null) — only object members carry positions
- Streaming or incremental parsing
- Position data for array elements (only keyed object members)
- Modifying the tokenizer or AST layer

## Decisions

1. **New option flag over separate method** — Add `structured?: boolean` to `HJSONParseOptions` rather than a separate `parseStructured()` method. This keeps the API surface small and discoverable. When `structured: true`, `parse()` returns `StructuredResult<T>` instead of `T`.

2. **`StructuredObject<T>` class wrapping plain objects** — Return a class (not a plain object or Proxy) so consumers can `instanceof` check and rely on consistent property access. The class holds the original plain JS value internally plus a `Map<string, FieldInfo>` for position metadata.

3. **Positions from existing AST `MemberNode` positions** — The AST already has `MemberNode.loc` (the entire `key: value` range), `MemberNode.key.loc` (the key), and `MemberNode.value.loc` (the value). Derive `start = member.loc.start`, `end = member.loc.end`, `valueStart = member.value.loc.start`, `valueEnd = member.value.loc.end` directly from these. No tokenizer changes required.

4. **Recursive position collection** — During `toJSValue()` conversion, when `structured` mode is active, collect position data from each `MemberNode` into a flat path-based map (e.g., `"a.b.c"` for nested fields). This avoids deeply nested wrapper types while still supporting arbitrary nesting.

5. **Separate module `structured.ts`** — New file `src/structured.ts` for the `StructuredObject` class and type definitions, keeping concerns separated from the core parser.

6. **Reuse existing `SourceLocation` type** — Use the same `SourceLocation` interface from `ast.ts` for position fields, maintaining consistency with the internal AST types.

## Risks / Trade-offs

- **Memory overhead** — Storing position metadata for every field doubles memory per parsed object. Mitigation: Position data is only collected when `structured: true` is explicitly passed; default parsing is unaffected.
- **Nested position path ambiguity** — Using flat dot-path keys for nested positions could clash with keys containing dots. Mitigation: Use an `ArrayPath` type (array of string/number segments) rather than dot-concatenated strings for the internal map keys.
- **API surface growth** — A new return type and option add complexity. Mitigation: The default path is unchanged; the structured path is opt-in and self-contained in a single new module.
