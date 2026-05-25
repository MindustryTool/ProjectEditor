## Why

Users need real-time feedback on file validity while editing mod projects. Currently, errors like invalid mod.hjson structure, broken content JSON, or incorrect script syntax go undetected until export/build time, causing frustration and wasted time.

## What Changes

- Introduce a file validation system that runs custom validators per file type
- Validators are registered per file path pattern, type, and content schema
- Validation results support 4 severity levels: info, warning, error, deprecated
- Validation runs on file content change (in MonacoEditor) and on export (ExportMenu)
- FileExplorer shows validation status per file with colored icons/badges
- StatusBar shows total error/warning count across all files
- All validation messages are i18n-ready
- A new `@project/file-validation` package is created to host the validation engine

## Capabilities

### New Capabilities
- `file-validation-core`: Core validation engine — registry, runner, severity levels, types
- `file-validation-mod-hjson`: Validator for `mod.hjson` using existing schema from `@project/validation`
- `file-validation-content-json`: Validator for content JSON files (items, blocks, liquids, units, etc.)
- `file-validation-ui`: UI integration — FileExplorer indicators, MonacoEditor markers, StatusBar counter, ExportMenu preflight

### Modified Capabilities
- `status-bar`: Add validation error/warning counts to the right side
- `file-explorer`: Add validation status icons per file

## Impact

- New package `@project/file-validation` with valibot dependency
- New package `@project/file-validation-mod-hjson` and `@project/file-validation-content-json`
- Changes to `apps/web/src/components/editor/StatusBar.tsx` — add validation counters
- Changes to `apps/web/src/components/editor/left/FileExplorer.tsx` — add validation badges
- Changes to `apps/web/src/components/editor/MonacoEditor.tsx` — add inline markers
- Changes to `apps/web/src/components/editor/ExportMenu.tsx` — add validation preflight check
- New i18n keys for validation messages (en + vi)
