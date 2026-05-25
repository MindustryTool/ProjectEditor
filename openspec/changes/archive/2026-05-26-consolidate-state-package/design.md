## Context

The `@project/state` package manages application state (file content, project context) but depends on `@project/file-validation` for validation logic. The dependency is indirect — `validation-listener.ts` uses `import("@project/file-validation")` which adds a runtime dynamic import boundary. Meanwhile, `packages/state/src/` is flat (6 files), making it harder to navigate as more files are added. Consolidating validation into state and organizing by category improves cohesion and code discoverability.

## Goals / Non-Goals

**Goals:**
- Move all validation code from `@project/file-validation` into `@project/state/src/validation/`
- Replace dynamic `import("@project/file-validation")` with direct imports
- Organize `packages/state/src/` into `stores/`, `hooks/`, `validation/`, `services/` sub-folders
- Update all `apps/web/` consumers to import from `@project/state`
- Delete the `@project/file-validation` package entirely

**Non-Goals:**
- No behavioral changes to validation logic or stores
- No changes to the public API surfaces (re-exports remain the same)
- No changes to `@project/validation` or `valibot` packages

## Decisions

### 1. Folder structure
**Decision**:
```
packages/state/src/
  index.ts              — Public API re-exports
  stores/               — Zustand stores
    file-content.ts
    validation.ts
  hooks/                — React hooks
    use-file-content.ts
  validation/           — Validation engine
    types.ts
    registry.ts
    runner.ts
    validators.ts
    store.ts
    listener.ts
    index.ts            — Internal re-exports for convenience
  services/             — Non-reactive utilities
    version-map.ts
    write-queue.ts
```
**Rationale**: Groups files by concern (state management, React integration, validation engine, utilities). Each folder is cohesive and can grow independently.

### 2. Validation package deletion
**Decision**: Delete `packages/file-validation/` entirely (source, package.json, tsconfig.json).
**Rationale**: No consumers would import from it after the move. The package would be empty and cause confusion.

### 3. Dynamic import → direct import
**Decision**: `validation/listener.ts` imports `createDefaultValidators`, `createValidationRunner`, and `useValidationStore` via direct relative imports (`../validation/validators`, `../validation/runner`, `./store`).
**Rationale**: No runtime boundary needed since all code is in the same package. Direct imports are statically analyzable, enable tree-shaking, and are faster.

### 4. Dependency management
**Decision**: Add `@project/validation` and `valibot` to `@project/state`'s `dependencies` (they were previously transitive through `@project/file-validation`).
**Rationale**: The validation code directly imports `ModHjsonSchema` from `@project/validation` and `v.safeParse` from `valibot`. These must be direct dependencies after the merge.

## Risks / Trade-offs

- **[Risk]** Package size increase for `@project/state` consumers (validation code is now bundled with state).
  → **Mitigation**: Validation code is ~250 lines total. Negligible impact. Tree-shaking will remove unused parts.
- **[Risk]** Breaking change for any external consumer of `@project/file-validation`.
  → **Mitigation**: All consumers are within this monorepo. All identified consumers are updated as part of this change.
