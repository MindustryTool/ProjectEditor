## Why

The export button currently triggers an immediate download with a fixed filename (`<project-name>.zip`). Users have no way to customize the filename before downloading, which is inconvenient when managing multiple export versions or organizing output files.

## What Changes

- `ExportMenu` button click opens a dialog instead of triggering immediate download
- Dialog contains an editable text input for the zip filename (pre-filled with `<project-name>.zip`)
- Dialog contains a "Download" button that triggers the export and download
- Dialog contains a "Cancel" button that closes the dialog without exporting
- The existing export logic and ZIP creation remain unchanged — only the UI flow changes

## Capabilities

### New Capabilities
- `export-dialog`: Dialog component that lets users customize the export filename before downloading

### Modified Capabilities
- `project-export`: The "Export button triggers export and download" requirement changes — button now opens a dialog instead of immediately downloading

## Impact

- **Modified**: `apps/web/src/components/editor/ExportMenu.tsx` — add dialog state and UI
- **Possible new**: `apps/web/src/components/editor/ExportDialog.tsx` — dialog component
- **Unchanged**: `packages/core/src/exporter.ts`, `packages/core/src/json-exporter.ts`, `packages/zip/` — core export and ZIP logic stays the same
- **Unchanged**: `EditorShell.tsx` — ExportMenu usage stays the same
