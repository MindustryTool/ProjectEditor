## Why

`packages/ui` is a shared UI package that was intended for cross-app reuse, but only `apps/app` actually imports from it (just `Button`). `apps/web` has `@project/ui` as a dependency but never uses it — it has its own component library via shadcn/ui. The three components (Button, FileTree, Editor) are small and app-specific, so the shared package adds unnecessary workspace overhead and indirection.

## What Changes

- **BREAKING** Remove `packages/ui/` directory
- **BREAKING** Remove `@project/ui` from workspace package.json files
- Move `Button` component into `apps/app/src/components/Button.tsx` (sole consumer)
- Move `FileTree` component into `apps/web/src/components/editor/FileTree.tsx` (only relevant to web editor)
- Move `Editor` component into `apps/web/src/components/editor/Editor.tsx` (only relevant to web editor)

## Capabilities

### New Capabilities
- *(none — this is a restructuring, not a new feature)*

### Modified Capabilities
- *(none — no existing specs to modify)*

## Impact

- **`packages/ui`**: Entire package removed
- **`apps/app`**: Gains local `Button` component; `@project/ui` dependency removed
- **`apps/web`**: Gains local `FileTree` and `Editor` components; `@project/ui` dependency removed
- **`pnpm-workspace.yaml`**: Remove `packages/ui` from workspace if listed
