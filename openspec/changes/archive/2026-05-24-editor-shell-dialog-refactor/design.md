## Context

The editor UI currently mixes layout composition (toolbar, split view, status bar) with feature orchestration (project picker and project settings dialogs). Dialog open state and picker mode are maintained in EditorShell and passed down into dialog components. In addition, EditorPage provides project actions as props, which are then threaded through EditorShell into ProjectMenu and dialog components.

This creates:

- Props drilling for actions that are global concerns (project open/close/create).
- Tight coupling between the editor chrome (EditorShell) and feature-specific UI flows (project picker/settings).
- A custom dialog state layer even though shadcn/radix Dialog already supports trigger-driven (uncontrolled) state.

## Goals / Non-Goals

**Goals:**

- Keep EditorShell as a presentational/layout component with minimal (or no) project-management props.
- Co-locate hook usage and state with the components that actually need them (menus/dialog entry points).
- Use shadcn Dialog + DialogTrigger patterns to eliminate explicit open-state wiring for project dialogs.
- Preserve existing user-visible behavior (open/change project, create project, open settings).

**Non-Goals:**

- Changing project storage, filesystem behavior, or event-bus behavior.
- Redesigning ProjectMenu UI or changing menu item structure.
- Introducing new libraries or changing the dialog component library.

## Decisions

- Consolidate project actions behind local hooks used by the UI components that trigger them.
  - Move `useProjectStore` selector usage and action wrappers out of EditorPage props and into the components that directly initiate actions (e.g. ProjectMenu dialogs, NoProjectScreen).
  - Keep side effects (toasts) close to the user interaction that triggers them.

- Replace EditorShell-managed dialog state with trigger-managed dialogs.
  - Implement dialogs using `<Dialog>` + `<DialogTrigger asChild>` (radix/shadcn) so open/close state is managed internally by the dialog component library.
  - Remove `pickerOpen`, `pickerMode`, and `settingsOpen` from EditorShell.
  - Avoid a single “mode” state by rendering separate dialog instances for each entry point:
    - “Create project” dialog instance with `mode="create"`.
    - “Open project” dialog instance with `mode="open"`.
    - “Change project” dialog instance with `mode="change"`.
  - Keep “change project” semantics (close current project before opening the new one) inside the `mode="change"` dialog’s `onSelectProject` handler.

- Minimize EditorShell’s API surface.
  - EditorShell receives only data that affects layout/rendering (e.g. `path` and derived display text).
  - EditorShell does not accept project lifecycle callbacks; those are obtained via store access within menu/dialog components.

## Risks / Trade-offs

- Multiple dialog instances could increase rendering cost or duplication → Mitigation: share a single dialog content component and vary behavior via props; rely on lazy-loading only for dialog content if needed.
- Moving hook usage into leaf components can scatter logic → Mitigation: extract a small `useProjectActions()` hook in the editor module to keep action wrappers consistent while still avoiding props drilling.
- Using uncontrolled dialogs can complicate programmatic close on selection → Mitigation: prefer Radix-provided close mechanisms (e.g. `DialogClose`) and design dialog content so selection naturally closes the dialog.
