## Why

The current `BundleRow` type uses two boolean flags (`existsInBundle`, `isInvalid`) to represent row state. This leads to complex filtering logic (e.g., "untranslated" requires checking `!existsInBundle || value === ""`), makes it impossible to distinguish "extra" keys (in file but not in contentKeys) from "missing" keys, and forces consumers to recompute derived state inline. Adding a delete action requires expanding the data model anyway.

## What Changes

- Replace boolean flags `existsInBundle` / `isInvalid` on `BundleRow` with a string enum: `'translated' | 'untranslated' | 'extra' | 'missing' | 'invalid'`
- Pre-compute state and counts in `parseRows()` so consumers get derived data for free
- Add `extra` state detection — keys present in the file but not in `contentKeys`
- Add a delete button column in the grid that removes a key from the bundle file
- Refactor all consumers (`Row.tsx`, `BundleGrid.tsx`, `use-comparison.ts`, `BundleToolbar.tsx`) to use the new state enum
- **BREAKING**: `BundleRow` interface changes; `existsInBundle` / `isInvalid` removed

## Capabilities

### New Capabilities
- `bundle-row-delete`: delete button per row in the bundle editor grid

### Modified Capabilities
- `bundle-editor-panel`: row state model changes (`BundleRow` interface, filtering logic), extra state detection, delete action
- `bundle-editor-ux`: state filter values expand to include "extra" and "missing"; entry count badges reflect new states; delete button UX

## Impact

- **`apps/web/src/components/editor/bundle/types.ts`**: `BundleRow` type redefined
- **`apps/web/src/components/editor/bundle/parse-rows.ts`**: `parseRows()` outputs state enum + counts; `getCounts()` simplified or removed
- **`apps/web/src/components/editor/bundle/Row.tsx`**: reads state enum instead of `existsInBounds`; delete button added
- **`apps/web/src/components/editor/bundle/BundleGrid.tsx`**: filtering logic uses state enum; header includes delete column; delete handler wired
- **`apps/web/src/components/editor/bundle/BundleToolbar.tsx`**: filter tabs updated for new states
- **`apps/web/src/components/editor/bundle/use-comparison.ts`**: comparison row construction uses new type
- **`apps/web/src/components/editor/bundle/write-key.ts`**: no changes needed (pure utility)
