## Context

The current `useProjectStore` in `packages/state/src/index.ts` is a single monolithic Zustand store holding both persisted settings/project metadata and transient ProjectContext (fs, events). The recently-opened-files feature needs a persistent, LRU-capped list of file paths per project. This requires extracting project-related state into its own store with proper persistence, separate from the app settings.

## Goals / Non-Goals

**Goals:**
- Extract `ProjectContext`, `projects`, `lastProjectId`, `treeSnapshot`, and all related actions into `packages/state/src/stores/project.ts`
- Add `recentlyOpenedFiles: Record<string, RecentFileEntry[]>` keyed by project ID, persisted via Zustand persist middleware
- LRU eviction: remove entry with oldest `lastAccessedAt` when count exceeds 50 per project
- Render a horizontal `RecentlyOpenedFilesBar` component in `EditorCenterPanel`
- Track file opens: on every file navigation, push/update the entry in the store

**Non-Goals:**
- Pin/favorite files (future work)
- Recently closed files tracking
- Cross-project recent files view
- Drag-and-drop reordering of the bar
- Grouping files by directory

## Decisions

1. **Separate store file over inline definition** — Following the existing pattern in `packages/state/src/stores/file-content.ts`. The new `stores/project.ts` will hold ProjectContext + recentlyOpenedFiles. The original `index.ts` re-exports and keeps the app settings store separately.

2. **LRU implementation via simple timestamp sort** — Each `RecentFileEntry` stores `lastAccessedAt: number`. On insert/update, evict the entry with the smallest timestamp when length > 50. This is O(n log n) on eviction but n ≤ 50, so negligible.

   Alternative considered: doubly-linked list + map for O(1). Rejected because of complexity overhead for a max-50 list.

3. **recentlyOpenedFiles keyed by project ID** — Each project gets its own list. When switching projects, the bar shows files from the active project only. This prevents cross-project pollution.

4. **Persist via Zustand `persist` middleware** — Same mechanism as current settings. `partialize` includes `recentlyOpenedFiles` and project metadata but excludes the transient `projectContext` (fs/events are rebuilt on load).

5. **Track via existing navigation** — The file open path is already managed through `useQueryState("path")` in `EditorPage`. We hook into the `path` state change in `EditorShell` or `EditorCenterPanel` to call `recordFileAccess(path)`.

6. **Separate AppSettings store** — The remaining state in `index.ts` (settings, hydrated) becomes a smaller `useAppSettingsStore` or stays minimal. Keeps concerns clean.

## Risks / Trade-offs

- **[Persistence size]** 50 file paths per project in localStorage could grow if many projects exist. Mitigation: each entry is ~100 bytes × 50 = ~5 KB per project, acceptable.
- **[Migration]** Existing users have `project-store` in localStorage with old schema. Mitigation: Zustand's `persist` handles schema evolution via `version` and `migrate` if needed.
- **[Performance]** `recentlyOpenedFiles` updates on every file navigation. Mitigation: Zustand's selector-based subscriptions prevent re-renders of unrelated components.
