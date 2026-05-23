## Context

The `ExportMenu` button in the toolbar currently triggers an immediate browser download of `<project-name>.zip`. There is no user interaction before the download starts. The project uses Radix UI primitives via `~/components/ui/dialog` for dialogs and `react-i18next` for translations.

## Goals / Non-Goals

**Goals:**
- Replace the one-click download with a dialog that lets the user customize the filename
- Reuse existing `Dialog` component from `~/components/ui/dialog`
- Keep all existing export logic untouched
- Add i18n keys for the new dialog elements

**Non-Goals:**
- Changing the export/ZIP creation logic in `@project/core` or `@project/zip`
- Adding file format options (`.zip` extension stays fixed)
- Adding multi-file or batch export
- Changing the `EditorShell` layout or `Toolbar` component

## Decisions

1. **Inline dialog in ExportMenu** — rather than creating a separate `ExportDialog.tsx` file, keep the dialog JSX inside `ExportMenu.tsx`. The component is small enough that a separate file adds unnecessary indirection. If it grows later, extraction is trivial.

2. **Controlled dialog state** — use `useState` for `open` and `filename` inside `ExportMenu`. The dialog opens on button click, shows a pre-filled input with `<project-name>.zip`, and the user can edit, download, or cancel.

3. **Filename validation** — strip `.zip` from the input value on change, re-append `.zip` on download. This prevents double extensions like `file.zip.zip`. The input is a simple text field with `.zip` suffix shown as a label or appended programmatically.

4. **Download logic** — the existing `handleExport` callback is refactored to accept a custom filename. The ZIP blob creation stays the same, only the `a.download` attribute changes.

5. **Styling** — use the existing `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `Input`, and `Button` primitives. Layout follows the same pattern as `ProjectPickerDialog`.

## Risks / Trade-offs

- **No `.zip` extension validation** → The user could append a different extension. Trade-off accepted for simplicity; the filename is cosmetic and the file is always a valid ZIP.
