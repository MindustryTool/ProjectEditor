## Why

Exported ZIPs place all files flat in the archive root (e.g., `mod.json`, `content/items.json`). When users extract multiple exports into the same directory, files from different projects collide. Nesting under a project-name folder keeps each export self-contained. Separately, the project name has no character restrictions, allowing names like `My/Mod` that produce invalid filesystem paths.

## What Changes

- **JsonExporter** prefixes all ZIP entry paths with `<project-name>/` so files are nested under a project folder
- **ProjectInfoSchema** adds a regex pattern to `name` field, restricting characters to `[a-zA-Z0-9._-]` (matching the existing `sanitizeFilename` rules)
- **BREAKING**: Project names containing invalid characters will fail validation on project load/create

## Capabilities

### New Capabilities
- `project-name-schema`: Pattern validation on project `name` to allow only filename-safe characters

### Modified Capabilities
- `project-export`: JsonExporter nests files under a `<project-name>/` folder inside the ZIP

## Impact

- **packages/validation/src/index.ts**: Add `v.regex()` pipe to `name` field in `ProjectInfoSchema`
- **packages/core/src/json-exporter.ts**: Read `context.project.name`, prefix all entry names with it
- **ExportMenu.tsx**: Sanitize filename changed already (previous change), no further changes needed
