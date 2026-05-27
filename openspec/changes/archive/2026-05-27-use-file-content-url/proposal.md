## Why

Two components (`ContentList.tsx`, `SpritePicker.tsx`) manually manage `URL.createObjectURL()` and `URL.revokeObjectURL()` lifecycle for sprite images. This is repetitive, error-prone (easy to forget revoke), and violates DRY. An image-specific React hook can abstract this pattern — accept an `ArrayBuffer`, return a managed `blob:` URL for `<img>` tags that auto-revokes on data change or unmount.

## What Changes

- Create `useFileContentImageUrl` hook in `@project/state` that:
  - Accepts `ArrayBuffer | null` (sprite image data)
  - Returns a memoized `blob:` URL string (`string | null`)
  - Hardcodes MIME type as `image/png`
  - Auto-revokes the previous URL when data changes
  - Auto-revokes on unmount
- Export the hook from `@project/state` index
- Refactor `SpritePreview` in `ContentList.tsx` and `SpriteViewer` in `SpritePicker.tsx` to use the new hook

## Capabilities

### New Capabilities
- `file-content-image-url-hook`: Image-only React hook that manages blob URL creation and automatic disposal via `createObjectURL`/`revokeObjectURL`

### Modified Capabilities

(none)

## Impact

- **New file**: `packages/state/src/hooks/use-file-content-image-url.ts`
- **Modified**: `packages/state/src/index.ts` (add export)
- **Refactored**: `apps/web/src/components/editor/center/ContentList.tsx`, `apps/web/src/components/editor/panel/SpritePicker.tsx`
