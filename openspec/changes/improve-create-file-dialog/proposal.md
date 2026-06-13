## Why

The current CreateFileDialog creates content files (item, block, unit, etc.) directly at the user's selected folder without enforcing placement in the correct content subdirectory. This leads to files being created in wrong locations, breaking project structure conventions. Additionally, the template-based cloning workflow is overly complex for most use cases — users often just want a blank file or to import an existing file from disk.

## What Changes

- **Add target folder dropdown**: When a content type is selected, show a dropdown of allowed target folders (derived from content type → folder mapping) and force the user to pick one before creating
- **Remove template selector**: Remove the `TemplateSelector` component and all template-related code/logic
- **Add file upload/import**: Add an "Import File" button that lets users upload a file from disk to the selected target folder
- **Update the content-type → folder mapping**: Define which subdirectories each content type is allowed to write to (e.g., `unit` → `content/units/*`)
- **Remove `onContentReady` / template refs**: Clean up the `getTemplateContentRef` and related hooks
- **Update spec**: Mark the existing template requirements as replaced by folder-picker and import

## Capabilities

### New Capabilities
- `content-folder-picker`: Target folder selection dropdown for content types, restricting creation to content-type-specific subdirectories
- `file-import-upload`: File import/upload capability allowing users to pick a file from disk and write it into the project FS

### Modified Capabilities
- `create-file-dialog`: Requirements around template selection are being replaced by folder-picker and import/upload; the behavior of content type → folder targeting is changing

## Impact

- `apps/web/src/components/editor/file-explorer/CreateFileDialog.tsx`: Major refactor — remove template selector, add folder picker and import button
- `apps/web/src/components/editor/left/TemplateSelector.tsx`: No longer imported — can be removed or deprecated
- `apps/web/src/components/editor/file-explorer/FileExplorerProvider.tsx`: No changes expected (props stay the same)
- `apps/web/src/components/editor/NoOpenedFileScreen.tsx`: No changes expected
- Project FS / packages/core: No changes needed — the folder structure already exists
