## 1. Tokenizer Changes

- [x] 1.1 Modify `readNumber()` in `src/tokenizer.ts` to detect leading-zero literals and emit string tokens instead of number tokens
- [x] 1.2 Update `scan()` in `src/tokenizer.ts` to route leading-zero sequences through the string token path

## 2. Parser Verification

- [x] 2.1 Verify `parseNumberNode()` in `src/parser.ts` no longer receives leading-zero number tokens
- [x] 2.2 Verify `parseUnquotedString()` in `src/parser.ts` correctly handles leading-zero strings

## 3. Tests

- [x] 3.1 Add tokenizer tests for leading-zero integers (`0023`, `00042`, `-007`, `+007`)
- [x] 3.2 Add tokenizer tests for leading-zero floats (`0.5`, `0.0`)
- [x] 3.3 Add tokenizer tests for single `0` and hex (`0xFF`) remaining as numbers
- [x] 3.4 Add parser tests for leading-zero integer and float parsing
- [x] 3.5 Add parser tests for single `0` and hex remaining as numbers
- [x] 3.6 Add integration test for leading-zero parsing and round-tripping

## 4. Verification

- [x] 4.1 Run existing test suite to confirm no regressions
- [x] 4.2 Run type checking to confirm no type errors
