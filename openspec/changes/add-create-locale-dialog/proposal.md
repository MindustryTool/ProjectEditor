## Why

The Localization menu in the editor toolbar is currently a placeholder with no actionable items. Users need to create new locale bundle files (e.g., `bundle_vi.properties`) for their Mindustry mod projects, but doing so requires manually finding the right locale code, creating the file, and optionally copying keys from an existing bundle. This change adds a "Create New Locale" dialog that streamlines this process, making it easy to scaffold new translation files from the UI.

## What Changes

- Add a "Create New Locale" menu item to the LocalizationMenu dropdown
- When clicked, open a dialog with a locale picker showing available locales from `SUPPORTED_LOCALES` that haven't been created yet
- Include an optional source bundle picker to copy keys from an existing bundle
- On create, read the source bundle (if chosen), extract all valid keys, and write them to the new bundle file with empty string values
- The dialog content is a separate component to prevent unnecessary hook execution when the dialog is closed

## Capabilities

### New Capabilities
- `create-locale-dialog`: Dialog for creating new locale bundle files with locale selection, optional source bundle copying, and empty-value scaffolding

### Modified Capabilities
- `localization-menu`: Add "Create New Locale" menu item to the existing dropdown, making it functional beyond the placeholder state

## Impact

- `apps/web/src/components/editor/toolbar/LocalizationMenu.tsx` - Add menu item and dialog integration
- New file: `apps/web/src/components/editor/toolbar/CreateLocaleDialog.tsx` - Dialog content component
- New translation keys in `apps/web/src/i18n/locales/{en,vi}/common.ts`
- References `SUPPORTED_LOCALES` from `packages/core/src/bundle/locales.ts` and bundle parsing utilities
