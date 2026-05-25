## Why

The file explorer shows validation error/warning badges but gives no feedback about in-memory file buffer state. Users can't tell which files have unsaved edits (dirty) or are currently being saved, and error states from failed writes aren't visible in the tree. This makes it easy to lose edits or be confused about file state.

## What Changes

- File explorer shows a white dot next to filenames that have `isDirty === true`
- File explorer shows a yellow dot next to filenames that have `isSaving === true`
- File explorer renders the filename in red when `isError === true` (write/read failure)
- File explorer renders the filename in yellow when validation warnings exist
- **BREAKING**: Existing red/yellow validation badges show counts; the new filename colors are more prominent visual cues

## Capabilities

### New Capabilities
- (none — extends existing file-explorer capability)

### Modified Capabilities
- `file-explorer`: Add buffer status indicators (dirty dot, saving dot, error filename color, warning filename color) to tree items

## Impact

- `apps/web/src/components/editor/left/FileExplorer.tsx` — add `useFileContentStore` selector for buffer state per file; render indicators based on `isDirty`, `isSaving`, `isError`; update filename color based on `isError` and validation warnings
