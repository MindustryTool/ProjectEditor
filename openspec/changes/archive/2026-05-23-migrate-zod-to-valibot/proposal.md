## Why

The project uses Zod for schema validation in `@project/validation`, but Valibot was already adopted for form validation in the editor (`mod-hjson-editor`). Running two validation libraries increases bundle size and adds cognitive overhead. Valibot's modular tree-shakeable design is better suited for a monorepo. Migrating off Zod eliminates a redundant dependency.

## What Changes

- Replace all Zod schemas in `packages/validation/src/index.ts` with equivalent Valibot schemas
- Replace `zod` dependency with `valibot` in `packages/validation/package.json`
- Update `packages/core/src/index.ts` to use Valibot's `v.parse()` instead of `ProjectSchema.parse()`
- Remove `zod` from the workspace root lockfile
- No breaking changes to public types — all exported inferred types remain identical

## Capabilities

### New Capabilities
- `validation-schemas`: Defines the Valibot-based validation schemas for Project, ProjectFile, and Settings. Documents the schema contracts that were previously implicit in the Zod implementation.

### Modified Capabilities
- None. This is a pure library swap — no spec-level behavior changes.

## Impact

- `packages/validation/src/index.ts` — rewrite schemas from Zod to Valibot
- `packages/validation/package.json` — replace `zod` with `valibot`
- `packages/core/src/index.ts` — update `validateProject()` to use `v.parse()`
- `packages/core/package.json` — no change needed (it imports from `@project/validation`, no direct Zod dependency)
