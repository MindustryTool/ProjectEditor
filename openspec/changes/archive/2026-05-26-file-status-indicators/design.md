## Context

The `FileExplorer` component currently displays validation error/warning badges via the validation store. The new `isDirty`, `isSaving`, and `isError` booleans from the file-content-store (added in `state-derivation-and-cache`) are not reflected in the tree. Each tree item needs access to its file's buffer state.

## Goals / Non-Goals

**Goals:**
- Show a white dot next to filenames with `isDirty === true`
- Show a yellow dot next to filenames with `isSaving === true`
- Render filename in red when `isError === true`
- Render filename in yellow when validation warnings exist (extends existing badge logic)

**Non-Goals:**
- No changes to validation badge behavior (red/yellow badge with counts stays)
- No changes to folder items (status is file-only)
- No changes to project switching or file open/close behavior

## Decisions

### 1. Status dot as inline SVG or Unicode character
**Decision**: Use `lucide-react` `Circle` icon (filled, small) for the dot, colored via Tailwind classes. Dirty = `fill-white`, Saving = `fill-yellow-500`.
**Rationale**: Already using `lucide-react` in the project. Keeps visual consistency. A filled circle is the standard "modified" indicator in editors.

### 2. Priority order for indicators
**Decision**: Saving dot takes precedence over dirty dot. Error color takes precedence over warning color. If both saving and error/warning, show saving dot but keep error/warning filename color.
**Rationale**: Saving is a transient state and the most actionable for the user to see.

### 3. Accessing buffer state per file
**Decision**: `TreeNodeItem` reads from `useFileContentStore` using the composite key built from the current project ID and the item's relative path.
**Rationale**: The buffer cache is keyed by `(projectId, path)`. The component already has access to `useCurrentProject()` which provides `project.id`.

## Risks / Trade-offs

- **[Risk]** Selector per tree item creates many subscriptions (one per visible file).
  → **Mitigation**: zustand selectors are O(1) per item. Tree typically shows < 50 items. No measurable performance impact.
- **[Risk]** `isSaving` stored in a component-level ref (`savingPaths`) is not reactive — the tree won't see saving state changes across projects.
  → **Mitigation**: The dot is a transient indicator. React re-renders when `useFileContentStore` state changes (via `writeBuffer`/`markPersisted`), which will trigger re-render of tree items.
