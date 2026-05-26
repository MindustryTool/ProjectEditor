## Context

The `recordFileAccess` action in `packages/state/src/stores/session.ts` calls `touchEntry()` which removes the existing entry for a path and prepends a new entry at position 0. On every file navigation, the recently-opened-files bar reorders — tabs jump around, making the bar feel unstable.

The recently-opened-files bar in `RecentlyOpenedFilesBar.tsx` renders entries in array order. Any reordering in the store directly causes visual tab rearrangement.

## Goals / Non-Goals

**Goals:**
- Re-accessing an existing file updates its `lastAccessedAt` timestamp without changing its position in the array
- New files (first access) are still added to the recently-opened list
- LRU eviction still works (oldest timestamp evicted when > 50)
- No changes to the UI component — only the store utility function is modified

**Non-Goals:**
- Adding sort/filter controls to the bar
- Changing the eviction strategy
- Altering persistence format

## Decisions

1. **Update in-place over remove+prepend** — Change `touchEntry` to update `lastAccessedAt` on the existing entry without moving it, instead of filtering + prepending. For new entries, append to the end (preserves insertion order).

   Alternatives considered:
   - Prepend new entries at position 0 and only skip reorder for existing entries. Rejected because mixing "new at front" with "existing stays put" creates inconsistent ordering.
   - Add a separate `sort` mechanism. Rejected as over-engineering for this use case.

2. **Append new entries to the end** — When a file is accessed for the first time, it is appended to the end of the array. This gives a stable "first-opened order" that only changes when entries are evicted.

3. **evictLRU unchanged** — The eviction function already sorts by timestamp descending when over capacity. No change needed — it still evicts the oldest entry correctly regardless of array order.

## Risks / Trade-offs

- **[Display order no longer = recency order]** Users can't visually identify most recently accessed file by position. Mitigation: the "current file" highlight (active tab styling) already provides this feedback.
- **[LRU eviction may remove recently-moved items]** Since items don't move, a file accessed yesterday that stays at position 5 might be evicted before a file accessed 2 days ago at position 50. Mitigation: eviction sorts by timestamp, so it always picks the true oldest entry.
