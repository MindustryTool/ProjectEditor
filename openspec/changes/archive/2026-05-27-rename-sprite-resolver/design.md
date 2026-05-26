## Context

The `SpritePicker` component is a stub returning `null`. The `resolveJsonContentImage()` helper maps content JSON paths to sprite PNG paths but uses an inconsistent naming convention. The `SpritePicker` needs to manage binary sprite files (read existing, accept uploads, delete), which the current `useFileContent` hook cannot handle (it only supports text content). The project filesystem (`ProjectFileSystem`) already supports binary `readFile`/`writeFile`/`delete` methods via `ArrayBuffer`.

## Goals / Non-Goals

**Goals:**
- Rename `resolveJsonContentImage` → `resolveContentSprite` everywhere (utils, importers, spec)
- Implement `SpritePicker.tsx` as a working panel component
- Support: view existing sprite, upload .png replacement, delete sprite
- Wire into `EditorRightPanel.tsx` for any content JSON path

**Non-Goals:**
- No preview editing of sprite dimensions or metadata
- No drag-and-drop upload (native `<input type="file">` is sufficient)
- No sprite sheet extraction or multi-frame support
- No change to how content JSON files store references to sprites

## Decisions

**Decision 1: Binary read via ProjectFileSystem directly, not useFileContent**
- `useFileContent` is text-only (string data). Sprites are binary PNG files.
- Components can access `fs` via `useCurrentProject()` from `@project/state` which exposes `projectContext.fs`.
- Use `fs.readFile(path)` → `ArrayBuffer` → `Blob` → `URL.createObjectURL()` for rendering.
- Use `fs.writeFile(path, data)` for saving uploaded PNGs.
- Use `fs.delete(path)` for removing the sprite.

**Decision 2: Check sprite existence via treeSnapshot**
- `useProjectSession` exposes `treeSnapshot: FileEntry[]`.
- Walk the tree to check if `sprites/<name>.png` exists.
- Avoids an extra async filesystem call; the tree is always synced via `file:changed` events.

**Decision 3: File upload via hidden `<input type="file" accept=".png">`**
- Native file input is simple, accessible, and requires no extra dependencies.
- Read uploaded file as `ArrayBuffer` via `FileReader.readAsArrayBuffer()`.
- No external upload library needed since files stay local (offline-first).

**Decision 4: Render sprite via URL.createObjectURL from ArrayBuffer**
- Read sprite bytes → create `Blob` → `URL.createObjectURL()` for `<img>` src.
- Revoke object URL on unmount/update to avoid memory leaks.

## Risks / Trade-offs

- **Memory**: Large sprites held as ArrayBuffer in component state → Mitigation: only keep current sprite; revoke object URLs on cleanup.
- **Tree snapshot staleness**: After writing a sprite, the tree may not update immediately → Mitigation: `writeFile` already emits `file:changed` which triggers tree refresh.
- **File size**: No client-side size limit on upload → Acceptable for Mindustry sprites (typically < 1MB).
