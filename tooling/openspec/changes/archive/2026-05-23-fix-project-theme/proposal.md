## Why

The project uses `next-themes` but has no `ThemeProvider`, causing potential runtime errors (e.g., in the sonner toast component). Theme logic is duplicated across `ThemeToggle.tsx` and `ViewMenu.tsx` using raw `useState`/`useEffect` + localStorage, with no SSR-safe initialization — leading to flash of unstyled content (FOUC). The theme should follow the [shadcn TanStack Start dark mode guide](https://ui.shadcn.com/docs/dark-mode/tanstack-start) for a clean, SSR-safe, single-source-of-truth approach.

## What Changes

- Create a proper `ThemeProvider` component using `ScriptOnce` from `@tanstack/react-router` for SSR-safe theme injection with no FOUC
- Replace duplicated custom theme logic in `ThemeToggle.tsx` and `ViewMenu.tsx` with the new `useTheme` hook
- Fix `sonner.tsx` to use the new local `useTheme` hook instead of `next-themes`
- Wrap the root layout (`__root.tsx`) with the new `ThemeProvider`
- Remove the `next-themes` dependency

## Capabilities

### New Capabilities
- `theme-provider`: SSR-safe theme provider with `ScriptOnce` injection, supporting `light`, `dark`, `system` modes with localStorage persistence

### Modified Capabilities
- *(none — no existing specs to modify)*

## Impact

- **Affected files**: `src/routes/__root.tsx`, `src/components/ThemeToggle.tsx`, `src/components/editor/ViewMenu.tsx`, `src/components/ui/sonner.tsx` — plus new file `src/components/theme-provider.tsx`
- **Dependencies**: Remove `next-themes` from `apps/web/package.json`
- **Behavior**: Theme switching appearance and localStorage key remain unchanged; internal mechanism shifts to `ScriptOnce`-based SSR-safe approach
