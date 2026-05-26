## Why

The `useFileContent` hook exposes a function named `update` that persists content to disk. The name `update` is ambiguous — it suggests a local state update rather than a write-through save. Renaming to `write` makes the side effect explicit and aligns with the underlying `writeBuffer`/`writeQueue` infrastructure.

## What Changes

- Rename `UseFileContentResult.update` → `UseFileContentResult.write`
- Rename the internal `update` callback → `write` in `use-file-content.ts`
- Update all consumers that destructure `update` from `useFileContent`

## Capabilities

### New Capabilities

*(none — this is a rename within an existing hook interface)*

### Modified Capabilities

*(none — no spec-level requirement changes)*

## Impact

- **Source**: `packages/state/src/hooks/use-file-content.ts`
- **Consumers** (4 files):
  - `apps/web/src/components/editor/EditorCenterPanel.tsx`
  - `apps/web/src/components/editor/panel/SpritePicker.tsx`
  - `apps/web/src/components/editor/panel/ItemPanel.tsx`
  - `apps/web/src/components/editor/panel/ModHjsonPanel.tsx`
- **Type export**: `UseFileContentResult` re-exported from `packages/state/src/index.ts`
- No runtime behavior changes
