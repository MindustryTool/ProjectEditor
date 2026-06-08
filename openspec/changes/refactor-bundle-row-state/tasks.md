## 1. Data Model & Parsing

- [x] 1.1 Update `BundleRow` type in `types.ts`: replace `existsInBundle`/`isInvalid` with `state: 'translated' | 'untranslated' | 'extra' | 'missing' | 'invalid'`
- [x] 1.2 Update `StateFilter` type to include `'extra' | 'missing'`
- [x] 1.3 Rewrite `parseRows()` to derive state at parse time and return `{ rows: BundleRow[]; counts: Record<StateFilter, number> }`
- [x] 1.4 Remove standalone `getCounts()` function from `parse-rows.ts`

## 2. Consumers Refactor

- [x] 2.1 Refactor `BundleGrid.tsx`: update `rows` destructuring, replace inline filter logic with state-based switch, add delete column to header
- [x] 2.2 Refactor `Row.tsx`: read `row.state` instead of `row.existsInBundle`, add delete button column, hide delete button on invalid rows
- [x] 2.3 Refactor `use-comparison.ts`: construct comparison rows with proper state enum based on comparison file data
- [x] 2.4 Refactor `BundleToolbar.tsx`: update filter tabs to include extra/missing, ensure `StateFilter` union accepts new values

## 3. Delete Functionality

- [x] 3.1 Add `onDelete` callback prop to `Row` component (uses `onValueChange(key, "")`)
- [x] 3.2 Wire delete handler in `BundleGrid.tsx` via `onValueChange` with empty string
- [x] 3.3 Add delete button column to grid layout with `grid-cols-[35%_1fr_auto]` / `grid-cols-[35%_1fr_1fr_auto]`

## 4. Verification

- [x] 4.1 Verify TypeScript compiles with no type errors
- [x] 4.2 Verify filtering by all states works correctly (translated, untranslated, extra, missing, invalid)
- [x] 4.3 Verify delete button appears on non-invalid rows and hidden on invalid rows
- [x] 4.4 Verify delete sets value to empty and row state transitions correctly
- [x] 4.5 Verify comparison view still renders and comparison rows have correct state
- [x] 4.6 Verify count badges show correct numbers for all states
