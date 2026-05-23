## Why

`EditorPage.tsx` is a monolithic component (193 lines) that bundles project state, picker logic, file counting, view rendering, and status bar layout into a single function. Every `useState` update (e.g. `value`, `pickerOpen`, `pickerMode`) causes the entire page to rerender — including `SplitView`, `Toolbar`, `StatusBar`, and the `Suspense`-wrapped dialog. This is unnecessary and degrades perceived performance, especially in a code editor context where responsiveness matters.

## What Changes

- Extract the "no project" state into a standalone `NoProjectScreen` component.
- Extract the editor chrome (Toolbar, SplitView, StatusBar, PickerDialog) into a memoized `EditorShell` component.
- Extract `renderLeft` / `renderCenter` / `renderRight` into proper sub-components (`EditorToolPanel`, `EditorCenterPanel`, `EditorRightPanel`).
- Inline the `projectTree` file count as a derived constant at the module level.
- Wrap extracted components with `React.memo` where appropriate to prevent cascading rerenders.
- No new features or user-visible changes — pure refactor.

## Capabilities

### New Capabilities

- *None.* This is a refactor-only change with no new feature capabilities.

### Modified Capabilities

- *None.* No spec-level behavior changes — implementation details only.

## Impact

- `apps/web/src/components/editor/EditorPage.tsx` — dramatically simplified; imports new components.
- New files to create:
  - `apps/web/src/components/editor/EditorShell.tsx`
  - `apps/web/src/components/editor/EditorToolPanel.tsx`
  - `apps/web/src/components/editor/EditorCenterPanel.tsx`
  - `apps/web/src/components/editor/EditorRightPanel.tsx`
  - `apps/web/src/components/editor/NoProjectScreen.tsx`
- No dependency changes, no API changes, no breaking changes.
