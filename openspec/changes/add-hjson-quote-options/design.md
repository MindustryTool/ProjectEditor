## Context

The `@project/hjson` package provides structured parsing via `HjsonNode` trees that support source-preserving edits. When patching values (`patchValue`, `insertField`, `insertElement`, `replaceValue`), the current code calls `hjsonStringify(v, null, 2)` unconditionally, producing default HJSON quoting (barewords where possible, double-quoted otherwise). Downstream code — particularly the HJSON editor UI — needs a simple flag to force quoting (JSON mode) or never quote (HJSON bareword mode).

Additionally, `HJSONParseOptions` currently only has `legacyRoot` and `structured` fields. The options object is not passed to `HjsonNode` instances, so serialization decisions cannot be configured at parse time.

`parseWithCache` uses a plain string cache key with no distinction for options, meaning two parses with different options would incorrectly share cached results.

## Goals / Non-Goals

**Goals:**
- Add `quote?: boolean` option to `HJSONParseOptions` and all parse functions
- Pass parsed options (immutable) to all `HjsonNode` instances so serialization methods respect them
- Expose stringify options (including `quote`) through `parseWithCache` cache key
- Restructure `structured.ts` so `FieldInfo`/`ElementInfo`/`HjsonNode` classes have access to options
- Update all test files to cover quote behavior

**Non-Goals:**
- Changing the parser's tokenizer to respect quote style during parsing (parsing always accepts all quote styles)
- Adding quote options to top-level `HJSON.stringify()` — that's a separate concern

## Decisions

### Decision 1: Quote option as a boolean flag

```typescript
// In HJSONParseOptions:
quote?: boolean;
```

- `true` — JSON mode: all strings are always double-quoted with `JSON.stringify()`
- `false` / `undefined` — HJSON mode (default): bareword where safe, double-quoted only when necessary

Rationale: Only two behaviors are needed — "force quotes" (JSON-safe output) vs "default HJSON" (bareword optimization). A boolean is the simplest API.

### Decision 2: Immutable shared options via frozen object on HjsonNode

Each `HjsonNode` instance holds a `#options` reference to a frozen options object. The object is created once during parsing and shared by reference.

```typescript
export interface HjsonSerializeOptions {
  quote: boolean;
}
```

Rationale: Sharing a frozen object is zero-cost for memory, prevents mutation, and avoids threading options through every method call signature.

### Decision 3: Pass options to factory functions

`createFieldInfo` and `createElementInfo` accept an `HjsonSerializeOptions` parameter, captured in the `replaceValue` closure.

### Decision 4: Cache key includes options

`parseWithCache` appends `JSON.stringify({ quote })` to the content-based cache key.

### Decision 5: Backward compatibility

`quote` defaults to `false`/`undefined`. Existing code without the option gets identical behavior.

## Risks / Trade-offs

- **[Risk]** Adding `#options` to `HjsonNode` is a minor memory increase → **Mitigation**: Single frozen object shared across all nodes; negligible
- **[Risk]** `parseWithCache` key change invalidates existing cached entries → **Mitigation**: Cache is in-memory LRU; only affects current session
