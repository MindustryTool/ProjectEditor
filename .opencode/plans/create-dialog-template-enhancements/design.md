## Overview

Modify `CreateFileForm` in `FileExplorer.tsx` to:
1. Use `.hjson` extension for content types
2. Replace static item template with a dynamic item selector powered by `useItems()`
3. Load content asynchronously from selected items (project=read file, base=empty)

## Extension Mapping

```ts
const EXTENSION_MAP: Record<string, string | null> = {
  file: null,
  folder: null,
  item: ".hjson",
  block: ".hjson",
  unit: ".hjson",
  effect: ".hjson",
};
```

- `null` means no extension appended
- `previewPath` appends the extension after the name
- `handleCreate` uses the extension map for the final path

## Item Template Selection

Replace the current `<Select>` for template with a new UX:

```
[Item Type Selected]
  Template: [None (empty file)]  ▼
            ─────────────
            Items (Project)
              copper
              lead
              titanium
            Items (Base)
              surge-alloy
              phase-fabric
```

### Data source
```ts
const items = useItems({ project: true, base: true });
// returns: { name: string; type: "project" | "base"; path: string }[]
```

### State
```ts
const [templateChoice, setTemplateChoice] = useState<"none" | Item>("none");
```

### Content loading (async)
```ts
async function getTemplateContent(): Promise<string> {
  if (templateChoice === "none") return "";
  if (templateChoice.type === "project") {
    return await context.fs.readTextFile(templateChoice.path);
  }
  // base type - placeholder for future API
  return "";
}
```

### Grouping in UI
- Items from `useItems()` are grouped by `type` ("Items (Project)" / "Items (Base)")
- Separator between groups
- "None (empty file)" at top

## Block / Unit / Effect

- Keep existing `templateOptions` and `getBlockTemplate`/`getUnitTemplate`/`getEffectTemplate` from `templates.ts`
- Template dropdown works as before: "None (empty file)" + "Block Template" / etc.
- These remain synchronous since they generate from factory functions

## Preview Path

```ts
const previewPath = name.trim()
  ? `${folderPath}/${name.trim()}${EXTENSION_MAP[type] ?? ""}`
  : "";
```

## handleCreate Changes

```ts
async function handleCreate() {
  const trimmed = name.trim();
  if (!trimmed) { setError("Name cannot be empty"); return; }
  setError("");

  const ext = EXTENSION_MAP[type] ?? "";
  const fullPath = `${targetPath || ""}/${trimmed}${ext}`;

  try {
    if (type === "folder") {
      await context.fs.mkdir(fullPath);
    } else {
      const content = await getTemplateContent();
      await context.fs.writeTextFile(fullPath, content);
    }
    onSuccess(fullPath);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to create");
  }
}
```

## File Changes

### `FileExplorer.tsx`
- Add `EXTENSION_MAP` constant
- Import `useItems` and `Item` type
- Import `SelectGroup`, `SelectSeparator`, `SelectLabel` for grouped select
- Add `templateChoice` type to support `"none" | Item`
- Replace template section for `item` type with grouped item selector
- Keep existing template section for `block`, `unit`, `effect`
- Make `getTemplateContent` an async function
- Update `previewPath` and `handleCreate` to use extension map

### `templates.ts`
- No changes needed (still used for block/unit/effect)
