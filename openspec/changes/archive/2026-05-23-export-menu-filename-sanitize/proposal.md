## Why

Export filenames are currently set to the raw project name (e.g., "My Cool Mod v2!"). Many filesystems and operating systems reject or behave unexpectedly with spaces, special characters, and unicode in filenames. This leads to broken downloads, user confusion, and inconsistent file naming.

## What Changes

- Add a filename sanitization utility that converts arbitrary project names to valid, cross-platform filenames
- Auto-sanitize the pre-filled project name when the export dialog opens
- Validate user-typed filenames in real-time, rejecting or correcting invalid characters
- Show inline validation feedback in the ExportMenu dialog
- The sanitized filename replaces spaces and special characters with hyphens, preserving alphanumeric chars, hyphens, and underscores only

## Capabilities

### New Capabilities
- `export-filename-sanitization`: Filename sanitization rules — allowed character set, conversion logic, max length, and error handling

### Modified Capabilities
- `project-export`: Update export dialog behavior to include sanitized default filename and real-time input validation

## Impact

- **ExportMenu.tsx**: Add sanitization logic on dialog open and on user input
- **New utility**: A shared sanitize function (likely in `packages/utils` or inline in `ExportMenu`)
- **i18n**: Add validation error message keys for `exportMenu`
- **project-export spec**: Update with new filename behavior requirements
