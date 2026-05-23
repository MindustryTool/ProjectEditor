## 1. Add i18n keys

- [x] 1.1 Add `exportMenu.dialogTitle`, `exportMenu.download`, `exportMenu.cancel`, and `exportMenu.filenameLabel` keys to `apps/web/src/i18n/locales/en/translation.json`
- [x] 1.2 Add same keys to `apps/web/src/i18n/locales/vi/translation.json` with appropriate translations

## 2. Refactor ExportMenu to use dialog

- [x] 2.1 Add `useState` for `open` (boolean) and `filename` (string) in `ExportMenu.tsx`
- [x] 2.2 Refactor `handleExport` to accept a `fileName` parameter and remove the direct call from button click
- [x] 2.3 Add dialog JSX inside `ExportMenu` using `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `Input`, and `Button` from `~/components/ui/`
- [x] 2.4 Wire button click to open dialog (`setOpen(true)`) instead of triggering download
- [x] 2.5 Wire Download button to call refactored `handleExport` with the edited filename, then close dialog
- [x] 2.6 Wire Cancel button to close dialog without exporting
- [x] 2.7 Pre-fill filename input with `<project-name>.zip` when dialog opens
