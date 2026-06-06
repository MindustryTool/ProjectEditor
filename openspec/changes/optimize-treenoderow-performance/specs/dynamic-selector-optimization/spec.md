## ADDED Requirements

### Requirement: Zustand selectors use stable factory functions

All zustand store access in `TreeNodeRow` SHALL use stable selector factory functions (exported by the store) wrapped with `useShallow` to prevent re-renders from unrelated state changes.

#### Scenario: isItemDirty uses stable selector

- **WHEN** `TreeNodeRow` renders for a non-folder node
- **THEN** the dirty state is read via `useFileStore(useShallow(selectEntry(projectId, currentPath)))` combined with `isDirty()`
- **AND** the selector function reference is stable across renders (does not create a new closure on each render)

#### Scenario: isItemSaving uses exported selectIsSaving factory

- **WHEN** `TreeNodeRow` renders for a non-folder node
- **THEN** the saving state is read via `useFileStore(useShallow(selectIsSaving(projectId, currentPath)))`
- **AND** the selector function reference is stable across renders

#### Scenario: Folder nodes short-circuit to constant selector

- **WHEN** `TreeNodeRow` renders for a folder node
- **THEN** `isItemDirty` and `isItemSaving` selectors return `false` without subscribing to the file store

#### Scenario: loadFile is read once at FileExplorer level

- **WHEN** any `TreeNodeRow` needs to call `loadFile`
- **THEN** the `loadFile` reference is obtained from context/prop (injected once by `FileExplorer`) rather than via `useFileStore((s) => s.loadFile)` on every row

### Requirement: Validation selectors use useShallow with stable output

`useValidationStore` selectors SHALL use `useShallow` and extract only the scalar values needed (error count, warning count).

#### Scenario: Error and warning counts are scalar comparisons

- **WHEN** validation results update for a different path
- **THEN** `TreeNodeRow` does NOT re-render because the selector output (`error`/`warning` counts for its own `currentPath`) remains unchanged
