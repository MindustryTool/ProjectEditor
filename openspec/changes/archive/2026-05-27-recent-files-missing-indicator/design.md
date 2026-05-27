## Context

`RecentlyOpenedFilesBar.tsx` already maintains a `filePaths` Set from the tree snapshot to check file existence. The `cn()` utility is already imported. This is a purely presentational change — no new state, stores, or data flow changes.

## Goals / Non-Goals

**Goals:**
- Visually distinguish tabs whose file no longer exists in the project tree
- Use existing `filePaths` Set (no new state or queries)
- Preserve all existing behavior (click navigation, close, active highlight)

**Non-Goals:**
- Not removing missing-file tabs automatically (user may want to see them to know what was deleted)
- Not changing click behavior — clicking still navigates to the path

## Decisions

- **Conditional className via `cn()`**: Add a `!filePaths.has(entry.path)` check inside the button's className to apply `line-through text-destructive` when the file is missing. This follows the existing pattern for conditional styling in the component.
- **No separate component or state**: The change is scoped to a single className condition — no need for new abstractions.

## Risks / Trade-offs

- **No polling for file deletions**: If the tree snapshot is stale, a recently-deleted file might still appear as existing. Mitigation: the tree snapshot is already updated on project structure changes, so this is unlikely.
