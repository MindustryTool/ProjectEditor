## Context

The web app is a Mindustry mod editor built with React 19, TanStack Router, Vite, and Tailwind CSS v4. Code editing is currently done via plain `<textarea>` elements with no syntax highlighting, autocomplete, bracket matching, or any editor features. Three editor components exist: `Editor.tsx` (generic wrapper), `HjsonEditor.tsx` (for `.hjson` files), and `JsonEditor.tsx` (for `.json` files). The app runs on Cloudflare (SSR via `@tanstack/react-start`).

Monaco Editor (VS Code's editor) provides first-class language support for JSON/JavaScript/Java out of the box, a well-documented API for custom languages (HJSON), and is the most widely adopted web code editor. It must work within Vite's build pipeline and Cloudflare's runtime constraints.

## Goals / Non-Goals

**Goals:**
- Replace all textarea-based editors with a unified Monaco-based editor component
- Provide syntax highlighting, bracket matching, minimap, and scrollable editing for JSON, HJSON, and future languages
- Configure HJSON as a custom Monaco language with basic syntax highlighting
- Preserve the existing file content flow: Zustand store (`useFileContent`) → editor → save
- Maintain lazy-loading to avoid Monaco bloating the initial bundle
- Keep the editor SSR-safe (Monaco must only render on the client)

**Non-Goals:**
- Language server / IntelliSense for HJSON (beyond basic tokenization)
- Diff editor or multi-tab editing
- Editor theming beyond the built-in Monaco themes (light/dark)
- Changing the Zustand store or data flow

## Decisions

1. **Use `@monaco-editor/react` over raw Monaco**
   - **Rationale**: The `@monaco-editor/react` wrapper handles Monaco's lifecycle (loading, worker setup, disposal) out of the box, provides a straightforward React component API, and supports `beforeMount` for custom language registration. Manual Monaco integration would require significant boilerplate for worker bundling and lifecycle management.
   - **Alternatives considered**: Raw Monaco via `monaco-editor` with manual Vite worker config — more control but higher complexity with no clear benefit for this use case.

2. **Worker bundling via `monaco-editor-workers` or Vite's native worker support**
   - **Rationale**: Monaco requires web workers for syntax highlighting. Vite natively supports web workers, and `@monaco-editor/react` can be configured to point to a public path for workers. Using `monaco-editor-workers` (separate package) or Vite's `?worker` import are both viable. The simpler approach is to let `@monaco-editor/react` load Monaco's default workers from a CDN via `loader.config({ paths: { vs: '...' } })`, which avoids complex worker bundling.
   - **Alternative**: Bundle workers locally with Vite — more self-contained but adds build complexity and increases bundle size. CDN loading is preferable for a web-first app.

3. **Single `<MonacoEditor>` wrapper component over per-language editors**
   - **Rationale**: A single component that accepts `language` as a prop (mapped from file extension) is simpler than maintaining separate editor components per file type. This matches the interface of the existing `Editor.tsx` and reduces duplication.
   - **Alternative**: Keep separate HjsonEditor/JsonEditor and have them each use Monaco internally — unnecessary duplication.

4. **Define HJSON as a Monaco language via `monaco.languages.register` + `setMonarchTokensProvider`**
   - **Rationale**: Monaco's Monarch tokenizer lets us define a complete custom language grammar (keywords, comments, strings, numbers) without external dependencies. This provides syntax highlighting without a full language server.
   - **Alternative**: Tokenize server-side or use CodeMirror which has HJSON support — neither is as well integrated as Monaco for this use case.

5. **Client-side only rendering (`<ClientOnly>` or dynamic import)**
   - **Rationale**: The app uses TanStack Start with SSR. Monaco requires browser APIs (`window`, `WebWorker`). The component must be excluded from SSR, either via a `<ClientOnly>` wrapper or by using `lazy()` with `ssr: false`.
   - **Implementation**: Use `React.lazy(() => import('./MonacoEditor'))` and wrap with a suspense fallback, or use the `clientOnly` pattern from `@tanstack/react-start`.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|---|---|---|
| **Bundle size increase** | Monaco adds ~2-5 MB to JS bundle | Lazy-load Monaco component; load workers from CDN; code-split by language |
| **SSR compatibility** | Monaco crashes on server | Ensure MonacoEditor is client-only via `React.lazy` + `ssr: false` or dynamic import |
| **HJSON grammar inaccuracy** | Syntax highlighting may be incorrect | Use a well-defined Monarch grammar; test with real mod.hjson files |
| **Worker loading from CDN** | Failure if CDN is unreachable | Use a reliable CDN (jsDelivr or unpkg); consider fallback to self-hosted workers later |
| **Performance on large files** | Large JSON files may lag | Monaco handles large files well by default; configure `renderWhitespace` and minimap as needed |
