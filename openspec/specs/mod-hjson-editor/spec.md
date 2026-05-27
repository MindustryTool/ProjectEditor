## ADDED Requirements

### Requirement: mod.hjson form editor renders with fields
The system SHALL render a form-based editor in the SplitView center panel when `?path=mod.hjson` is selected, with labeled input fields for each mod metadata property. The form SHALL NOT include save or reset buttons. Changes SHALL be applied to the file content via position-based replacement rather than rebuilding the entire file.

#### Scenario: Form renders eight fields
- **WHEN** `?path=mod.hjson` is active
- **THEN** the center panel SHALL display a form with labeled inputs for: `name`, `displayName`, `author`, `description`, `version`, `minGameVersion`, `dependencies` as a list, and `hidden` as a checkbox

#### Scenario: Field descriptions visible
- **WHEN** the form is rendered
- **THEN** each input SHALL display a description explaining the field's purpose

#### Scenario: No save or reset buttons
- **WHEN** the form is rendered
- **THEN** the form SHALL NOT contain save or reset buttons

### Requirement: Form uses HJSON structured parser for field values
The mod.hjson editor SHALL parse the file content using `HJSON.parse()` from `@project/hjson` with structured mode enabled. Field values SHALL be read from the parsed result. Inline field validation SHALL NOT be performed in the editor panel — validation is handled by the file validation system.

#### Scenario: content parsed with HJSON structured parser
- **WHEN** the mod.hjson file content loads
- **THEN** the editor SHALL parse it using `HJSON.parse(content, undefined, { structured: true })`
- **THEN** field values SHALL be extracted from the structured result

#### Scenario: No inline validation on field input
- **WHEN** the user types in any field
- **THEN** the editor SHALL NOT display inline validation errors for that field

### Requirement: Field labels and descriptions are translated
All mod.hjson form field labels and descriptions SHALL use i18n translation keys.

#### Scenario: Fields show translated labels
- **WHEN** the mod.hjson form renders
- **THEN** each field label SHALL be rendered via `t()` with keys under `editor.modHjson.*`

#### Scenario: Fields show translated descriptions
- **WHEN** the mod.hjson form renders
- **THEN** each field description SHALL be rendered via `t()` with keys under `editor.modHjson.*`

### Requirement: description field uses Textarea
The system SHALL render the `description` field using a `<textarea>` element instead of a single-line `<input>`.

#### Scenario: description renders as textarea
- **WHEN** the mod.hjson form renders
- **THEN** the description field SHALL be a multi-line textarea element

### Requirement: dependencies rendered as field list with add button
The `dependencies` array SHALL be rendered as a list of individual input fields, each validating against the mod-name schema. The form SHALL show one input by default and include an "Add" button below to append additional dependency inputs. An "X" remove button SHALL appear on each dependency input (except the last remaining). Adding or removing dependencies SHALL update only the `dependencies:` line.

#### Scenario: One default dependency input
- **WHEN** the form renders with no initial dependencies
- **THEN** the dependencies section SHALL show exactly one empty input

#### Scenario: Add button appends a new input
- **WHEN** the user clicks the "Add" button in the dependencies section
- **THEN** a new empty dependency input SHALL appear below the existing ones

#### Scenario: Remove button deletes a dependency input
- **WHEN** the user clicks the remove button on a dependency input
- **THEN** that input SHALL be removed from the list

### Requirement: hidden field renders as checkbox
The system SHALL render the `hidden` field as a checkbox in the mod.hjson form. The value SHALL be `true` (checked), `false` (unchecked), or `undefined` (indeterminate/unset).

#### Scenario: Checkbox renders with label and description
- **WHEN** the mod.hjson form renders
- **THEN** the `hidden` field SHALL appear as a checkbox with a translated label and description

#### Scenario: Checkbox unchecked represents false
- **WHEN** the checkbox is unchecked
- **THEN** the field value SHALL be `false`

#### Scenario: Checkbox checked represents true
- **WHEN** the checkbox is checked
- **THEN** the field value SHALL be `true`

### Requirement: Changes applied via position-based replacement
When the user modifies a field, the system SHALL replace only the value portion of that field in the original source text, using the `valueStart`/`valueEnd` positions from the structured parse result. Other parts of the file SHALL remain unchanged, preserving comments and formatting.

#### Scenario: Position-based replacement on change
- **WHEN** the user modifies any field value
- **THEN** the editor SHALL use the field's `valueStart`/`valueEnd` positions to slice the replacement into the original source string
- **THEN** only the modified field's value range SHALL be replaced, leaving all other text intact

#### Scenario: Initial field values from parsed result
- **WHEN** the mod.hjson file has no `hidden:` line (field is absent)
- **THEN** the editor SHALL treat `hidden` as `false` (default value)
