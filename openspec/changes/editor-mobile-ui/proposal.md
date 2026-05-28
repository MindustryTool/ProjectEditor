## Why

The editor is unusable on tablets and small screens (<1024px) because SplitView with three fixed panels does not fit. Users on mobile devices cannot access file browsing or the right-side property panel. Adding responsive mobile UI support makes the editor functional on a wider range of devices without disrupting the existing desktop experience.

## What Changes

- Add responsive breakpoint detection in EditorShell that switches between desktop and mobile layouts at 1024px
- Create mobile layout with: Toolbar at top, collapsible Sheet on left for FileExplorer, Tabs switching between EditorCenterPanel and EditorRightPanel with TabsTrigger at bottom, StatusBar at bottom
- Lazy-load mobile components using React.lazy to avoid increasing desktop bundle size
- Keep existing desktop SplitView layout unchanged
- No changes to existing component internals (EditorLeftPanel, EditorCenterPanel, EditorRightPanel, Toolbar, StatusBar) — they are reused

## Capabilities

### New Capabilities
- `editor-mobile-layout`: Responsive editor shell that renders a mobile-adapted layout at viewport widths below 1024px using lazy-loaded components

### Modified Capabilities
- (none — existing specs describe component behaviors that remain unchanged)

## Impact

- **apps/web/src/components/editor/EditorShell.tsx**: Add breakpoint detection and conditional rendering
- **apps/web/src/components/editor/**: New mobile layout component(s) for the tablet/phone layout
- No API, dependency, or routing changes
- No i18n changes needed (all panels already have their own translations)
