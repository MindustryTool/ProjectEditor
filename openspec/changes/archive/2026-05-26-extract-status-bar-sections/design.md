## Context

The `EditorShell` component currently defines the content for all three StatusBar sections (`left`, `center`, `right`) inline as JSX ReactNode props. The `statusbar/` directory already exists but is empty. The project follows a consistent pattern of feature-based subdirectories (see `toolbar/`, `left/`, `center/`, `panel/`) with one component per file.

## Goals / Non-Goals

**Goals:**
- Extract `StatusBarLeft` component: displays project name and file count
- Extract `StatusBarCenter` component: displays editor status text
- Extract `StatusBarRight` component: displays validation summary and icon indicators
- Follow existing component conventions (named export, interface props, memo where appropriate)
- Each component owns its store subscriptions instead of relying on parent-passed values

**Non-Goals:**
- No changes to the `StatusBar` slot component itself
- No new i18n keys or store changes
- No behavioral changes to what is displayed
- No file count logic improvement (still hardcoded `0` — handled separately)

## Decisions

1. **Each component subscribes to stores directly** — Rather than threading props through `EditorShell`, each status bar section reads the stores it needs. This matches how `EditorShell` currently accesses stores and keeps each section self-contained.

2. **Plain named exports (not default)** — Follows the project convention (all editor components use named exports).

3. **No `React.memo` wrapping** — The extracted sections are lightweight and re-render only when their specific store slices change. If profiling shows a need, memoization can be added later.

4. **Components live in `statusbar/` directory** — The directory already exists and parallels the `toolbar/` structure.

5. **Icons remain imported from `lucide-react` in the right section** — Follows existing usage.

## Risks / Trade-offs

- **Minor duplication of `useTranslation`** — Each section component calls `useTranslation()` independently. Acceptable given the small overhead and cleaner separation.
- **Validation store subscription in `StatusBarRight`** — Currently `validationSummary` is read via `useValidationStore`. Extracting this to its own component preserves the same subscription behavior.
