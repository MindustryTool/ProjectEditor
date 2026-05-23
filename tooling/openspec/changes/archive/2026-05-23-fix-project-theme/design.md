## Context

The `apps/web` app uses TanStack Start (SSR), Tailwind v4, and shadcn/ui. Theme switching is done via a custom `useState` + `useEffect` + `localStorage` approach, duplicated in `ThemeToggle.tsx` and `ViewMenu.tsx`. The package `next-themes` is installed but unused except in `sonner.tsx` where `useTheme` would throw because no `ThemeProvider` exists.

The CSS uses a dual mechanism: `@custom-variant dark (&:where([data-theme="dark"]))` for Tailwind `dark:` utilities, and `.dark` class for CSS variable overrides. The current custom implementation sets both `.dark`/`.light` classes and `data-theme` attribute. There is no SSR-safe initialization — the theme flashes on load (FOUC).

## Goals / Non-Goals

**Goals:**
- Eliminate theme flash (FOUC) via SSR-safe `ScriptOnce` injection
- Replace duplicated theme logic with a single `ThemeProvider` + `useTheme` hook
- Fix sonner component to use the local `useTheme` instead of `next-themes`
- Maintain backward compatibility with existing `localStorage` key (`"theme"`) and value semantics (`"light"`, `"dark"`, `"auto"`)
- Keep both CSS class (`.dark`/`.light`) and `data-theme` attribute for CSS variable overrides and Tailwind dark variant

**Non-Goals:**
- Changing the appearance or behavior of the theme toggle UI
- Refactoring CSS color variables or color schemes
- Adding new theme modes (e.g., high contrast)
- Changing the Tailwind dark variant selector

## Decisions

1. **Local ThemeProvider vs next-themes** — The shadcn TanStack Start guide recommends a custom `ThemeProvider` using `ScriptOnce` from `@tanstack/react-router`. This is preferred over `next-themes` because:
   - `ScriptOnce` integrates natively with TanStack Router's SSR pipeline
   - No extra dependency needed
   - Full control over DOM mutations (setting both class and `data-theme`)
   - `next-themes` has no built-in TanStack Start support

2. **Dual DOM mutations (class + data-theme)** — The existing CSS requires both `.dark` class (for `:root`/`.dark` variable overrides) and `data-theme="dark"` (for Tailwind's `@custom-variant dark`). The ThemeProvider's `applyTheme` helper sets both to avoid breaking existing styling.

3. **localStorage key `"theme"`** — Existing users have preferences saved under this key. Using the same key ensures zero migration cost. Value `"auto"` is treated as `"system"` internally.

4. **Sonner integration** — The sonner `theme` prop accepts `"light" | "dark" | "system"`. Our `useTheme` returns `theme` where `"auto"` is mapped to `"system"` for the sonner component.

## Risks / Trade-offs

- **[Backward compat]** Existing users with `"auto"` value in localStorage → automatically handled, no migration needed
- **[ScriptOnce CSP]** If a Content-Security-Policy blocks inline scripts, `ScriptOnce` won't work → fallback: the `useEffect` in ThemeProvider will still set the theme on hydration (with FOUC). No CSP is currently configured.
- **[Sonner theme mismatch]** If sonner's internal theme detection differs from ours → low risk, sonner accepts explicit theme string
