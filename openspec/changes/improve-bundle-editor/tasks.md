## 1. Layout & Structure Changes

- [x] 1.1 Remove outer padding (`p-4 gap-3`) from root container
- [x] 1.2 Remove the separator line above compare-with area
- [x] 1.3 Remove the "DEFAULT" locale name display (hide `bundle.localeName` span when value is "DEFAULT")

## 2. Unified Search & Filter Toolbar

- [x] 2.1 Merge keyFilter and valueFilter state into a single `searchQuery` state
- [x] 2.2 Replace two Input components with one unified search Input
- [x] 2.3 Update filteredRows useMemo to search both key and value against the single query
- [x] 2.4 Remove the separate `keyFilter` and `valueFilter` useState hooks
- [x] 2.5 Move compare-with Select dropdown to the same toolbar row as search input and state filter tabs

## 3. Entry Count Badges

- [x] 3.1 Compute entry counts per state from `bundle.rows` (all, translated, untranslated, invalid)
- [x] 3.2 Display count badges on each state filter tab button

## 4. Auto-Save & Untranslated Editing

- [x] 4.1 Remove save Button and comparison save Button from the header
- [x] 4.2 Remove `onClick={bundle.save}` and `onClick={bundle.saveComparison}` handlers
- [x] 4.3 Enable value input for untranslated rows (remove `disabled` on rows where `isMissing`)
- [x] 4.4 Remove opacity/cursor classes that were applied to disabled untranslated inputs

## 5. Cleanup

- [x] 5.1 Remove unused imports (`Button` from ui/button)
- [x] 5.2 Remove unused i18n translation keys for filter-key, filter-value, and save
