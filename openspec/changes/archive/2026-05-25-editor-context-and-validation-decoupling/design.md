## Context

The editor area (EditorCenterPanel → MonacoEditor + useFileContent) has accumulated architectural debt:

- **MonacoEditor** directly triggers file validation via `setTimeout` + dynamic import inside the `onChange` callback. This couples the editor component to the file-validation package and validation lifecycle, making the component harder to test and reuse.
- **useFileContent** is a 150-line hook that handles file reading (with AbortController), EventBus subscriptions, version tracking, project-switch cleanup, and write queue management. This mix of concerns makes it difficult to reason about, and any new editor feature requires modifying the same hook.
- **No EditorContext** exists — editor-specific concerns (monaco theme, language setup, validation markers) are scattered across MonacoEditor, useValidationMarkers, and the module-level `configureMonaco()` call.

## Goals / Non-Goals

**Goals:**
- Decouple validation triggering from MonacoEditor — validation runs automatically when store content changes
- Move file I/O and event logic from useFileContent into file-content-store actions
- Create EditorContext to host editor-specific lifecycle (theme, markers, monaco setup)
- Slim useFileContent to a thin selector + update wrapper
- Keep all existing UX behavior identical (debounced validation on typing, markers, badges, status bar)

**Non-Goals:**
- Not changing the validation runner itself (validators, registry, runner stay untouched)
- Not changing how write queue works
- Not changing other consumers (FileExplorer, ExportMenu, StatusBar, ModHjsonPanel)
- Not adding new editor features beyond refactoring

## Decisions

### 1. Store subscriber vs EventBus for validation trigger
**Decision**: Use a Zustand `subscribe` on `fileContents` to detect status transitions to "dirty" and trigger validation.
**Rationale**: The validation must run when content changes in the store, not when the user types in MonacoEditor. Using the store as the source of truth ensures validation runs regardless of which component triggers the update (MonacoEditor, ModHjsonPanel, future editors). EventBus is for external file changes, not internal state transitions.
**Alternative considered**: EventBus event `file:content-changed` — adds unnecessary indirection since the store already notifies subscribers synchronously.

### 2. EditorContext placement in component tree
**Decision**: Place EditorContext inside SplitView as a wrapper around the center panel area only (not the entire app).
**Rationale**: Editor-specific concerns (monaco setup, markers) are only needed when an editor is visible. Keeping it scoped avoids unnecessary setup in tool panels or the right panel.
**Alternative considered**: Placing it in EditorShell — would work but load monaco/languages even when no file is open.

### 3. File-content-store actions vs separate service
**Decision**: Add imperative `readFile(path)`, `subscribeToEvents(path)`, and `cleanup(path)` to the existing file-content-store.
**Rationale**: These actions need direct access to the store's state for abort coordination and version checks. A separate service would need to import the store anyway. Keeping them as store actions keeps the API surface cohesive.
**Alternative considered**: Separate file service module — cleaner separation but adds import overhead and still needs store access.

### 4. useFileContent future
**Decision**: Keep useFileContent as a thin convenience hook that calls `useFileContentStore` selectors and exposes `update`. The hook will NOT manage read/event/cleanup lifecycle.
**Rationale**: Components that need file content should not need to manually call store actions for read/event setup. Editors on the other hand need the extra lifecycle (EditorContext provides this).
**Implication**: EditorCenterPanel will use EditorContext for lifecycle + useFileContent for data. ModHjsonPanel will continue using useFileContent alone (it doesn't need monaco lifecycle).

## Risks / Trade-offs

- **[Risk]** Reading file in store action instead of hook: store actions are not tied to component lifecycle, so cleanup on unmount must be explicit.
  → **Mitigation**: EditorContext will call `subscribeToEvents` in its effect and return cleanup that calls `cleanup(path)`.

- **[Risk]** Validation running on every dirty transition: if useFileContent `update` is called rapidly, validation could fire many times.
  → **Mitigation**: The store subscriber will have its own debounce (500ms) before calling the validation runner.

- **[Risk]** Existing useFileContent consumers (ModHjsonPanel) might break if read logic is removed from the hook.
  → **Mitigation**: Move read logic into a store action that's called from EditorContext (for editor) AND from useFileContent itself (for legacy consumers). useFileContent will internally call the store read action on mount.
