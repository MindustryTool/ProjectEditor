## Context

`EditorPage.tsx` currently shows a loading view while the project context is being restored, then immediately swaps to either `NoProjectScreen` or `EditorShell`. This is functionally correct but creates an abrupt visual swap that can look like a “flash” or stutter.

The change is intentionally scoped to presentation/UX. The project load workflow, data flow, and routing behavior remain unchanged.

## Goals / Non-Goals

**Goals:**

- Add a smooth transition between loading UI and the next rendered screen using blur + opacity (and optional subtle motion).
- Avoid delaying “ready” state; animations should run after content is ready and should not block interactions longer than necessary.
- Respect accessibility preferences (`prefers-reduced-motion`).
- Keep changes localized to the editor entry surface.

**Non-Goals:**

- Changing how projects are opened/restored, how progress is computed, or how long loading takes.
- Adding complex page-level routing transitions across the entire app.
- Redesigning loading visuals beyond the transition behavior.

## Decisions

- Use a presence-style transition so both “loading” and “content” can be rendered simultaneously during the crossfade/blur window, avoiding a hard unmount/mount swap.
- Prefer a minimal animation approach:
  - If an existing motion/animation utility exists in the codebase, reuse it.
  - Otherwise, implement the transition using CSS/Tailwind transitions (opacity + filter blur) to avoid introducing a new runtime dependency.
  - If the product requirement explicitly mandates a JS motion library, introduce a small, focused dependency (e.g., a motion library) and encapsulate usage inside a tiny wrapper component to prevent spreading animation primitives across the app.
- Implement reduced-motion support via:
  - CSS `@media (prefers-reduced-motion: reduce)` rules (or Tailwind’s `motion-reduce:` variants if available in the project setup), ensuring blur/motion are minimized while preserving readable state changes.

## Risks / Trade-offs

- [Animation dependency choice] → Mitigation: default to CSS-only transitions; if a motion library is added, keep usage isolated to `EditorPage`-adjacent components.
- [Blur performance on low-end GPUs] → Mitigation: keep blur radius small and duration short; provide reduced-motion path that disables blur.
- [Interaction timing issues] → Mitigation: ensure the “content” layer is interactive as soon as it is visible; keep loading layer `pointer-events: none` once the transition starts.
