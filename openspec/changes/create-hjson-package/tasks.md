## 1. Project Setup

- [x] 1.1 Create `packages/hjson/` directory structure with `src/`, `tests/`, `package.json`, `tsconfig.json`
- [x] 1.2 Configure `package.json` with ESM + CJS dual output, `"type": "module"`, `"sideEffects": false`
- [x] 1.3 Set up `tsconfig.json` with strict mode, `declaration: true`, `declarationMap: true`
- [x] 1.4 Add build scripts (`build`, `test`, `lint`, `typecheck`) and configure `.gitignore`
- [x] 1.5 Write initial `index.ts` re-exporting all public API modules

## 2. Error System (`hjson-error`)

- [x] 2.1 Define `HJSONErrorCode` const object with all error codes (`UnexpectedToken`, `UnterminatedString`, `UnterminatedMultilineString`, `ExpectedValue`, `ExpectedCommaOrClosingBrace`, `DuplicateKey`, `InvalidNumber`, `UnexpectedEndOfInput`, `ExpectedColon`, `InvalidEscapeSequence`, `MaximumDepthExceeded`)
- [x] 2.2 Export `HJSONErrorCode` type as union derived from the const object
- [x] 2.3 Implement `HJSONError` class extending `SyntaxError` with readonly `code`, `row`, `col`, `index`, `inputFragment` properties
- [x] 2.4 Implement error message formatting with human-readable descriptions including position and context
- [x] 2.5 Write unit tests for all error code scenarios

## 3. Tokenizer

- [x] 3.1 Implement `Tokenizer` class that consumes input character-by-character with position tracking (row, col, index)
- [x] 3.2 Implement whitespace skipping with line counting for accurate row/col tracking
- [x] 3.3 Implement comment skipping (single-line `//` and multi-line `/* */`)
- [x] 3.4 Implement string tokenization (quoted strings with escape sequences)
- [x] 3.5 Implement multi-line string tokenization with `'''` delimiter and whitespace stripping
- [x] 3.6 Implement unquoted string tokenization (bare words, context-sensitive termination)
- [x] 3.7 Implement number tokenization (int, float, hex, exponent forms)
- [x] 3.8 Implement keyword tokenization (`true`, `false`, `null`)
- [x] 3.9 Implement symbol tokenization (`{`, `}`, `[`, `]`, `:`, `,`)
- [x] 3.10 Implement `peek()` / `next()` / `expect()` API with error reporting on unexpected tokens
- [x] 3.11 Write comprehensive tokenizer tests covering all token types and edge cases

## 4. AST Nodes

- [x] 4.1 Define `HjsonNode` discriminated union type with `kind`, `loc` (source position), and type-specific data
- [x] 4.2 Implement AST node types: `ObjectNode`, `ArrayNode`, `StringNode`, `NumberNode`, `BooleanNode`, `NullNode`, `MemberNode`
- [x] 4.3 Implement `SourceLocation` type with `start`/`end` positions (row, col, index)

## 5. Parser (`hjson-parser`)

- [x] 5.1 Implement `parseValue()` top-level dispatch that routes to specific parse methods based on current token
- [x] 5.2 Implement `parseObject()` with key-value pair parsing, trailing comma support, and duplicate key detection
- [x] 5.3 Implement `parseArray()` with element parsing and trailing comma support
- [x] 5.4 Implement `parseString()` for quoted/unquoted/multi-line strings
- [x] 5.5 Implement `parseNumber()` for all numeric formats
- [x] 5.6 Implement root braced object parsing (file-level key-value pairs without outer braces)
- [x] 5.7 Implement AST-to-JS-value conversion with reviver support
- [x] 5.8 Implement `HJSON.parse(text, reviver?, options?)` public API with proper TypeScript generics
- [x] 5.9 Implement `HJSON.parseAsync(text, reviver?, options?)` with microtask chunking
- [x] 5.10 Write unit tests for all spec scenarios: standard JSON, unquoted keys, trailing commas, comments, unquoted strings, multi-line strings, numbers, root objects, nested structures, arrays

## 6. Serializer (`hjson-serializer`)

- [x] 6.1 Implement value type detection and dispatch (null, boolean, number, string, array, object)
- [x] 6.2 Implement object serialization with unquoted keys (where valid), trailing comma, and indentation
- [x] 6.3 Implement array serialization with proper formatting
- [x] 6.4 Implement multi-line string detection and `'''` syntax emission
- [x] 6.5 Implement string quoting rules (quote only when necessary for HJSON compatibility)
- [x] 6.6 Implement number/boolean/null serialization
- [x] 6.7 Implement replacer support (function and array forms)
- [x] 6.8 Implement `toJSON()` method support for round-trip compatibility
- [x] 6.9 Implement `HJSON.stringify(value, replacer?, space?)` public API
- [x] 6.10 Write unit tests for all serializer scenarios with round-trip verification

## 7. TypeScript Types (`hjson-types`)

- [x] 7.1 Export `HJSON` namespace type with `parse`, `stringify`, and `parseAsync` method signatures
- [x] 7.2 Export `HJSONParseOptions` interface with `keepQuote` and `legacyRoot` properties
- [x] 7.3 Export `Reviver` and `Replacer` type aliases matching JSON API signatures
- [x] 7.4 Export `HJSONError` class type with readonly properties
- [x] 7.5 Write type-level tests (tsd or similar) verifying generic constraints and type inference

## 8. Integration & Verification

- [x] 8.1 Implement round-trip tests (stringify → parse → verify structural equality)
- [x] 8.2 Test with real-world HJSON configuration files from the HJSON test corpus
- [x] 8.3 Run full test suite and verify 100% of spec scenarios pass
- [x] 8.4 Run TypeScript typecheck with strict mode, verify zero type errors
- [x] 8.5 Run lint and verify zero warnings/errors
- [x] 8.6 Verify ESM and CJS builds both work correctly
- [x] 8.7 Update root-level package registry / workspace configuration to include the new package
