## 1. Rename resolveJsonContentImage to resolveContentSprite

- [x] 1.1 Rename function in `apps/web/src/lib/utils.ts` — change `resolveJsonContentImage` to `resolveContentSprite`
- [x] 1.2 Update import and usage in `apps/web/src/components/editor/center/ContentList.tsx` to use new name

## 2. Add tree lookup utility for sprite existence check

- [x] 2.1 Create a helper `findFileInTree(tree: FileEntry[], path: string): FileEntry | null` in `apps/web/src/lib/utils.ts` that checks if a file path exists in the project tree snapshot

## 3. Implement SpritePicker component

- [x] 3.1 Implement `SpritePicker.tsx` — derive sprite path via `resolveContentSprite(path)`, check existence via tree snapshot, render `<img>` with object URL when sprite exists
- [x] 3.2 Add upload flow — hidden `<input type="file" accept=".png">` triggered by a button, read as ArrayBuffer, write via `ProjectFileSystem.writeFile()`
- [x] 3.3 Add replace/remove buttons — replace re-triggers file picker, remove calls `ProjectFileSystem.delete()`
- [x] 3.4 Handle edge cases — loading state while reading sprite binary, error fallback if read fails, object URL cleanup on unmount, tree staleness after write/delete

## 4. Wire SpritePicker into editor routing

- [x] 4.1 Import `SpritePicker` and `useCurrentProject` in `EditorRightPanel.tsx`
- [x] 4.2 Add route: for `path.startsWith("content") && path.endsWith(".json")` that is NOT an item — render `<SpritePicker path={path} />`
