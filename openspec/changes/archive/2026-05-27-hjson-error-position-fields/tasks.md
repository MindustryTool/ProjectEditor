## 1. HJSONError Class Changes

- [ ] 1.1 Rename `HJSONError.row` → `HJSONError.startLine` in property declarations and constructor
- [ ] 1.2 Rename `HJSONError.col` → `HJSONError.startColumn` in property declarations and constructor
- [ ] 1.3 Add `endLine` and `endColumn` readonly properties to `HJSONError`, defaulting to start values in constructor
- [ ] 1.4 Update constructor options type: rename `row`/`col` to `startLine`/`startColumn`, make `endLine`/`endColumn` optional
- [ ] 1.5 Update `super()` message string to use `startLine:startColumn`

## 2. Tokenizer Error Construction

- [ ] 2.1 Update tokenizer's `error()` method to pass `startLine`/`startColumn`/`endLine`/`endColumn` instead of `row`/`col`
- [ ] 2.2 Add `endLine`/`endColumn` computation: for multi-character tokens, derive end from value length; for single-char errors, end = start

## 3. Parser Error Construction

- [ ] 3.1 Update all 9 parser error construction calls to pass `startLine`/`startColumn`/`endLine`/`endColumn` instead of `row`/`col`
- [ ] 3.2 Compute `endColumn = startColumn + value.length` and `endLine = startLine + newlineCount` for token-based errors

## 4. External Consumer

- [ ] 4.1 Update `packages/state/src/validation/validators.ts` to destructure `startLine`/`startColumn` instead of `row`/`col`

## 5. Tests

- [ ] 5.1 Update `tests/errors.test.ts` — replace `err.row`/`err.col` with `err.startLine`/`err.startColumn`; add tests for `endLine`/`endColumn`
- [ ] 5.2 Update `tests/integration.test.ts` — replace `e.row`/`e.col` with `e.startLine`/`e.startColumn`

## 6. Verification

- [ ] 6.1 Run `npm run typecheck` in `packages/hjson` — ensure no type errors
- [ ] 6.2 Run `npm test` in `packages/hjson` — ensure all tests pass
- [ ] 6.3 Run `npm run typecheck` in `packages/state` — ensure no type errors
- [ ] 6.4 Run `npm run typecheck` in `apps/web` — ensure no type errors
