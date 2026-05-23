## Context

The `Project` interface in `@project/core` embeds `files: ProjectFile[]` as a simple array of in-memory objects. The `FileSystemAdapter` in `@project/fs` provides basic file operations but lacks `rename`, `move`, `copy`, `watch`, `stat`, and `readdir`. The OPFS root handle exists in `@project/storage` but is never wired up. There is no event system — cross-cutting concerns like "file changed" or "project saved" have no communication channel.

The Zustand store (`@project/state`) holds a raw `Project` object; file operations are tightly coupled to the project model, preventing lazy loading or streaming.

## Goals / Non-Goals

**Goals:**
- Strip `files: ProjectFile[]` from the project model, making it a metadata-only `ProjectInfo`
- Define a rich `VirtualFileSystem` interface (read/write/delete/mkdir/readdir/stat/exists/rename/move/copy/watch)
- Implement `OPFSAdapter` wrapping the Origin Private File System
- Create a lightweight `EventBus` for publish/subscribe events
- Introduce `ProjectContext` bundling `project: ProjectInfo + fs: VirtualFileSystem + events: EventBus`
- Refactor the Zustand store to hold `ProjectContext` instead of raw `Project`

**Non-Goals:**
- Fully replacing IndexedDB project metadata storage (stays as-is)
- Implementing file sync or conflict resolution
- Changing the UI file tree or editor components
- Adding authentication or permissions

## Decisions

1. **EventBus in `@project/core`** — A minimal typed pub/sub (no external lib). Keeping it in `@project/core` makes it available to all layers without circular deps. Using `type EventMap = Record<string, unknown[]>` pattern for type safety.

2. **VirtualFileSystem in `@project/fs`** — The FS abstraction belongs with the existing file system code. `FileSystemAdapter` will be replaced by the richer `VirtualFileSystem`. `FileEntry`/`FileStat` types added alongside.

3. **OPFSAdapter in `@project/fs`** — Implements `VirtualFileSystem` using `FileSystemDirectoryHandle` from `navigator.storage.getDirectory()`. The `@project/fs` package already depends on `@project/storage`, which exposes `getOPFSRoot()`.

4. **Project in `@project/core` renamed to `ProjectInfo`** — Clearer name for a metadata-only record. The `ProjectContext` (in `@project/state`) becomes the runtime handle that carries the fs and event bus alongside the info.

5. **ProjectContext in `@project/state`** — It assembles `ProjectInfo` (from core), `VirtualFileSystem` (from fs), and `EventBus` (from core). `@project/state` gains a dependency on `@project/fs`.

6. **No new package** — Keeping everything in existing packages avoids additional workspace overhead.

## Risks / Trade-offs

- **[Breaking rename]** `Project` → `ProjectInfo` affects all consumers → add type alias `Project = ProjectInfo` temporarily, mark deprecated, remove in follow-up
- **[OPFS browser support]** OPFS requires modern Chromium-based browsers → `OPFSAdapter` can throw a clear `UnsupportedError` at construction time when unavailable
- **[EventBus memory leak]** Subscribers not unsubscribing → `EventBus.subscribe()` returns `Unsubscribe` (void function); enforce via linting
- **[Dep coupling]** `@project/state` gains dep on `@project/fs` → previously it only depended on `@project/core` + `@project/config`
