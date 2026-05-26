## 1. Core type and store changes

- [ ] 1.1 Change `FileContentEntry.data` type from `string | null` to `ArrayBuffer | null | undefined` in `packages/state/src/stores/file-content.ts`
- [ ] 1.2 Update `writeBuffer` action to accept `ArrayBuffer | string` and auto-encode strings via `TextEncoder.encode()`
- [ ] 1.3 Change `readFile` action to use `ProjectFileSystem.readFile(path)` (returns `ArrayBuffer`) instead of `readTextFile`
- [ ] 1.4 Update `readFile` NotFoundError fallback to set empty `ArrayBuffer(0)` instead of `""`
- [ ] 1.5 Update `FileContentStore` interface to reflect new types in `writeBuffer` signature

## 2. WriteQueue migration

- [ ] 2.1 Change `PendingWrite.content` type from `string` to `ArrayBuffer | string` in `packages/state/src/services/write-queue.ts`
- [ ] 2.2 Update `WriteQueue.flush()` to write via `writeFile` for `ArrayBuffer` content and `writeTextFile` for string content
- [ ] 2.3 Update `enqueue` signature to accept `ArrayBuffer | string`

## 3. useFileContent hook

- [ ] 3.1 Update `UseFileContentResult.data` type to `ArrayBuffer | null`
- [ ] 3.2 Update `useFileContent` `write` callback parameter type from `string` to `ArrayBuffer | string`
- [ ] 3.3 Update `write` callback to call `store.writeBuffer` with the new type

## 4. useFileContentString hook (new)

- [ ] 4.1 Create `packages/state/src/hooks/use-file-content-string.ts` with `useFileContentString(path)` that wraps `useFileContent(path)`
- [ ] 4.2 Implement string decoding via `useMemo` with `TextDecoder().decode(data)` for `ArrayBuffer` data
- [ ] 4.3 Handle edge cases: `null` data → `null`, zero-length buffer → `""`
- [ ] 4.4 Export `UseFileContentStringResult` type and `useFileContentString` from `packages/state/src/index.ts`

## 5. Validation listener migration

- [ ] 5.1 Update `scheduleValidation` in `packages/state/src/validation/listener.ts` to decode `ArrayBuffer` data to string before passing to `runner.validate`
- [ ] 5.2 Handle `null`/`undefined` data as empty string fallback

## 6. Consumer migration (apps/web)

- [ ] 6.1 Update `EditorCenterPanel.tsx` — switch from `useFileContent` to `useFileContentString`, update `write` calls
- [ ] 6.2 Update `ItemPanel.tsx` — switch from `useFileContent` to `useFileContentString`
- [ ] 6.3 Update `ModHjsonPanel.tsx` — switch from `useFileContent` to `useFileContentString`
- [ ] 6.4 Verify `FileExplorer.tsx` — uses `selectEntry` and `isDirty` which are unaffected by data type
- [ ] 6.5 Verify `MonacoEditor.tsx` — uses `useFileContentStore` directly, no data type dependency

## 7. Cleanup and verification

- [ ] 7.1 Run `npm run typecheck` to verify all type errors are resolved
- [ ] 7.2 Run `npm run lint` to verify no new lint issues
- [ ] 7.3 Remove unused `readTextFile` / `writeTextFile` references if any were exclusively used by the store
