## 1. Rewrite SpriteViewer with overlay actions

- [x] 1.1 Replace text-labeled buttons below image with icon-only buttons overlaid on the sprite preview using `relative` container and `absolute` positioning
- [x] 1.2 Add backdrop blur (`backdrop-blur-sm bg-background/60`) to the action overlay for readability
- [x] 1.3 Add `aria-label` attributes to icon-only buttons for accessibility
- [x] 1.4 Add `variant="ghost" size="icon"` to overlay buttons

## 2. Rewrite SpriteUploader with FormField layout

- [x] 2.1 Wrap the upload prompt in `<FormField>`, `<FormLabel>`, `<FormControl>` components from `#/components/ui/form`
- [x] 2.2 Replace text-labeled button with icon-only Upload button

## 3. Clean up unused imports and verify

- [x] 3.1 Remove unused imports (Button text variant classes if no longer needed)
- [x] 3.2 Verify no TypeScript errors in modified files
