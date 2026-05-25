## Context

The editor currently has no file validation system. The `@project/validation` package exists with valibot schemas for mod info and settings, but it's only used at project creation time. Files can be freely edited with zero feedback. Users discover issues only at export time or during gameplay.

Validation needs to be:
- Extensible — different file types need different validators
- Reactive — validate on content change, show results immediately
- Visual — indicators in file tree, inline markers in editor, counters in statusbar
- Blocking — export should warn/halt if errors exist
- Localized — messages in en + vi (current locale strategy)

## Goals / Non-Goals

**Goals:**
- Create a validation engine at `@project/file-validation` with a registry, runner, and severity system
- Provide validators for mod.hjson, content JSON (items, blocks, liquids, units), and scripts
- Show validation badges on files in FileExplorer (error/warning/info counts per file)
- Show inline error markers in MonacoEditor (squiggly underlines + hover messages)
- Show total error/warning count in StatusBar
- Block export with error summary if critical errors exist
- All validation messages support i18n (en + vi)
- 4 severity levels: error, warning, info, deprecated

**Non-Goals:**
- Real-time syntax highlighting for non-Monaco editors (only Monaco gets inline markers)
- Auto-fix or quick-fix suggestions
- Validation of image/sound/map binary files
- Server-side validation (all validation is client-side in the browser)

## Decisions

1. **Separate validation package** (`@project/file-validation`) vs expanding `@project/validation`  
   Decision: New package. The existing `@project/validation` is for schema validation of project metadata. File validation is a larger, UI-integrated concern. Keep them separate.

2. **Validator registration** pattern  
   Each validator is a function: `(params: {path: string, content: string}) => ValidationResult[]`  
   Validators register against a file path pattern (glob or regex). A registry collects all validators. The runner matches file paths, runs applicable validators, and aggregates results.

3. **Severity levels** as a numeric enum  
   `error = 0, warning = 1, info = 2, deprecated = 3`  
   This allows filtering (e.g., "only show errors" for export blocking).

4. **Validation on content change**  
   MonacoEditor fires `onChange` → debounce → validate → store results in a zustand store → UI reactively reads store. This keeps validation async from rendering.

5. **File-level validation state store**  
   A new zustand store (`useValidationStore`) maps file path → array of validation results. Components subscribe to what they need.

6. **Export integration**  
   ExportMenu calls `runAllValidations()` before export. If any errors exist, show a dialog with the error list. User can cancel or force export.

7. **Inline Monaco markers**  
   Use `monaco.editor.setModelMarkers()` to set markers from validation results at the correct line/column. This requires parsing error positions from validation results.

## Risks / Trade-offs

- **Performance**: Validating every keystroke could be expensive for large JSON files. Mitigation: debounce + validate only the current file, not the whole project.
- **Monaco API coupling**: Inline markers depend on Monaco editor API, which is only available after mount. Mitigation: wrap marker logic in a hook that safely handles the editor instance.
- **i18n maintenance**: Validation error messages must be kept in sync between en and vi. Mitigation: use a key-based message system where validators return message keys + interpolations, not raw strings.
