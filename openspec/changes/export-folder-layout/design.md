## Context

JsonExporter places files flat in the ZIP (`mod.json`, `content/items.json`). No outer folder. The project name is available via `context.project` but currently ignored. ProjectInfoSchema only checks name length (1-100 chars), allowing names with spaces, slashes, and special chars that are invalid as filesystem paths.

A `sanitizeFilename` function already exists in ExportMenu.tsx using the rule `[a-zA-Z0-9._-]` — the schema validation should align with this.

## Goals / Non-Goals

**Goals:**
- All ZIP entries prefixed with `<project-name>/` so extraction creates a self-contained folder
- ProjectInfoSchema rejects names with characters outside `[a-zA-Z0-9._-]`
- Backward-compatible loading of existing projects with invalid names

**Non-Goals:**
- Modify `sanitizeFilename` in ExportMenu (already correct, already shipped)
- Add import-time sanitization in ExportMenu (not needed — validation guarantees clean names)

## Decisions

1. **Exporter reads `project.name` directly, does not sanitize**
   - Since the schema guarantees valid names, the exporter just prepends `project.name + "/"`
   - **Alternative considered**: Exporter double-sanitizes → rejected (violates DRY, hides schema bugs)

2. **Regex pattern in schema: `/^[a-zA-Z0-9._-]+$/`**
   - Matches `sanitizeFilename` allowed set exactly
   - Period `.` is allowed (it's valid in filenames, distinct from directory traversal)
   - **Alternative considered**: More restrictive (no `.`) → rejected (file extensions use periods)

3. **Auto-sanitize on project load for backward compatibility**
   - Existing projects with invalid names (e.g., "My Mod") must still load
   - When validating via `validateProject()`, replace invalid chars in name with `-` and trim, mirroring `sanitizeFilename` logic
   - This prevents load errors for saved projects

4. **No changes to ExportMenu filename flow**
   - Filename input already sanitizes on dialog open
   - The ZIP content folder name and the download filename are independent concerns

## Risks / Trade-offs

- [Existing data] Projects with names like "My Mod" saved in IndexedDB will be auto-sanitized to "My-Mod" on next load → Display name changes silently; mitigation: log a warning when name is altered
- [Cross-platform] `.` in folder names is fine on all OS → No concern
- [Max path length] Nesting under a folder increases ZIP entry paths by ~30 chars → NTFS 255-char limit still safe for typical project depths
