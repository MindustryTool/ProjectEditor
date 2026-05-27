## Why

When a file is deleted from the project, its tab in the recently opened files bar still looks the same as existing files — there's no visual cue that the file no longer exists. This misleads users into clicking a tab that won't open anything useful. Adding a line-through and red text for missing files provides immediate feedback.

## What Changes

- Modify `RecentlyOpenedFilesBar.tsx` to detect if a recent file path still exists in the project tree snapshot
- If the file does not exist, render its tab with `line-through` text decoration and `text-destructive` (red) color
- Clicking a missing file tab still navigates to that path (preserves existing behavior)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities
- `recently-opened-files-bar`: Add visual indicator for missing/deleted files — line-through + red text on tabs whose file no longer exists in the project tree

## Impact

- **Modified**: `apps/web/src/components/editor/recently-opened/RecentlyOpenedFilesBar.tsx`
