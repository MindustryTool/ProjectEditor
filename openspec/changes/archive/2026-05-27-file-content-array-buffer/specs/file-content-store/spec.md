## MODIFIED Requirements

### Requirement: File content Zustand store slice
The system SHALL provide a Zustand store slice within `@project/state` that caches file contents in memory keyed by `(projectId, path)` tuple. Each entry SHALL have `data`, `currentVersion`, `savedVersion`, `savedAt`, `error`, and `loading` fields. Derived state (`isDirty`, `isSaving`, `isLoading`, `isError`) SHALL be computed from these fields. The store SHALL be the single source of truth; filesystem is an async persistence layer only.

#### Scenario: Store holds file contents with version pair
- **WHEN** the store slice is initialized
- **THEN** it SHALL expose a `fileContents` record mapping cache keys (string) to entries containing `data` (`ArrayBuffer | null | undefined`), `currentVersion` (number), `savedVersion` (number), `savedAt` (number | null), `error` (string | null), and `loading` (boolean)

### Requirement: writeBuffer sets buffer content
Changed: `writeBuffer` now accepts `ArrayBuffer | string` as content. Strings are auto-encoded to `ArrayBuffer` via `TextEncoder.encode()` before storage.

#### Scenario: writeBuffer with ArrayBuffer
- **WHEN** `writeBuffer("mod.hjson", encodedBuffer)` is called with an `ArrayBuffer`
- **THEN** `data` SHALL be set to the `ArrayBuffer`, `currentVersion` SHALL increment by 1, `savedVersion` SHALL remain unchanged, `error` SHALL be cleared, and `loading` SHALL be set to `false`

#### Scenario: writeBuffer with string auto-encodes
- **WHEN** `writeBuffer("mod.hjson", "content")` is called with a string
- **THEN** `data` SHALL be set to the `TextEncoder.encode("content")` result (an `ArrayBuffer`), `currentVersion` SHALL increment by 1

### Requirement: readFile loads from disk as ArrayBuffer
Changed: `readFile` now calls `ProjectFileSystem.readFile(path)` (returns `ArrayBuffer`) instead of `readTextFile`.

#### Scenario: readFile loads from disk without resetting version
- **WHEN** `readFile(projectId, "mod.hjson", fs)` is called
- **THEN** the store SHALL set `loading` to `true`, call `ProjectFileSystem.readFile("mod.hjson")`, and on success set `data` to the `ArrayBuffer` content, set `loading` to `false`, and set `savedVersion = currentVersion`

#### Scenario: readFile handles not found
- **WHEN** `readFile` throws a `NotFoundError`
- **THEN** the store SHALL set `data` to an empty `ArrayBuffer` (byte length 0), `loading` to `false`, and `savedVersion = currentVersion`

## ADDED Requirements

### Requirement: FileContentEntry data defaults to undefined for uncached entries
The system SHALL represent uncached (not-yet-loaded) entries as `undefined` in the store's `fileContents` record, while loaded entries use `ArrayBuffer | null`.

#### Scenario: Uncache entry returns undefined
- **WHEN** `selectEntry(projectId, path)` is called for a path that has never been loaded
- **THEN** the selector SHALL return `undefined`
