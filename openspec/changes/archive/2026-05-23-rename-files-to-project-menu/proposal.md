## Why

The current "Files" menu (Save, Save As, Open File) is misleading since it overlaps with the File Explorer panel and doesn't address the primary workflow: managing projects. Users need a clear way to create, open, and switch between Mindustry mod projects. Renaming it to "Project" and adding project-level actions makes the toolbar reflect the actual user flow.

## What Changes

- **BREAKING**: Rename `FilesMenu` component → `ProjectMenu`, rename translation keys `filesMenu.*` → `projectMenu.*`
- **BREAKING**: Remove `filesMenu.openFile` action (replaced by File Explorer)
- **BREAKING**: Remove `filesMenu.save` / `filesMenu.saveAs` actions (handled by Editor)
- Add **Create Project** action → dialog prompts for project name, calls `createNewProject()`
- Add **Open Project** action → dialog lists saved projects from IndexedDB, select one to open
- Add **Change Project** action → same dialog but when a project is already open
- When `projectContext` is `null`, render a **Welcome/ProjectPicker screen** instead of `<SplitView/>`
- Update `statusBar.project` to use actual project name from store (instead of hardcoded `"My Project"`)
- Update `statusBar.files` to show actual file count

## Capabilities

### New Capabilities
- `project-menu`: Toolbar dropdown menu for project-level CRUD actions (create, open, change project)
- `project-picker-screen`: Full-screen welcome view shown when no project is open, with options to create or open a project
- `project-picker-dialog`: Reusable dialog UI for listing and selecting projects

### Modified Capabilities
- `toolbar-menus`: FilesMenu replaced by ProjectMenu in the toolbar
- `status-bar`: Live project name and file count instead of hardcoded values
- `editor-layout`: SplitView only renders when a project is active; otherwise show project picker

## Impact

- `apps/web/src/components/editor/FilesMenu.tsx` → fully rewritten as `ProjectMenu.tsx`
- `apps/web/src/components/editor/EditorPage.tsx` → conditional rendering of project picker vs SplitView
- `apps/web/src/components/editor/Toolbar.tsx` → update import
- `apps/web/src/components/editor/index.ts` → update export
- `apps/web/src/i18n/locales/en/translation.json` and `vi/translation.json` → rename/add keys
- `packages/state/src/index.ts` → add `loadProject` action to hydrate from storage
- New components: `ProjectMenu.tsx`, `ProjectPickerScreen.tsx`, `ProjectPickerDialog.tsx`
