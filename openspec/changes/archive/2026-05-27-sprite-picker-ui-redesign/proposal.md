## Why

The SpritePicker's current layout has action buttons (Replace/Remove/Upload) placed below the sprite image, separated from the visual preview. This wastes vertical space in the panel and makes actions feel disconnected from the sprite they act on. Placing icon-only actions inside the preview with a backdrop blur overlay creates a tighter, more polished editing experience.

## What Changes

- Rewrite `SpriteViewer` to overlay icon-only action buttons on top of the sprite image with backdrop blur
- Rewrite `SpriteUploader` to use `<FormField>`, `<FormLabel>`, `<FormControl>` layout
- Replace text-labeled buttons with icon-only buttons inside the preview area
- Use backdrop blur and semi-transparent background on action overlays for clarity

## Capabilities

### New Capabilities
- `sprite-picker-overlay-actions`: Icon-only action buttons positioned as an overlay on the sprite preview with backdrop blur styling

### Modified Capabilities
- `sprite-picker-component`: Update SpritePicker requirements to reflect overlay-based action layout and FormField-based layout

## Impact

- `apps/web/src/components/editor/panel/SpritePicker.tsx` — complete UI rewrite of both SpriteViewer and SpriteUploader
