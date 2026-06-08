## 1. Add Translation Keys

- [x] 1.1 Add English translation keys for the locale dialog (`create-locale-dialog.title`, `create-locale-dialog.locale-picker`, `create-locale-dialog.source-bundle-picker`, `create-locale-dialog.create`, `create-locale-dialog.cancel`, `localization-menu.create-new-locale`) to `apps/web/src/i18n/locales/en/common.ts`
- [x] 1.2 Add Vietnamese translation keys to `apps/web/src/i18n/locales/vi/common.ts`

## 2. Create CreateLocaleDialogContent Component

- [x] 2.1 Create `apps/web/src/components/editor/toolbar/CreateLocaleDialogContent.tsx` with a `Select`-based locale picker that displays available locales from `SUPPORTED_LOCALES` (filtering out those already created in the project's `bundles/`)
- [x] 2.2 Add an optional source bundle picker using file listing from the project filesystem, showing `bundle*.properties` files
- [x] 2.3 Implement the "Create" handler that reads the source bundle (if selected) via `useFileString`/`readFile`, extracts valid entries with `parseBundle`, and writes the new bundle file via the project filesystem with empty string values

## 3. Integrate into LocalizationMenu

- [x] 3.1 Add `DropdownMenuItem` with "Create New Locale" text to the LocalizationMenu dropdown
- [x] 3.2 Wire up the dialog open state and render `Dialog` + `CreateLocaleDialogContent` in `LocalizationMenu.tsx`
