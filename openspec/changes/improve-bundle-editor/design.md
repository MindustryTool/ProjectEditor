## Context

The bundle editor component (`apps/web/src/components/editor/bundle/index.tsx`) currently has separate key/value filter inputs, save buttons, a compare-with dropdown in the header, and outer padding. The write queue system (`write-queue` spec) already handles batched writes on change — the save button is legacy. Untranslated rows are disabled (can't edit), forcing users to switch files or add keys manually. The separator line and "DEFAULT" text add visual noise.

## Goals / Non-Goals

**Goals:**
- Unified search input that matches against both key and value
- Auto-save via write queue on every value change (remove save buttons)
- Editable inputs for untranslated rows (enable writing new keys)
- Entry count badges on state filter tabs
- Streamlined layout: compare-with dropdown on same row as search/filters, no outer padding, no separator
- Remove "DEFAULT" locale label display

**Non-Goals:**
- Not changing the underlying bundle file parsing or write-queue architecture
- Not changing the comparison file selection logic or locale detection
- Not redesigning the table/grid itself beyond removing the "DEFAULT" label

## Decisions

1. **Single unified search** over merged key/value approach — simpler UX than toggling between key/value modes. The filter function will check both `row.key` and `row.value` against the search string.

2. **Remove save buttons** — the write queue (`callback-write-pattern` / `write-queue` specs) already debounces and batches writes on value change. No need for explicit save.

3. **Enable untranslated rows** — set `disabled={false}` on the input even when `!row.existsInBundle`. The write queue handles adding new keys to the bundle on write.

4. **Entry counts via derived state** — compute counts from `bundle.rows` in a useMemo (same as filteredRows), not from a new API. No changes to `useBundleFile` needed; counts are derived client-side.

5. **Layout restructure** — move compare-with Select to the toolbar row alongside search input and state filter tabs. Remove `p-4` from outer div. Remove the separator div entirely.

6. **Remove "DEFAULT" text** — delete the `{bundle.localeName}` span (or conditionally hide it when localeName is "DEFAULT").

## Risks / Trade-offs

- [Auto-save on change] → Could cause excessive writes if user types rapidly. Mitigation: write queue already debounces; verify debounce delay is adequate.
- [Untranslated rows editable] → User might enter values without the key existing in the bundle file. Mitigation: on write, the bundle file handler should add missing keys (check existing write behavior in useBundleFile).
- [Removing save button] → User has no visual confirmation of save. Mitigation: could add a subtle "saving..." indicator or rely on the existing status bar feedback.
