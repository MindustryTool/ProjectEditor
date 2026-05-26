## Why

The current `useProjectStore` conflates two concerns: app-level persisted state (settings, projects list) and transient project session state (active project context, tree snapshot, recently opened files). This makes the store hard to reason about and prevents clean separation of concerns. Renaming `ProjectState` to `AppState` and extracting session state into its own store clarifies the architecture.

## What Changes

- Rename `ProjectState` to `AppState` and `useProjectStore` to `useAppStore` in `stores/project.ts`
- Extract `projectContext`, `treeSnapshot`, and `recentlyOpenedFiles` into a new separate store `stores/session.ts` with type `ProjectSession` and hook `useProjectSession`
- Rename `useCurrentProject` to `useActiveProject` (or keep as-is but sourced from the session store)
- Update all consumers to import from the correct store
- **BREAKING**: All imports using `useProjectStore(s => s.projectContext)`, `useProjectStore(s => s.treeSnapshot)`, `useProjectStore(s => s.recentlyOpenedFiles)` must switch to the new session store

## Capabilities

### New Capabilities

- `project-session-store`: Extract transient project session state into a dedicated store

### Modified Capabilities

- `project-store-refactor`: Rename `ProjectState` → `AppState`, `useProjectStore` → `useAppStore`; add `AppState` type; split session state out

## Impact

- **`packages/state/src/stores/project.ts`**: Renamed types, removed session fields, actions;
  store renamed to `useAppStore`
- **`packages/state/src/stores/session.ts`**: New file with `ProjectSession`, `useProjectSession` containing `projectContext`, `treeSnapshot`, `recentlyOpenedFiles`
- **`packages/state/src/index.ts`**: Updated re-exports
- **`packages/state/src/hooks/use-file-content.ts`**: Updated imports
- **13+ consumer files** across `apps/web/` and `apps/app/`: Updated imports and selectors
