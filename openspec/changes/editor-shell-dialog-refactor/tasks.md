## 1. EditorShell Simplification

- [x] 1.1 Update EditorShell props to remove project lifecycle callbacks (close/open/create) and any dialog-related props/state
- [x] 1.2 Remove lazy dialog imports from EditorShell and delete pickerOpen/pickerMode/settingsOpen logic
- [x] 1.3 Update EditorShell toolbar composition to render ProjectMenu without dialog/state props

## 2. Move Project Actions to Call Sites

- [x] 2.1 Refactor NoProjectScreen to obtain create/open actions locally (via store selectors or a small shared hook) instead of receiving them as props
- [x] 2.2 Refactor ProjectMenu to obtain close/open/create actions locally (via store selectors or a small shared hook) instead of receiving them as props
- [x] 2.3 Keep user feedback (toasts) co-located with the triggering UI interaction after the refactor

## 3. Dialog Refactor (Trigger-Managed)

- [x] 3.1 Refactor ProjectPickerDialog to support trigger-managed usage (Dialog + DialogTrigger) without requiring external open-state props
- [x] 3.2 Implement separate picker dialog instances for create/open/change entry points without a shared pickerMode state
- [x] 3.3 Implement change-project selection flow so it closes the current project before opening the selected project, without routing the logic through EditorShell
- [x] 3.4 Refactor ProjectSettingsDialog to be opened from its usage site via DialogTrigger (no external open-state props)

## 4. EditorPage Cleanup

- [x] 4.1 Remove now-unnecessary callback wrappers and props drilling from EditorPage
- [x] 4.2 Keep EditorPage focused on routing state (e.g. query `path`) and high-level page switching (no-project vs editor)

## 5. Cleanup

- [x] 5.1 Remove dead code paths, unused imports, and now-unused component props across the editor module
- [x] 5.2 Ensure TypeScript build passes for the web app after the refactor
