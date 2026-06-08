## Context

The bundle editor grid uses `BundleRow` with two boolean fields (`existsInBundle`, `isInvalid`) to encode row state. Filtering and styling logic duplicates state derivation across `BundleGrid.tsx` (inline filter), `Row.tsx` (inline `isMissing`), and `parse-rows.ts` (`getCounts`). The current model cannot represent "extra" keys (in file but not in contentKeys), and adding a delete column requires state-aware UX.

## Goals / Non-Goals

**Goals:**
- Single source of truth: `state` field on `BundleRow` derived at parse time
- Distinguish all meaningful states: `translated`, `untranslated`, `extra`, `missing`, `invalid`
- Pre-compute counts per state in `parseRows()` return value
- Add delete button column in the grid that removes a row's key from the bundle file
- Minimal touch to unrelated code

**Non-Goals:**
- Changing the core `@project/core` bundle parser types (`BundleEntry`, `BundleFile`)
- Batch delete, undo delete, or confirmation dialogs
- Rewriting the virtualizer or layout

## Decisions

1. **String enum over numeric/boolean flags** — `'translated' | 'untranslated' | 'extra' | 'missing' | 'invalid'` is self-documenting in logs, readable in filter switches, and eliminates inline boolean logic.

2. **`parseRows` returns counts alongside rows** — return `{ rows: BundleRow[]; counts: Record<StateFilter, number> }` instead of a separate `getCounts()` function. Counts are derived once at parse time; `getCounts()` is removed.

3. **Delete writes empty-string to remove key** — `writeKey` already supports setting a key to empty string. On delete, `writeKey(path, key, "")` writes the key with empty value. The key stays visible as `missing` until removed from `contentKeys`. This avoids a separate bundle-file-rewrite mechanism.

4. **Delete button in a new fixed-width column** — add a `grid-cols-[35%_1fr_auto]` / `grid-cols-[35%_1fr_1fr_auto]` column at the right edge with a small icon button. Hidden on invalid rows.

5. **No new dependency** — delete uses the existing `onValueChange` callback with empty value. No mutation APIs needed.

## Risks / Trade-offs

- **[Extra rows accumulate]** Keys present in file but absent from contentKeys are shown as `extra` and never auto-cleaned → Mitigation: manual delete button suffices; no automated cleanup needed for current scope
- **[Delete = empty string may confuse]** Writing empty string keeps the key in the file with no value → Accepted: this matches how untranslated keys look on initial load; user can delete again if they truly want to remove the line from file (future enhancement)
- **[Comparison rows lose state info]** `use-comparison` currently maps to `BundleRow` with simplified booleans → Mitigation: comparison rows get the full state enum too, computed from the comparison file's own data
