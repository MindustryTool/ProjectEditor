## Why

`@project/state` and `@project/core` have overlapping concerns and circular dependency risk. `@project/core` already imports `@project/state`-like functionality (`EventBus`, `ProjectInfo`), while `@project/state` imports `@project/core` for project info types and event bus. Merging simplifies the dependency graph, eliminates a package boundary, and reduces build overhead. Core concepts (project info, event bus, state stores, validation) all belong to a single "core" domain.

## What Changes

- **BREAKING**: Delete `packages/state/` directory entirely
- Move all source files from `packages/state/src/` into `packages/core/src/` under appropriate subdirectories
- Update `packages/core/package.json` to include `zustand`, `@project/fs`, `@project/schema`, `@project/hjson` and `react` peer deps
- Export all state features (stores, hooks, validation, write queue) from `packages/core/src/index.ts`
- Update all import paths across the monorepo: `@project/state` → `@project/core`
- Remove `@project/state` from workspace configuration (`pnpm-workspace.yaml`, etc.)
- Fix any circular or broken imports within the merged codebase

## Capabilities

### New Capabilities
- *(none — no new behavior introduced; pure code reorganization)*

### Modified Capabilities
- *(none — all existing specs remain valid; only the package location changes)*

## Impact

- `packages/state/` — deleted entirely
- `packages/core/` — absorbs all state code and gains dependencies on `zustand`, `react`, `@project/fs`, `@project/schema`, `@project/hjson`
- `apps/web/package.json` — replace `@project/state` dep with `@project/core`
- `apps/app/package.json` — replace `@project/state` dep with `@project/core`
- `apps/web/src/**` — ~25 files update imports from `@project/state` to `@project/core`
- `apps/app/src/app.tsx` — update import
- `packages/state/tests/` — move to `packages/core/tests/`
- Workspace config — remove `@project/state` workspace entry
