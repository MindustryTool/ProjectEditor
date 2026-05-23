## Why

Currently mod projects are assumed to be JSON-only, but Mindustry mods can also be authored in JavaScript or Java. Users need to specify their project language at creation time so the editor can tailor file templates, validation, and tooling accordingly in the future. Even though only JSON is active now, the type system and UI should support the full set from the start.

## What Changes

- Add `language: 'json' | 'java' | 'javascript'` field to `ProjectInfo` interface (default `'json'`)
- Update `createProjectInfo()` to accept a `language` parameter
- Update `ProjectInfoSchema` validation to include the new field
- Add `language` to `ProjectRecord` in the storage layer (IndexedDB schema)
- Update `createNewProject` in the Zustand store to accept and persist `language`
- Add a language picker (segmented control / select) to the project creation form in both `ProjectPickerScreen` and `ProjectPickerDialog`
- Show a small language icon/badge next to each project name in listing (both screens and dialog)
- Update i18n strings for the new UI elements

## Capabilities

### New Capabilities
- `project-language`: Support for setting and displaying a project's language (`json`, `java`, `javascript`) throughout creation, listing, and switching workflows.

### Modified Capabilities
<!-- No existing spec changes required – current specs don't define language behavior -->

## Impact

- `@project/core` – `ProjectInfo` interface + `createProjectInfo()` signature
- `@project/validation` – `ProjectInfoSchema` updated
- `@project/storage` – `ProjectRecord` interface + IndexedDB store upgrade
- `@project/state` – `createNewProject` signature change
- `apps/web` – `EditorPage.tsx`, `ProjectPickerScreen.tsx`, `ProjectPickerDialog.tsx` UI changes
- i18n locales – new translation keys for language labels and icons
