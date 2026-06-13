## 1. Remove Template Selector & Related Code

- [x] 1.1 Remove import of `TemplateSelector` from `CreateFileDialog.tsx`
- [x] 1.2 Remove `getTemplateContentRef`, `handleGetTemplateContent`, and `handleSetTemplateContent` from `CreateFileDialog.tsx`
- [x] 1.3 Remove the `<TemplateSelector>` JSX line from the render
- [x] 1.4 Remove `useRef`, `useCallback` imports if no longer needed

## 2. Add Content Type → Folder Mapping

- [x] 2.1 Add a static `CONTENT_FOLDER_MAP` record mapping each content type to its root folder path (e.g., `unit` → `content/units`)
- [x] 2.2 Add state for `selectedContentFolder` in the component

## 3. Implement Folder Picker Dropdown

- [x] 3.1 When a content type is selected, read subdirectories from `context.fs.readdir(rootContentFolder)` via `useEffect`
- [x] 3.2 Build list of folder options: the root folder + any subdirectories found
- [x] 3.3 Render a `<Select>` dropdown with the folder options when `isContentType` is true
- [x] 3.4 Auto-select the root folder if no subdirectories exist
- [x] 3.5 Disable "Create" button or show error if no folder is selected

## 4. Update Create Logic

- [x] 4.1 Change content type creation to use `selectedContentFolder` instead of `targetPath` for the file path
- [x] 4.2 Remove async template content loading — create content files with empty content `""`

## 5. Add File Import/Upload

- [x] 5.1 Add a hidden `<input type="file" ref={fileInputRef}>` to the dialog
- [x] 5.2 Add an "Import File" button in `DialogFooter` next to "Cancel" and "Create"
- [x] 5.3 On button click, trigger the hidden file input
- [x] 5.4 On file selection, read the file via `FileReader.readAsText()`
- [x] 5.5 Write the file to the appropriate target folder (selected folder for content types, `targetPath` for files, or `targetPath` for folders)
- [x] 5.6 Handle errors during file read/write with error state

## 6. Clean Up

- [x] 6.1 Remove unused imports (`useRef`, `useCallback` if not needed, `TemplateSelector`)
- [x] 6.2 Verify `TemplateSelector.tsx` is no longer imported anywhere (check for other consumers)
- [x] 6.3 Run linter and type checker

## 7. Add i18n Translation Keys

- [x] 7.1 Add translation keys to English locale
- [x] 7.2 Add translation keys to Vietnamese locale
