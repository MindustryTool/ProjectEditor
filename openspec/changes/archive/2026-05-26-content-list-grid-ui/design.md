## Context

The editor's center panel shows either a Monaco editor (for JSON/mod.hjson files) or a `ContentList` (for content directories). Currently `ContentList` renders a flat `<div>` with filenames. The project uses `nuqs` for URL query state (`useQueryState("path")`), `@tanstack/react-router` for navigation, and `@tanstack/react-query` for file listing. Sprites for Mindustry content items live in a `/sprites/` directory parallel to `/content/`.

## Goals / Non-Goals

**Goals:**
- Display content items in a responsive CSS grid of cards
- Show sprite thumbnail for `.json` content items sourced from `/sprites/<basename>.png`
- Clicking a folder navigates by updating the `path` query parameter
- Expose a shared `resolveJsonContentImage(path: string): string | null` utility
- Restyle `CreateNewContentDialog` as a "+" card in the grid

**Non-Goals:**
- No lazy-loading or infinite scroll for grid items
- No drag-and-drop reordering
- No image fallback beyond the default file icon

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Grid layout | CSS Grid via Tailwind (`grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))]`) | Lightweight, responsive, no extra dependency |
| Navigation | Use `useNavigate` from `@tanstack/react-router` + `nuqs` `useQueryState` | Already used in the codebase for path state |
| Sprite path convention | Replace `content/` prefix with `sprites/` and swap `.json` → `.png` | Matches Mindustry mod directory structure conventions |
| Helper location | `~/lib/utils.ts` | Existing shared util file, avoids creating new files |
| New content button | As a card inside the grid with a "+" icon and "New" label | Visually consistent with grid, always visible at top |
| Image loading | Native `<img>` with `onError` to hide on failure | Simple, no image component library needed |

## Risks / Trade-offs

- **Missing sprites**: If no sprite exists, `onError` hides the image → card shows icon-only. Acceptable.
- **Path resolution mismatches**: Content items might use different naming conventions than their sprites. The resolver function is centralized so the convention can be updated in one place.
- **Grid overflow**: Many items could create a tall grid. The parent panel already scrolls.
