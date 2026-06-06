## Why

The file explorer can render hundreds of TreeNodeRow components, each mounting an independent `DropdownMenu` (Radix UI) with its own trigger, content, and portal. This causes unnecessary DOM nodes and layout computations even when the dropdown is never opened. Additionally, zustand selectors in `TreeNodeRow` extract store slices inline, creating new function references on every render and preventing proper memoization.

## What Changes

- **Remove `<DropdownMenu>` from `TreeNodeRow`**: Replace the per-row `DropdownMenu` wrapper with a simple button that calls a callback (`onContextMenu`) with the `currentTarget` position.
- **Single `<DropdownMenu>` at `FileExplorer` level**: Render one `DropdownMenu` that opens at the stored position (anchored via absolute positioning from `currentTarget.getBoundingClientRect()`).
- **Extract zustand selectors into dynamic selector factories**: Use `useShallow` with stable selector factories (e.g., `selectEntry`, `selectIsSaving`) to avoid unnecessary re-renders.
- **Move dropdown state into its own minimal store slice** (or a simple `useState` + context) so only `FileExplorer` manages open/close/position state — no prop drilling.

## Capabilities

### New Capabilities
- `context-menu-positioning`: Position a single floating dropdown at the `currentTarget` of the clicked row, using `getBoundingClientRect()` for pixel-perfect placement.
- `dynamic-selector-optimization`: Pattern for creating and using zustand dynamic selector factories (`selectEntry`, `selectIsSaving`) with `useShallow` to prevent cascading re-renders in large lists.

### Modified Capabilities
- (none — existing spec-level behavior is unchanged; only internal rendering is optimized)

## Impact

- **`apps/web/src/components/editor/file-explorer/TreeNodeRow.tsx`**: No longer imports or renders `DropdownMenu`. Adds a context-menu button that calls `onContextMenu(path, rect)`. Store selectors use dynamic selector factories.
- **`apps/web/src/components/editor/file-explorer/FileExplorer.tsx`**: Renders a single `<DropdownMenu>` anchored at the recorded position. Manages open/close/position state locally.
- **`apps/web/src/components/editor/file-explorer/TreeNodeChildren.tsx`**: Updated to pass the context-menu handler through props.
- **`@project/core` stores**: No changes — the dynamic selector factories already exist (`selectEntry`, `selectIsSaving`); the refactor is at the consumer level.
- **`../../ui/dropdown-menu`**: Unchanged. Still used, but only once per FileExplorer instead of once per TreeNodeRow.
