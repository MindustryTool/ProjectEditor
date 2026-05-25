## Why

The StatusBar in EditorShell currently has its left, center, and right section content defined inline as JSX props. As the editor gains more features (file tracking, real-time validation, language/server status), these sections will grow in complexity. Extracting them into dedicated components improves maintainability, testability, and follows the existing pattern used by `toolbar/`, `left/`, `center/`, and `panel/` subdirectories.

## What Changes

- Extract inline StatusBar `left` JSX into a new `StatusBarLeft` component
- Extract inline StatusBar `center` JSX into a new `StatusBarCenter` component
- Extract inline StatusBar `right` JSX into a new `StatusBarRight` component
- Place all three in the existing `statusbar/` subdirectory
- Update `EditorShell` to use the new components
- Each component receives its own props (typed interfaces) instead of relying on parent-inlined JSX

## Capabilities

### New Capabilities
- `status-bar-left`: Displays project name and file count on the left side of the status bar
- `status-bar-center`: Displays editor status messages (e.g., "Ready") in the center of the status bar
- `status-bar-right`: Displays validation summary (errors/warnings) and document type icons on the right side of the status bar

### Modified Capabilities

<!-- No existing specs are modified -->

## Impact

- `apps/web/src/components/editor/EditorShell.tsx` - inline JSX replaced with component imports
- `apps/web/src/components/editor/statusbar/` - three new component files added
- No changes to the `StatusBar` slot component itself
- No changes to stores, i18n keys, or public API
