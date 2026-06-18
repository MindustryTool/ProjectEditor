## 1. Cleanup

- [ ] 1.1 Remove unused `use-container-dimensions.ts` file
- [ ] 1.2 Remove unused `useContainerDimensions` import from `PositionCanvas.tsx` (if any)
- [ ] 1.3 Grep for any other dead exports/imports in the position-editor directory

## 2. Per-Type Preview Components

- [ ] 2.1 Create `preview/SpritePreview.tsx` — renders sprite thumbnail via `ImageFilePreview`, name, dimensions, mirror status
- [ ] 2.2 Create `preview/EnginePreview.tsx` — renders engine name, radius, rotation
- [ ] 2.3 Create `preview/ShootPreview.tsx` — renders weapon name, weapon position, shoot offset
- [ ] 2.4 Create `preview/PartPreview.tsx` — renders part name, mirror status
- [ ] 2.5 Create `preview/DrawRegionPreview.tsx` — renders region name, suffix
- [ ] 2.6 Create `preview/PositionPreview.tsx` — dispatcher component that selects the correct preview based on sprite type
- [ ] 2.7 Create `preview/index.ts` — barrel exports

## 3. Inline Position Editing

- [ ] 3.1 Add `onPositionChange` callback type to preview component props
- [ ] 3.2 Add editable x/y `<Input type="number">` fields to each preview component
- [ ] 3.3 Implement blur/Escape/Enter handlers for position edits
- [ ] 3.4 Wire `onPositionChange` up to `updatePositionData()` in `PositionSidebar`
- [ ] 3.5 Ensure input values sync when positions change via canvas drag

## 4. Back Button in Sidebar

- [ ] 4.1 Add `path` prop to `PositionSidebar`
- [ ] 4.2 Import and use `usePath` in `PositionSidebar`
- [ ] 4.3 Render a persistent "Back to text editor" button at the top of the sidebar (outside scroll area)
- [ ] 4.4 Wire button click to `setPath({ path, type: "text", jsonPath: null })`

## 5. Sprite Visibility Toggle

- [ ] 5.1 Add visibility state (`useState<boolean>`) in `PositionCanvas`
- [ ] 5.2 Pass visibility prop down to canvas rendering components
- [ ] 5.3 Conditionally render/hide Konva shapes based on visibility state
- [ ] 5.4 Add eye icon button (`Eye`/`EyeOff` from `lucide-react`) overlay in top-right of canvas container

## 6. Integration

- [ ] 6.1 Update `PositionCanvas` to use new `PositionPreview` dispatcher from `preview/`
- [ ] 6.2 Pass `path` to `PositionSidebar` in `PositionCanvas`
- [ ] 6.3 Remove old inline `PositionPreview` function from `PositionSidebar.tsx`
- [ ] 6.4 Verify all functionality works end-to-end
