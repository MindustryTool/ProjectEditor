### Requirement: Canvas pinch-to-zoom
The position editor canvas SHALL support pinch-to-zoom using two-finger touch gestures, zooming centered on the pinch midpoint with the same scale constraints as mouse wheel zoom (0.1x–10x).

#### Scenario: Pinch zoom in
- **WHEN** user places two fingers on the canvas and spreads them apart
- **THEN** the canvas view zooms in centered on the midpoint between the two fingers

#### Scenario: Pinch zoom out
- **WHEN** user places two fingers on the canvas and pinches them together
- **THEN** the canvas view zooms out centered on the midpoint between the two fingers

#### Scenario: Pinch zoom respects scale limits
- **WHEN** user pinches to zoom beyond 10x
- **THEN** the scale is clamped to 10x
- **WHEN** user pinches to zoom below 0.1x
- **THEN** the scale is clamped to 0.1x

### Requirement: Canvas touch pan
The position editor canvas SHALL support single-finger drag-to-pan on touch devices, panning the view in the direction of the finger movement.

#### Scenario: Single-finger pan
- **WHEN** user places one finger on empty canvas space and drags
- **THEN** the canvas view pans following the finger movement

#### Scenario: Tap on empty canvas deselects
- **WHEN** user taps (touch and release without significant movement) on empty canvas
- **THEN** the current selection is cleared

#### Scenario: Touch pan does not trigger on item drag
- **WHEN** user touches and drags a draggable item (sprite, shoot marker, placeholder)
- **THEN** the item is dragged and the canvas view does not pan

### Requirement: Browser default touch prevention
The canvas container SHALL prevent the browser's default touch behaviors (page scroll, page zoom) while the user interacts with the canvas area.

#### Scenario: No page scroll on canvas drag
- **WHEN** user drags on the canvas with one finger
- **THEN** the page does not scroll

#### Scenario: No page zoom on canvas pinch
- **WHEN** user pinches on the canvas with two fingers
- **THEN** the page does not zoom
