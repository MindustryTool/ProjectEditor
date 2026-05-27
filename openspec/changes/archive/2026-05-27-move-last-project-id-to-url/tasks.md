## 1. Remove lastProjectId from store

- [x] 1.1 Remove `lastProjectId: string | null` from `AppState` interface in `packages/state/src/stores/project.ts`
- [x] 1.2 Remove `lastProjectId: null` from initial state in `packages/state/src/stores/project.ts`
- [x] 1.3 Remove `lastProjectId: state.lastProjectId` from `partialize` in `packages/state/src/stores/project.ts`
- [x] 1.4 Remove `set({ lastProjectId: project.id })` from `createNewProject` action in `packages/state/src/stores/project.ts`

## 2. Rename NoProjectScreen to ProjectsPage

- [x] 2.1 Rename `apps/web/src/components/editor/NoProjectScreen.tsx` to `ProjectsPage.tsx` and rename the component export
- [x] 2.2 Update import in `EditorPage.tsx` (if still needed) or remove it

## 3. Create projects routes

- [x] 3.1 Create `apps/web/src/routes/$lang/projects/index.tsx` — renders `ProjectsPage` component
- [x] 3.2 Create `apps/web/src/routes/$lang/projects/$id.tsx` — renders `EditorPage`, reads `$id` param
- [x] 3.3 Run TanStack Router code generation to update `routeTree.gen.ts`
- [x] 3.4 Remove or redirect `/$lang/editor` route to `/$lang/projects`

## 4. Update EditorPage to read project ID from URL

- [x] 4.1 Replace `useAppStore((s) => s.lastProjectId)` with `useParams({ from: projectsIdRoute })` or a generic param reader in `EditorPage.tsx`
- [x] 4.2 Update loading logic: if URL has project ID and project exists, load it; if not, redirect to `/projects`
- [x] 4.3 Remove the `lastProjectId` auto-restore effect fallback

## 5. Update create/import/open flows to navigate instead of setting lastProjectId

- [x] 5.1 Update `ProjectPickerScreen.tsx` to accept `onProjectSelected` callback and use it instead of `useAppStore.setState({ lastProjectId: ... })`
- [x] 5.2 Update `ProjectMenu.tsx` to navigate with `useNavigate()` after import instead of setting `lastProjectId`
- [x] 5.3 Update `useProjectActions.ts` — add navigation after `createProject` and `openProjectFromRecord` (or make navigation the caller's responsibility)

## 6. Clean up and verify

- [x] 6.1 Verify no remaining references to `lastProjectId` in the codebase
- [x] 6.2 Test route navigation: `/projects`, `/projects/:id` (valid and invalid), `/projects/:id` redirects correctly
- [x] 6.3 Run typecheck and lint
