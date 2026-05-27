## MODIFIED Requirements

### Requirement: Form uses TanStack Form with Valibot validation
The mod.hjson form SHALL use `@tanstack/react-form` for form state management and Valibot for field validation.

**MODIFIED TO:**
The mod.hjson editor SHALL parse the file content using `HJSON.parse()` from `@project/hjson` with structured mode enabled. Field values SHALL be read from the parsed result. Inline field validation SHALL NOT be performed in the editor panel — validation is handled by the file validation system.

#### Scenario: content parsed with HJSON structured parser
- **WHEN** the mod.hjson file content loads
- **THEN** the editor SHALL parse it using `HJSON.parse(content, undefined, { structured: true })`
- **THEN** field values SHALL be extracted from the structured result

#### Scenario: No inline validation on field input
- **WHEN** the user types in any field
- **THEN** the editor SHALL NOT display inline validation errors for that field

### Requirement: Changes applied line-by-line
The system SHALL update only the corresponding line in the file content when the user modifies a field. The line SHALL be identified by its key prefix (e.g., `name:` for the name field) and replaced with the new value. Other lines SHALL remain unchanged.

**MODIFIED TO:**
When the user modifies a field, the system SHALL replace only the value portion of that field in the original source text, using the `valueStart`/`valueEnd` positions from the structured parse result. Other parts of the file SHALL remain unchanged, preserving comments and formatting.

#### Scenario: Position-based replacement on change
- **WHEN** the user modifies any field value
- **THEN** the editor SHALL use the field's `valueStart`/`valueEnd` positions to slice the replacement into the original source string
- **THEN** only the modified field's value range SHALL be replaced, leaving all other text intact

#### Scenario: Initial field values from parsed result
- **WHEN** the mod.hjson file has no `hidden:` line (field is absent)
- **THEN** the editor SHALL treat `hidden` as `false` (default value)

## REMOVED Requirements

### Requirement: name field validates mod-name format
**Reason**: Inline validation removed from editor panel; validation is handled by the file validation system.
**Migration**: Validation schemas remain in `@project/validation` (`ModNameSchema`). File validation listener provides async validation feedback.

### Requirement: displayName length validated
**Reason**: Inline validation removed from editor panel.
**Migration**: File validation system uses `ModHjsonSchema` which includes `displayName` length constraints.

### Requirement: description max length validated
**Reason**: Inline validation removed from editor panel.
**Migration**: File validation system uses `ModHjsonSchema` which includes `description` max length.

### Requirement: author length validated
**Reason**: Inline validation removed from editor panel.
**Migration**: File validation system uses `ModHjsonSchema` which includes `author` length constraints.

### Requirement: version max length validated
**Reason**: Inline validation removed from editor panel.
**Migration**: File validation system uses `ModHjsonSchema` which includes `version` max length.

### Requirement: minGameVersion must be a number > 145
**Reason**: Inline validation removed from editor panel.
**Migration**: File validation system uses `ModHjsonSchema` which includes `minGameVersion` constraint.

### Requirement: dependencies validated as mod-names
**Reason**: Inline validation removed from editor panel.
**Migration**: File validation system uses `ModHjsonSchema` which validates `dependencies` array against `ModNameSchema`.
