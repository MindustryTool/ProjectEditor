## ADDED Requirements

### Requirement: Editor page uses translated text
The EditorPage SHALL use translation keys for all user-facing strings instead of hardcoded English text.

#### Scenario: Placeholder text is translatable
- **WHEN** the EditorPage shows placeholder content (e.g. "Select a file to start editing")
- **THEN** the text SHALL be rendered via `t()` with a translation key
