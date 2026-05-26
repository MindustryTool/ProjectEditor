## 1. Rename in source hook

- [x] 1.1 Rename `UseFileContentResult.update` → `UseFileContentResult.write` in the interface
- [x] 1.2 Rename internal `update` callback → `write` in `use-file-content.ts`
- [x] 1.3 Update return object to use `write` key

## 2. Update consumers

- [x] 2.1 Update `EditorCenterPanel.tsx` — destructuring and `onChange` prop
- [x] 2.2 Update `SpritePicker.tsx` — destructuring
- [x] 2.3 Update `ItemPanel.tsx` — destructuring and call site
- [x] 2.4 Update `ModHjsonPanel.tsx` — destructuring and call sites
