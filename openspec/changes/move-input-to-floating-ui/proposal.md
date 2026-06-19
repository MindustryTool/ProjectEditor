## Why

Position editing workflow is disjointed — users must look at the canvas for visual placement but reach to the sidebar for numeric input. There's no way to select a sprite on the canvas itself, and every preview card clutters the sidebar with input fields even when unused. Selection + floating input brings editing to the point of interaction.

## What Changes

- **Add selection state** to `PositionCanvas` — clicking a `SpriteItem`/`ShootItem` on the canvas selects it, highlighted with a visual border
- **Selected preview highlight** — the `PositionPreview` card in the sidebar for the selected item gets a highlighted border
- **Move input fields out of preview cards** — remove `PositionInputs` from all per-type preview components (`SpritePreview`, `EnginePreview`, `ShootPreview`, `PartPreview`, `DrawRegionPreview`)
- **Floating input UI on canvas** — when a position is selected, show a floating overlay on the canvas (positioned near the selected item) with X/Y inputs and type-specific controls
- **Deselect on canvas click-away** — clicking empty canvas area deselects

## Capabilities

### New Capabilities
- `canvas-selection`: Click-to-select sprites on the Konva canvas with visual highlight
- `floating-position-input`: Floating overlay UI on the canvas for inline X/Y editing of selected positions

### Modified Capabilities
- (none — sidebar preview cards remain, just lose input fields)

## Impact

- `PositionCanvas.tsx` — add selection state, onClick handlers on canvas items, render floating UI
- `SpriteItem.tsx` / `ShootItem.tsx` / `PositionImage.tsx` — accept `selected` prop, show highlight border, emit onClick
- All `*Preview.tsx` components — remove `PositionInputs` from `footer`, remove `onPositionChange` prop
- `PreviewContainer.tsx` — remove footer slot
- `PositionSidebar.tsx` — pass `selectedKey` for highlight, remove `handlePositionChange`
- `PositionInputs.tsx` / `usePositionEdit.ts` / `PositionField.tsx` — kept for reuse in floating UI
- Files: ~10 components modified, 1 new component (floating UI)
