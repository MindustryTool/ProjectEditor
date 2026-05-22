## MODIFIED Requirements

### Requirement: mod.hjson form editor renders with fields
The system SHALL render a form-based editor in the SplitView center panel when `?path=mod.hjson` is selected, with labeled input fields for each mod metadata property. The form SHALL NOT include save or reset buttons.

#### Scenario: Form renders seven fields
- **WHEN** `?path=mod.hjson` is active
- **THEN** the center panel SHALL display a form with labeled inputs for: `name`, `displayName`, `author`, `description`, `version`, `minGameVersion`, and `dependencies` as a list

#### Scenario: Field descriptions visible
- **WHEN** the form is rendered
- **THEN** each input SHALL display a description explaining the field's purpose

#### Scenario: No save or reset buttons
- **WHEN** the form is rendered
- **THEN** the form SHALL NOT contain save or reset buttons

### Requirement: Form uses TanStack Form with Valibot validation
The mod.hjson form SHALL use `@tanstack/react-form` for form state management and Valibot for field validation.

#### Scenario: name field validates mod-name format
- **WHEN** the user enters a value with uppercase letters or spaces in the `name` field
- **THEN** the field SHALL display a validation error

#### Scenario: displayName length validated
- **WHEN** the user enters a `displayName` shorter than 2 or longer than 127 characters
- **THEN** the field SHALL display a validation error

#### Scenario: description max length validated
- **WHEN** the user enters a description longer than 9999 characters
- **THEN** the field SHALL display a validation error

#### Scenario: author length validated
- **WHEN** the user enters an `author` shorter than 2 or longer than 127 characters
- **THEN** the field SHALL display a validation error

#### Scenario: version max length validated
- **WHEN** the user enters a `version` longer than 127 characters
- **THEN** the field SHALL display a validation error

#### Scenario: minGameVersion must be a number > 145
- **WHEN** the user enters a `minGameVersion` that is not a valid number or is 145 or less
- **THEN** the field SHALL display a validation error

#### Scenario: dependencies validated as mod-names
- **WHEN** the user enters a dependency that does not match the mod-name format
- **THEN** the field SHALL display a validation error

### Requirement: description field uses Textarea
The system SHALL render the `description` field using a `<textarea>` element instead of a single-line `<input>`.

#### Scenario: description renders as textarea
- **WHEN** the mod.hjson form renders
- **THEN** the description field SHALL be a multi-line textarea element

### Requirement: dependencies rendered as field list with add button
The `dependencies` array SHALL be rendered as a list of individual input fields, each validating against the mod-name schema. The form SHALL show one input by default and include an "Add" button below to append additional dependency inputs. An "X" remove button SHALL appear on each dependency input (except the last remaining).

#### Scenario: One default dependency input
- **WHEN** the form renders with no initial dependencies
- **THEN** the dependencies section SHALL show exactly one empty input

#### Scenario: Add button appends a new input
- **WHEN** the user clicks the "Add" button in the dependencies section
- **THEN** a new empty dependency input SHALL appear below the existing ones

#### Scenario: Remove button deletes a dependency input
- **WHEN** the user clicks the remove button on a dependency input
- **THEN** that input SHALL be removed from the list
