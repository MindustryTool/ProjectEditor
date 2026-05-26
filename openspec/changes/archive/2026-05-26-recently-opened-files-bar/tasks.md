## 1. Store Refactor — Extract Project Store

- [x] 1.1 Create `packages/state/src/stores/project.ts` with `ProjectContext`, `ProjectState`, `useProjectStore` (move all project-related state, actions, and persistence from `index.ts`)
- [x] 1.2 Add `recentlyOpenedFiles: Record<string, RecentFileEntry[]>` (keyed by project ID) to the new store state
- [x] 1.3 Implement LRU eviction logic: on insert, remove entry with oldest `lastAccessedAt` when length > 50
- [x] 1.4 Add `recordFileAccess(projectId: string, path: string)` action to the store
- [x] 1.5 Add `removeFromRecentFiles(projectId: string, path: string)` action to the store
- [x] 1.6 Add `clearRecentFiles(projectId: string)` action to the store
- [x] 1.7 Update `partialize` to persist `recentlyOpenedFiles` alongside `projects`, `lastProjectId`, `settings`
- [x] 1.8 Update `packages/state/src/index.ts` to re-export `useProjectStore` from the new file; keep only `AppSettings` and `hydrated` inline or move to `stores/settings.ts`
- [x] 1.9 Verify all existing imports of `useProjectStore` from `@project/state` still work

## 2. Recently Opened Files Bar Component

- [x] 2.1 Create `apps/web/src/components/editor/recently-opened/RecentlyOpenedFilesBar.tsx` with horizontal tab layout
- [x] 2.2 Each tab shows file name (basename), close button (x), and active state highlighting
- [x] 2.3 Clicking a tab calls `recordFileAccess` and navigates via query param update
- [x] 2.4 Close button calls `removeFromRecentFiles` and removes the tab
- [x] 2.5 Component reads `recentlyOpenedFiles[projectId]` from store selector
- [x] 2.6 Empty state: render nothing when list is empty
- [x] 2.7 Style with Tailwind: compact horizontal scroll, truncation for long names

## 3. Integrate Bar into Editor Layout

- [x] 3.1 Integrate `RecentlyOpenedFilesBar` into `EditorCenterPanel` above the main content area
- [x] 3.2 Hook into file navigation: when `path` changes, call `recordFileAccess(projectId, path)`
- [x] 3.3 Handle project close: clear recent files list on project close or keep per-project data (design decision: keep persisted)
- [x] 3.4 Test that switching projects shows correct recent files list

## 4. Verify and Clean Up

- [x] 4.1 Run typecheck across the workspace
- [x] 4.2 Run lint
- [x] 4.3 Verify persistence: open files, reload page, confirm list is restored
- [x] 4.4 Verify LRU cap: open 50+ files, confirm oldest are evicted
