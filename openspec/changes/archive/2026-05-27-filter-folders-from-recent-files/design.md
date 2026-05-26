## Context

The `RecentlyOpenedFilesBar` renders tabs for all entries in `recentlyOpenedFiles` regardless of whether the path points to a file or directory. Clicking a folder tab sets the path query parameter to a directory, which the editor cannot render as content. The session store already maintains `treeSnapshot` — a flat `FileEntry[]` array where each entry has a `kind` field (`"file" | "directory"`).

## Goals / Non-Goals

**Goals:**
- Prevent folder paths from being recorded into `recentlyOpenedFiles`
- Use the existing `treeSnapshot` to determine file vs directory before recording

**Non-Goals:**
- No changes to the `recordFileAccess` store action itself
- No changes to the session store or fs package
- No migration of existing persisted data

## Decisions

1. **Guard at record time, not filter at render time** — The check is placed before `recordFileAccess()` is called in the component. This is simpler and prevents folders from polluting the persisted data entirely. The alternative (filtering at render) was rejected because it still persists folders and requires a second selector/subscription for filtering.

2. **Use `treeSnapshot` lookup over alternative approaches** — Alternatives considered:
   - Checking the file system directly: slower, async, more complex
   - Adding a `kind` field to `RecentFileEntry`: requires store change, migration, and duplicates data already in `treeSnapshot`
   - Using `treeSnapshot.find()` by path: O(n) but n is small (project file count), simple, synchronous, and uses existing state

3. **Same-store subscription** — `treeSnapshot` is already in `useProjectSession`, so no new store or context needed. The component just adds a second selector.

## Risks / Trade-offs

- [Stale snapshot] If `treeSnapshot` hasn't loaded yet, folder clicks would be recorded before the guard is effective. Mitigation: Snapshot loads near-instantly on project open; this is an edge case that resolves itself.
- [Dual call sites] `recordFileAccess` may be called from other components in the future, each needing the same guard. Mitigation: Acceptable for now — the guard is trivial and the function is only called in this one place. If more call sites emerge, the guard can be moved into the store action later.
