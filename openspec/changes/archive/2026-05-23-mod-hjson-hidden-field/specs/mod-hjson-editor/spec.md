## MODIFIED Requirements

### Requirement: mod.hjson form editor renders with fields
The system SHALL render a form-based editor in the SplitView center panel when `?path=mod.hjson` is selected, with labeled input fields for each mod metadata property. The form SHALL NOT include save or reset buttons.

#### Scenario: Form renders eight fields
- **WHEN** `?path=mod.hjson` is active
- **THEN** the center panel SHALL display a form with labeled inputs for: `name`, `displayName`, `author`, `description`, `version`, `minGameVersion`, `dependencies` as a list, and `hidden` as a checkbox

#### Scenario: Field descriptions visible
- **WHEN** the form is rendered
- **THEN** each input SHALL display a description explaining the field's purpose

#### Scenario: No save or reset buttons
- **WHEN** the form is rendered
- **THEN** the form SHALL NOT contain save or reset buttons

## ADDED Requirements

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
