## Why

The `FileContentEntry.data` field is typed as `string | null`, but the underlying VirtualFileSystem operates on `ArrayBuffer`. This creates a design mismatch where binary files (sprites, sounds, maps) must bypass the file content store entirely and access `ProjectFileSystem` directly. By changing `data` to `ArrayBuffer | null | undefined`, the store becomes compatible with both text and binary content, eliminating the parallel pathways and enabling future features like binary file previews.

## What Changes

- **BREAKING**: `FileContentEntry.data` changes from `string | null` to `ArrayBuffer | null | undefined`
- `useFileContent()` hook adjusted to work with `ArrayBuffer`
- New `useFileContentString()` hook wraps `useFileContent()` to decode `ArrayBuffer` → `string` for text consumers
- `writeBuffer` and related store actions accept `ArrayBuffer | string` (string auto-encoded)
- `readFile` action uses `ProjectFileSystem.readFile()` (returns `ArrayBuffer`) instead of `readTextFile()`
- Monorepo package `@project/state` public API exports `useFileContentString`
- All existing string-based consumers switch to `useFileContentString()`
- Validation listener decodes `ArrayBuffer` to string before validation

## Capabilities

### New Capabilities
- `file-content-string-hook`: React hook `useFileContentString(path)` that returns decoded string data, for text-only consumers

### Modified Capabilities
- `file-content-store`: Requirement changes — `data` field type changes from `string | null` to `ArrayBuffer | null | undefined`, store actions accept both `string` and `ArrayBuffer`

## Impact

- **@project/state**: `FileContentEntry`, `FileContentStore`, `useFileContent`, store actions, validation listener
- **@project/state/index.ts**: New export `useFileContentString`
- **apps/web**: All 3 consumers (`EditorCenterPanel`, `ItemPanel`, `ModHjsonPanel`, `MonacoEditor`, `FileExplorer`) — switch to `useFileContentString` or update type usage
- **@project/state/validation/listener.ts**: Must decode `ArrayBuffer` to string for validation
- **@project/state/write-queue.ts**: `PendingWrite.content` changes to `ArrayBuffer | string`
