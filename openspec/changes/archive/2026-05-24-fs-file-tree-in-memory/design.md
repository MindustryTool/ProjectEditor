## Context

The web editor currently embeds a hard-coded “default project tree” model in `apps/web`, while `packages/fs` exposes directory listing primitives and a `ProjectFileSystem.listFiles()` convenience method that returns string paths.

This creates duplication (tree semantics live outside the fs layer) and makes it harder to standardize path/entry representation across the app (e.g., “is this a file or directory?”, “what is the full scoped path?”). Additionally, repeated directory walks can become expensive as project size grows.

## Goals / Non-Goals

**Goals:**
- Centralize the default project tree model/data in `packages/fs` so both UI and other packages can reuse it.
- Standardize `FileEntry` so an entry always includes both identity (`name`) and location (`path`), with an explicit `kind`.
- Update `ProjectFileSystem` to eagerly load the full project tree into memory once, and use this cache to serve `listFiles()` results.
- Preserve existing project path scoping rules in `ProjectFileSystem` (project-root prefixing for relative paths).

**Non-Goals:**
- Implement a real-time incremental watcher-driven cache invalidation strategy (OPFS watch is currently a no-op).
- Define or enforce additional constraints on Mindustry mod structure beyond what the file explorer already requires.
- Introduce new external dependencies or persistence layers.

## Decisions

- **Move the tree model into `packages/fs/src/index.ts`**
  - Rationale: The user request explicitly asks to move `file-explorer-data.ts` into the fs package entrypoint. Keeping it in the public fs entry simplifies imports for UI code and other packages.
  - Alternative: Create a new module (e.g., `packages/fs/src/project-tree.ts`) and re-export it from `index.ts`. This keeps `index.ts` smaller, but still satisfies the public API requirement. If `index.ts` grows too large, this refactor remains available later.

- **`FileEntry` includes `path` (full scoped path)**
  - Decision: `FileEntry` becomes `{ name: string; path: string; kind: "file" | "directory" }`.
  - Rationale: Consumers frequently need the full path for subsequent operations (open, stat, rename) and for UI selection. Making `path` part of the entry reduces repeated string concatenation and ambiguity about whether a returned path is scoped/relative.
  - Path semantics: `path` is the full VFS path, including the leading `/` and any project scoping prefix (e.g., `/projects/<projectId>/content/items`).
  - Alternative: Keep `FileEntry` unchanged and introduce a new `ProjectFileEntry` type for `ProjectFileSystem`. This avoids breaking VFS-level APIs but increases type surface area and can fragment usage across the codebase.

- **`ProjectFileSystem` maintains a flat in-memory tree cache**
  - Decision: On construction (or via an explicit `init()` invoked by `createProjectFileSystem`), walk the project root and store all discovered entries in memory as a flat `FileEntry[]`.
  - Rationale: A flat list is simple to query/filter for `listFiles(dir, { recursive })` and can be transformed into a hierarchical tree for UI if needed. It also avoids complicated parent/child pointer maintenance.
  - Filtering behavior: `listFiles(dir, { recursive })` filters the cached entries by directory prefix and by depth when `recursive` is false. Returned results are `FileEntry[]`.
  - Alternative: Maintain a nested tree structure. This is convenient for UI, but requires more complex updates and a clear “directory node” representation.

## Risks / Trade-offs

- **[Breaking API changes]** → Mitigation: Update all TypeScript call sites in one change, and adjust relevant specs to reflect new contracts.
- **[Stale cache if files change]** → Mitigation: Provide a `refreshTree()` (or cache invalidation) hook and revisit incremental watching when OPFS watch becomes functional.
- **[Memory overhead for large projects]** → Mitigation: Keep cache as a flat list; consider lazy-loading or paging if project size becomes problematic.
- **[Path confusion between “full” and “relative”]** → Mitigation: Clearly document path semantics in specs and ensure `ProjectFileSystem.watch()` continues to emit relative-to-project paths if required by UI routing.
