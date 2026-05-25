## Why

`EditorContext` is a React context used by exactly one consumer (`MonacoEditor`) and wrapped around exactly one child (`MonacoEditor` via `EditorProvider`). This indirection adds complexity without benefit — the provider and consumer always appear together. Merging eliminates the unnecessary abstraction, reducing file count and simplifying the component tree.

## What Changes

- Move all `EditorProvider` logic (monaco configuration, validation markers, file-content-store integration) directly into `MonacoEditor`
- Remove `EditorContext.tsx` entirely
- Update `EditorCenterPanel.tsx` to remove `EditorProvider` wrapper

## Capabilities

### New Capabilities
- `editor-code`: Inline editor lifecycle management within MonacoEditor

### Modified Capabilities
- `editor-context`: **BREAKING** — Removed. All requirements moved into `editor-code` capability
- `mod-hjson-editor`: No requirement change — only consumes MonacoEditor, unaffected by removal of context layer

## Impact

- **File removed**: `apps/web/src/components/editor/EditorContext.tsx`
- **File modified**: `apps/web/src/components/editor/MonacoEditor.tsx` (adds lifecycle logic)
- **File modified**: `apps/web/src/components/editor/EditorCenterPanel.tsx` (removes `EditorProvider` wrapper)
- **No external API changes** — `MonacoEditor` props remain identical
