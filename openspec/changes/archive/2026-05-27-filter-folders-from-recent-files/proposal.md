## Why

The recently-opened files bar displays tabs for both files and folders. Folders cannot be "opened" as editor tabs — clicking a folder tab sets the path to a directory, which the editor cannot render. This creates a broken UX where folder entries appear in the bar but don't correspond to actual openable files.

## What Changes

- `recordFileAccess()` will skip recording if the path corresponds to a directory (not a file)
- The check uses `treeSnapshot` from the session store — only entries with `kind === "file"` are recorded
- This prevents folders from ever entering `recentlyOpenedFiles`, keeping the data clean

## Capabilities

### New Capabilities
- `filter-recent-files`: Filter recently-opened entries to show only files, using the project's tree snapshot to discriminate files from directories

### Modified Capabilities
<!-- No existing specs need requirement changes -->

## Impact

- **File**: `apps/web/src/components/editor/recently-opened/RecentlyOpenedFilesBar.tsx` — add guard before `recordFileAccess()` to skip folders
- **State**: No changes to `packages/state/` — the store action is unchanged; the guard lives at the call site
