## 1. nuqs Setup

- [x] 1.1 Install `nuqs` dependency
- [x] 1.2 Wrap app with `<NuqsAdapter>` in `__root.tsx` shell component

## 2. File Explorer Data

- [x] 2.1 Create `file-explorer-data.ts` with static TreeNode type and tree structure

## 3. File Explorer Component

- [x] 3.1 Create `FileExplorer.tsx` with recursive tree rendering, expandable folders, file/folder icons
- [x] 3.2 Wire selection to `?path=` query param via `useQueryState` from nuqs
- [x] 3.3 Read initial selection from URL on mount

## 4. Integration

- [x] 4.1 Replace hardcoded file list in EditorPage.tsx left panel with FileExplorer
- [x] 4.2 Add FileExplorer export to editor components index.ts
