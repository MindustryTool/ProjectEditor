## Why

The editor currently switches from the loading state to the main UI abruptly, which feels jarring and can look like a brief “flash” on slower machines. A subtle blur/fade transition will make the loading-to-editor handoff feel smoother without changing any project-loading behavior.

## What Changes

- Add a smooth visual transition (fade + blur + slight motion) between the loading screen and the editor content.
- Ensure transitions respect `prefers-reduced-motion` (reduced/no motion while keeping readability).
- Keep existing loading logic/progress behavior intact; only presentation changes in the editor entry page.

## Capabilities

### New Capabilities

- `editor-loading-transition`: Smooth animated transition (blur/fade/motion) for the editor entry loading state.

### Modified Capabilities

- (none)

## Impact

- UI entry component: `apps/web/src/components/editor/EditorPage.tsx`
- Potential new animation dependency (or small in-house utility) for motion/transition orchestration
- Tailwind/CSS adjustments for blur/opacity transitions and reduced-motion handling
