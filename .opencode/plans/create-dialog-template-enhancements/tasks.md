## Tasks

### T1: Add extension map and update preview path

- Add `EXTENSION_MAP` constant mapping type → extension string (`.hjson` for content types, `""` for file/folder)
- Change `previewPath` and `handleCreate` to use `EXTENSION_MAP[type]` instead of hardcoded `.json`
- Update `fullPath` construction in `handleCreate` to be based on extension map

**Files:** `apps/web/src/components/editor/left/FileExplorer.tsx`
**Verify:** Build passes; preview shows `example.hjson` for item type

### T2: Integrate useItems() for item template selection

- Import `useItems` and `Item` type from `#/hooks/use-items`
- Change `templateChoice` state type to `"none" | Item`
- Add `items = useItems({ project: true, base: true })` call in `CreateFileForm`
- Create async `getTemplateContent()` function:
  - If `templateChoice === "none"`: return `""`
  - If `templateChoice.type === "project"`: return `await context.fs.readTextFile(templateChoice.path)`
  - If `templateChoice.type === "base"`: return `""` (placeholder)
- Update template section in JSX:
  - For `item` type: render grouped `<Select>` with "None (empty file)" + items grouped by project/base
  - Use `<SelectGroup>`, `<SelectLabel>`, `<SelectSeparator>` from shadcn/ui
- For `block`/`unit`/`effect`: keep existing template dropdown (unchanged)
- Filter out empty groups (no items to show)

**Files:** `apps/web/src/components/editor/left/FileExplorer.tsx`
**Verify:** Build passes; item type shows items from project/base

### T3: Clean up old item template

- Remove `getItemTemplate` from import and `templateOptions` (no longer used)
- `getBlockTemplate`, `getUnitTemplate`, `getEffectTemplate` remain for their respective types

**Files:** `apps/web/src/components/editor/left/FileExplorer.tsx`
**Verify:** Build passes; no unused imports

### T4: Update spec

- Write delta spec to `openspec/specs/create-file-dialog/spec.md` (update relevant scenarios)
- Update extension scenario from `.json` to `.hjson`
- Add item selector scenarios
- Document async template loading

**Files:** `openspec/specs/create-file-dialog/spec.md`
**Verify:** Spec reflects new behavior
