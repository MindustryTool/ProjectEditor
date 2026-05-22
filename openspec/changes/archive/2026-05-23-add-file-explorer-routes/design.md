## Context

The editor's left panel renders a hardcoded `<div>` with two file entries (`mod.json`, `content.json`). There's no tree structure, no folder expansion, and no URL state. The `packages/ui/src/file-tree.tsx` component exists but is not used — it depends on `@project/fs`'s `FileHandle` type and doesn't render child directories.

The user needs a static file tree representing a Mindustry mod's expected project layout, with selection state synced to the URL via `?path=` query parameter for deep-linking and browser navigation.

## Goals / Non-Goals

**Goals:**
- Install `nuqs` and wrap the app with `<NuqsAdapter>` in the root route shell component
- Create a `FileExplorer` component rendering the Mindustry mod directory tree with expandable folders and file/folder icons
- Sync selected file/folder to URL query param `?path=` using `useQueryState` from nuqs
- Replace the hardcoded file list in `EditorPage.tsx` with the new component

**Non-Goals:**
- Real filesystem integration (the tree is static; actual file I/O is separate)
- Drag-and-drop or file operations
- Search/filter of the tree
- Multi-select

## Decisions

1. **nuqs over TanStack Router's built-in search params** — nuqs provides a simpler `useQueryState` hook that avoids needing `validateSearch` schemas on every route. The TanStack Router adapter (`NuqsAdapter`) integrates it cleanly without leaking into route definitions.

2. **Static tree data model** — Define the directory structure as a recursive TypeScript array of `TreeNode` objects (each with `name`, `type: "file" | "folder"`, and optional `children`). This keeps the structure declarative and easy to modify.

3. **CSS-based folder expansion** — Use local `expanded` state per folder (not URL-synced). Only the selected leaf file/folder path goes to the URL. This prevents URL bloat from expansion state.

4. **Lucide icons** — Use `Folder`, `File`, and related icons from `lucide-react` (already a dependency) for the tree nodes. Consistent with the rest of the UI.

5. **Single `?path=` query param** — The URL stores the selected path as a string (e.g., `?path=content/blocks`, `?path=mod.hjson`). The component reads this on mount to restore selection and highlights the corresponding node.

## Risks / Trade-offs

- [nuqs is experimental with TanStack Start] → The TanStack Router adapter docs note it's experimental and doesn't yet cover TanStack Start (SSR). For the editor page (client-side), this is fine. If SSR issues arise, fall back to TanStack Router's built-in `validateSearch`.
- [Static tree doesn't reflect actual filesystem] → This is intentional for the initial implementation. A future change can hook into `@project/fs` to show real files.
