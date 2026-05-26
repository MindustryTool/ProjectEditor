## 1. Core type change

- [x] 1.1 Add `field?: string` to `ValidationResult` in `packages/state/src/validation/types.ts`

## 2. Update validators

- [x] 2.1 In `validators.ts` contentJsonValidator, replace `messageParams: { index: i + 1, field: "type" }` with `field: "type"` and remove `index` from messageParams if unused

## 3. Update spec documentation

- [x] 3.1 Add `field` to the result shape in `openspec/specs/file-validation-core/spec.md`

## 4. Verify

- [x] 4.1 Run `pnpm typecheck` to confirm no type errors across the monorepo
- [x] 4.2 Run `pnpm lint` to confirm no lint issues
- [x] 4.3 Run tests to confirm existing validation behavior is preserved
