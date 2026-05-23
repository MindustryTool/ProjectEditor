## Context

The `@project/state` package currently holds a Zustand store with `ProjectContext` containing `ProjectInfo`, `ProjectFileSystem`, and `EventBus`. File editors and forms need to read and write file content, but there is no in-memory cache. Each component currently must re-read from disk on mount and write directly on every change. This creates redundant I/O, inconsistent states across components editing the same file, and no pattern for debounced persistence.

The existing `ProjectFileSystem` already provides `readTextFile` and `writeTextFile` — we need a thin caching layer on top of it.

## Goals / Non-Goals

**Goals:**
- Provide a React hook `useFileContent(path)` that any editor component can use as the single source of truth for file data
- Cache file content in a Zustand store slice (in-memory, not persisted to localStorage)
- Load content from disk lazily on first access via `ProjectFileSystem`
- Debounce writes to disk (default 500ms) to batch rapid edits
- Surface loading and error states per file path
- Sync with `EventBus` `file:changed` events so external changes are reflected

**Non-Goals:**
- Full CRDT or conflict resolution for concurrent edits
- Binary file content support (text-only for now; binary can be added later)
- File tree or directory-level operations (existing `ProjectFileSystem` handles those)
- Cross-tab sync (future concern)

## Decisions

**Decision 1: Store slice in existing `@project/state` store vs. separate store**
Separate store. The file content cache is high-churn (changes on every keystroke) and should not be persisted to localStorage alongside the main store. A separate `useFileContentStore` keeps concerns clean and avoids bloating the persisted project store.

**Alternatives considered:**
- Adding to the main `useProjectStore`: Rejected because the persist middleware would continuously serialize the entire cache on every change, degrading performance.
- No store at all (just `useState` + `useEffect` in each component): Rejected because components editing the same file would have independent state; no cache sharing.

**Decision 2: Store structure — flat map vs. normalized**
Flat `Record<path, FileContentEntry>` map. Each entry holds `{ data, isLoading, error }`. Simple, sufficient for the expected ~10-50 open files.

**Alternatives considered:**
- Normalized with separate entities: Overkill for this scale. The flat map is O(1) lookup and trivially cleared on project close.

**Decision 3: Debounce utility — lodash.debounce vs. custom**
Use a custom `useDebouncedCallback` or inline `setTimeout`/`clearTimeout`. The `@project/state` doesn't currently depend on lodash, and a debounce for this use case is ~5 lines. Avoids adding a dependency.

**Alternatives considered:**
- `lodash.debounce`: Adds ~4KB to the bundle. Not worth it for a single debounce.
- `use-debounce` package: Same reasoning.

**Decision 4: Hook placement — `@project/state` vs. `@project/hooks`**
Co-locate in `@project/state` since it directly depends on the store and is the canonical location for project state primitives. No separate hooks package exists yet.

**Alternatives considered:**
- New `@project/hooks` package: Premature. Can extract later if a generic hooks pattern emerges.

**Decision 5: Debounce delay value**
500ms default, configurable via the hook's options parameter. Matches the existing `settings.autoSaveDelay` convention.

## Risks / Trade-offs

- **Memory growth**: Each open file's content is held in memory. Mitigation: files are loaded lazily and entries are cleared on project close. For text files in a mod project (~100KB each), this is negligible.
- **Stale cache on external writes outside EventBus**: If another tab modifies the file, this cache won't know. Mitigation: the OPFS `watch` API is limited; EventBus integration covers in-app changes. Cross-tab sync is a future non-goal.
- **Debounced write loss on crash**: If the browser tab crashes before the debounce timer fires, unsaved content is lost. Mitigation: same as any in-memory editor. The save is best-effort; the autoSaveDelay setting lets users trade off write frequency vs. battery/performance.
