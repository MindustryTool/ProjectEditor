## 1. Remove Imperative Cache Clear

- [x] 1.1 Remove `useFileContentStore.getState().clearAllFileContents()` call from `closeProject()` action in `packages/state/src/index.ts`
- [x] 1.2 Remove the `import { useFileContentStore }` from `packages/state/src/index.ts`

## 2. Add Reactive Cache Clear

- [x] 2.1 In `packages/state/src/use-file-content.ts`, add a `useEffect` that watches `projectContext?.project.id ?? null` and calls `clearAllFileContents()` when the ID changes
- [x] 2.2 Ensure the effect does not fire on initial mount when no project is set (null stays null — no change detected, so no spurious clear)

## 3. Validation

- [x] 3.1 Run `pnpm --filter @project/state typecheck` to verify no type errors
