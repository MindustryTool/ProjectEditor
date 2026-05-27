## Context

Export exists (`JsonExporter` → `createZip`) but there is no import counterpart. The zip extraction utilities (`extractZip`, `getEntryByName`, `getTextContent`) already exist in `@project/zip`. The `ProjectFileSystem` and project creation flow (via `createProjectFileSystem`, `saveProject`, `setCurrentProject`) are well-established patterns used by the existing project open/create flow.

## Goals / Non-Goals

**Goals:**
- Core `importProject` function in `@project/core` that parses a zip, finds `mod.hjson`, extracts project metadata, returns scoped entries
- "Import Project" menu item in `ProjectMenu` that opens a file picker, selects `.zip`, triggers import
- Full import flow: pick zip → extract → create project → write files → activate

**Non-Goals:**
- No drag-and-drop import (future enhancement)
- No automatic dependency resolution or mod compatibility checks
- No partial/failed-import rollback (import is all-or-nothing within the try/catch)

## Decisions

- **`importProject` in `@project/core`**: Follows the existing pattern where `getExporter` lives in core. The function returns a structured result (`ImportResult`) with parsed project info and entry list, rather than performing the write itself — this keeps core logic pure and leaves side effects (filesystem writes, store updates) to the UI layer.
- **`mod.hjson` as root marker**: Mindustry mods always have `mod.hjson` at the root. Finding it in the zip tells us the root folder and lets us derive project name/language from its contents.
- **File picker in ProjectMenu**: Follows the same pattern as the existing "Create Project" button. No separate dialog needed — the file picker is triggered directly on click, then the import runs with a loading state.

## Risks / Trade-offs

- **[Malformed zip]** If the zip is corrupt or missing `mod.hjson`, the import fails. Mitigation: validate early and surface an error message to the user.
- **[Zipbomb / large zip]** A very large zip could hang the UI during extraction. Mitigation: extraction is async and relatively fast with `fflate`; the UI enters a loading state during import.
- **[Duplicate project name]** If a project with the same name already exists. Mitigation: generate a unique project ID (already handled by `createProjectInfo`), and the name can have a suffix added.
