## Context

The editor component tree currently has three layers for Monaco: `EditorCenterPanel` → `EditorProvider` (context) → `MonacoEditor` (consumer). The `EditorProvider` provides monaco refs, theme, validation markers, and file-content-store integration. `MonacoEditor` is the sole consumer of all these values. This indirection adds a file, a context creation, and a wrapper component for no benefit.

## Goals / Non-Goals

**Goals:**
- Eliminate `EditorContext.tsx` by inlining all logic into `MonacoEditor`
- Remove `EditorProvider` wrapper from `EditorCenterPanel`
- Preserve exact same behavior: monaco setup, theme, markers, file-content-store subscriptions

**Non-Goals:**
- Changing MonacoEditor's public props interface
- Modifying validation store or file-content-store APIs
- Behavioral changes to the editor

## Decisions

1. **Inline context refs directly into MonacoEditor** — The `monacoRef` and `editorRef` are only set and read within `MonacoEditor`. Move them to local `useRef` inside the component. No need for context.

2. **Keep theme hook in MonacoEditor** — `useMonacoTheme()` is already called in `EditorProvider`. Move it into `MonacoEditor` directly. The theme is only needed by the editor component.

3. **Keep monaco configuration call in MonacoEditor** — `configureMonaco()` is called once on mount. Move it into `MonacoEditor` as a one-time effect. Already guarded by a `useRef` flag.

4. **Move validation markers logic into MonacoEditor** — The `updateMarkers` callback reads `resultsByPath` from the validation store and calls `setModelMarkers`. Move it into `MonacoEditor` using the same pattern. The path is already available as the eventual `filePath` prop from `EditorCenterPanel`.

5. **Move file-content-store subscription into MonacoEditor via prop** — `EditorProvider` currently receives `path` as a prop. `MonacoEditor` can receive `filePath` instead, which `EditorCenterPanel` already passes. The `useEffect` for subscribing to file events moves into `MonacoEditor`.

## Risks / Trade-offs

- **Risk** → **Mitigation**: MonacoEditor currently doesn't accept `path` — need to ensure `filePath` prop drives both language selection and file-store subscription. The prop `filePath` already exists but is unused; will wire it properly.
- **Risk** → **Mitigation**: If another consumer of `EditorContext` emerges later, the context pattern would need reintroduction. Low likelihood since the context was purpose-built for this single use case.
