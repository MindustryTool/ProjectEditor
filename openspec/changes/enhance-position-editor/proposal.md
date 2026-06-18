## Why

The position editor currently has a monolithic sidebar preview, no sprite visibility control, no inline position editing, and no easy way to navigate back to the text editor. These gaps make sprite positioning tedious and slow on both desktop and mobile.

## What Changes

- Add a visibility toggle (eye icon) in the top-right corner of the position editor to show/hide all sprites on the canvas
- Replace the single `PositionPreview` component with dedicated per-type preview components for better type-specific rendering
- Add editable numeric inputs for x/y position values in the sidebar, allowing direct coordinate editing
- Add a persistent "Back" button at the top of `PositionSidebar` that uses `usePath` to switch back to text editor mode
- Remove unused `use-container-dimensions.ts` hook and any other dead code

## Capabilities

### New Capabilities
- `sprite-visibility-toggle`: Toggle sprite visibility on the canvas via an eye icon overlay
- `per-type-sprite-preview`: Dedicated sidebar preview components for each sprite type (sprite, engine, shoot, part, draw-region)
- `inline-position-editing`: Editable x/y inputs in the sidebar for precise coordinate editing
- `position-editor-back-nav`: A "Back to text editor" button always visible at the top of the sidebar

### Modified Capabilities
- (none — no existing specs to modify)

## Impact

- `apps/web/src/components/editor/position-editor/` — multiple component additions and refactoring
- `apps/web/src/components/editor/right/UnitPanel.tsx` — the "Close position editor" button in UnitPanel may become redundant (back button in sidebar replaces it)
- i18n — new translation keys for the back button and visibility toggle may be needed
