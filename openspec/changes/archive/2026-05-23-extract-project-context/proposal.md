## Why

The `Project` interface currently embeds `files: ProjectFile[]` inline, mixing the project model with file storage concerns. File operations need a proper abstraction over OPFS, and decoupling file state from the project model enables lazy loading, streaming, and persistence via a virtual file system. A `ProjectContext` consolidates the project, its filesystem, and event bus into one composable unit that replaces scattered state management.

## What Changes

- **BREAKING** Remove `files: ProjectFile[]` from the `Project` interface in `@project/core`
- **BREAKING** Remove `ProjectFile` interface and `ProjectFileSchema` from `@project/core` and `@project/validation`
- Create new `VirtualFileSystem` interface in `@project/fs` that mirrors the existing `FileSystemAdapter` but with richer semantics (rename, move, copy, watch, stat)
- Create `OPFSAdapter` class implementing `VirtualFileSystem` using the Origin Private File System
- Create `EventBus` type and implementation in `@project/core` for file change events and cross-cutting communication
- Create `ProjectContext` interface bundling project metadata, VFS, and event bus
- Refactor `@project/state` Zustand store to hold `ProjectContext` instead of raw `Project`
- Move `ProjectFileSystem` convenience wrapper to use `VirtualFileSystem`

## Capabilities

### New Capabilities
- `virtual-file-system`: `VirtualFileSystem` interface and `OPFSAdapter` implementation for file I/O over the Origin Private File System
- `event-bus`: Lightweight `EventBus` type for publish/subscribe events (file changes, project saves, etc.)
- `project-context`: `ProjectContext` interface bundling `project: ProjectInfo`, `fs: VirtualFileSystem`, `events: EventBus`

### Modified Capabilities
- *(none — no existing specs in `openspec/specs/`)*

## Impact

- **`@project/core`**: Remove `ProjectFile`/`files` from `Project`; rename `Project` → `ProjectInfo` (lean metadata-only); add `EventBus` type
- **`@project/validation`**: Remove `ProjectFileSchema`; update `ProjectSchema` to remove `files`
- **`@project/fs`**: Add `VirtualFileSystem` interface; add `OPFSAdapter` class; keep `ProjectFileSystem` as a convenience layer
- **`@project/storage`**: Extend OPFS usage beyond `getOPFSRoot()`
- **`@project/state`**: Replace `Project` with `ProjectContext`; add context init actions
- **`apps/app`**: Update imports and usages to work with `ProjectContext` instead of `Project`
