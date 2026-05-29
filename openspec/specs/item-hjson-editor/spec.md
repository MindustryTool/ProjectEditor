## ADDED Requirements

### Requirement: Item panel uses schema-driven FieldRenderer
The `ItemPanel` SHALL pass `ItemHjsonSchema` directly to `FieldsRenderer` instead of a manually authored `Field[]` array.

#### Scenario: All schema fields rendered
- **WHEN** `ItemPanel` renders with a valid item HJSON file
- **THEN** all fields defined in `ItemHjsonSchema` SHALL appear in the panel: hardness, cost, charge, radioactivity, flammability, explosiveness, healthScaling, color, research, lowPriority, buildable, hidden

#### Scenario: Nullish fields allow empty/null values
- **WHEN** a `v.nullish()` field is absent from the HJSON
- **THEN** the field SHALL be rendered as empty (no value shown)
- **WHEN** the user clears a nullish field's value
- **THEN** the field SHALL be removed from the HJSON object

#### Scenario: Number fields rendered with number input
- **WHEN** a numeric field (hardness, cost, charge, etc.) is rendered
- **THEN** it SHALL use the Number renderer (`<input type="number">`)

#### Scenario: Color field rendered with color picker
- **WHEN** the color field is rendered
- **THEN** it SHALL use the HexColor renderer (color swatch + popover picker)

#### Scenario: Research field rendered with research editor
- **WHEN** the research field is rendered
- **THEN** it SHALL use the Research renderer (parent input + requirement list)

#### Scenario: Boolean fields rendered with checkboxes
- **WHEN** lowPriority, buildable, or hidden fields are rendered
- **THEN** they SHALL use the Boolean renderer (checkbox)

### Requirement: SpritePicker still rendered alongside fields
The `ItemPanel` SHALL still render the `SpritePicker` component above the schema-driven fields.

#### Scenario: Sprite picker present
- **WHEN** `ItemPanel` renders
- **THEN** the `SpritePicker` SHALL be rendered above the field list
