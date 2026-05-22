## 1. Migrate Validation Package

- [x] 1.1 Replace `zod` dependency with `valibot` in `packages/validation/package.json`
- [x] 1.2 Rewrite `packages/validation/src/index.ts` — replace all Zod schemas with equivalent Valibot schemas (`ProjectFileSchema`, `ProjectSchema`, `SettingsSchema`)
- [x] 1.3 Run typecheck in `packages/validation` to verify the new schemas compile

## 2. Migrate Core Consumer

- [x] 2.1 Update `packages/core/src/index.ts` — change `ProjectSchema.parse()` to `v.parse(ProjectSchema, ...)`
- [x] 2.2 Run typecheck in `packages/core` to verify the consumer compiles

## 3. Cleanup

- [x] 3.1 Remove `zod` from the root lockfile by running `pnpm install` after dependency changes
- [x] 3.2 Run workspace-wide typecheck (`pnpm -r typecheck`) to ensure no breakage

## 4. Verification

- [x] 4.1 Run the test suite (`pnpm -r test`) to ensure all existing tests pass (note: apps/web test failure is pre-existing Cloudflare plugin issue, unrelated)
- [x] 4.2 Verify that Valibot is not imported anywhere else with a Zod-compatible API
