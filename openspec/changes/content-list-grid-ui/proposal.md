## Why

ContentList currently renders as a bare flat list of filenames with no visual hierarchy, making it hard to browse content items. JSON content items (e.g., `content/items/copper.json`) should show their associated sprite as a preview thumbnail, and folder navigation should work via URL query params.

## What Changes

- **ContentList** changes from a flat list to a responsive grid layout showing file/folder cards
- **JSON content items** show a sprite image preview derived from the file name (e.g., `copper.json` → `/sprites/copper.png`)
- **Folder click** updates the `path` URL query param via `nuqs` to navigate into the folder
- **New shared helper** `resolveJsonContentImage` in `~/lib/utils` resolves the sprite path for a given JSON content path
- **CreateNewContentDialog** is restyled/relocated to fit the new grid card UI (e.g., as a "New Content" card at the top)

## Capabilities

### New Capabilities
- `content-grid-list`: Grid-based content file/folder browser with thumbnail previews and folder navigation
- `content-sprite-resolver`: Shared utility to resolve sprite image paths from content JSON file paths

### Modified Capabilities
- (none)

## Impact

- `apps/web/src/components/editor/center/ContentList.tsx` — rewritten grid layout, folder navigation, image preview
- `apps/web/src/components/editor/center/CreateNewContentDialog.tsx` — restyled for grid card UI
- `apps/web/src/lib/utils.ts` — new `resolveJsonContentImage` function added
