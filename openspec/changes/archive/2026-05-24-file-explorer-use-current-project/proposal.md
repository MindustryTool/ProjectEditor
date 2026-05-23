## Why

The file explorer currently renders from a static JSON tree, which can drift from the active project state and ignores runtime filesystem changes. Folder clicks also pollute `?path=` navigation, making deep browsing cumbersome when only files should drive the editor selection.

## What Changes

- File explorer directory tree is derived from the current project’s cached file-tree snapshot (via `useCurrentProject()`), not from `jsonProjectTree`.
- Clicking a folder toggles expand/collapse without writing to the `?path=` URL query parameter.
- Clicking a file sets selection and syncs the selected file path to `?path=`.
- Initial selection still hydrates from `?path=` on mount (when it points to a file that exists in the snapshot).

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `file-explorer`: Render the tree from the current project snapshot; only file selections update `?path=` while folder clicks only expand/collapse.

## Impact

- UI: `apps/web` editor left panel file explorer behavior and selection semantics.
- State/data: consumes `useCurrentProject()` snapshot instead of `@project/fs` static `jsonProjectTree`.
- Routing: `nuqs` query state updates only on file selection; folder interactions become purely local UI state.
