## Context

The LocalizationMenu in the editor toolbar currently renders an empty dropdown. The editor supports Mindustry mod projects which contain `.properties` bundle files (e.g., `bundle.properties`, `bundle_vi.properties`). Supported locale codes are defined in `packages/core/src/bundle/locales.ts` as `SUPPORTED_LOCALES`. Bundle file reading/writing utilities exist in `packages/core/src/bundle/`.

## Goals / Non-Goals

**Goals:**
- Add a "Create New Locale" menu item to the LocalizationMenu dropdown
- Provide a dialog with a locale picker (filtering out already-created locales) and optional source bundle picker
- Scaffold new bundle files by copying keys from an existing bundle (if selected) with empty values
- Keep dialog content in a separate component to avoid mounting hooks when dialog is closed

**Non-Goals:**
- Editing or deleting existing locale bundles
- Bulk operations across multiple locales
- UI translation for the new locale (this is about Mindustry mod bundles, not the editor UI)

## Decisions

- **Dialog content as separate component**: The `CreateLocaleDialogContent` component encapsulates all dialog state and logic. This prevents hooks (state, effects, data fetching) from running when the dialog is closed, since React only mounts components when they're rendered.
- **Locale list from `SUPPORTED_LOCALES`**: Use the canonical list from `packages/core/src/bundle/locales.ts` filtered against files already present in the project's `bundles/` directory, ensuring only valid Mindustry locale codes are offered.
- **Source bundle picker lists all existing bundle files**: Lists all `bundle*.properties` files from the project's `bundles/` directory. When selected, keys are extracted via `parseBundle()` and written to the new file with empty values.
- **File write via project filesystem**: Use `useProjectSession`'s filesystem API (`writeFile`) to create the new bundle file, consistent with how other file operations work in the editor.

## Risks / Trade-offs

- **No validation on locale code**: The picker restricts selection to `SUPPORTED_LOCALES`, so invalid codes are impossible. This is safer than a free-text input.
- **Bundle file naming convention**: Assumes files follow `bundles/bundle_{locale}.properties` pattern (or `bundles/bundle.properties` for English). Files outside this convention won't appear as existing locales but won't break anything.
