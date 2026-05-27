## 1. Create Hook

- [x] 1.1 Create `packages/state/src/hooks/use-file-content-image-url.ts` with `useFileContentImageUrl(data)` hook
- [x] 1.2 Export `useFileContentImageUrl` from `packages/state/src/index.ts`

## 2. Refactor Consumers

- [x] 2.1 Refactor `ContentList.tsx` `SpritePreview` — replace manual `useMemo` + `useEffect` with `useFileContentImageUrl`
- [x] 2.2 Refactor `SpritePicker.tsx` `SpriteViewer` — replace manual `useMemo` + `useEffect` with `useFileContentImageUrl`

## 3. Verify

- [x] 3.1 Run `pnpm typecheck` across all packages
