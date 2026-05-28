## Context

The current `ColorPicker` component uses `color` library parameter types for its props, which creates a convoluted API surface and typescript errors. Moreover, the project currently uses native `<input type="color"/>` or `<Input type="color"/>` in several places, which offer an inconsistent user experience across different browsers and do not match the application's design system.

## Goals / Non-Goals

**Goals:**
- Simplify `ColorPickerProps` so that `value` and `defaultValue` only accept a hex string (e.g. `"#ff0000"`).
- Make the `onChange` callback of `ColorPicker` return a hex string.
- Replace native color pickers (`<input type="color" />` in `MonacoEditor.tsx` and `<Input type="color" />` in `FieldRenderer.tsx`) with the custom `ColorPicker` component.
- Ensure the newly integrated `ColorPicker` components are displayed properly without breaking the UI layout (e.g., using `Popover` where necessary).

**Non-Goals:**
- Refactor the underlying `color` library usage inside the `ColorPicker` internal state (it can still use it for conversion, but the public API will be strictly hex).
- Redesign the `ColorPicker` sub-components (like Hue, Alpha, EyeDropper).

## Decisions

1. **Prop Type Simplification**: 
   - `value?: string;`
   - `defaultValue?: string;`
   - `onChange?: (value: string) => void;`
   *Rationale*: A hex string is the most common format, universally understood by both CSS and developers, minimizing type conversion bugs.

2. **Internal State Initialization**: 
   - Internal `useEffect` will be updated to accept the string value and convert it correctly to initialize the `hue`, `saturation`, `lightness`, and `alpha` states.
   - The `onChange` event in the `ColorPicker` will emit the hex string representation `color.hex()` instead of the RGBA array.

3. **UI Integration for Replacement**:
   - In `MonacoEditor.tsx`, the `<input type="color" />` is already inside a custom popover. We will replace it with the `ColorPicker` compound components. We may need to adjust the popover size to accommodate the `ColorPicker`.
   - In `FieldRenderer.tsx`, the `<Input type="color" />` is rendered inline. We will wrap the `ColorPicker` inside a `Popover` (from `@radix-ui/react-popover` or our UI library) so it behaves like a dropdown color picker, mimicking the native behavior without taking up too much vertical space.

## Risks / Trade-offs

- [Risk] Replacing a native `<input type="color">` with a custom `ColorPicker` might introduce layout issues if the new component is much larger. 
  → **Mitigation**: Use a `Popover` to hide the complex UI of the `ColorPicker` behind a clickable trigger button that displays the current color.
- [Risk] Converting colors to hex might lose some precision or alpha channel information if not handled carefully.
  → **Mitigation**: Ensure that the `ColorPicker` correctly outputs an 8-digit hex if alpha is used, or maintain the alpha slider properly and format the string. The `color` library supports `.hex()` which includes alpha if needed, but standard hex is 6 characters. If alpha is necessary, we'll ensure 8-digit hex is emitted.