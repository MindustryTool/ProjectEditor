## 1. Formatter API Surface

- [x] 1.1 Add formatter exports and option types in `packages/hjson/src/index.ts` and `packages/hjson/src/hjson.ts`
- [x] 1.2 Create a formatter module in `packages/hjson/src/` that accepts source text and returns formatted HJSON text
- [x] 1.3 Keep `HJSON.stringify()` behavior unchanged and document formatter-specific defaults separately in code comments or types

## 2. Tolerant Structured Input

- [x] 2.1 Extend tokenizer/parser flow with a tolerant formatter-oriented mode that can continue past recoverable malformed segments
- [x] 2.2 Represent preserved invalid or partial spans in formatter-facing structured output without losing raw source text
- [x] 2.3 Preserve exact source positions for valid fields/elements and preserved opaque segments so formatter rewrites stay source-accurate
- [x] 2.4 Ensure existing strict parsing entry points still throw on invalid input unless tolerant formatter behavior is explicitly requested

## 3. Formatting Engine

- [x] 3.1 Implement deterministic formatting for valid objects, arrays, separators, indentation, and trailing delimiter layout
- [x] 3.2 Preserve comments, blank lines, and multiline string payloads while normalizing surrounding structure
- [x] 3.3 Re-emit malformed or ambiguous spans verbatim and in original order whenever they cannot be safely normalized
- [x] 3.4 Make formatting idempotent so formatting already formatted output produces the same text

## 4. Verification

- [x] 4.1 Add unit tests for valid-document formatting and parse-equivalent round trips
- [x] 4.2 Add unit tests for idempotent formatting across representative object, array, and multiline-string inputs
- [x] 4.3 Add unit tests proving recoverably invalid input is formatted without source data loss
- [x] 4.4 Add unit tests proving comments, blank lines, and trailing invalid source remain preserved
