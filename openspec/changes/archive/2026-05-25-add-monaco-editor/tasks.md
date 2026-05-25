## 1. Dependencies & Setup

- [x] 1.1 Add `monaco-editor` and `@monaco-editor/react` to `apps/web/package.json`
- [x] 1.2 Configure Monaco loader to load workers from CDN (jsDelivr) in the app entry

## 2. MonacoEditor Component

- [x] 2.1 Create `src/components/editor/MonacoEditor.tsx` with props: `value`, `onChange`, `language`, `readOnly`
- [x] 2.2 Integrate `@monaco-editor/react` `<Editor>` component with `beforeMount` for custom language setup
- [x] 2.3 Implement `value` prop sync (external changes → editor update, no onChange trigger)
- [x] 2.4 Implement proper disposal on unmount via `useEffect` cleanup
- [x] 2.5 Add lazy-loading wrapper with `React.lazy()` + Suspense fallback (spinner/skeleton)
- [x] 2.6 Ensure SSR safety: render a fallback placeholder on server, mount Monaco on client

## 3. HJSON Language Support

- [x] 3.1 Create `src/lib/monaco/hjsonLanguage.ts` with Monarch tokenizer grammar definitions
- [x] 3.2 Register `hjson` custom language via `monaco.languages.register({ id: 'hjson' })`
- [x] 3.3 Set Monarch tokenizer via `monaco.languages.setMonarchTokensProvider('hjson', grammar)`
- [x] 3.4 Configure HJSON language settings: bracket matching, auto-closing pairs, comment toggling (`#`)
- [x] 3.5 Call language registration in the MonacoEditor `beforeMount` handler

## 4. File Extension to Language Mapping

- [x] 4.1 Create `src/lib/monaco/languageMap.ts` mapping file extensions → Monaco language IDs
- [x] 4.2 Support `.json` → `json`, `.hjson` → `hjson`, fallback to `plaintext`
- [x] 4.3 Integrate mapping into `EditorCenterPanel` to pass correct `language` prop

## 5. Theme Integration

- [x] 5.1 Create a hook or utility to detect the current theme (light/dark) from the app's theme provider
- [x] 5.2 Pass `theme="vs"` or `theme="vs-dark"` to MonacoEditor based on detected theme
- [x] 5.3 Ensure theme updates reactively when user toggles theme

## 6. EditorCenterPanel Migration

- [x] 6.1 Update `EditorCenterPanel.tsx` to render `<MonacoEditor>` for `.hjson` and `.json` files
- [x] 6.2 Remove `HjsonEditor.tsx` component and its imports
- [x] 6.3 Remove `JsonEditor.tsx` component and its imports
- [x] 6.4 Remove `Editor.tsx` generic textarea component and its imports
- [x] 6.5 Clean up any unused CSS or styles related to the old textarea editors

## 7. Verification

- [x] 7.1 Run `pnpm typecheck` to ensure TypeScript compiles without errors
- [x] 7.2 Run `pnpm test` to ensure existing tests pass
- [x] 7.3 Run `pnpm build` to verify the production build succeeds with Monaco workers
- [ ] 7.4 Verify manually: open a `.json` file — syntax highlighting and minimap work
- [ ] 7.5 Verify manually: open `mod.hjson` — HJSON syntax highlighting works
- [ ] 7.6 Verify manually: toggle theme — Monaco theme switches accordingly
