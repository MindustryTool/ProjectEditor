## 1. Update core package configuration

- [ ] 1.1 Add `zustand`, `@project/fs`, `@project/config`, `@project/schema`, `@project/hjson` to `packages/core/package.json` dependencies
- [ ] 1.2 Add `react` and `react-dom` as peer dependencies in `packages/core/package.json`
- [ ] 1.3 Remove the self-referencing `@project/core:workspace:*` entry from `packages/core/package.json`
- [ ] 1.4 Update `packages/core/tsconfig.json` if needed (check state's tsconfig for any additional settings)

## 2. Move state source files into core

- [ ] 2.1 Copy `packages/state/src/stores/` → `packages/core/src/stores/`
- [ ] 2.2 Copy `packages/state/src/hooks/` → `packages/core/src/hooks/`
- [ ] 2.3 Copy `packages/state/src/services/` → `packages/core/src/services/`
- [ ] 2.4 Copy `packages/state/src/validation/` → `packages/core/src/validation/`
- [ ] 2.5 Fix intra-package self-imports in moved files: `use-file-content.ts` imports from `@project/state` → use relative imports
- [ ] 2.6 Move `packages/state/tests/` → `packages/core/tests/`

## 3. Merge barrel exports

- [ ] 3.1 Update `packages/core/src/index.ts` to re-export all state APIs (stores, hooks, validation, write queue)
- [ ] 3.2 Remove duplicate `import type { ProjectContents } from "@project/core"` if any validation files import it — now it's internal

## 4. Update consumer imports

- [ ] 4.1 Update all imports in `apps/web/src/` from `@project/state` to `@project/core`
- [ ] 4.2 Update imports in `apps/app/src/app.tsx` from `@project/state` to `@project/core`
- [ ] 4.3 Update `apps/web/package.json` — replace `@project/state:workspace:*` with `@project/core:workspace:*`
- [ ] 4.4 Update `apps/app/package.json` — same replacement
- [ ] 4.5 Update any remaining references (specs, config files referencing `@project/state`)

## 5. Clean up state package

- [ ] 5.1 Remove `@project/state` from workspace configuration (root `pnpm-workspace.yaml`, turbo.json if applicable)
- [ ] 5.2 Delete `packages/state/` directory entirely

## 6. Verification

- [ ] 6.1 Run `pnpm install` to update lockfile
- [ ] 6.2 Run typecheck on `@project/core` — `cd packages/core && npx tsc --noEmit`
- [ ] 6.3 Run typecheck on `apps/web` — `cd apps/web && npx tsc --noEmit`
- [ ] 6.4 Run typecheck on `apps/app` — `cd apps/app && npx tsc --noEmit`
- [ ] 6.5 Run tests — `pnpm run test --filter @project/core`
- [ ] 6.6 Verify no remaining references to `@project/state` in source code
