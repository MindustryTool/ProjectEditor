## Why

`ProjectContext.fs` is currently typed as `VirtualFileSystem` — a general-purpose low-level interface with raw `ArrayBuffer`/`BufferSource` operations. Callers must manually handle text encoding, JSON parsing, and path scoping. A `ProjectFileSystem` class already exists in `@project/fs` as a convenience wrapper, but it is never used as the `fs` type on `ProjectContext`, and it does not accept `ProjectInfo` or enforce project-scoped paths. This forces every consumer to repeat boilerplate (encoding, path prefixing) and leaves project boundaries unenforced at the type level.

## What Changes

- **BREAKING** — `ProjectFileSystem` constructor now accepts `ProjectInfo` alongside `VirtualFileSystem`; paths are scoped to a project subdirectory (e.g., `/projects/<id>/`) automatically.
- **BREAKING** — `ProjectContext.fs` type changes from `VirtualFileSystem` to `ProjectFileSystem`.
- `ProjectFileSystem` gains all `VirtualFileSystem` methods as delegated members so it can fully replace the interface.
- `createOPFSAdapter` usage is moved behind a `createProjectFileSystem(projectInfo)` factory.
- `EditorPage.tsx` and `@project/state` store updated to use `ProjectFileSystem`.
- `VirtualFileSystem` remains as an internal abstraction implemented by `OPFSAdapter`; external consumers use `ProjectFileSystem`.

## Capabilities

### New Capabilities

- *None*

### Modified Capabilities

- `project-context`: `ProjectContext.fs` field type changes from `VirtualFileSystem` to `ProjectFileSystem`; construction of the context changes.
- `virtual-file-system`: `ProjectFileSystem` becomes the public API; `VirtualFileSystem` becomes an internal implementation detail.

## Impact

- `packages/fs/src/index.ts` — `ProjectFileSystem` reworked: takes `ProjectInfo` + `VirtualFileSystem`, auto-scopes paths by project ID, delegates all VFS methods
- `packages/state/src/index.ts` — `ProjectContext.fs` type → `ProjectFileSystem`; `createNewProject` builds a `ProjectFileSystem` instead of raw `OPFSAdapter`
- `apps/web/src/components/editor/EditorPage.tsx` — uses `ProjectFileSystem` in constructed context
- All downstream consumers of `ProjectContext.fs` benefit from project-scoped paths and text/JSON helpers
