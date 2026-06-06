## Why

MonacoEditor re-renders and recomputes expensive operations (validation markers, color decorations, color tag detection) on every keystroke, causing visible jank in large files. The `onChange` callback also fires synchronously on each character, potentially re-triggering upstream computations unnecessarily.

## What Changes

- Add `debounce()` to the editor `onChange` callback so upstream state updates are batched during fast typing
- Wrap validation + decoration updates in React `useTransition()` to defer non-urgent work and keep the editor responsive
- Debounce `updateColorDecorations()` and `updateMarkers()` calls that run on every value change via `useEffect`
- Clean up dispose/reset patterns in hooks that run redundant work on each render

## Capabilities

### New Capabilities
*(None — this is purely an internal performance optimization. No new user-facing capabilities.)*

### Modified Capabilities
*(None — no spec-level behavior changes. The editor continues to function identically, only faster.)*

## Impact

- **MonacoEditor.tsx**: Debounce `onChange` prop callback; wrap non-critical state updates in `useTransition`
- **useEditorValidation.ts**: Debounce `updateMarkers()` calls triggered by value changes
- **useColorTagDecorations.ts**: Debounce `updateColorDecorations()` calls triggered by value/language changes
- **useColorTagPicker.ts**: Debounce color tag detection on cursor/scroll events
- **Dependencies**: Use existing `@project/utils` debounce utility (no new deps needed); React 19 `useTransition` API
