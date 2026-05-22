## 1. Core Editor Components

- [x] 1.1 Remove inline CSS variables and `color`/`backgroundColor` from `EditorPage.tsx` root div; replace with `bg-background text-foreground` classes
- [x] 1.2 Update `Toolbar.tsx` — replace `bg-[var(--editor-surface)]` with `bg-muted`
- [x] 1.3 Update `StatusBar.tsx` — replace `bg-[var(--editor-surface)]` with `bg-muted`, `text-[var(--editor-muted)]` with `text-muted-foreground`

## 2. SplitView & Panel

- [x] 2.1 Update `SplitView.tsx` — replace `bg-[var(--editor-surface)]` with `bg-muted`, `bg-[var(--editor-border)]` with `bg-border`, `bg-[var(--editor-bg)]` with `bg-background`, `text-[var(--editor-muted)]` with `text-muted-foreground`, `hover:bg-[var(--editor-accent)]` with `hover:bg-accent`, `active:bg-[var(--editor-accent)]` with `active:bg-accent`
- [x] 2.2 Update `Panel.tsx` — replace `text-[var(--editor-muted)]` with `text-muted-foreground`

## 3. Menu Components

- [x] 3.1 Update `FilesMenu.tsx` — replace `text-[var(--editor-text)]` with `text-foreground`, `hover:bg-[var(--editor-card)]` with `hover:bg-accent`, `active:bg-[var(--editor-border)]` with `active:bg-accent`, `text-[var(--editor-muted)]` with `text-muted-foreground`
- [x] 3.2 Update `ExportMenu.tsx` — same replacements as FilesMenu

## 4. CSS Cleanup

- [x] 4.1 Remove `--color-editor-*` entries from `styles.css` `@theme` block (already removed)
- [x] 4.2 Remove any remaining unused `--editor-*` CSS variable definitions from `styles.css` (already removed)
