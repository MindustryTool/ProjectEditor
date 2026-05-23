## 1. Core Types & Validation

- [x] 1.1 Add `language` field to `ProjectInfo` interface in `@project/core` (`'json' | 'java' | 'javascript'`)
- [x] 1.2 Update `createProjectInfo()` to accept optional `language` parameter (default `'json'`)
- [x] 1.3 Add `language` field to `ProjectInfoSchema` in `@project/validation` (optional, defaults to `'json'`)

## 2. Storage Layer

- [x] 2.1 Add `language` field to `ProjectRecord` interface in `@project/storage`
- [x] 2.2 Ensure legacy records without `language` are handled gracefully (default to `'json'`)

## 3. State Store

- [x] 3.1 Update `createNewProject` signature in `@project/state` to accept `language` parameter
- [x] 3.2 Pass `language` through to `createProjectInfo()` when creating a project

## 4. Editor Page Wiring

- [x] 4.1 Update `handleCreateProject` in `EditorPage.tsx` to accept and pass `language`
- [x] 4.2 Update `openProjectFromRecord` to default missing `language` to `'json'`
- [x] 4.3 Pass `language` through `saveProject()` call so it persists to IndexedDB

## 5. ProjectPickerScreen UI

- [x] 5.1 Add language picker `<select>` below the project name input in `ProjectPickerScreen.tsx`
- [x] 5.2 Wire selected language into the `onCreateProject` callback
- [x] 5.3 Add language badge display next to each project name in the recent projects list
- [x] 5.4 Add translation keys for language labels

## 6. ProjectPickerDialog UI

- [x] 6.1 Add language picker `<select>` below the project name input in `ProjectPickerDialog.tsx`
- [x] 6.2 Wire selected language into the `onCreateProject` callback
- [x] 6.3 Add language badge display next to each project name in the project list
- [x] 6.4 Add translation keys for language labels

## 7. i18n

- [x] 7.1 Add English translations for language picker labels and language names
