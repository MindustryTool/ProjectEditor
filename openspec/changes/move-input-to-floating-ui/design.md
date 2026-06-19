## Context

The position editor currently renders sidebar preview cards (`PositionPreview` → `SpritePreview`/`EnginePreview`/etc.) that each contain X/Y input fields in their footer. The canvas (`PositionCanvas`) has no selection model — items are draggable but not click-selectable. Users must mouse back and forth between canvas and sidebar to edit coordinates precisely.

## Goals / Non-Goals

**Goals:**
- Click-to-select any `SpriteItem`/`ShootItem` on the Konva canvas
- Show a highlighted border on the selected canvas item
- Highlight the corresponding `PositionPreview` card in the sidebar
- Show a floating overlay on the canvas (near the selected item) with X/Y inputs
- Remove X/Y inputs from sidebar preview cards
- Maintain all existing functionality (drag-to-move, visibility toggle, HJSON write)

**Non-Goals:**
- No changes to how HJSON mutation works (`updatePositionData` stays)
- No changes to the drag interaction model
- No changes to mobile layout behavior (sidebar in collapsible still works)
- No multi-select (single selection only)
- No keyboard shortcuts for selection
- No i18n for the floating UI (keep as-is, same as current inputs)

## Decisions

1. **Selection state in `PositionCanvas` (local state, not Zustand)**
   - Selection is local to the `PositionCanvas` instance — no need for global state
   - State: `selectedPath: string | null` (keyed by `position.x.path`)
   - Alternative considered: Zustand store — rejected because selection is ephemeral UI state scoped to one editor view

2. **Floating UI via HTML overlay div, not Konva layer**
   - Render a positioned `<div>` over the Stage using absolute positioning
   - Sync position from Konva coordinates to HTML via a ref tracked on drag
   - Alternative considered: Konva Text/Input nodes — rejected due to limited text input support in Konva and poor mobile UX

3. **Reuse existing `PositionInputs` / `usePositionEdit` / `PositionField`**
   - These components are already well-tested and handle debounce + commit logic
   - The floating UI wraps `PositionInputs` with a container that has popover-like styling (card with shadow, absolute positioning)
   - No need to build new input logic

4. **Canvas highlight via Konva `Rect` with stroke**
   - Add a `<Rect>` with dashed yellow/cyan stroke behind/beside selected items
   - Alternative considered: modifying the image directly — rejected because outline is a visual overlay, not image data

5. **Click handling on canvas items**
   - Add `onClick` to the hit `Rect` in `PositionImage.tsx` and to `Group` in `ShootItem.tsx` and `PositionPlaceholder`
   - Click on empty stage background deselects (check `e.target === e.currentTarget` on Stage)

6. **Sidebar highlight via CSS class**
   - `PositionSidebar` receives `selectedKey: string | null` prop
   - The matching `PositionPreview` card gets `ring-2 ring-primary` styling

## Risks / Trade-offs

- **Floating UI position desync on zoom/pan** → Recalculate position on every stage transform (wheel, drag-end). Accept small latency.
- **Floating UI overlap with sidebar** → Position the floating UI on the canvas side (left of the item, or right if near edge). Simple offset calculation.
- **Preview cards lose inputs** → Users see a cleaner sidebar but must select a sprite to edit. This is intended — selection becomes the primary interaction mode.
- **Mobile**: floating UI must not break on small screens → Use responsive positioning (prefer top, fallback to bottom if item is near top edge).
