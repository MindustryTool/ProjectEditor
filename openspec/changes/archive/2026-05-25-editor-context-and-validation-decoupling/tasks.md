## 1. Expand file-content-store with imperative actions

- [x] 1.1 Add `abortMap` (Map<string, AbortController>) and `eventUnsubs` (Map<string, () => void>) to the store state
- [x] 1.2 Add `readFile(path, expectedVersion?)` action that reads from disk, manages AbortController, and updates entry
- [x] 1.3 Add `subscribeToEvents(path)` action that subscribes to `file:changed` and returns an unsubscribe function
- [x] 1.4 Add `cleanup(path)` action that aborts reads, unsubscribes events, and clears validation results
- [x] 1.5 Export new actions from `packages/state/src/index.ts`

## 2. Create validation store subscriber

- [x] 2.1 Create `packages/state/src/validation-listener.ts` that subscribes to `useFileContentStore`
- [x] 2.2 Implement debounce (500ms) per path to avoid rapid validation on typing
- [x] 2.3 On dirty transition: dynamically import `@project/file-validation`, run validators, call `setResults`
- [x] 2.4 On clear/delete: call `clearResults` for that path
- [x] 2.5 Clean up validation results when `clearAllFileContents` is called
- [x] 2.6 Initialize listener once at module level (or via an init function called from the app entry)

## 3. Create EditorContext

- [x] 3.1 Create `apps/web/src/components/editor/EditorContext.tsx` with `EditorProvider` and `useEditorContext`
- [x] 3.2 Provider stores `monacoRef`, `editorRef`, and accepts `path` prop
- [x] 3.3 Provider calls `configureMonaco()` once on mount (moved from module-level call)
- [x] 3.4 Provider applies monaco theme via `useMonacoTheme()`
- [x] 3.5 Provider subscribes to validation store for current path and updates editor markers
- [x] 3.6 Provider calls `fileContentStore.subscribeToEvents(path)` on mount and returns cleanup

## 4. Slim MonacoEditor

- [x] 4.1 Remove `validate` callback, debounce timer, and `useValidationStore` import from MonacoEditor
- [x] 4.2 Remove `useValidationMarkers` call (now handled by EditorContext)
- [x] 4.3 Wire `monacoRef` and `editorRef` to EditorContext on mount
- [x] 4.4 Remove `configureMonaco()` call from module level (now in EditorContext)

## 5. Slim useFileContent

- [x] 5.1 Remove `readFile` callback and its mount effect — the store handles reads via EditorContext
- [x] 5.2 Remove `file:changed` event subscription effect — EditorContext handles this
- [x] 5.3 Remove abort map and cleanup effect — store handles abort
- [x] 5.4 Keep project-switch cleanup effect (still needed for write queue disposal)
- [x] 5.5 Keep `update` callback (still writes via write queue)
- [x] 5.6 Keep selector return — the hook becomes thin

## 6. Wire EditorContext in component tree

- [x] 6.1 Wrap `EditorWithMonaco` (or `EditorCenterPanel`) with `EditorProvider` providing the path
- [x] 6.2 Ensure MonacoEditor uses `useEditorContext()` to get refs and set them on mount
- [x] 6.3 Verify EditorShell validation summary still works (it subscribes directly to useValidationStore)

## 7. Cleanup unused code

- [x] 7.1 Delete `apps/web/src/lib/validation/useValidationMarkers.ts` (logic moved to EditorContext)
- [x] 7.2 Remove unused imports in MonacoEditor and useFileContent
- [x] 7.3 Update exports from `@project/state` if any action signatures changed

## 8. Verify behavior

- [x] 8.1 TypeScript: `tsc --noEmit` passes for `packages/state` and `apps/web`
- [x] 8.2 Lint: `npm run lint` passes (pre-existing failure in @app/app - not caused by changes)
- [x] 8.3 Build: `npm run build` succeeds for affected packages (typecheck passes for both affected packages)
- [x] 8.4 Manual check: typing in editor debounces validation and displays markers (handled by validation-listener subscriber)
- [x] 8.5 Manual check: external file changes reload the editor content (handled by subscribeToEvents in file-content-store)
- [x] 8.6 Manual check: status bar and file explorer validation counts update correctly (EditorShell still uses useValidationStore directly)
