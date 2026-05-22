## Context

The editor components currently define their own color scheme via inline CSS custom properties on the `EditorPage` root div:

```tsx
style={{
  "--editor-bg": "#1e1e1e",
  "--editor-surface": "#252526",
  "--editor-border": "#3c3c3c",
  "--editor-text": "#cccccc",
  "--editor-muted": "#858585",
  "--editor-accent": "#007acc",
  "--editor-card": "rgba(255,255,255,0.04)",
  color: "#cccccc",
  backgroundColor: "#1e1e1e",
}}
```

These `--editor-*` variables are referenced via Tailwind arbitrary value syntax (`bg-[var(--editor-surface)]`, `text-[var(--editor-muted)]`, etc.) across 7 components. The `styles.css` `@theme` block also defines `--color-editor-*` tokens that are unused.

The shadcn theme already provides a full set of design tokens (`--background`, `--foreground`, `--card`, `--muted`, `--border`, `--accent`, etc.) with both light and dark variants.

## Goals / Non-Goals

**Goals:**
- Remove all `--editor-*` CSS variable definitions from `EditorPage.tsx`
- Replace all `var(--editor-*)` references with equivalent shadcn theme tokens
- Remove `--color-editor-*` entries from `styles.css` `@theme` block
- Preserve exact layout and spacing — only color/border/style references change

**Non-Goals:**
- Restructuring component layout or DOM hierarchy
- Changing component behavior or functionality
- Adding new components or UI elements
- Modifying the shadcn theme itself

## Decisions

1. **Replace `--editor-bg` with `bg-background`** — The root editor background maps directly to the app's background token.

2. **Replace `--editor-surface` with `bg-muted` / `bg-card`** — Side panels and surface areas use the muted background, which provides subtle differentiation in both themes.

3. **Replace `--editor-border` with `border-border`** — Standard border token for all border colors.

4. **Replace `--editor-text` with `text-foreground`** — Primary text color throughout.

5. **Replace `--editor-muted` with `text-muted-foreground`** — Secondary/muted text color.

6. **Replace `--editor-card` hover with `hover:bg-accent`** — The card hover effect maps to the accent background used for interactive hover states.

7. **Replace `--editor-accent` with `bg-primary` / `text-primary` variants** — Accent color maps to the primary token or accent token depending on context.

8. **Remove inline `color`/`backgroundColor` from `EditorPage.tsx`** — The shadcn theme handles these via `bg-background text-foreground` classes.

## Risks / Trade-offs

- **[Visual change]** The editor currently forces a dark VSCode-like appearance regardless of theme. After the change, the editor will follow the app theme. This is the intended outcome but is a visible difference.
- **[Missed mapping]** Some `--editor-*` usage may not have a perfect shadcn equivalent. In these cases, use the closest semantic token (e.g., `bg-muted` for surface, `bg-accent` for hover highlights).
- **[Layout shift risk]** Removing the inline `backgroundColor` may cause a flash of unstyled content if the shadcn theme hasn't initialized. Mitigated by the existing theme init script in `__root.tsx`.
