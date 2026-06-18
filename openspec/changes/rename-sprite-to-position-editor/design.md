## Context

The `SpriteEditor` component and its supporting code were originally built to visualize unit sprite regions on a Konva canvas. Over time, the canvas grew to render engines, shoot points, parts, and draw-regions — all positioned entities from the unit schema. However, naming stayed sprite-centric: `collectRegionData`, `SpriteRegionData`, `SpriteEditor`, `SpriteSidebar`, etc.

The `packages/schema/src/utils.ts` `collectRegionData` function traverses HJSON objects to collect all entities with `x`/`y` coordinates, but it currently doesn't filter out fields that happen to have `x`/`y` but aren't position entities (e.g., shadow offsets, trail offsets). These false positives clutter the canvas.

## Goals / Non-Goals

**Goals:**
- Rename all "sprite" → "position" naming in the editor feature
- Exclude non-position fields from `collectPositionData` results
- `PositionSidebar` shows meaningful previews for engine, shoot, part, draw-region types (not just sprites)
- Fix the `UnitSpritEdior.tsx` filename typo during rename
- All i18n keys updated from `sprite-editor.*` → `position-editor.*`

**Non-Goals:**
- No changes to the actual rendering logic or canvas interaction behavior
- No changes to the schema field definitions themselves
- No new editor features beyond the renames and exclusion list

## Decisions

1. **Exclusion via field name list instead of schema metadata** — The excluded fields (`shadowElevation`, `waveTrailX`, etc.) are known statically. Adding a `positionOnly: false` metadata flag to each schema field is more invasive. A simple `excludeFields` Set in `collectPositionData` is clean and reversible.

2. **Directory rename `sprite/` → `position-editor/`** — Keeps consistent with naming convention (`position-editor/` matches `pixel-editor/` pattern). All files move as-is with internal type/function renames.

3. **Inline `PositionSidebar` stays inline** — It's tightly coupled to `PositionEditor` internals (scroll-to logic, type dispatch). No benefit to extracting it.

4. **i18n keys renamed via find/replace** — Keys are simple one-to-one renames (`sprite-editor.open` → `position-editor.open`). No structural changes needed.

5. **Exclusion check in `visit()` before creating position entry** — When an object has `x`/`y` but is in the exclude set, skip it. This avoids adding then filtering after collection.

## Risks / Trade-offs

- **Risk: Missed import references after rename** → Use comprehensive grep across monorepo before declaring done. Run `pnpm typecheck` to catch stale references.
- **Risk: Breaking external consumers of `@project/schema`** → This is an internal monorepo; all consumers are accounted for in the impact list. No external consumers exist.
- **Trade-off: Static exclude list is fragile** → If new non-position `x`/`y` fields are added to schemas, they'll need to be added to the exclude list. But this is rare, and the list is centralized in one place.
