## Why

The current editor interface lacks a structured, professional layout inspired by VS Code. Users need a familiar multi-panel editing environment with organized menus, resizable panels, and clear status feedback — essential for complex project editing workflows.

## What Changes

- Add VS Code-inspired editor page with top toolbar containing Files and Export menus
- Add bottom status bar displaying current project information
- Add middle editor area with resizable left and right panels
- Build new EditorPage component with layout orchestration
- Create reusable layout primitives: Toolbar, StatusBar, Panel, SplitView
- Wire up Files menu for project file operations and Export menu for project export

## Capabilities

### New Capabilities
- `editor-layout`: VS Code-inspired editor page with toolbar, status bar, and resizable left/right panels
- `toolbar-menus`: Top toolbar with Files and Export dropdown menus
- `status-bar`: Bottom bar showing current project name, file count, and status
- `panel-system`: Left/right resizable panels with content slot system

### Modified Capabilities

*(none)*

## Impact

- New UI components in `apps/` (React) — no existing UI is removed
- CSS/layout system changes for split-panel resizing
- No backend API changes required (UI-only change)
