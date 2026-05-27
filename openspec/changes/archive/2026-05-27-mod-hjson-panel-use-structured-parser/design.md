## Context

The `ModHjsonPanel` currently parses mod.hjson content with a hand-rolled regex (`/^(\w+):\s*(.*)$/`) that splits lines and extracts key-value pairs. Updates use a `replaceLine` function that finds the line starting with a key prefix and replaces it in the raw string array. This approach:
- Breaks on comments (`//`, `#`), multi-line strings, or any formatting outside the regex expectation
- Cannot distinguish between keys with the same prefix
- Must join/re-split the entire string on each write
- Has no position awareness for error reporting

The `@project/hjson` structured parser now provides `HJSON.parse(text, undefined, { structured: true })` returning a `StructuredObject<ModHjsonData>` with per-field `FieldInfo` containing exact source positions (`start`, `end`, `valueStart`, `valueEnd`) in row/col/index coordinates. Validation schemas exist separately in `@project/validation` and are already consumed by the file validation system.

## Goals / Non-Goals

**Goals:**
- Replace `parseModHjsonContent()` regex parsing with `HJSON.parse()` structured mode
- Replace `linesRef`/`replaceLine` with position-based in-source replacement using `FieldInfo` offsets
- Remove all inline valibot validation (`validateField`, `fieldErrors`, `ModHjsonSchema`, `ModNameSchema` imports) from the panel
- Add `@project/hjson` as a dependency of `apps/web`
- Preserve all existing form rendering behavior (fields, layout, translations)

**Non-Goals:**
- Changing the form UI layout or field set
- Adding new validation UI (validation is handled by the file validation system)
- Modifying `@project/hjson` or `@project/validation` packages
- Preserving comments/formatting on write-back (position-based replacement keeps untracked lines unchanged)

## Decisions

1. **Position-based in-source replacement over `HJSON.stringify` round-trip** — Using `StructuredObject.field(key)` to get `valueStart`/`valueEnd` positions and splicing the replacement into the original source string. This preserves comments, ordering, and formatting of other fields. `HJSON.stringify` would rebuild the entire file and lose all comments/formatting.

2. **Write-back uses string slicing** — Given the original `content` string and a field's `valueStart`/`valueEnd` positions (converted from row/col to flat index), replace the value portion in-place: `content.slice(0, valueIdxStart) + newValue + content.slice(valueIdxEnd)`. This avoids line-splitting and rejoining entirely.

3. **Row/col to index conversion** — `FieldInfo` uses `row`/`col`/`index` coordinates. The `index` field (character offset from start) is used directly for slicing, avoiding row/col-to-index recalculation.

4. **Validation removal** — The panel no longer validates fields on input. Validation schemas (`ModHjsonSchema`, `ModNameSchema`) remain in `@project/validation` and are used by the file validation listener (`file-validation-mod-hjson`). The panel trusts that file-level validation handles error feedback.

5. **Default values on empty content** — When `data === ""`, the panel resets to `defaultModHjson` with no source string to reference. Structured parse is skipped in this case (same as current behavior).

## Risks / Trade-offs

- **HJSON parse errors for malformed content** — If the user manually edits the file to be invalid HJSON, `HJSON.parse()` throws an `HJSONError`. Mitigation: Catch the error and fall back to `defaultModHjson` with an empty source reference, preventing writes until the file is valid.
- **Position mismatch after mutation** — If the source string is mutated by an external editor between parse and write, the cached `FieldInfo` positions may be stale. Mitigation: Re-parse on each write cycle (parse → get positions → write), since the component re-renders when `data` changes.
- **Removing inline validation removes real-time field feedback** — Users won't see validation errors as they type. Mitigation: The file validation system provides asynchronous validation. If inline feedback is desired later, it should be added as a separate concern using the same validation schemas.
