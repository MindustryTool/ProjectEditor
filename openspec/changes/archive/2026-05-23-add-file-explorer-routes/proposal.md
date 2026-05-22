## Why

The editor's left panel currently shows a hardcoded flat list of two example files. A proper file explorer with the Mindustry mod directory structure makes the tool feel like a real IDE, and syncing the selected path to the URL enables deep-linking, browser back/forward navigation, and future state persistence.

## What Changes

- Install `nuqs` and wrap the app with `<NuqsAdapter>` in `__root.tsx`
- Create a `FileExplorer` component rendering the Mindustry mod directory tree (mod.hjson, content/{items,blocks,liquids,units}, maps, bundles, sounds, schematics, scripts, sprites-override, sprites)
- Sync selected file/folder path to URL query param `?path=` using nuqs
- Replace the hardcoded file list in EditorPage's left panel with the new FileExplorer

## Capabilities

### New Capabilities
- `file-explorer`: Static file tree explorer in the editor left panel showing the Mindustry mod directory structure with expandable folders and file/folder selection synced to URL query params
- `nuqs-integration`: nuqs library installed and wired via NuqsAdapter in the root route for URL query state management

### Modified Capabilities
- `editor-layout`: Left panel content changes from hardcoded placeholder list to the FileExplorer component

## Impact

- New dependency: `nuqs`
- Modified file: `apps/web/src/routes/__root.tsx` — add NuqsAdapter wrapper
- New file: `apps/web/src/components/editor/FileExplorer.tsx` — tree component
- New file: `apps/web/src/components/editor/file-explorer-data.ts` — static tree data
- Modified file: `apps/web/src/components/editor/EditorPage.tsx` — replace inline file list with FileExplorer
- Modified file: `apps/web/src/components/editor/index.ts` — export new component
