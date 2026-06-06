## Context

`TreeNodeRow` is the leaf component in the file explorer tree, rendered once per file/folder node. A typical Mindustry project has 100–400 files, meaning 100–400 `<DropdownMenu>` components are mounted simultaneously — each creating Radix UI primitives (trigger, content, portal, backdrop) in the DOM. This inflates the render tree and adds ~5–15 ms of layout cost per node on interaction.

The existing zustand selectors in `TreeNodeRow` create new anonymous functions on every render cycle (e.g., `useFileStore((state) => isDirty(state.getEntry(...)))`). While `useShallow` is used for validation, the file-store selectors are not memoized, causing child re-renders when parent store slices change.

## Goals / Non-Goals

**Goals:**
- Reduce DOM node count by 1 Radix `<DropdownMenu>` subtree per tree row (~8–12 nodes × 200 rows = ~1600–2400 fewer DOM nodes)
- Eliminate re-renders of `TreeNodeRow` caused by inline zustand selector closures
- Keep existing UX (hover-to-reveal More button, Rename/Delete actions) intact
- Maintain accessibility (keyboard navigation, ARIA attributes)

**Non-Goals:**
- Rewriting the store layer in `@project/core`
- Changing the `useFileExplorerState` React context to zustand
- Altering validation, file-loading, or dirty-indicator behavior
- Optimizing `TreeNodeChildren` recursive rendering

## Decisions

1. **Single floating `DropdownMenu` in `FileExplorer` instead of zustand store for dropdown state**
   - The dropdown state (open/closed, position, target path) is purely UI-local and ephemeral. A simple `useState<{path: string; x: number; y: number} | null>` in `FileExplorer` is sufficient. A zustand store would add indirection without benefit.
   - Alternative considered: zustand slice for dropdown state — rejected because the state has only two consumers (the trigger button and the dropdown renderer), both colocated in `FileExplorer`.

2. **Absolute positioning via `position: fixed` on dropdown content, set from `currentTarget.getBoundingClientRect()`**
   - The dropdown appears at the right edge of the clicked row button, regardless of scroll position. Using `fixed` positioning with viewport coordinates avoids clipping inside overflow containers.
   - Alternative considered: CSS anchor positioning (`anchor-name`) — not yet stable enough across browsers.

3. **Callback prop `onContextMenu(path: string, anchorRect: DOMRect)` instead of event bubbling**
   - `TreeNodeRow` emits the click event with the rect; `FileExplorer` decides to open. This keeps `TreeNodeRow` stateless and `FileExplorer` as the single source of truth for which dropdown is open.
   - Alternative considered: DOM event bubbling with `data-path` attribute — rejected because it couples the parent to DOM structure and bypasses React's event system.

4. **Dynamic selector factories with `useShallow` for file-store access**
   - The store already exports `selectIsSaving(projectId, path)` which returns a stable selector function. Wrap it with `useShallow` to prevent re-renders when unrelated store slices change.
   - `isItemDirty`: replace inline `(state) => isDirty(state.getEntry(...))` with a stable factory. The store's `getEntry` method reads from the LRU map, which is constant-time. The selector should reference `state.fileContents` directly.
   - Alternative considered: using `useSyncExternalStore` — adds complexity for the same result.

5. **Pass `loadFile` reference through context rather than per-row zustand selector**
   - `loadFile` never changes (it's defined at store creation). Using `useFileStore((s) => s.loadFile)` on every row is wasteful — the same reference is returned every time. Extract it once at the `FileExplorer` level and inject via context.

## Risks / Trade-offs

- **Scrolling while dropdown is open**: The dropdown stays at fixed viewport coordinates. If the user scrolls, the dropdown won't follow. → Mitigation: Close dropdown on scroll (listen to container `onScroll`).
- **Many rows still render per-frame**: This refactor improves per-row cost but doesn't reduce the number of rows rendered. Virtualization (e.g., `react-window`) is a separate concern.
- **Context-menu callback creates a new function reference each render in `TreeNodeChildren`**: Use `useCallback` at the `FileExplorer` level to keep the callback stable.
