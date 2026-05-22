## Why

The editor currently shows static placeholder panels regardless of which file is selected in the explorer. Selecting a file should open an appropriate editor panel, starting with a form-based editor for `mod.hjson` that allows editing fields directly.

## What Changes

- **Dynamic editor panels**: SplitView center/right panels respond to the `?path=` query param — show nothing when no file is selected, show a matching editor when a known file is selected, show nothing for unknown paths
- **mod.hjson form editor**: When `?path=mod.hjson` is active, the center panel renders a form with labeled fields, inputs (text, number, select), and descriptions using TanStack Form + shadcn UI + Valibot validation
- **New dependencies**: Add `@tanstack/react-form`, `@tanstack/react-form-start` (TanStack Start adapter), and `valibot`
- **shadcn form components**: Add `label`, `form` shadcn primitives if not already present

## Capabilities

### New Capabilities
- `mod-hjson-editor`: Form-based editor for `mod.hjson` using TanStack Form, shadcn form components, and Valibot validation schemas
- `file-editor-panel`: Dynamic rendering of editor center/right panels based on the selected file path from the `?path=` URL query parameter

### Modified Capabilities
- `editor-layout`: The EditorPage layout gains conditional panel visibility — center and right panels are only rendered when a valid file path is selected

## Impact

- `apps/web/src/components/editor/SplitView.tsx` — conditionally render center/right panels based on path presence
- `apps/web/src/components/editor/EditorPage.tsx` — read `?path=` query, pass conditional content to SplitView
- `apps/web/src/components/editor/mod-hjson/` — new directory with form components for mod.hjson editing
- `apps/web/package.json` — add `@tanstack/react-form`, `@tanstack/react-form-start`, `valibot`
- New shadcn UI components: `label`, `form` (or use radix directly)
- i18n keys for mod.hjson field labels and descriptions
