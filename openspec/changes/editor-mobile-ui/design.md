## Context

The editor currently uses a fixed three-panel SplitView layout that requires 1024px+ width. There is no responsive handling, no mobile hooks, and no existing pattern for adaptive layouts in the editor. Sheet and Tabs components from Radix UI already exist in the project.

## Goals / Non-Goals

**Goals:**
- EditorShell detects viewport width and switches layout at 1024px breakpoint
- Mobile layout reuses existing Toolbar, StatusBar, EditorCenterPanel, EditorRightPanel, FileExplorer
- Mobile layout uses Sheet (left side) for FileExplorer access, Tabs (trigger at bottom) to switch between editor center and right panels
- Mobile components are lazy-loaded via React.lazy to keep desktop bundle unchanged
- Zero changes to existing component internals

**Non-Goals:**
- Touch gestures, swipe, or drag-and-drop on mobile
- Native mobile app or PWA behavior
- Redesigning existing components—only layout changes
- Mobile-specific Monaco Editor features (e.g., touch keyboard handling)

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Breakpoint detection | Custom `useMediaQuery` hook (window.matchMedia) | No external dep needed; small hook; avoids resize listener churn |
| Layout switch threshold | 1024px (CSS lg breakpoint) | Matches common tablet landscape breakpoint; desktop SplitView min panel widths sum to ~920px |
| Mobile FileExplorer access | Sheet from left side | Sheet component already exists; left side matches desktop left panel location; supports open/close state |
| Panel switching | Tabs with trigger at bottom | Tabs component already exists; bottom trigger follows mobile app convention; triggers stay accessible |
| Mobile bundle | React.lazy + Suspense for all mobile-specific components | Desktop users never download mobile code; no bundle size regression |
| State sharing | No new state management | All panels use existing Zustand stores and URL state — no changes needed |

## Risks / Trade-offs

- **Layout flash on resize** → Mitigation: use CSS `hidden`/`flex` classes with a stable container; matchMedia fires synchronously on initial render
- **Sheet left-side may conflict with browser back gesture** → Mitigation: default Sheet behavior with overlay prevents interference; acceptable trade-off
- **Tabs at bottom may feel unfamiliar to desktop users who resize** → Acceptable: desktop layout is the default; mobile layout only activates below 1024px
- **Two code paths to maintain** → Mitigation: all panels are the same components, only the shell layout differs; low maintenance burden
