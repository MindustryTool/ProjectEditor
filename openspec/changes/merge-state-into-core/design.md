## Context

The monorepo has two packages — `@project/state` and `@project/core` — that serve related purposes. `@project/core` provides low-level project info types, schemas, event bus, and import/export. `@project/state` provides Zustand state stores (app, session, file), React hooks, validation infrastructure, and a write queue. `@project/state` depends on `@project/core`, creating an artificial separation. The state code is deeply coupled to core concepts (project info, event bus, content types), and the package boundary adds no encapsulation benefit.

## Goals / Non-Goals

**Goals:**
- Eliminate `packages/state/` and move all code into `packages/core/`
- Update all imports across the monorepo from `@project/state` to `@project/core`
- Preserve all public APIs exactly — consumers should only change the import path
- Remove `@project/state` from workspace configuration

**Non-Goals:**
- No behavior changes, refactoring, or API redesign
- No changes to the Zustand stores' logic or validation algorithms
- No restructuring of files beyond what's needed for a clean merge

## Decisions

1. **Flat directory merge under `packages/core/src/`**
   State source files will be moved to `packages/core/src/` preserving their directory structure: `stores/`, `hooks/`, `services/`, `validation/`. The existing core files (`content.ts`, `exporter.ts`, `importer.ts`, `json-exporter.ts`) remain at the top level of `src/`. This keeps everything organized with minimal churn.

2. **Update `packages/core/package.json` dependencies**
   Add `zustand` (existing catalog dep), `@project/fs`, `@project/config`, `@project/schema`, `@project/hjson` as runtime deps. Add `react`, `react-dom` as peer deps (same as current state package). Remove the self-referencing `@project/core:workspace:*` entry.

3. **Single barrel export from `packages/core/src/index.ts`**
   The merged `index.ts` combines existing core exports (ProjectInfo, EventBus, getExporter, importProject, findContent) with all state exports (stores, hooks, validation, write queue). Consumers import everything from `@project/core`.

4. **Self-import fix in `use-file-content.ts`**
   Currently `use-file-content.ts` imports from `@project/state` (its own package). After merge, this becomes a local relative import or an import from `@project/core`. Use relative imports for intra-package references.

5. **Move tests to `packages/core/tests/`**
   `packages/state/tests/validation/utils.test.ts` moves to `packages/core/tests/validation/utils.test.ts`. Update any vitest config as needed.

## Risks / Trade-offs

- **[Risk] Circular imports** — After merging, ensure no circular dependency exists between the moved modules and existing core modules. Mitigation: The state modules currently only import types from core (`@project/core`), not concrete implementations. This pattern should be preserved.
- **[Risk] Missing peer dep** — Apps that depend on `@project/core` will now transitively depend on React via the state hooks. Mitigation: Add `react` and `react-dom` as peer deps on `@project/core`, matching the current `@project/state` setup.
- **[Risk] Breaking change for external consumers** — Anyone importing from `@project/state` will break. Mitigation: This is a monorepo with no external consumers; all internal imports are updated atomically in this change.
- **[Trade-off] Single package grows larger** — `@project/core` becomes bigger, but the reduction in workspace complexity and build overhead outweighs this.

## Migration Plan

1. Update `packages/core/package.json` — add deps, remove self-ref
2. Move all files from `packages/state/src/` to `packages/core/src/`
3. Update `packages/core/src/index.ts` to export all merged APIs
4. Fix intra-package imports (self-imports in state files → relative)
5. Update `packages/state/tests/` → `packages/core/tests/`
6. Update all consumer imports: `apps/web/src/**`, `apps/app/src/app.tsx`
7. Update workspace config: remove `@project/state` from workspace
8. Delete `packages/state/`
9. Verify with typechecking and tests

## Open Questions

- *(none)*
