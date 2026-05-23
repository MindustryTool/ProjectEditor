## Why

Currently, the export menu has two placeholder items ("Export as JSON", "Export as Image") with no actual export logic. Each project language (JSON, Java, JavaScript) needs different export behavior, and there is no common interface for exporting. This change introduces a unified exporter interface and a JSON exporter implementation, replacing the fragmented placeholder menu with a single export action that adapts to the project language.

## What Changes

- Add an `Exporter` interface in `@project/core` with a method that receives `ProjectContext` and returns a ZIP file
- Implement `JsonExporter` that collects all files from the current folder and creates a ZIP archive
- Select the correct exporter based on project language
- Update `ExportMenu` to show a single export button (remove "Export as Image")
- Remove `exportMenu.exportImage` translation key from locale files

## Capabilities

### New Capabilities
- `project-export`: Base export interface, JSON exporter implementation, and language-aware exporter selection for Mindustry mod projects

### Modified Capabilities
- `toolbar-menus`: Export menu changes from two placeholder items to a single export button wired to the exporter system

## Impact

- `@project/core`: New `Exporter` interface and `JsonExporter` class, depends on `@project/zip`
- `@app/web`: `ExportMenu.tsx` rewired to use exporter system, single button instead of dropdown
- `@project/zip`: No changes (already provides `createZip`)
- Locale files: Remove `exportMenu.exportImage` key, keep `exportMenu.exportJson` (or rename)
