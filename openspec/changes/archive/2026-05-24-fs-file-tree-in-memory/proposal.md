## Why

The editor currently defines the default project directory tree inside the web app, while filesystem code exposes only ad-hoc listing APIs. Centralizing the project tree model in the fs package and caching the tree enables consistent path semantics and reduces repeated directory walks.

## What Changes

- Move the default project tree model/data (currently in `apps/web/src/components/editor/file-explorer-data.ts`) into `packages/fs` so it can be shared across packages.
- **BREAKING**: Extend `FileEntry` to include `path` (full, absolute path within the underlying VFS namespace).
- **BREAKING**: Change `ProjectFileSystem.listFiles()` to return `FileEntry[]` instead of `string[]`.
- Update `ProjectFileSystem` to load and keep the full project file tree in memory as `FileEntry[]`, and serve `listFiles()` results from this cache.
- Update web/editor callers to consume the new `FileEntry`-based APIs.

## Capabilities

### New Capabilities

- `project-file-tree-cache`: Project-scoped filesystem exposes an in-memory cached file tree (flat `FileEntry[]`) with full-path entries.

### Modified Capabilities

- `virtual-file-system`: `FileEntry` shape and `ProjectFileSystem.listFiles()` return type and path semantics change.

## Impact

- `packages/fs`: type changes (`FileEntry`), `ProjectFileSystem.listFiles()` signature change, new file-tree cache behavior, moved shared project tree data/model.
- `apps/web`: file explorer and any code consuming `listFiles()` / `FileEntry` must be updated to the new return type and `path` field.
- Downstream packages: any usage of `FileEntry` from `readdir()` results must adapt to the new type.
