## Context

The `@project/storage` package currently exports a thin wrapper over IndexedDB (`idb` library) with functions like `saveProject`, `getProject`, `getSetting`, etc. All consumers import these functions directly. There is no interface — swapping storage requires changing `@project/storage` internals and retesting everything.

The package also exports `getOPFSRoot()` for the `@project/fs` package, which is a separate concern but lives here because OPFS is a storage API.

## Goals / Non-Goals

**Goals:**
- Define a `StorageBackend` interface that covers all current operations (project CRUD, settings CRUD, OPFS root)
- Implement `LocalStorageAdapter` as the default backend
- Export a pre-configured `storage` instance so existing consumers don't need to change their call sites
- Remove the `idb` dependency
- Make it straightforward to write a fake storage backend for tests

**Non-Goals:**
- Changing the shape of `ProjectRecord` or other shared types
- Changing the `@project/fs` import of `getOPFSRoot` (it stays as a re-export)
- Adding new storage operations beyond what currently exists
- Supporting OPFS as a project/settings storage backend

## Decisions

1. **Interface name `StorageBackend` instead of `IStorage`** — follows the existing codebase convention (`VirtualFileSystem`, `FileEntry`, etc.). No `I` prefix.

2. **Single interface for all operations** — projects, settings, and OPFS root all share one contract. Keeps the API surface small and avoids multiple imports. Consumers that only need part of it can depend on the interface type.

3. **Default singleton instance** — the module creates and exports a `storage: StorageBackend` instance initialized with `LocalStorageAdapter`. Consumers continue writing `import { saveProject } from "@project/storage"` but under the hood it delegates to `storage.saveProject(...)`. No DI container needed.

4. **localStorage with JSON serialization** — `ProjectRecord` fields including `Date` objects are serialized as ISO strings and deserialized back. The adapter handles prefixing keys (e.g., `pe:project:<id>`, `pe:setting:<key>`) to avoid collisions.

5. **Keep `getOPFSRoot` as a separate re-export** — OPFS is a different storage domain. The interface has a `getOPFSRoot()` method, but `@project/storage` also re-exports it as a standalone function for convenience (`@project/fs` uses it that way).

## Risks / Trade-offs

- **localStorage size limit (~5-10 MB)** — Project data is small (JSON metadata), so this is acceptable. If projects grow large blobs, a future adapter can use OPFS.
- **Date serialization** — `JSON.parse` returns strings for dates. The adapter must hydrate `createdAt`/`updatedAt` back to `Date` objects on read. Mitigation: explicit mapping in the adapter.
- **No transactional guarantees** — localStorage does not support atomic multi-key operations. Current usage only reads/writes one record at a time, so this is not a regression.
- **Synchronous localStorage** — all operations become synchronous under the hood but the interface remains async (`Promise`). This keeps the contract stable if a future adapter is truly async.
