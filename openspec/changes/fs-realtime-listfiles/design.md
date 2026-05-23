## Context

`ProjectFileSystem` is a project-scoped wrapper around `VirtualFileSystem` that currently supports a cached “tree snapshot” flow:

- `ProjectFileSystem.refreshTree()` walks the project directory structure using `readdir()` and emits a `FileEntry[]` snapshot via `onTreeSnapshotChange`.
- `ProjectFileSystem.listFiles()` does not read the filesystem; it filters the snapshot provided by `getTreeSnapshot`.

This creates two problems:

- `listFiles()` can return stale results when the underlying VFS changes but the snapshot is not refreshed.
- Snapshot lifecycle plumbing (`getTreeSnapshot`/`onTreeSnapshotChange`) is embedded into `ProjectFileSystem`, even though caching is a store/UI concern.

## Goals / Non-Goals

**Goals:**

- Make `ProjectFileSystem.listFiles()` reflect the current VFS state on every call.
- Remove the snapshot callback/getter fields from `ProjectFileSystem`.
- Keep the `VirtualFileSystem` interface unchanged (reuse existing `readdir()`).

**Non-Goals:**

- Introduce a new global caching layer in `packages/fs`.
- Redesign the file explorer UI; UI-side caching improvements can be done incrementally after this change.
- Change the shape of `FileEntry` / `FileStat`.

## Decisions

- **`listFiles()` becomes VFS-backed**
  - **Decision:** Implement `listFiles(dir, { recursive })` by calling `vfs.readdir()` starting at the scoped directory. For `recursive: true`, walk directories and aggregate results.
  - **Rationale:** `readdir()` is the authoritative source of current tree structure and already returns `FileEntry` objects with correct `path` information.
  - **Alternatives considered:**
    - Keep snapshot as the source of truth and “refresh on read” inside `listFiles()` → still couples caching and correctness to snapshot mechanics and encourages expensive full-tree refreshes.

- **Snapshot plumbing removed from `ProjectFileSystem`**
  - **Decision:** Remove `getTreeSnapshot` / `onTreeSnapshotChange` fields and the corresponding `ProjectFileSystemOptions`. `createProjectFileSystem()` no longer maintains an internal `localSnapshot`.
  - **Rationale:** A filesystem wrapper should not own app-store state. If UI needs cached trees, it should maintain them independently (e.g., via store state + VFS watch).
  - **Alternatives considered:**
    - Keep options for backwards compatibility but stop using them → keeps dead API surface and ambiguity around which source is authoritative.

- **Tree refresh responsibilities move upward**
  - **Decision:** Callers that require a full snapshot (e.g., initial explorer tree) should build it explicitly by calling `listFiles("/", { recursive: true })` (or equivalent store helper) instead of relying on `ProjectFileSystem.refreshTree()` side effects.
  - **Rationale:** Aligns snapshot creation with the component/store that consumes it and avoids hidden side effects on mutation operations.

## Risks / Trade-offs

- **More VFS calls for repeated listings** → Mitigation: allow UI/store to introduce its own caching keyed by directory + invalidation via VFS watch events.
- **Behavior change for consumers expecting snapshot consistency across calls** → Mitigation: document the change in the updated spec (`project-file-tree-cache`) and ensure callers that need stable results take their own snapshot.
- **Potential performance regression for recursive listings** → Mitigation: keep the walk iterative/async-safe, avoid repeated path normalization, and only traverse directories when `recursive: true`.
