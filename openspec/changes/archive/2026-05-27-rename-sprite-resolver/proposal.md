## Why

Currently, `resolveJsonContentImage()` resolves a content JSON path to a sprite PNG path, but the name is misleading — it uses "JsonContentImage" rather than "ContentSprite". The `SpritePicker` component is a stub that needs to be implemented to let users manage (view, pick, replace, remove) sprite images for content JSON files.

## What Changes

- **BREAKING**: Rename `resolveJsonContentImage()` to `resolveContentSprite()` in `~/lib/utils`
  - Update all imports and usages across the codebase
- **BREAKING**: Update the spec `content-sprite-resolver` to reflect the new name
- Implement `SpritePicker.tsx` component:
  - Uses `resolveContentSprite()` to derive sprite path from a content JSON path
  - Checks if sprite file exists via file tree snapshot
  - If sprite exists: renders the sprite image
  - If no sprite: shows a file picker for `.png` files
  - On picking a `.png`: writes it as the sprite file
  - Allows user to replace the sprite with a different `.png`
  - Allows user to remove the sprite file entirely
- Wire `SpritePicker` into `EditorRightPanel.tsx` for content JSON file paths

## Capabilities

### New Capabilities
- `sprite-picker-component`: Interactive sprite picker panel that renders, replaces, or removes sprite images for content JSON files, with file upload support

### Modified Capabilities
- `content-sprite-resolver`: Rename `resolveJsonContentImage` to `resolveContentSprite`, update spec scenarios to match new API name

## Impact

- `apps/web/src/lib/utils.ts` — function renamed
- `apps/web/src/components/editor/center/ContentList.tsx` — update import reference
- `apps/web/src/components/editor/panel/SpritePicker.tsx` — full implementation
- `apps/web/src/components/editor/EditorRightPanel.tsx` — wire in new panel
- `openspec/specs/content-sprite-resolver/spec.md` — update spec
- New: sprite binary file read/write via `ProjectFileSystem` (ArrayBuffer operations)
