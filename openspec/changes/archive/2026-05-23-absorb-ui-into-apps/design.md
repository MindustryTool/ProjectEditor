## Context

`packages/ui` exports three components: Button, FileTree, Editor. Only `Button` is actually consumed — by `apps/app`. `apps/web` lists `@project/ui` as a dependency but never imports it; it already has a full shadcn/ui component library. Maintaining a separate package for three small components that are only used by one consumer each adds build overhead, an extra workspace package, and import indirection.

## Goals / Non-Goals

**Goals:**
- Remove `packages/ui/` and its workspace entry
- Move `Button` into `apps/app/src/components/` (its sole consumer)
- Move `FileTree` and `Editor` into `apps/web/src/components/editor/` (where they're contextually relevant)
- Clean up `@project/ui` references from all `package.json` files
- Ensure `pnpm typecheck` and `pnpm build` pass

**Non-Goals:**
- Refactoring the components themselves (pure relocation)
- Adding new features to Button, FileTree, or Editor
- Changing the shadcn/ui setup in `apps/web`

## Decisions

1. **Button → `apps/app`** — Only `apps/app` imports Button. The app is a simple React + Vite shell; a small local Button component is appropriate. No need for shared abstraction.

2. **FileTree → `apps/web`** — The FileTree is a recursive file explorer component that depends on `FileEntry` from `@project/fs`. The web app is the primary codebase that will use this in its editor layout.

3. **Editor → `apps/web`** — Same reasoning as FileTree. The textarea-based editor is only relevant to the web app's editor page.

4. **No component duplication** — No component is needed in both apps, so no duplication is required.

## Risks / Trade-offs

- **[Future reuse]** If `apps/app` later needs FileTree or Editor, they'd need to be copied or a new shared package created → low probability given `apps/app` is a minimal shell
- **[Import path change]** `apps/app`'s import changes from `@project/ui` to `./components/Button` → trivial, no behavioral change
