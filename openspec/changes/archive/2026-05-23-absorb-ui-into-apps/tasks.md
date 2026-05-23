## 1. Move Button into apps/app

- [x] 1.1 Create `apps/app/src/components/Button.tsx` with the Button component copied from `packages/ui/src/button.tsx`
- [x] 1.2 Add `apps/app/src/components/index.ts` barrel export for Button
- [x] 1.3 Update `apps/app/src/app.tsx` to import Button from local `./components/Button` instead of `@project/ui`

## 2. Move FileTree and Editor into apps/web

- [x] 2.1 Create `apps/web/src/components/editor/FileTree.tsx` with the FileTree component from `packages/ui/src/file-tree.tsx`
- [x] 2.2 Create `apps/web/src/components/editor/Editor.tsx` with the Editor component from `packages/ui/src/editor.tsx`
- [x] 2.3 Add barrel exports for FileTree and Editor in the editor directory

## 3. Remove @project/ui from workspace

- [x] 3.1 Remove `@project/ui` dependency from `apps/app/package.json`
- [x] 3.2 Remove `@project/ui` dependency from `apps/web/package.json`
- [x] 3.3 Delete `packages/ui/` directory entirely
- [x] 3.4 Run `pnpm install` to update lockfile (14 workspace projects, @project/ui removed)

## 4. Verify

- [x] 4.1 Run `pnpm typecheck` — 10/10 packages passed ✓
- [x] 4.2 Run `pnpm build` — @app/app and @app/web build clean ✓
