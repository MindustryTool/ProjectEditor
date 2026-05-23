## Context

`EditorPage.tsx` is the root component of the editor view (193 lines). It manages project context, URL query state (`path`), editor content (`value`), picker dialog state (`pickerOpen`, `pickerMode`), and inline render functions for left/center/right panels. The component rerenders entirely on any state change — notably `value` changes on every keystroke cascade through `Toolbar`, `SplitView`, `StatusBar`, and the lazy `ProjectPickerDialog`, despite none of those depending on `value`.

The current `renderLeft()`, `renderCenter()`, `renderRight()` patterns create new React elements each render but still force the parent to coordinate them. The `fileCount` is recalculated every render from a static `projectTree` constant.

## Goals / Non-Goals

**Goals:**
- Eliminate cascading rerenders from `value` changes (editor input) to unrelated chrome components.
- Eliminate cascading rerenders from `pickerOpen`/`pickerMode` changes to the editor content area.
- Make `fileCount` a module-level constant (it never changes).
- Produce clean, independently testable components.
- Zero user-visible behavior changes.

**Non-Goals:**
- Changing the SplitView, Panel, or other layout components.
- Introducing a state management library for UI state.
- Adding tests — existing tests should pass unchanged.

## Decisions

1. **`React.memo` on all extracted panel components** — Each panel depends on a narrow set of props. `EditorToolPanel` (file explorer) has no props and never rerenders. `EditorCenterPanel` only rerenders when `path` or `value` changes. `EditorRightPanel` only rerenders when `path` changes. `NoProjectScreen` only rerenders when `onCreateProject`/`onOpenProject` references change (stable callbacks via `useCallback`).

2. **`EditorShell` owns the picker state** — The picker is part of the "chrome" (toolbar → project menu triggers it). Moving `pickerOpen`/`pickerMode` into `EditorShell` isolates picker rerenders to the shell + dialog, not the panels. `EditorPage` keeps only `path` (nuqs) and `value` (editor content).

3. **`fileCount` as module-level constant** — `projectTree` is a static import. The count never changes. Move `countFiles(projectTree)` to module scope so it runs once.

4. **Props over render functions** — Replace `renderLeft()`/`renderCenter()`/`renderRight()` with `<EditorToolPanel>`, `<EditorCenterPanel>`, `<EditorRightPanel>` JSX elements passed to `SplitView`'s props.

5. **Alternatives considered**:
   - **Zustand slices for UI state** — Overkill for 2 state vars; simple prop drilling is clearer.
   - **Keeping everything in one file with `React.memo` wrappers** — Same runtime perf but worse code organization.
   - **Inline render functions as JSX directly in the template** — Less clear separation; inline functions always create new elements.

## Risks / Trade-offs

- [Prop drilling] `path` and `value`/`onChange` must pass through `EditorShell` to reach `EditorCenterPanel`. Trade-off: acceptable for 2 props; avoids adding a store just for UI state.
- [Over-splitting] Creating 5 new files for a 193-line component could feel excessive. Trade-off: each file has a single responsibility, making future changes easier to isolate.
