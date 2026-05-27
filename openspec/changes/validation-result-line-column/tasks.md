## 1. Update ValidationResult Type

- [x] 1.1 Replace `line?: number` and `column?: number` with `startLine: number`, `startColumn: number`, `endLine?: number`, `endColumn?: number` in the `ValidationResult` interface in `packages/state/src/validation/types.ts`

## 2. Update Validator to Use New Fields

- [x] 2.1 Update `jsonSyntaxValidator` in `packages/state/src/validation/validators.ts` to destructure `startLine`/`startColumn`/`endLine`/`endColumn` from `HJSONError` and pass them to `ValidationResult`
- [x] 2.2 Update the non-HJSON error fallback path to set `endLine`/`endColumn` equal to start positions

## 3. Update Consumer Code

- [x] 3.1 Update `MonacoEditor.tsx` — remove the `r.line === undefined` guard, map `startLine`/`startColumn`/`endLine`/`endColumn` directly to Monaco marker fields, remove the `r.line - 1` and `(r.column ?? 1) + 1` workaround math

## 4. Typecheck & Test

- [ ] 4.1 Run `npm run typecheck` in `packages/state` and `apps/web` — ensure no type errors
- [ ] 4.2 Run existing tests — ensure no regressions
