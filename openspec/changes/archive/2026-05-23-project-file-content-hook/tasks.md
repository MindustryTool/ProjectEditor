## 1. Store Types & Zustand Store

- [x] 1.1 Define `FileContentEntry` type in `@project/state` with `data: string | null`, `isLoading: boolean`, `error: string | null`
- [x] 1.2 Define `FileContentStore` interface with `fileContents: Record<string, FileContentEntry>`, `setFileContent(path, data)`, `setFileLoading(path)`, `setFileError(path, error)`, `clearFileContent(path)`, `clearAllFileContents()`
- [x] 1.3 Create `useFileContentStore` Zustand store with the above actions (no `persist` middleware)

## 2. File Content Hook

- [x] 2.1 Implement `useFileContent(path, options?)` hook in `@project/state` that subscribes to `useFileContentStore` for the given path's entry
- [x] 2.2 On mount: if no cached entry exists for the path, call `setFileLoading(path)`, read from `ProjectFileSystem.readTextFile(path)`, then `setFileContent(path, data)` on success or `setFileError(path, error)` on failure
- [x] 2.3 Return `{ data, isLoading, error, update }` from the hook where `update(content)` immediately updates the store entry and schedules a debounced `ProjectFileSystem.writeTextFile(path, content)`
- [x] 2.4 Implement inline debounce using `useRef` + `setTimeout`/`clearTimeout` (default 500ms, configurable via `options.debounceMs`)
- [x] 2.5 Subscribe to `file:changed` events from `ProjectContext.events`: reload on `"write"` for the same path, clear entry on `"delete"`
- [x] 2.6 On unmount: cancel pending debounced write and unsubscribe from EventBus

## 3. Store Integration

- [x] 3.1 In `closeProject()` action in `useProjectStore`, call `useFileContentStore.getState().clearAllFileContents()` to flush cached entries when project closes
- [x] 3.2 Export `useFileContentStore` and `useFileContent` from `@project/state` package index

## 4. Validation & Cleanup

- [x] 4.1 Run `pnpm typecheck` to verify no type errors in `@project/state`
- [x] 4.2 Run `pnpm lint` to verify no lint issues (no lint script in `@project/state`, root lint failure is pre-existing in `@app/app`)
