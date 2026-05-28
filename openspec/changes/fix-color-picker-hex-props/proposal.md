## Why

The current `ColorPicker` component has complex prop types that accept various formats, leading to type errors and inconsistent usage. Additionally, there are multiple instances of native `<input type="color"/>` across the codebase which provide a suboptimal user experience compared to our custom color picker. Standardizing on a single hex color format will simplify the component interface, and replacing native inputs will unify the UI.

## What Changes

- Modify `ColorPickerProps` in `color-picker.tsx` to strictly type `value` and `defaultValue` as hex strings (`string`).
- Update the `onChange` callback in `ColorPickerProps` to pass a hex string instead of an array of RGBA values.
- Refactor internal logic of `ColorPicker` to correctly initialize and emit hex color strings.
- **BREAKING**: Replace all occurrences of `<input type="color"/>` throughout the codebase with the updated `<ColorPicker>` component.
- Fix any type errors arising from the updated `ColorPicker` props across the project.

## Capabilities

### New Capabilities
- `color-picker-standardization`: Standardize the color picker component interface to use hex color strings and ensure unified usage across the application.

### Modified Capabilities

## Impact

- `apps/web/src/components/ui/color-picker.tsx` will be modified.
- Various components currently using `<input type="color"/>` (e.g., `apps/web/src/components/editor/MonacoEditor.tsx` and potentially others) will be refactored to use `<ColorPicker>`.
- Any existing consumers of `<ColorPicker>` will need to be updated to match the new hex string prop types.