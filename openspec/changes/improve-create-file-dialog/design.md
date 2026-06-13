## Context

The `CreateFileDialog` currently lets users create files/folders at a `targetPath` passed from the parent. For content types (item, block, unit, etc.), it shows a `TemplateSelector` dropdown to clone existing content entries. The user's target folder is whatever folder they right-clicked, which may not be the correct content subdirectory (e.g., `content/units/` for units).

Users often want to import a file from disk rather than clone from existing content. The template cloning approach also adds complexity with async refs and composite hooks.

## Goals / Non-Goals

**Goals:**
- Add a folder picker dropdown that, for content types, restricts creation to content-type-appropriate subdirectories
- Remove the `TemplateSelector` component and all template-related logic (refs, hooks, async content loading)
- Add a file upload/import button that reads a file from disk and writes it to the project FS
- Clean up unused props, state, and imports

**Non-Goals:**
- Changing the parent interfaces (`FileExplorerProvider`, `NoOpenedFileScreen`)
- Modifying the project FS or content validation logic
- Adding batch/multiple file import

## Decisions

1. **Content type → folder mapping as a static record** instead of dynamic FS enumeration
   - Rationale: The project tree structure is well-defined in `packages/fs/src/index.ts`. A static map is simpler, testable, and avoids async lookups. Dynamic scanning would also be fragile if the user hasn't created the content directory yet.
   - Map: `{ item: "content/items", block: "content/blocks", unit: "content/units", liquid: "content/liquids", status: "content/status", sector: "content/sectors", "env-block": "content/env-blocks", effect: "content/effects" }`

2. **Folder picker reads subdirectories from the FS** (only for the root content folder)
   - Rationale: For `unit`, the user should be able to target `content/units` or any subfolder like `content/units/my-faction`. We list existing subdirectories via `context.fs.readDir()`.
   - Fallback: If no subdirectories exist, only the root content folder is shown.

3. **Use native `<input type="file">`** for import/upload instead of a custom drop zone
   - Rationale: Simplest implementation, works on all platforms, accessible. Matches patterns in `SpriteUploader` and `NewCanvasDialog`.

4. **Remove `TemplateSelector` entirely** rather than conditionally hiding it
   - Rationale: The component is only used in `CreateFileDialog`. Removing it eliminates dead code and reduces bundle size.

## Risks / Trade-offs

- **[Risk] User tries to create a unit in `content/units` but the folder doesn't exist yet** → Mitigation: The picker always includes the root content folder as a valid target, and we create the file there successfully. Subdirectories are optional.
- **[Risk] File upload writes binary files** → Mitigation: The current FS supports reading files as text. For binary files, we'd need ArrayBuffer support. First iteration only supports text files (hjson/json); binary import is future work.
- **[Risk] Removing template selector removes cloning workflow** → Mitigation: Users can now import files from disk instead, which covers the same use case more directly. If cloning is needed later, it can be added without templates (just copy the file).
