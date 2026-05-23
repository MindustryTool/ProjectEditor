## Context

The codebase currently assumes all projects use JSON. The `ProjectInfo` type, validation schema, storage record, and UI all lack any language concept. Adding a `language` field requires changes across 5 packages plus the web app. The field must be forward-compatible for future Java/JavaScript support while having no behavioral impact today.

## Goals / Non-Goals

**Goals:**
- Add `language: 'json' | 'java' | 'javascript'` to type definitions, validation, storage, and store
- Surface a language picker in the project creation UI (both full-screen picker and dialog)
- Show a language indicator icon in project listing items
- Default to `'json'` everywhere for backward compatibility

**Non-Goals:**
- No behavioral differences between languages yet (always JSON mode)
- No file template generation based on language
- No validation differences based on language
- No language filtering or sorting in listings

## Decisions

1. **Type union vs enum** – Use a string union type (`'json' | 'java' | 'javascript'`) rather than a numeric/string enum. Simpler, tree-shakeable, no runtime overhead. TypeScript provides the same narrowing guarantees.

2. **IndexedDB schema upgrade** – Add `language` to `ProjectRecord`. The existing store key is `id` (not auto-increment), so new fields on existing records will be `undefined` on read. Handle this by defaulting to `'json'` when the field is missing in `openProjectFromRecord`.

3. **Language picker control** – Use a `<select>` or segmented button group. Since there are only 3 options and one is the default, a `<select>` is simpler and more accessible. Place it below the project name input in both creation forms.

4. **Language icons** – Use simple text badges (e.g., "JSON", "JS", "Java") with distinct colors rather than importing icon SVGs. This avoids dependency bloat while remaining visually scannable.

5. **i18n keys** – New keys under `projectPickerScreen.language.*` and `projectPickerDialog.language.*` following existing naming conventions. Language labels (`json`, `java`, `javascript`) can use the native names.

## Risks / Trade-offs

- IndexedDB schema has no migration mechanism – existing records without `language` will silently default to `'json'`. Acceptable since this is the only valid value today.
- Adding the field to `ProjectRecord` makes the IndexedDB store incompatible if downgrading. Low risk in development.
- The language picker adds one more step to project creation. Mitigated by sensible default (`'json'`) and placing it as a secondary field.
