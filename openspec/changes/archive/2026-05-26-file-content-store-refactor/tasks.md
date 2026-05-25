## 1. Types & Data Model

- [x] 1.1 Add `FileStatus` enum (`idle | dirty | saving | error | loading`) and `FileContentEntry` type with `status`, `version`, `savedAt` fields
- [x] 1.2 Add `AbortController` map type for per-path read cancellation
- [x] 1.3 Add version counter map type

## 2. File Versioning

- [x] 2.1 Create `file-version-map.ts` — `FileVersionMap` class with `get`, `increment`, `reset` methods
- [x] 2.2 Integrate version into store setters: `setFileContent(path, data, version)`, version check in completion handlers

## 3. Write Queue

- [x] 3.1 Create `write-queue.ts` — `WriteQueue` class with per-project instance map
- [x] 3.2 Implement `enqueue(path, content, version)` — debounce per path, replace pending
- [x] 3.3 Implement `flush()` — execute all pending writes immediately
- [x] 3.4 Implement `dispose()` — flush then lock queue
- [x] 3.5 Wire `onError` callback for write failures

## 4. Rewrite FileContentStore

- [x] 4.1 Update `FileContentEntry` interface: add `status`, `version`, `savedAt`; remove `isLoading`
- [x] 4.2 Rewrite `setFileContent` to accept version param, set status `idle`
- [x] 4.3 Rewrite `setFileLoading` to set status `loading`
- [x] 4.4 Rewrite `setFileError` to preserve `data`, set status `error`
- [x] 4.5 Add `setFileDirty(path, content, version)` action (status → dirty)
- [x] 4.6 Add `setFileSaving(path)` action (status → saving)
- [x] 4.7 Add `setFileSaved(path)` action (status → idle, update savedAt)

## 5. Rewrite useFileContent Hook

- [x] 5.1 Import `WriteQueue` and `FileVersionMap` singletons
- [x] 5.2 Replace per-hook `setTimeout` with `WriteQueue.enqueue()`
- [x] 5.3 Add `AbortController` per path for read cancellation on path change
- [x] 5.4 Add version check in read/write completion callbacks — discard if stale
- [x] 5.5 Skip disk reload on `file:changed` if status is `dirty` or `saving`
- [x] 5.6 Update return type: `{data, status, error, version, savedAt, update}`
- [x] 5.7 Trigger `flush()` on project close / project switch

## 6. Consumer Updates

- [x] 6.1 Update `MonacoEditor.tsx` to use new `status` field instead of `isLoading`
- [x] 6.2 Update any other consumers of `useFileContent` for new return shape
- [x] 6.3 Update exports in `@project/state` `index.ts`
