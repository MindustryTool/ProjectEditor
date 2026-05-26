## Why

Users frequently navigate between files in a Mindustor project, but there is no way to quickly return to a previously opened file. A "Recently Opened Files" bar provides quick access to recently viewed files, reducing navigation overhead and improving editing workflow.

## What Changes

- Add a `recentlyOpenedFiles` state to the project store: an ordered list of file paths with their last access timestamps, capped at 50 entries (LRU eviction)
- Extract `ProjectContext`-related state from the existing Zustand store into a dedicated `useProjectStore` definition in its own file under `packages/state/src/stores/`
- `recentlyOpenedFiles` is persisted to localStorage via Zustand persist middleware
- Render a horizontal bar of recently opened file tabs above the main editor content in `EditorCenterPanel`
- The bar displays file names, supports clicking to navigate, closing individual entries, and highlights the current file

## Capabilities

### New Capabilities
- `recently-opened-files-bar`: A horizontal bar of recently opened file tabs shown above the editor content, with LRU tracking, persistence, and cap at 50 entries
- `project-store-refactor`: Extract ProjectContext-related store logic into a dedicated store file

### Modified Capabilities

*(None — no existing capability requirements are changing)*

## Impact

- **`packages/state/src/stores/`**: New store file `project.ts` for ProjectContext-related state
- **`packages/state/src/index.ts`**: Re-export from new store; remove inline ProjectContext store definition
- **`apps/web/src/components/editor/EditorCenterPanel.tsx`**: Add recently opened files bar above main content
- **New component(s)**: `RecentlyOpenedFilesBar` UI component
- **Dependencies**: None new (uses existing Zustand, localStorage, and project path types)
