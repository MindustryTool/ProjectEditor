## ADDED Requirements

### Requirement: Renderer contract separates primitive helper from structural patching
`FieldRenderer.tsx` SHALL not use a generic `patchValue` prop in the shared renderer contract. Primitive field renderers SHALL receive a helper dedicated to scalar edits, while structural renderers SHALL update content through explicit HJSON patch operations.

#### Scenario: Primitive renderer receives scalar edit helper
- **WHEN** a string, number, boolean, color, or select-like field is rendered from a primitive HJSON value node
- **THEN** the renderer SHALL update the field through a helper that accepts raw scalar input
- **AND** the helper SHALL apply the same default-removal and nullish handling rules as existing scalar editing

#### Scenario: Structural renderer does not depend on generic raw-value replacement
- **WHEN** an object or array renderer is rendered
- **THEN** its write path SHALL be expressed with explicit structural patch APIs
- **AND** the shared renderer prop contract SHALL not provide a generic whole-field replacement callback for that purpose
