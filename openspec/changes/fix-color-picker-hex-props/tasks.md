## 1. ColorPicker Component Refactoring

- [x] 1.1 Update `ColorPickerProps` in `color-picker.tsx` to strictly type `value` and `defaultValue` as `string`.
- [x] 1.2 Update the `onChange` signature in `ColorPickerProps` to `(value: string) => void`.
- [x] 1.3 Modify the internal `useEffect` in `ColorPicker` that listens to `value` prop to correctly parse the hex string and set hue, saturation, lightness, and alpha.
- [x] 1.4 Modify the internal `useEffect` in `ColorPicker` that triggers `onChange` to emit a hex string (`color.hex()`) instead of an array.

## 2. Refactoring MonacoEditor

- [x] 2.1 In `MonacoEditor.tsx`, locate the color popup rendering the `<input type="color" />`.
- [x] 2.2 Replace `<input type="color" />` with a compact version or `Popover`-wrapped version of `<ColorPicker />`.
- [x] 2.3 Ensure the `onChange` and `value` bindings work correctly with the new hex string API, updating the `activeColorTag.pickerColor` and triggering `handleCustomColorPick`.

## 3. Refactoring FieldRenderer

- [x] 3.1 In `FieldRenderer.tsx`, locate the `HexColor` renderer currently using `<Input type="color" />`.
- [x] 3.2 Implement a `Popover` wrapper to display the `ColorPicker` so it doesn't take up excessive vertical space in the form.
- [x] 3.3 Replace `<Input type="color" />` with the `Popover`-wrapped `<ColorPicker />`.
- [x] 3.4 Bind the `value` and `onChange` to the new hex string API, ensuring the updater receives the correct hex value.

## 4. Verification

- [x] 4.1 Verify that the `Demo` component in `color-picker.tsx` still functions correctly and its types are updated.
- [x] 4.2 Test the color popup in `MonacoEditor` to ensure the custom `ColorPicker` works and updates the code tag.
- [x] 4.3 Test the `HexColor` field in `FieldRenderer` to ensure the `Popover` and `ColorPicker` work and update the field value correctly.
