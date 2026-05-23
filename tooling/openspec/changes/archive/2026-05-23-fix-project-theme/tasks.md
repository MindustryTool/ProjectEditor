## 1. Create ThemeProvider component

- [x] 1.1 Create `src/components/theme-provider.tsx` with `ThemeProvider`, `useTheme`, and SSR-safe `ScriptOnce` injection
- [x] 1.2 Implement `applyTheme` helper that sets both CSS class (`.dark`/`.light`) and `data-theme` attribute and `colorScheme` on `<html>`
- [x] 1.3 Implement `getThemeScript` that generates the inline script for SSR-safe theme injection before React hydration

## 2. Wire ThemeProvider into root layout

- [x] 2.1 Add `suppressHydrationWarning` to `<html>` tag in `__root.tsx` (already present)
- [x] 2.2 Import and wrap `<Outlet />` with `<ThemeProvider defaultTheme="system" storageKey="theme">` in `__root.tsx`

## 3. Refactor ThemeToggle to use useTheme

- [x] 3.1 Import `useTheme` from `~/components/theme-provider` in `ThemeToggle.tsx`
- [x] 3.2 Replace custom `useState`/`useEffect`/`applyThemeMode` with `useTheme` hook
- [x] 3.3 Ensure toggle cycles light → dark → system → light and displays current mode label

## 4. Refactor ViewMenu to use useTheme

- [x] 4.1 Import `useTheme` from `~/components/theme-provider` in `ViewMenu.tsx`
- [x] 4.2 Replace custom theme state and `applyTheme` with `useTheme` hook
- [x] 4.3 Remove duplicated theme logic (keep language switching logic unchanged)

## 5. Fix Sonner to use local useTheme

- [x] 5.1 Replace `import { useTheme } from "next-themes"` with `import { useTheme } from "~/components/theme-provider"`
- [x] 5.2 Map theme value `"system"` for the Sonner `theme` prop when our theme is `"system"`

## 6. Clean up next-themes dependency

- [x] 6.1 Remove `"next-themes"` from `apps/web/package.json`
- [x] 6.2 Run `pnpm install` to update lockfile (next-themes removed)

## 7. Verify

- [x] 7.1 Run `pnpm typecheck` in `apps/web` to ensure no type errors
- [x] 7.2 Run `pnpm build` in `apps/web` to verify no build errors
- [x] 7.3 Run `pnpm test` in `apps/web` (pre-existing Cloudflare Vite plugin × Vitest env incompatibility — not caused by theme changes)
