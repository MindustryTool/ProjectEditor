## Context

The project needs a first-party HJSON library for human-friendly configuration files. HJSON is a superset of JSON that adds comments, trailing commas, unquoted keys, and multi-line strings — making it ideal for hand-edited configs. The library must be zero-dependency, TypeScript-native, and follow familiar JSON API conventions.

## Goals / Non-Goals

**Goals:**
- Full HJSON spec compliance (https://hjson.github.io/)
- API mirroring `JSON.parse`/`JSON.stringify` (`HJSON.parse`/`HJSON.stringify`)
- Typed errors with row/col/index position, error codes, and descriptive messages
- Zero runtime dependencies
- Tree-shakeable ESM + CommonJS output
- Async parsing API for large inputs (`HJSON.parseAsync`)
- Strong TypeScript types throughout

**Non-Goals:**
- Streaming parse (incremental chunk-based) in v1 — `parseAsync` is non-blocking but loads entire input
- HJSON to JSON schema generation
- CLI tool (focus on library API first)
- Browser WASM build (pure JS is sufficient for config file sizes)

## Decisions

1. **Recursive-descent parser over parser generator** — Hand-written tokenizer + recursive-descent parser is simpler to maintain, easier to type, and avoids a build-time codegen dependency. No grammar file to keep in sync. HJSON is small enough that hand-rolling is practical.

2. **AST as intermediate representation** — Parse HJSON → `HjsonNode` AST → convert to JS value. This separates syntax concerns from semantic conversion, simplifies error reporting with source positions on every node, and enables future transforms (e.g., HJSON-to-JSON conversion).

3. **`HJSONErrorCode` as const object + type union** — `export const HJSONErrorCode = { ... } as const` with `export type HJSONErrorCode = (typeof HJSONErrorCode)[keyof typeof HJSONErrorCode]` — provides runtime constants AND a strict TypeScript union type without duplication.

4. **Separate error class (`HJSONError` extends `SyntaxError`)** — Carries `code`, `row`, `col`, `index`, `inputFragment` (the offending source snippet). Extends `SyntaxError` to be catchable alongside native `SyntaxError` from `JSON.parse`.

5. **`parseAsync` uses `setImmediate`/`queueMicrotask` chunking** — Breaks tokenization into microtask-sized chunks to avoid blocking the event loop on large inputs, without requiring a Web Worker.

6. **Stringify preserves HJSON conventions** — Use unquoted keys where valid, detect multi-line strings by content, emit trailing comma on last member. Accept `toJSON()` on objects for round-trip compatibility with `JSON.stringify`.

7. **Reviver/replacer parity with JSON API** — `parse` accepts `(text, reviver?)` matching `JSON.parse` signature. `stringify` accepts `(value, replacer?, space?)` matching `JSON.stringify`. `replacer` supports both function and array-of-keys forms.

## Risks / Trade-offs

- **Parser complexity** — HJSON has context-sensitive rules (e.g., unquoted strings vs. bare keys). Risk → Comprehensive test suite with edge cases from the HJSON test corpus.
- **Performance** — Hand-written parser may be slower than generated ones. Risk → Profile on target file sizes (typically <1MB config files); optimize hot paths if needed.
- **Multi-line string whitespace stripping** — Python-style indent stripping is subtle. Risk → Match HJSON reference implementation behavior exactly with targeted tests.
- **Unicode handling** — Emoji and non-BMP characters in unquoted strings. Risk → Use native JS string iteration and test with diverse Unicode inputs.
