## 1. Selection State & Canvas Click Handling

- [x] 1.1 Add `selectedPath` state to `PositionCanvas` (`useState<string | null>(null)`)
- [x] 1.2 Add `onClick` to hit `Rect` in `PositionImage.tsx` that calls a new `onSelect` callback
- [x] 1.3 Add `onClick` to `Group` in `ShootItem.tsx` that calls `onSelect`
- [x] 1.4 Add `onClick` to `Group` in `PositionPlaceholder.tsx` that calls `onSelect`
- [x] 1.5 Add click handler on Stage background (`e.target === e.currentTarget`) to deselect
- [x] 1.6 Thread `onSelect` and `selectedKey` through `SpriteItem`/`ShootItem` from `PositionCanvas`

## 2. Canvas Selection Highlight (Konva)

- [x] 2.1 Pass `isSelected` prop to `PositionImage.tsx` — show dashed `Rect` stroke when selected
- [x] 2.2 Pass `isSelected` prop to `ShootItem.tsx` — show highlight ring when selected
- [x] 2.3 Pass `isSelected` prop to `PositionPlaceholder.tsx` — show highlight border when selected
- [x] 2.4 Define consistent highlight style (e.g., yellow dashed stroke, `#eab308`)

## 3. Sidebar Highlight

- [x] 3.1 Pass `selectedPath` from `PositionCanvas` → `PositionSidebar`
- [x] 3.2 Pass `isSelected` prop from `PositionSidebar` → `PositionPreview`
- [x] 3.3 Apply `ring-2 ring-primary` class to selected preview card in `PreviewContainer`

## 4. Remove Inputs from Sidebar Preview Cards

- [x] 4.1 Remove `onPositionChange` prop from `SpritePreview`, `EnginePreview`, `ShootPreview`, `PartPreview`, `DrawRegionPreview`
- [x] 4.2 Remove `PositionInputs` from footer in all five preview components
- [x] 4.3 Remove footer slot from `PreviewContainer` (or make it optional and omit)
- [x] 4.4 Remove `handlePositionChange` creation from `PositionSidebar`
- [x] 4.5 Clean up unused `PositionEditHandler` imports from preview components

## 5. Floating Input UI

- [x] 5.1 Create `PositionFloatingInput` component — wraps `PositionInputs` + `usePositionEdit` in a card with absolute positioning
- [x] 5.2 Integrate `PositionFloatingInput` into `PositionCanvas` — render inside the canvas `div` when `selectedPath` is set
- [x] 5.3 Position the floating UI by converting Konva coords to screen coords using stage ref
- [x] 5.4 Recalculate floating UI position on zoom (`handleWheel`) and pan (`onDragEnd`)
- [x] 5.5 Handle edge cases: reposition above/below item based on available space

## 6. Cleanup

- [x] 6.1 Verify all files build with `npm run typecheck`
- [x] 6.2 Run lint — fix any issues
- [ ] 6.3 Manual test: click to select, highlight, floating input, deselect on background click
