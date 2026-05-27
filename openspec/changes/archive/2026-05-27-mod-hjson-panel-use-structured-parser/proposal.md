## Why

The `ModHjsonPanel` uses fragile regex-based line parsing (`parseModHjsonContent`) and crude line-replacement (`replaceLine`) to read and write mod.hjson content. This approach breaks on comments, multi-line strings, unquoted values, or any formatting the regex doesn't anticipate. The `@project/hjson` package now provides a structured parser with per-field position metadata, enabling precise field extraction and targeted in-source editing. Inline valibot validation in the panel duplicates validation already present in the file validation system and complicates the component.

## What Changes

- Replace `parseModHjsonContent()` regex parsing with `HJSON.parse(text, undefined, { structured: true })` from `@project/hjson`
- Replace `replaceLine()` / `linesRef` approach with position-based text replacement using `FieldInfo` start/end offsets
- Remove inline valibot validation (`validateField`, `fieldErrors`, `ModHjsonSchema`, `ModNameSchema` imports) from ModHjsonPanel
- Add `@project/hjson` as a dependency of `apps/web`
- No breaking changes to public API

## Capabilities

### New Capabilities

*(None — modifying existing capability.)*

### Modified Capabilities
- `mod-hjson-editor`: Replace regex parsing with structured HJSON parser; remove inline field validation from the editor panel (validation moves to the file validation system)

## Impact

- `apps/web/package.json` — add `"@project/hjson": "workspace:*"` dependency
- `apps/web/src/components/editor/panel/ModHjsonPanel.tsx` — rewrite parsing/update logic; remove valibot imports and validation code
- `packages/validation` — no change (validation schemas remain for file validation system)
