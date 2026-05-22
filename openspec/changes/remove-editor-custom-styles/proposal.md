## Why

The editor page has its own custom CSS variable system (`--editor-*`) with inline style definitions and hardcoded dark theme colors. This duplicates the shadcn theme layer, creates maintenance burden, and prevents the editor from respecting the user's chosen theme (light/dark/auto). Removing these custom styles in favor of shadcn defaults ensures consistent theming across the app.

## What Changes

- Remove inline CSS variable definitions from `EditorPage.tsx` root div (`--editor-bg`, `--editor-surface`, `--editor-border`, `--editor-text`, `--editor-muted`, `--editor-accent`, `--editor-card`)
- Replace all `var(--editor-*)` references in editor components with shadcn theme equivalents (`bg-background`, `text-muted-foreground`, `border-border`, `bg-card`, etc.)
- Remove `--color-editor-*` entries from the Tailwind `@theme` block in `styles.css`

## Capabilities

### New Capabilities
*(none — this is a pure refactoring/cleanup change)*

### Modified Capabilities
*(none — no spec-level behavior changes)*

## Impact

- **Files modified**: `EditorPage.tsx`, `Toolbar.tsx`, `StatusBar.tsx`, `SplitView.tsx`, `Panel.tsx`, `FilesMenu.tsx`, `ExportMenu.tsx`, `styles.css`
- **Theme behavior**: Editor will now follow the app's shadcn theme (light/dark) instead of forcing a dark VSCode-like appearance
- **No functional changes**: Layout, interactions, and behavior remain identical
