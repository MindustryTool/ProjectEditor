## ADDED Requirements

### Requirement: ColorPicker Component API Standardization
The `ColorPicker` component MUST expose a strictly typed API where color values are passed and emitted as hex strings.

#### Scenario: Providing a default value
- **WHEN** the `ColorPicker` is rendered with `defaultValue="#ff0000"`
- **THEN** the internal state initializes correctly and the picker displays red

#### Scenario: Providing a controlled value
- **WHEN** the `ColorPicker` is rendered with a controlled `value` of `"#00ff00"`
- **THEN** the picker displays green, and updates when the `value` prop changes

#### Scenario: Emitting color changes
- **WHEN** the user interacts with the color picker to change the color
- **THEN** the `onChange` callback is fired with the new hex string value (e.g., `"#0000ff"`)

### Requirement: Native Color Picker Replacement
All instances of native `<input type="color">` and `<Input type="color">` MUST be replaced with the custom `ColorPicker` component.

#### Scenario: FieldRenderer HexColor usage
- **WHEN** rendering a field of type `HexColor` in `FieldRenderer`
- **THEN** a `Popover` containing the `ColorPicker` is displayed instead of a native input
- **WHEN** the user selects a new color in the `ColorPicker`
- **THEN** the field value is updated with the new hex string

#### Scenario: MonacoEditor active color tag
- **WHEN** the user clicks on a color tag in the `MonacoEditor`
- **THEN** the color popup displays the custom `ColorPicker` instead of the native `<input type="color">`
- **WHEN** the user selects a new color
- **THEN** the color tag in the editor is replaced with the new hex string