## 1. Extract NoProjectScreen

- [x] 1.1 Create `apps/web/src/components/editor/NoProjectScreen.tsx` — move the "no project" branch from `EditorPage` into a standalone memoized component
- [x] 1.2 Component receives `onCreateProject` and `onOpenProject` as props

## 2. Extract Panel Components

- [x] 2.1 Create `apps/web/src/components/editor/EditorToolPanel.tsx` — memoized component with `renderLeft` content (FileExplorer + Panel wrapper)
- [x] 2.2 Create `apps/web/src/components/editor/EditorCenterPanel.tsx` — memoized component receiving `path`, `value`, `onChange` props; renders HjsonEditor or placeholder
- [x] 2.3 Create `apps/web/src/components/editor/EditorRightPanel.tsx` — memoized component receiving `path` prop; renders ModHjsonPanel conditionally

## 3. Extract EditorShell

- [x] 3.1 Create `apps/web/src/components/editor/EditorShell.tsx` — memoized component that owns `pickerOpen`/`pickerMode` state and renders Toolbar + menus, SplitView with panels, StatusBar, and ProjectPickerDialog
- [x] 3.2 EditorShell receives `path`, `value`, `onChange`, `projectName`, `fileCount`, `onCloseProject`, `onOpenProject`, `onCreateProject` as props
- [x] 3.3 Move `handleOpenPicker`, `handleChangePicker`, `handleCreatePicker`, `handleSelectProject`, `handleCreateProject` into EditorShell

## 4. Refactor EditorPage

- [x] 4.1 Move `fileCount` to a module-level constant (`const fileCount = countFiles(projectTree)`)
- [x] 4.2 Simplify `EditorPage.tsx` to only hold `path`, `value`/`setValue`, `projectContext` and delegate to either `NoProjectScreen` or `EditorShell`
- [x] 4.3 Verify the app builds and existing functionality is preserved
