## Why

The create file dialog uses `.json` extension for content files, but Mindustry content files use `.hjson`. The template dropdown offers only generic templates — for "item" type, users should be able to select an existing item from the project or base game and clone its content.

## What Changes

- Change file extension for content types (`item`, `block`, `unit`, `effect`) from `.json` to `.hjson`
- Show extension info in the full path preview below the name input
- Replace the static template dropdown for `item` type with a dynamic selector listing project and base items from `useItems()`
- When an item is selected:
  - If `type === "project"`: read file content via `context.fs.readTextFile(path)`
  - If `type === "base"`: return empty string (async placeholder for future API call)
- Keep existing template functions for `block`, `unit`, `effect` types (unchanged from current behavior)
- Extend template loading to be async to support file reads
- Preview path updates to reflect the correct extension

## Capabilities

### New Capabilities
*(none — all changes modify existing capability)*

### Modified Capabilities
- `create-file-dialog`: extension format from `.json` to `.hjson`; item template selection now uses live item list with content cloning from project/base sources; template loading is now async

## Impact

- `apps/web/src/components/editor/left/FileExplorer.tsx` — `CreateFileForm` component: extension map, `useItems()` integration, async template content loading, preview path update
- `apps/web/src/components/editor/left/templates.ts` — may be kept for block/unit/effect but item template moves to `useItems()`-based selection
