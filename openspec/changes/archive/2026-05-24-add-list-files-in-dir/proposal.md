## Why

Multiple features (e.g., export) need to collect all files under a directory. Today this requires each caller to hand-roll recursive `readdir()` traversal, which is repetitive and easy to get subtly wrong (path normalization, leading slashes).

## What Changes

- Add a `ProjectFileSystem.listFiles()` convenience method to list file paths under a directory, with optional recursive traversal.
- Keep the underlying `VirtualFileSystem` interface unchanged (the new API is project-scoped convenience on top of `readdir()`).

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `virtual-file-system`: Extend `ProjectFileSystem` convenience API with a `listFiles()` helper for collecting file paths in a directory (optionally recursive).

## Impact

- `packages/fs`: Update `ProjectFileSystem` with the new convenience method.
- Potential follow-ups: exporters and other callers may adopt the new helper to reduce duplicated traversal logic.
