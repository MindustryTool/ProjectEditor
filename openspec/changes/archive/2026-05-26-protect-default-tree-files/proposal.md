## Why

Users can currently rename or delete any file/folder in the file explorer, including the default project template files (mod.hjson, content/, maps/, etc.). Accidentally renaming or deleting these breaks the project structure. The system should protect the default project tree files/folders from rename/delete to prevent invalid project states.

## What Changes

- Add a `defaultProjectTree` field of type `DefaultProjectFileTree` to the `ProjectFileSystem` class, storing a reference to the tree used during project initialization
- In `FileExplorer.tsx`, check if the target path matches a node in the default project tree and hide the rename/remove buttons for those items
- The protection must work for both files and folders (including protecting default folders from being renamed/deleted)

## Capabilities

### New Capabilities
- `default-tree-protection`: Protection of default project tree files and folders from rename/delete operations

### Modified Capabilities
- `file-rename-remove`: Rename/remove buttons are hidden for default project tree items
- `file-explorer`: Action buttons conditionally rendered based on default tree membership

## Impact

- `packages/fs/src/index.ts` — Add `defaultProjectTree` property to `ProjectFileSystem` class; pass the `jsonProjectTree` reference during construction in `createProjectFileSystem`
- `apps/web/src/components/editor/left/FileExplorer.tsx` — Add path membership check against `context.fs.defaultProjectTree` to conditionally hide rename/remove buttons on default tree items
