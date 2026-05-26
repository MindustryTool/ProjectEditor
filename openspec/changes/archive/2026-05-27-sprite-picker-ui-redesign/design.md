## Context

The SpritePicker currently displays action buttons (Replace/Remove) as text-labeled buttons in a row below the sprite image. This layout feels loose — the actions are visually separated from the sprite they control. The goal is to overlay icon-only actions directly on the sprite preview using backdrop blur for readability, and use `<FormField>`/`<FormLabel>`/`<FormControl>` from the project's custom form components for consistent layout.

## Goals / Non-Goals

**Goals:**
- Overlay Replace and Remove icon buttons on top of the sprite image preview
- Use backdrop blur (`backdrop-blur-sm`) and semi-transparent backgrounds for overlay clarity
- Replace text labels with icons only (Upload, Trash2)
- Use `<FormField>`, `<FormLabel>`, `<FormControl>` for the upload/no-sprite state layout
- Match existing form patterns in `FieldRenderer.tsx`

**Non-Goals:**
- No functional behavior changes (reading, writing, deleting sprites stays the same)
- No changes to `resolveContentSprite` or `findFileInTree`
- No changes to `EditorRightPanel.tsx`

## Decisions

**Decision 1: Overlay positioned with `relative` container and `absolute` buttons**
- The sprite image container uses `relative`. The action button group uses `absolute bottom-2 right-2` inside it.
- Backdrop blur via `backdrop-blur-sm bg-background/60` on the overlay for readability.

**Decision 2: Icon-only buttons with `variant="ghost"` or minimal styling**
- Use `Button variant="ghost" size="icon"` for clean icon-only buttons.
- No text labels — icons convey enough meaning (Upload for replace, Trash2 for remove).

**Decision 3: Use `<FormField>` for the upload/no-sprite state**
- Match the pattern from `FieldRenderer.tsx`: `<FormField>` → `<FormLabel>` → `<FormControl>` → content.
- `FormLabel` reads "Sprite" (matching the Panel header).
- `FormControl` wraps the upload prompt or the sprite viewer.

## Risks / Trade-offs

- **Accessibility**: Icon-only buttons lack text labels → Mitigation: use `aria-label` on icon buttons.
- **Touch targets**: Small icon buttons may be hard to tap on mobile → Acceptable since the app is desktop-focused (offline-first Mindustry mod editor).
