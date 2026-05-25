## Context

The current `FileContentEntry` uses an explicit status machine (`idle → dirty → saving → idle`) tracked by a `status` field. This forces every action to manage transitions, and every consumer (hook, validation listener, components) must understand the state machine. The store also uses a single global file cache keyed only by path, meaning switching projects clears all buffers. Additionally, `readFile` resets the version to 0, which conflates "disk version" with "edit version."

## Goals / Non-Goals

**Goals:**
- Eliminate explicit status transitions — derive `isDirty`, `isSaving`, `isLoading`, `isError` from version comparison
- Replace `status` field with `savedVersion` and `currentVersion` in `FileContentEntry`
- Key cache by `(projectId, path)` so switching projects preserves buffers
- Add LRU eviction to cap in-memory buffers
- Change validation trigger from status-based to version-change-based
- `readFile` writes `data` without resetting version
- Decouple WriteQueue from the status machine — it only syncs `savedVersion` on completion
- Validation runs against in-memory buffer, not disk

**Non-Goals:**
- No changes to WriteQueue debounce behavior or batching
- No changes to the validation engine (registry, runner, validators)
- No changes to MonacoEditor marker display logic (only the trigger changes)
- No UI redesign — only state management semantics change

## Decisions

### 1. State shape: `savedVersion` / `currentVersion` instead of `status`

**Decision:**
```
FileContentEntry {
  data: string | null
  currentVersion: number    // incremented on every local edit
  savedVersion: number      // synced to currentVersion on successful persist
  savedAt: number | null
  error: string | null
  loading: boolean          // true while a readFile is in-flight
}
```
Derived getters (not stored):
- `isDirty` = `currentVersion !== savedVersion`
- `isSaving` = `loading` is false and a write is in-flight for this path
- `isError` = `error !== null` (and `isDirty` is false — error cleared on next edit)

**Rationale**: Version comparison is the canonical definition of "dirty" (buffer differs from disk). The explicit status machine was duplicating this information. `loading` is kept as a simple boolean since it's a transient I/O flag, not a state derived from versions.

### 2. Action set: `writeBuffer` + `markPersisted` + `setBufferError`

**Decision:**
- Remove: `setFileDirty`, `setFileSaving`, `setFileSaved`, `setFileLoading`, `setFileError`
- Add: `writeBuffer(path, content)` — sets `data`, increments `currentVersion`, clears `error`
- Add: `markPersisted(path)` — sets `savedVersion = currentVersion`, updates `savedAt`
- Add: `setBufferError(path, err)` — sets `error` without touching versions
- Keep: `readFile`, `clearFileContent`, `clearAllFileContents`, `subscribeToEvents`, `cleanup`

**Rationale**: Three atomic actions replace five status transitions. The hook no longer orchestrates a sequence of calls — it calls `writeBuffer`, enqueues in WriteQueue, then on resolve calls `markPersisted`.

### 3. Per-project cache with `(projectId, path)` keying

**Decision:**
```
fileContents: Record<string, FileContentEntry>
// key = `${projectId}::${path}`
```
No `clearAllFileContents()` on project switch. The WriteQueue for the old project is flushed/disposed, but buffers remain accessible if the user switches back.

**Rationale**: Users may switch between projects frequently. Losing unsaved edits on switch is surprising. Per-project keying is simple and requires no additional data structure.

### 4. LRU eviction

**Decision:**
Add a `Map<string, FileContentEntry>` (maintains insertion order) with a configurable `maxEntries` (default 100). On `writeBuffer`, if size exceeds `maxEntries`, delete the oldest entry (first key in map). `clearFileContent` removes the entry explicitly. `readFile` re-inserts (bumps to end).

**Rationale**: Without eviction, every file ever opened accumulates in memory. An LRU approach based on `Map` insertion order is simple, O(1), and well-understood.

### 5. Validation trigger: version change

**Decision:**
Validation listener watches `currentVersion` across subscribe calls. If a file's `currentVersion` changed, schedule validation against `data` (in-memory buffer). This removes the `status === "dirty"` check.

**Rationale**: The current listener checks `status === "dirty"` because that's the only signal of user edits. With derived state, any `currentVersion` increment signals a change worth validating.

### 6. `readFile` semantics: no version reset

**Decision:**
- Remove the `expectedVersion` parameter from `readFile`
- On read start, capture `currentVersion` from the entry (or 0 if no entry)
- On read complete, discard if `currentVersion` has changed since capture → stale read detection still works
- On success, set `data`, set `loading = false`, set `savedVersion = currentVersion` (since disk is now in sync)
- Do NOT reset any version to 0

**Rationale**: Resetting version to 0 on every read was conflating "disk baseline" with "edit count." The version should only increment on user edits.

### 7. WriteQueue decoupling

**Decision:**
- `update()` in the hook calls `writeBuffer()`, then `queue.enqueue(path, data, currentVersion)`
- On enqueue resolve: if `currentVersion` hasn't changed, call `markPersisted()`
- On enqueue reject: if `currentVersion` hasn't changed, call `setBufferError()`
- No calls to `setFileSaving()` or `setFileSaved()`
- The hook's `isSaving` derived boolean is computed by checking if the queue has a pending write for the path

**Rationale**: WriteQueue no longer needs to know about status. It just persists content and reports back. The derived `isSaving` is computed from external queue state.

## Risks / Trade-offs

- **[Risk]** Per-project caching increases memory usage if user opens many projects.
  → **Mitigation**: LRU eviction caps total entries. Projects not actively used will have their oldest buffers evicted.
- **[Risk]** Derived `isSaving` requires querying the WriteQueue, which is not in the store.
  → **Mitigation**: The hook can track a `savingPaths: Set<string>` in a local ref, populated on enqueue and cleared on resolve/reject.
- **[Risk]** Removing `clearAllFileContents()` on project switch means stale buffers may persist.
  → **Mitigation**: The store provides an explicit `closeProject` cleanup. The hook can call it. The LRU will eventually evict stale entries.
- **[Risk]** Validation trigger switches from status-transition to version-change — may fire more often (on every keystroke vs once entering dirty).
  → **Mitigation**: Debounce (500ms) already exists in the listener. The debounce prevents per-keystroke validation anyway.
