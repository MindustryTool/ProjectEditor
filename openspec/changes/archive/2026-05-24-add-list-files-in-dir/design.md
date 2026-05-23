## Context

`ProjectFileSystem` wraps `VirtualFileSystem` and already provides convenient helpers like `readTextFile`, `readJsonFile`, and project-root path scoping. Several features need to traverse a directory tree and collect all files, which currently requires each caller to implement recursive `readdir()` traversal and handle path normalization themselves.

## Goals / Non-Goals

**Goals:**
- Provide a single, reusable `ProjectFileSystem` helper for collecting file paths under a directory.
- Make returned paths consistently formatted (project-relative, no leading `/`) so downstream code (e.g., export) can use them directly.
- Keep `VirtualFileSystem` unchanged; build on top of existing `readdir()` behavior.

**Non-Goals:**
- Adding new capabilities to `VirtualFileSystem` (e.g., globbing, streaming directory walks).
- Changing OPFS adapter semantics (error handling, ordering guarantees).
- Adding tests as part of this change.

## Decisions

- **API shape**: Add `ProjectFileSystem.listFiles(dir, { recursive? }) -> Promise<string[]>`.
  - Rationale: Most call sites only need file paths; returning paths (not file contents) keeps it composable with existing `readFile` / `readTextFile`.
  - Alternative: return `FileEntry[]` with full paths. Rejected because callers then still need to filter and normalize.
- **Path normalization**: Normalize inputs to accept `""`, `"/"`, `"subdir"`, or `"/subdir"`, and return paths without a leading `/`.
  - Rationale: Matches existing patterns in exporters (strip leading `/` before using paths externally).
- **Traversal strategy**: Depth-first traversal implemented on top of `readdir()`; include only `kind === "file"` entries.
  - Rationale: Minimal surface area and avoids introducing concurrency/memory complexity.

## Risks / Trade-offs

- **[Risk] Ambiguous path conventions across callers** → **Mitigation**: Document the output format in the spec (project-relative, no leading `/`) and keep the implementation consistent.
- **[Risk] Very large directories lead to large arrays in memory** → **Mitigation**: Keep this helper simple for now; if needed later, introduce an async iterator-based walk API as a separate change.
