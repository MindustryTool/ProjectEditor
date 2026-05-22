## Context

The editor currently renders static placeholder panels in the SplitView regardless of which file is selected. With the FileExplorer now syncing selections to `?path=`, the editor panels need to react to path changes and render appropriate editors. The first concrete editor target is `mod.hjson`, the Mindustry mod metadata file.

The existing stack includes shadcn UI primitives (input, button, card, select, etc.), nuqs for URL query state, and i18next for translations. TanStack Form is not yet installed — it brings typed form state, field validation, and submission handling that pairs well with Valibot schemas.

## Goals / Non-Goals

**Goals:**
- SplitView hides center/right panels when no path is selected or path is unknown
- SplitView shows a matching editor panel when a known file path is selected
- `mod.hjson` editor renders a form with fields (name, displayName, author, description, version, minGameVersion, dependencies) using TanStack Form + shadcn + Valibot
- Editor state is driven solely by the `?path=` query param (no additional URL state)
- All field labels and descriptions are i18n-translated

**Non-Goals:**
- Full code editor / Monaco / CodeMirror integration (future change)
- File tree manipulation (rename, delete, create)
- Multiple open tabs or split editors
- Autosave or dirty-state tracking
- Editor for other file types (content.json, scripts, etc.) beyond mod.hjson

## Decisions

1. **Conditional panel rendering at EditorPage level, not SplitView level**
   - `SplitView` remains a pure layout component. `EditorPage` reads `?path=` and decides what content to pass. This keeps SplitView reusable and testable.
   - Alternative considered: Making SplitView path-aware — rejected because it couples layout to editor logic.

2. **TanStack Form over React Hook Form + Zod**
   - The project already uses TanStack Router/Start; staying within the TanStack ecosystem reduces cognitive overhead. `@tanstack/react-form` has first-class Valibot adapter support.
   - Alternative considered: React Hook Form + Zod — more mature but adds a different ecosystem. Valibot is preferred over Zod for its smaller bundle and modular design.

3. **One form component per file type, in a dedicated directory**
   - `apps/web/src/components/editor/mod-hjson/` contains all mod.hjson form components (main form, field groups, validation schema). This scales well as more file editors are added (e.g., `apps/web/src/components/editor/content/`).

4. **shadcn Form + Label components added via inline copy, not CLI**
   - The project doesn't use the shadcn CLI. Existing UI components are hand-written. Form and Label primitives will be hand-written following the same pattern.

5. **Valibot schema defined in the mod-hjson directory, not shared**
   - The mod.hjson structure is specific to this editor. If validation schemas need reuse later, they can be extracted to `@project/validation`.

## Risks / Trade-offs

- [Risk] `@tanstack/react-form-start` adapter may not yet support TanStack Start v1 SSR patterns fully → Mitigation: Use `@tanstack/react-form` (core) only; the Start adapter is optional and can be omitted if problematic
- [Risk] No persisted editor state across navigation (if user changes path and back, form resets) → Accepted trade-off for v1; can add state caching later
- [Trade-off] Inline shadcn form components instead of CLI — fine as long as we match the shadcn API conventions exactly so migration is possible later
