## 1. Sanitization Utility

- [x] 1.1 Add `sanitizeFilename` function in `ExportMenu.tsx` that replaces invalid chars `[^a-zA-Z0-9._-]` with `-`, collapses consecutive `-`, trims leading/trailing `-` and `.`, caps at 200 chars, and falls back to `"export"`
- [x] 1.2 Unit test the sanitize function: spaces → hyphens, special chars stripped, consecutive collapse, trim edges, empty fallback, length cap

## 2. Export Dialog Integration

- [x] 2.1 Auto-sanitize `projectContext.project.name` when `handleOpen` sets initial filename
- [x] 2.2 Add real-time validation on `handleFilenameChange` — compute sanitized version, compare to input, set validation state
- [x] 2.3 Add warning UI: error text below input when filename contains invalid chars, red border via conditional className

## 3. i18n Keys

- [x] 3.1 Add `exportMenu.filenameWarning` key to `en/translation.json` and `vi/translation.json`
- [x] 3.2 Add `exportMenu.filenameEmpty` key to `en/translation.json` and `vi/translation.json`
