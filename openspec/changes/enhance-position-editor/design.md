## Context

The position editor (`apps/web/src/components/editor/position-editor/`) currently uses a single `PositionPreview` component inside `PositionSidebar` that renders all sprite types in a uniform card layout. There is no way to hide sprites on the canvas, no inline coordinate editing, and no navigation back to the text editor from within the sidebar. The `use-container-dimensions.ts` hook exists but is not imported anywhere.

## Goals / Non-Goals

**Goals:**
- Allow users to toggle sprite visibility on the canvas via an eye icon overlay
- Render dedicated preview components per sprite type in the sidebar
- Provide editable x/y number inputs for precise coordinate editing
- Add a persistent back button at the top of the sidebar to return to text mode
- Remove dead code (`use-container-dimensions.ts` and any other unused exports)

**Non-Goals:**
- Changing the Konva canvas rendering pipeline (position items still rendered via `SpriteItem`/`ShootItem`)
- Rewriting the HJSON mutation logic in `utils.ts`
- Adding undo/redo for position edits
- Changing the mobile layout strategy

## Decisions

1. **Visibility state via local React state in `PositionCanvas`** — Simple boolean state passed down as prop. No need for Zustand since visibility is scoped to the editor instance. The eye icon (`Eye`/`EyeOff` from `lucide-react`) renders as an absolute-positioned button in the canvas container.

2. **Dedicated preview components under `preview/` subdirectory** — New files: `SpritePreview.tsx`, `EnginePreview.tsx`, `ShootPreview.tsx`, `PartPreview.tsx`, `DrawRegionPreview.tsx`, plus a dispatcher `PositionPreview.tsx` (replacing the inline `PositionPreview`). Keeps the sidebar clean and each preview focused on its type.

3. **Inline x/y editing with controlled inputs + blur/Enter commit** — Each preview component renders two `<Input>` (Shadcn-ui) fields for x and y. On blur or Enter key, calls the parent `onPositionChange` callback which invokes `updatePositionData()`. Local state mirrors the value while editing; committed on blur. No debounce needed since blur/Enter is sufficient.

4. **Back button with `usePath`** — `PositionSidebar` gets a `path` prop (the current file path). A non-scrolling sticky header renders a `Button` that calls `setPath({ path, type: "text", jsonPath: null })`. This replaces the similar button in `UnitPanel.tsx` for the sprite editor context, though `UnitPanel` can remain unchanged (both buttons work independently).

5. **Removal of `use-container-dimensions.ts`** — Simple file deletion. No other code depends on it. Grep the codebase to confirm zero imports first.

## Risks / Trade-offs

- **Duplicate back buttons** — Both `UnitPanel` and `PositionSidebar` will have a "back" button after this change. Trade-off accepted: the sidebar button is always visible inside the position editor, while the UnitPanel button is on the right panel. Users get two exit points, which is fine.
- **Inline editing scope** — x/y inputs modify the HJSON string immediately on blur. If the user makes a typo, there's no validation beyond the number input type. Mitigation: use `<Input type="number">` with `step` attribute.
- **Visibility toggle reset** — Visibility state resets when navigating away and back. Acceptable since it's per-editor-session state.
