## 1. Dependencies & Setup

- [x] 1.1 Install `@tanstack/react-form`, `@tanstack/react-form-start`, and `valibot` in apps/web
- [x] 1.2 Create shadcn `label` and `form` UI components under `apps/web/~/components/ui/`
- [x] 1.3 Add i18n translation keys for mod.hjson form field labels and descriptions (en + vi)

## 2. Dynamic Panel Rendering

- [x] 2.1 Read `?path=` query param in EditorPage and conditionally render center/right panels — hide both when path is absent/null/unknown
- [x] 2.2 Hide SplitView resize handles when center or right panel is not rendered

## 3. mod.hjson Form Editor

- [x] 3.1 Create Valibot validation schema for mod.hjson fields in `<editor>/mod-hjson/schema.ts`
- [x] 3.2 Create ModHjsonEditor component in `<editor>/mod-hjson/ModHjsonEditor.tsx` using TanStack Form + shadcn form components with all 7
      fields (name, displayName, author, description, version, minGameVersion, dependencies)
- [x] 3.3 Register ModHjsonEditor in EditorPage — render it in the center panel when `?path=mod.hjson` is selected

## 4. Verification

- [x] 4.1 Run typecheck (`npm run typecheck`) — fix any errors
- [x] 4.2 Manual check: no path selected → only left panel visible, center + right hidden
- [x] 4.3 Manual check: `?path=mod.hjson` → form renders with fields and descriptions
- [x] 4.4 Manual check: unknown path → center + right panels hidden
