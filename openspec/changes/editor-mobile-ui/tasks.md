## 1. Responsive Infrastructure

- [x] 1.1 Create `useMediaQuery` hook at `apps/web/src/hooks/use-media-query.ts` that uses `window.matchMedia` and returns a boolean

## 2. Mobile Layout Component

- [x] 2.1 Create `EditorMobileLayout` component at `apps/web/src/components/editor/EditorMobileLayout.tsx` with:
  - Toolbar at the top (reuses existing Toolbar with all menus + a Sheet trigger button for FileExplorer)
  - Sheet from the left containing FileExplorer
  - Tabs with `EditorCenterPanel` and `EditorRightPanel` as tab panels, `TabsTrigger` at the bottom
  - StatusBar at the bottom
- [x] 2.2 Add a Sheet trigger button (e.g., FolderOpen icon from lucide-react) to the mobile toolbar alongside existing menus

## 3. Shell Integration

- [x] 3.1 In `EditorShell.tsx`, import `useMediaQuery` with breakpoint `(min-width: 1024px)`
- [x] 3.2 Lazy-load `EditorMobileLayout` via `React.lazy(() => import("./EditorMobileLayout"))`
- [x] 3.3 Add conditional rendering in EditorShell: desktop layout when >=1024px, mobile layout when <1024px, wrapped in Suspense

## 4. Verification

- [x] 4.1 Run `npm run typecheck` in `apps/web` to verify no type errors (pre-existing errors in use-base-*.ts only, no errors in new or modified files)
- [x] 4.2 Run `npm run lint` in `apps/web` to verify no lint errors (no lint script in apps/web; build succeeds cleanly)
- [x] 4.3 Build the project to confirm no bundle issues
