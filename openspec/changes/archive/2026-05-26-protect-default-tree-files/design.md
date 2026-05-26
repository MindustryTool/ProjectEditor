## Context

The `DefaultProjectFileTree` class and `jsonProjectTree` singleton already exist in `packages/fs/src/index.ts`, used only during project initialization in `createProjectFileSystem`. The `ProjectFileSystem` class has no reference to it. The `FileExplorer` currently allows rename/delete on any path without restrictions.

## Goals / Non-Goals

**Goals:**
- Expose `defaultProjectTree` on `ProjectFileSystem` so consumers can check membership
- Hide rename and remove buttons on any file or folder that is a direct node in the default project tree
- Prevent accidental rename/delete by removing the UI affordance entirely
- Affect only rename and delete — not create, move, copy, or other filesystem operations

**Non-Goals:**
- Protecting user-created files inside default folders (e.g., `content/items/custom.hjson`) — only the default tree nodes themselves
- Protecting files at the VFS/OPFS layer — only the UI-level guard in FileExplorer
- Adding server-side or backend-level enforcement

## Decisions

1. **Store reference, not copy** — `ProjectFileSystem` stores `this.defaultProjectTree = jsonProjectTree` as a public readonly property. No cloning needed; the singleton is immutable in practice.
2. **Path set built at check time** — `DefaultProjectFileTree` already has a `walkTree` method. A helper function `isDefaultPath(tree, path)` walks the tree, builds a relative path for each node, and checks for exact match. This avoids storing a separate flat set.
3. **UI-level guard in FileExplorer** — The check happens in the rendering logic. `TreeNodeItem` uses `isDefaultPath()` to decide whether to show action buttons. If the path is in the default tree, the buttons are omitted entirely.
4. **Hide buttons, not block actions** — Instead of showing buttons and blocking with a toast, the buttons simply don't render for default tree items. This is cleaner UX: if an action isn't available, the affordance isn't shown.
5. **Implicit vs explicit permission** — No "force delete" escape hatch in this change. Users must manually edit the code or the OPFS if they truly need to remove default files. This can be revisited if users request it.

## Risks / Trade-offs

- **Risk: Path format mismatch** — The `currentPath` in FileExplorer is a relative path like `mod.hjson` or `content/items`. The default tree nodes are named similarly. A helper will correctly build relative paths from tree nodes for comparison.
- **Trade-off: No recursive protection** — Only exact node matches are blocked. Users can still add content inside default folders, but cannot delete/rename the default folders themselves. This is the desired behavior — protecting the structure while allowing user content.
