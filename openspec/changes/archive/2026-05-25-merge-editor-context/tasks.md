## 1. Inline Monaco lifecycle refs into MonacoEditor

- [x] 1.1 Move `monacoRef` and `editorRef` local `useRef` into MonacoEditor component
- [x] 1.2 Move `useMonacoTheme()` call into MonacoEditor
- [x] 1.3 Move `configureMonaco()` one-time call into MonacoEditor body

## 2. Inline validation markers logic

- [x] 2.1 Import `useValidationStore`, `Severity`, and `useTranslation` into MonacoEditor
- [x] 2.2 Port `updateMarkers` callback into MonacoEditor using local refs and `filePath` prop
- [x] 2.3 Add `useEffect` to call `updateMarkers` reactively

## 3. Inline file-content-store subscription

- [x] 3.1 Import `useFileContentStore` and `useProjectStore` into MonacoEditor
- [x] 3.2 Port the file event subscription `useEffect` using `filePath` prop

## 4. Update EditorCenterPanel

- [x] 4.1 Remove `EditorProvider` wrapper from `EditorWithMonaco`
- [x] 4.2 Pass `filePath` prop to `MonacoEditor`

## 5. Cleanup

- [x] 5.1 Delete `EditorContext.tsx`
- [x] 5.2 Remove unused import of `EditorProvider` from `EditorCenterPanel.tsx`
