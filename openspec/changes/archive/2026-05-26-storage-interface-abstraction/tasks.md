## 1. Interface Definition

- [x] 1.1 Define `StorageBackend` interface in `packages/storage/src/types.ts` with project CRUD, settings CRUD, and `getOPFSRoot()` methods
- [x] 1.2 Re-export `StorageBackend` from `packages/storage/src/index.ts`

## 2. LocalStorageAdapter

- [x] 2.1 Implement `LocalStorageAdapter` class in `packages/storage/src/adapters/local-storage.ts` implementing `StorageBackend`
- [x] 2.2 Implement project serialization with ISO date string conversion and hydration
- [x] 2.3 Implement project CRUD with prefixed keys (`<prefix>project:<id>`)
- [x] 2.4 Implement settings CRUD with prefixed keys (`<prefix>setting:<key>`)
- [x] 2.5 Implement `getOPFSRoot()` delegation to `navigator.storage.getDirectory()`
- [x] 2.6 Export `LocalStorageAdapter` from package entry

## 3. Default Instance and Legacy Exports

- [x] 3.1 Create and export a default `storage` singleton initialized with `LocalStorageAdapter`
- [x] 3.2 Refactor legacy function exports (`saveProject`, `getProject`, etc.) to delegate to the default `storage` instance
- [x] 3.3 Remove `idb` dependency from `packages/storage/package.json`

## 4. Verification

- [x] 4.1 Run `npm run typecheck` in `packages/storage` to verify types compile
- [x] 4.2 Verify `@project/fs` and `@project/state` imports still work with the refactored exports
- [x] 4.3 Run full project typecheck to ensure no regressions (only pre-existing `@app/web` error, unrelated)
