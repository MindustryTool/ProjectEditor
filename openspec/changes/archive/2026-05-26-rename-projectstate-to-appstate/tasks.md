## 1. Create Session Store

- [x] 1.1 Create `packages/state/src/stores/session.ts` with `ProjectSession` type and `useProjectSession` hook
- [x] 1.2 Move `projectContext`, `treeSnapshot`, `recentlyOpenedFiles` fields and all session actions (`setCurrentProject`, `closeProject`, `updateCurrentProject`, `recordFileAccess`, `removeFromRecentFiles`, `clearRecentFiles`) into the new store
- [x] 1.3 Copy persistence config for `recentlyOpenedFiles` into session store
- [x] 1.4 Move `useCurrentProject` hook to session store

## 2. Rename App Store

- [x] 2.1 Rename `ProjectState` → `AppState` in `stores/project.ts`
- [x] 2.2 Rename `useProjectStore` → `useAppStore` in `stores/project.ts`
- [x] 2.3 Remove session fields and actions from `stores/project.ts`
- [x] 2.4 Update `partialize` to remove `recentlyOpenedFiles` from app store persistence

## 3. Update Re-exports

- [x] 3.1 Update `packages/state/src/index.ts` to re-export `useAppStore` (as `useAppStore`) and `useProjectSession` (as `useProjectSession`)
- [x] 3.2 Add backward-compatible `useProjectStore` alias pointing to `useAppStore` (optional, or just update consumers)

## 4. Update All Consumers

- [x] 4.1 `EditorPage.tsx`: `useProjectStore` → `useAppStore` for `lastProjectId`, `hydrated`; `useProjectSession` for `projectContext`
- [x] 4.2 `EditorCenterPanel.tsx`: `useProjectStore` → `useProjectSession` for `projectContext`, `recordFileAccess`
- [x] 4.3 `RecentlyOpenedFilesBar.tsx`: `useProjectStore` → `useProjectSession` for `recentlyOpenedFiles`, `recordFileAccess`, `removeFromRecentFiles`
- [x] 4.4 `FileExplorer.tsx`: `useProjectStore` → `useProjectSession` for `treeSnapshot`; `useCurrentProject` unchanged
- [x] 4.5 `useProjectActions.ts`: `useProjectStore` → `useAppStore` for `createNewProject`; `useProjectSession` for `setCurrentProject`, `closeProject`
- [x] 4.6 `ExportMenu.tsx`: `useProjectStore` → `useProjectSession` for `projectContext`
- [x] 4.7 `ProjectMenu.tsx`: `useProjectStore` → `useProjectSession` for `projectContext`
- [x] 4.8 `StatusBarLeft.tsx`: `useProjectStore` → `useProjectSession` for `projectContext`
- [x] 4.9 `ProjectSettingsDialog.tsx`: `useProjectStore` → `useProjectSession` for `projectContext`, `updateCurrentProject`, `closeProject`
- [x] 4.10 `MonacoEditor.tsx`: `useProjectStore` → `useProjectSession` for `projectContext`
- [x] 4.11 `use-file-content.ts`: `useProjectStore` → `useProjectSession` for `projectContext`
- [x] 4.12 `apps/app/src/app.tsx`: `useProjectStore` → `useProjectSession` for `projectContext`; `useAppStore` for `createNewProject`

## 5. Verify

- [x] 5.1 Run typecheck across the workspace
- [x] 5.2 Verify no remaining references to `useProjectStore` or `ProjectState`
