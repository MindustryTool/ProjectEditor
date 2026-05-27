## 1. Debounce refreshTree

- [x] 1.1 Import `debounce` from `@project/utils` in `packages/fs/src/index.ts` and wrap `refreshTree()` — trailing-edge debounce at 50ms, with a `force` parameter to bypass
- [x] 1.2 Add `force` boolean parameter to `refreshTree(force?: boolean): Promise<FileEntry[]>` — when `true`, clears pending debounce and refreshes immediately

## 2. Add writeFiles batch method

- [x] 2.1 Implement `writeFiles(entries: { name: string; data: Uint8Array }[])` on `ProjectFileSystem` — iterates entries, creates parent dirs, writes files, calls `refreshTree(true)` once at the end

## 3. Update import flow

- [x] 3.1 Replace the sequential `for` loop in `ProjectMenu.tsx` with a single `fs.writeFiles(result.entries)` call

## 4. Verify

- [x] 4.1 Run `pnpm typecheck` across all packages
