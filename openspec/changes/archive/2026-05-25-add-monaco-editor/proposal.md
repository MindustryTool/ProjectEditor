## Why

The editor currently uses bare `<textarea>` elements for all code editing — no syntax highlighting, bracket matching, autocomplete, minimap, or any developer-friendly editing features. This severely limits the editing experience for JSON, HJSON, and future Java/JavaScript content. Monaco Editor provides a professional-grade code editing experience that will dramatically improve user productivity and correctness.

## What Changes

- Add `monaco-editor` as a dependency and integrate it into the web app
- Create a reusable `<MonacoEditor>` wrapper component that replaces the three existing textarea-based editors (`Editor.tsx`, `HjsonEditor.tsx`, `JsonEditor.tsx`)
- Configure Monaco language support for JSON, HJSON (custom language), and future languages (Java, JavaScript)
- Remove the old textarea-based editor components after migration
- Wire up Monaco with the existing file content flow (Zustand store → editor → save)

## Capabilities

### New Capabilities
- `editor-code`: Monaco-based code editor with language-specific syntax highlighting, bracket matching, minimap, and theme support. Replaces all textarea editors.
- `editor-language-hjson`: HJSON language support for Monaco — syntax highlighting and validation for `.hjson` files (Mindustry mod metadata format).

### Modified Capabilities

*(No existing specs have their requirements changed.)*

## Impact

- **New dependency**: `monaco-editor` + `@monaco-editor/react` (or manual loader) in `apps/web/package.json`
- **Affected components**: `Editor.tsx`, `HjsonEditor.tsx`, `JsonEditor.tsx` — will be replaced by `<MonacoEditor>`
- **EditorCenterPanel.tsx** — will render `<MonacoEditor>` instead of switching between textarea editors
- **Build**: Monaco workers need to be bundled correctly with Vite
- **Bundle size**: Monaco adds ~2-5 MB to the JS bundle (tree-shakeable; we can lazy-load workers)
- no changes to Zustand stores, routes, or backend — Monaco is purely a frontend rendering change
