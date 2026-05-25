## Why

MonacoEditor violates separation of concerns by directly triggering validation, useFileContent has grown into a fat hook managing read/event/cleanup logic that belongs in the store, and there is no EditorContext to provide editor-specific lifecycle management. These make the code harder to reason about, test, and extend with new editor features.

## What Changes

- **BREAKING**: Remove validation trigger from MonacoEditor — validation is triggered via a store subscriber on content changes
- **BREAKING**: Move file read, event subscription, and cleanup logic from useFileContent hook into file-content-store as imperative actions
- Create `EditorContext` React context to manage editor-specific lifecycle (monaco setup, theme, validation markers)
- Slim down useFileContent to a thin selector that returns current store state

## Capabilities

### New Capabilities
- `editor-context`: React Context providing editor lifecycle management (monaco setup, theme, validation markers) to descendant components
- `file-content-validation-listener`: Store subscriber in file-content-store that triggers validation on content status changes

### Modified Capabilities
- `file-content-store`: Add imperative store actions for readFile, subscribeToEvents, and cleanup — currently these live in useFileContent hook
- `file-validation-ui`: Remove "MonacoEditor shows inline validation markers" scenario that mentions validation triggered by content change in MonacoEditor; validation trigger becomes an implementation detail of file-content-store

## Impact

**Files removed:**
- None

**Files created:**
- `apps/web/src/components/editor/EditorContext.tsx` — React context and provider

**Files modified:**
- `apps/web/src/components/editor/MonacoEditor.tsx` — remove validate function, debounce timer, useValidationStore import
- `apps/web/src/components/editor/EditorCenterPanel.tsx` — wrap editor in EditorContext
- `apps/web/src/components/editor/EditorShell.tsx` — position EditorContext in tree
- `packages/state/src/use-file-content.ts` — remove readFile, event subscription, cleanup effects; keep only selector + update
- `packages/state/src/file-content-store.ts` — add readFile action, eventBus subscription action, cleanup action, validation subscriber registration
- `packages/state/src/index.ts` — export new store actions
- `apps/web/src/lib/validation/useValidationMarkers.ts` — may move into EditorContext

**Dependencies:**
- `@project/file-validation` — store subscriber will import validation runner
- `@project/state` — expanded store API
