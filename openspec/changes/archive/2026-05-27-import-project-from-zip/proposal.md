## Why

Users need to import Mindustry mod projects from `.zip` archives (e.g., downloaded from GitHub, shared by others, or exported via the existing export feature). Currently there is no import flow — the export feature exists but has no counterpart.

## What Changes

- **Add importer module** in `@project/core` (`src/importer.ts`) with an `importProject` function that:
  - Accepts a `Uint8Array` (zip file bytes)
  - Extracts entries via `extractZip()` from `@project/zip`
  - Searches for `mod.hjson` to determine the project root folder
  - Parses `mod.hjson` to derive project name and language
  - Returns parsed entries scoped to the root folder
- **Add "Import Project" menu item** in `ProjectMenu.tsx` that opens a file picker for `.zip` files
- **Wire up import flow** in the UI that reads the selected zip, calls `importProject`, creates a `ProjectInfo`, sets up the `ProjectFileSystem`, writes all files, and activates the project

## Capabilities

### New Capabilities
- `project-importer`: Core logic to parse a zip archive, find `mod.hjson`, extract project metadata, and return scoped file entries ready for import
- `project-import-ui`: UI for importing a project — file picker button in ProjectMenu, import dialog with progress/feedback

### Modified Capabilities

(none)

## Impact

- **New file**: `packages/core/src/importer.ts`
- **Modified**: `packages/core/src/index.ts` (export importer)
- **Modified**: `apps/web/src/components/editor/toolbar/ProjectMenu.tsx` (add import button)
- **Modified**: `apps/web/src/i18n/locales/en/translation.json` (add import strings)
