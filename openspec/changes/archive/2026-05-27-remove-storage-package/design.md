## Context

The `@project/storage` package (`packages/storage/`) was introduced during the storage-interface-abstraction refactor to decouple storage from IndexedDB. It now exports a `StorageBackend` interface, a `LocalStorageAdapter` implementation, and thin wrapper functions (`saveProject`, `getProject`, `getAllProjects`, `deleteProject`, `saveSetting`, `getSetting`, `getOPFSRoot`). 

Meanwhile, `@project/state` already manages all app state via zustand with a `persist` middleware that writes to `localStorage`. This creates a redundant persistence layer — project metadata is both stored in the zustand store (as `ProjectInfo[]`) and in `@project/storage` (as `ProjectRecord[]`). The storage package adds a workspace dependency, a build target, and a mental indirection for no benefit.

## Goals / Non-Goals

**Goals:**
- Delete the `packages/storage/` directory and its `@project/storage` workspace entry
- Inline `getOPFSRoot()` as a standalone function in `@project/fs` (its only consumer)
- Add `projectRecords: Record<string, ProjectRecord>` state and CRUD actions to `useAppStore`
- Export `ProjectRecord` type from `@project/state`
- Update all import paths across `apps/web`, `apps/app`, `packages/state`, `packages/fs`
- Remove `@project/storage` from all `package.json` files and `pnpm-workspace.yaml`

**Non-Goals:**
- Changing the shape of `ProjectRecord` or `ProjectInfo`
- Changing how `getOPFSRoot` works — only its import location
- Modifying the write queue, file content, validation, or any other state module
- Adding new storage features beyond CRUD parity with the old module

## Decisions

1. **Store `projectRecords` as a `Record<string, ProjectRecord>` in `useAppStore`** — a map keyed by project ID is O(1) for lookup, supports the `getProject(id)` use case efficiently, and serializes cleanly through zustand persist. The existing `projects: ProjectInfo[]` array is kept for list rendering (it's already used by selectors).

2. **`getOPFSRoot` becomes a local function in `@project/fs`** — it simply calls `navigator.storage.getDirectory()`. It was only ever a thin wrapper, and the `StorageBackend` interface method was an unnecessary indirection. No need for a new file — it lives in `packages/fs/src/index.ts` as a `const` or `function`.

3. **`ProjectRecord` type moves to `@project/state`** — it's a data contract consumed by the store and UI components. Keeping it in `@project/state` alongside the store that owns it is cohesive. Export it from `packages/state/src/index.ts`.

4. **Date serialization via existing zustand persist** — the store already persists `projects` which contains `Date` fields (`ProjectInfo.createdAt`/`updatedAt`). The same persist config is extended to include `projectRecords`. Dates are serialized as ISO strings by default JSON and hydrated in selectors/actions. Add a custom `Date` reviver in the persist config if needed to ensure `projectRecords` dates are properly hydrated.

5. **No migration script needed** — users with existing data in the old `@project/storage` localStorage keys will lose it. This is acceptable because the app is in early development (no production users). The `useAppStore` persist key (already `"project-store"`) remains unchanged for settings and project list.

## Risks / Trade-offs

- **Data loss for existing local projects** — The old `@project/storage` kept project records under different localStorage keys (`pe:project:*`). After removal these records are orphaned. Mitigation: acceptable for pre-v1; document in changelog.
- **Persist payload size increase** — `projectRecords` adds the full record data to the zustand persisted state. Currently records are small JSON. If files grow large, payload size could slow initial load. Mitigation: the `data` field in `ProjectRecord` is currently a string that doesn't hold file contents (that's in OPFS), so it remains small.
- **Browser extension interference with localStorage** — No change from current behavior (zustand already uses localStorage).
