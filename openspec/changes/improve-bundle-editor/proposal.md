## Why

The bundle editor panel has usability issues: separate key/value search inputs waste space, save button is redundant with auto-save write queue, untranslated entries can't be edited, and the layout has unnecessary visual clutter (outer padding, separator, rounded containers). These issues slow down translation workflows.

## What Changes

- Merge key filter and value filter into a single unified search input that searches both key and value
- Remove outer padding (`p-4`) from the root container
- Make the tab switching container (bundle/text editor) not rounded
- **BREAKING**: Remove save buttons — writes happen on change via write queue
- Show entry counts for each state filter: all, translated, untranslated, invalid
- Enable value editing for untranslated (missing) rows
- Move compare-with dropdown to same line as search input and state filter tabs
- Remove the separator line above the compare-with area
- Remove the "DEFAULT" text label next to the locale name

## Capabilities

### New Capabilities
- `bundle-editor-ux`: Improved bundle editor user experience — unified search, entry counts, auto-save, and streamlined layout

### Modified Capabilities
- `bundle-editor-panel`: Row filtering requirement changes (unified search instead of separate key/value filters, untranslated rows become editable)

## Impact

- `apps/web/src/components/editor/bundle/index.tsx` — complete rewrite of the UI layout
- `apps/web/src/components/editor/bundle/use-bundle-file.ts` — may need to expose entry counts per state
- i18n translation keys may need updates (remove filter-key/filter-value, add search placeholder, remove save key)
