## 1. Rename FilesMenu to ProjectMenu

- [x] 1.1 Rename `FilesMenu.tsx` to `ProjectMenu.tsx` and update the component name
- [x] 1.2 Replace menu items: remove Open File / Save / Save As, add Create Project / Open Project / Change Project / Close Project
- [x] 1.3 Add `disabled` state for Change Project and Close Project when no project is open
- [x] 1.4 Update translations: rename `filesMenu.*` keys to `projectMenu.*` in both `en/translation.json` and `vi/translation.json`
- [x] 1.5 Update import in `EditorPage.tsx` (FilesMenu → ProjectMenu)
- [x] 1.6 Update export in `editor/index.ts` if needed

## 2. Add project picker dialog

- [x] 2.1 Create `ProjectPickerDialog` component using shadcn `Dialog`, listing projects from `getAllProjects()`
- [x] 2.2 Add "Create New" project form inside the dialog with name input and validation
- [x] 2.3 Wire "Open Project" and "Change Project" menu actions to open the dialog
- [x] 2.4 Add project open logic: call `setCurrentProject` with the selected project context

## 3. Create project picker welcome screen

- [x] 3.1 Create `ProjectPickerScreen` component with welcome heading, quick-create form, and recent projects list
- [x] 3.2 Query `getAllProjects()` on mount to populate the recent list
- [x] 3.3 Wire create/open actions to the project store

## 4. Update EditorPage layout

- [x] 4.1 Conditionally render `ProjectPickerScreen` when `projectContext === null`, otherwise render Toolbar + SplitView + StatusBar
- [x] 4.2 Remove the `return undefined` for center panel when no project — the whole layout switches instead

## 5. Update StatusBar to use live data

- [x] 5.1 Pass actual project name from `projectContext.project.name` instead of hardcoded `"My Project"`
- [x] 5.2 Pass actual file count from `projectContext.fs` listing
- [x] 5.3 Show "No project" when `projectContext === null`

## 6. Verify and cleanup

- [x] 6.1 Run `npm run typecheck` and fix any type errors
- [x] 6.2 Run `npm run lint` and fix any lint issues
