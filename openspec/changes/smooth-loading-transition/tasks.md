## 1. Baseline Review

- [x] 1.1 Review `EditorPage.tsx` loading/content swap points and identify where to introduce a presence-style transition without changing load logic
- [x] 1.2 Confirm the preferred animation approach: CSS/Tailwind transitions (default) vs adding a motion library dependency

## 2. Transition Implementation (Editor Entry)

- [x] 2.1 Refactor `EditorPage.tsx` rendering so the loading UI and the destination UI can overlap briefly during transition (avoid abrupt unmount/mount)
- [x] 2.2 Implement fade + blur transition for loading → editor shell and loading → no-project screen
- [x] 2.3 Add reduced-motion handling so motion and blur are minimized when `prefers-reduced-motion: reduce` is set
- [x] 2.4 Ensure the destination UI is interactive promptly during the transition (e.g., pointer-events and z-index layering)

## 3. Dependency / Cleanup

- [x] 3.1 If a motion library is required, add the dependency and encapsulate its usage behind a small local wrapper component
- [x] 3.2 Validate that the transition does not introduce layout shift or flashing (visual-only change) and keep the change localized to editor entry components
