## Context

The `FileContentEntry.data` field is currently `string | null`, matching the original text-only design of `useFileContent`. However, the lowest-level `VirtualFileSystem.readFile()` returns `ArrayBuffer`, and all binary file access (sprites via `SpritePicker.tsx`, ZIP export via `JsonExporter.ts`) must bypass the store. This creates two parallel patterns: store-based text access and direct-fs binary access. The goal is to make the store natively binary-capable so all file types share one path.

The file-content store uses an LRU cache (`lruMap`), version-based staleness detection (`currentVersion` vs `savedVersion`), a `WriteQueue` that debounces disk writes, and event-bus integration for external file changes.

## Goals / Non-Goals

**Goals:**
- `FileContentEntry.data` type changes from `string | null` to `ArrayBuffer | null | undefined`
- `useFileContent()` returns `ArrayBuffer`-typed data
- New `useFileContentString()` hook wraps `useFileContent()` and decodes `ArrayBuffer` → `string` via `TextDecoder`
- `writeBuffer` and `WriteQueue.enqueue` accept `ArrayBuffer | string` (string auto-encoded to `ArrayBuffer`)
- All existing text consumers switch to `useFileContentString()` with zero behavioral change
- Validation listener decodes `ArrayBuffer` to string before running validators
- `readFile` store action uses `fs.readFile()` (returns `ArrayBuffer`) instead of `fs.readTextFile()`

**Non-Goals:**
- Binary file editing in Monaco (not needed yet)
- Binary diff/versioning support
- Changing the `VirtualFileSystem` interface
- New UI for binary file preview

## Decisions

### Decision 1: `data` type → `ArrayBuffer | null | undefined`
Using `undefined` (instead of just `null`) to distinguish "not yet loaded" from "loaded and empty". This makes `null` mean "explicitly empty content" and `undefined` mean "no entry exists". Selector returns `undefined` for uncached entries, matching Zustand's default behavior.

### Decision 2: `writeBuffer` accepts `ArrayBuffer | string` with auto-encode
Rather than forcing all callers to encode strings manually, `writeBuffer` and `WriteQueue.enqueue` accept a union type. Strings are encoded via `TextEncoder.encode()` before storage. This keeps the internal representation uniform (`ArrayBuffer`) while providing a convenient API for text callers.

### Decision 3: `readFile` switches to `fs.readFile()` (binary)
The store action reads raw `ArrayBuffer` from disk. The `NotFoundError` fallback produces an empty `ArrayBuffer` (byte length 0) instead of an empty string. This is consistent with the binary model — "file not found" means zero bytes.

### Decision 4: `useFileContentString()` as a thin wrapper
Instead of modifying `useFileContent` to have a string mode, a separate hook provides the string decoding. This keeps the core hook simple and avoids conditional type complexity. The wrapper decodes on every render via `useMemo`.

Alternatives considered:
- **Generic hook** (`useFileContent<T = ArrayBuffer>`): Adds type complexity, doesn't simplify consumers.
- **Option parameter** (`useFileContent(path, { asString: true })`): Hides the conversion, makes the return type conditional and harder to type.

### Decision 5: Validation listener decodes via `TextDecoder`
The listener calls `scheduleValidation(key, currEntry.data)` where `data` is now `ArrayBuffer`. A `TextDecoder().decode(data)` converts before passing to validators. If `data` is `null` or `undefined`, empty string is used.

### Decision 6: Write queue flushes via `fs.writeTextFile` (string) or `fs.writeFile` (binary)
Since `WriteQueue` may now hold either encoded `ArrayBuffer` or original `string` content, the flush logic checks the type. Strings go through `writeTextFile` (which internally encodes), `ArrayBuffer` goes through `writeFile`. This avoids double-encoding.

## Risks / Trade-offs

- **[Performance] `useFileContentString()` decodes on every render** → Mitigation: `useMemo` with `data` as dependency; if `data` reference is stable, decode is skipped
- **[Migration] All string consumers must be updated** → Mitigation: grep for `useFileContent(` across the codebase; only 3 consumer files
- **[Breaking] `FileContentEntry.data` type change may affect external store subscribers** → Mitigation: `useFileContentStore.subscribe` callers check for `data` type; the validation listener is already handled
- **[Edge case] Empty file read returns `ArrayBuffer(0)` instead of `""`** → `useFileContentString` handles this: `data.byteLength === 0` → `""`
