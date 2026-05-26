## Why

`recordFileAccess()` currently moves the accessed file to the first position (MRU at front). This reorders the recently-opened-files list on every navigation, making the bar unstable and disorienting — users expect files to stay in the order they originally appeared.

## What Changes

- **Modify `touchEntry` utility** in `packages/state/src/stores/session.ts` to update `lastAccessedAt` **in-place** instead of moving the entry to position 0
- **Update `recently-opened-files-bar` spec** to remove the requirement that re-accessed entries move to first position
- **Preserve LRU eviction** — when list exceeds 50, oldest entry is still evicted

## Capabilities

### New Capabilities

*(None — no new capabilities)*

### Modified Capabilities

- `recently-opened-files-bar`: Remove the requirement that re-accessing an existing file moves it to the first position. Update to require that `lastAccessedAt` is updated in-place.

## Impact

- **`packages/state/src/stores/session.ts`**: Change `touchEntry()` to mutate `lastAccessedAt` without changing array order
- **`openspec/specs/recently-opened-files-bar/spec.md`**: Remove scenario "Entry is moved to first position on re-open"
- **`apps/web/src/components/editor/recently-opened/RecentlyOpenedFilesBar.tsx`**: No changes expected — reads from store, unaffected by sort semantics
