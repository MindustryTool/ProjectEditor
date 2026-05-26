## Why

The `@project/storage` package is tightly coupled to IndexedDB via the `idb` library, making it impossible to swap storage backends for different environments (e.g., localStorage for simplicity, OPFS for large blobs, or a remote API). This coupling also complicates testing — tests that touch storage require an IndexedDB environment.

## What Changes

- Define a `StorageBackend` interface that abstracts all storage operations (project CRUD, settings CRUD, OPFS root handle)
- Implement a `LocalStorageAdapter` as the default storage backend, replacing direct IndexedDB usage
- Keep `ProjectRecord` and other shared types as-is
- Remove the `idb` dependency from `@project/storage`
- Consumers import through the interface but continue using the same function names via a default instance

## Capabilities

### New Capabilities
- `storage-interface`: Defines the `StorageBackend` interface contract for all storage operations (project CRUD, settings CRUD, OPFS root handle). Includes factory/DI mechanism to swap implementations.
- `local-storage-adapter`: Implements `StorageBackend` using `window.localStorage` with JSON serialization. Handles key prefixing, size limits, and fallback logic.

### Modified Capabilities
- None — no existing storage spec exists in `openspec/specs/`

## Impact

- `@project/storage` — remove `idb` dependency, replace IndexedDB code with interface + LocalStorageAdapter
- `@project/state` — import change: uses shared `StorageBackend` instance (interface is the same)
- `@project/fs` — unchanged (`getOPFSRoot` remains on the interface)
- `apps/web` and `apps/app` — no direct import changes (they import `@project/storage` transitively)
- Tests — easier to mock storage by providing a fake `StorageBackend`
