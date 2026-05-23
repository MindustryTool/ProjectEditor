## Context

`ProjectFileSystem` currently exists as a thin convenience wrapper around `VirtualFileSystem` with 6 text/JSON helper methods. It does not appear on the `ProjectContext` type — consumers still see the raw `VirtualFileSystem` and must manually import `TextDecoder`/`TextEncoder`/`JSON.parse` for basic file operations. Moreover, `VirtualFileSystem` is path-unaware at the project level — it accepts arbitrary absolute paths with no project root scoping. The path-prefixing logic (e.g., `/projects/<id>/mod.hjson`) would be duplicated across every call site.

## Goals / Non-Goals

**Goals:**
- `ProjectContext.fs` typed as `ProjectFileSystem` (not `VirtualFileSystem`).
- `ProjectFileSystem` accepts `ProjectInfo` and auto-scopes all paths to a project subdirectory (e.g., `/projects/<project.id>/`).
- `ProjectFileSystem` delegates all `VirtualFileSystem` methods (readFile, writeFile, delete, mkdir, readdir, stat, exists, rename, move, copy, watch) with scoped paths so it is a full drop-in replacement.
- Existing text/JSON convenience methods preserved and also scoped.
- Factory `createProjectFileSystem(projectInfo)` exported.

**Non-Goals:**
- Changing `OPFSAdapter` or the `VirtualFileSystem` interface itself.
- Adding new storage backends.
- Changing project serialization or `saveProject`.

## Decisions

1. **Path scoping via project root prefix** — `ProjectFileSystem` stores a `projectRoot` computed as `/projects/<project.id>/`. Every delegated call prepends this root to the given relative path. This means consumers pass `"mod.hjson"` and the VFS receives `"/projects/<id>/mod.hjson"`. Alternative considered: passing root handle to OPFSAdapter — but OPFSAdapter already takes a root handle; the project root is an additional layer above that.

2. **Constructor takes `ProjectInfo` + `VirtualFileSystem`** — Keeps the VFS injectable for testing. A static `create(projectInfo)` factory or a standalone `createProjectFileSystem(projectInfo)` function calls `createOPFSAdapter` internally.

3. **Full method delegation** — `ProjectFileSystem` re-exports every `VirtualFileSystem` method signature so consumers never need to import `VirtualFileSystem` directly. Each method wraps the path with `projectRoot`. Existing convenience methods (`readTextFile`, `writeTextFile`, `readJsonFile`, `writeJsonFile`, `copyFile`, `exists`) use the delegated members internally.

4. **No getRawVfs() escape hatch** — If code needs the raw un-scoped VFS, it should go through a separate mechanism (e.g., a dedicated utility). The default path scoping is intentional to prevent path mistakes.

## Risks / Trade-offs

- [Breaking change] `ProjectContext.fs` type change requires updating all references to `projectContext.fs`. Mitigation: there are only 3 files to change (state package, EditorPage, and the `ProjectFileSystem` itself).
- [Path double-prefixing] A consumer could accidentally pass a full path that already includes the project root. Mitigation: `ProjectFileSystem` strips any leading `/projects/<id>/` prefix before adding it, making calls idempotent.
