## 1. Update touchEntry Utility

- [x] 1.1 Modify `touchEntry` in `packages/state/src/stores/session.ts` to update `lastAccessedAt` in-place for existing entries (no reorder) and append new entries to the end
- [x] 1.2 Verify `evictLRU` still correctly evicts the oldest entry when list exceeds 50

## 2. Update Spec

- [x] 2.1 Update `openspec/specs/recently-opened-files-bar/spec.md` — change "Entry is added on file open" to add at last position, change "Existing entry is updated on re-open" to keep position unchanged

## 3. Verify

- [x] 3.1 Run typecheck across workspace
- [x] 3.2 Open a file, verify it appears in recently opened bar
- [x] 3.3 Re-access an existing recently-opened file, verify it does NOT move position
- [x] 3.4 Verify LRU eviction still works when 50+ files accessed
