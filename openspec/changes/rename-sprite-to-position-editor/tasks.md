## 1. Schema Package — Rename Types and Functions

- [x] 1.1 Rename `BasePosition` type (keep, already named position) and rename all `*RegionData` types to `*PositionData` in `packages/schema/src/utils.ts` (`SpriteRegionData` → `SpritePositionData`, `EngineRegionData` → `EnginePositionData`, `ShootRegionData` → `ShootPositionData`, `PartRegionData` → `PartPositionData`, `DrawRegionData` → `DrawPositionData`, `UnknownRegionData` → `UnknownPositionData`, `RegionData` union → `PositionData`)
- [x] 1.2 Rename `resolveRegionType` → `resolvePositionType` in `packages/schema/src/utils.ts`
- [x] 1.3 Rename `collectRegionData` → `collectPositionData` in `packages/schema/src/utils.ts`, add exclusion Set for non-position fields
- [x] 1.4 Update re-exports in `packages/schema/src/index.ts` (all type names, `collectPositionData`, `resolvePositionType`)

## 2. Update Importers of @project/schema

- [x] 2.1 Update imports in `apps/web/src/components/editor/sprite/SpriteEditor.tsx` — use new type/function names
- [x] 2.2 Update imports in `apps/web/src/components/editor/sprite/RegionPlaceholder.tsx` — use new type names
- [x] 2.3 Update any other files importing renamed types from `@project/schema` (grep for `RegionData`, `collectRegionData`, `resolveRegionType`)

## 3. Rename Editor Directory and Components

- [x] 3.1 Rename directory `apps/web/src/components/editor/sprite/` → `apps/web/src/components/editor/position-editor/`
- [x] 3.2 Rename `SpriteEditor.tsx` → `PositionEditor.tsx` — rename component to `PositionEditor`, rename `SpriteSidebar` → `PositionSidebar`, `SpritePreview` → `PositionPreview`, update internal imports
- [x] 3.3 Rename `SpriteImage.tsx` → `PositionImage.tsx` — rename component to `PositionImage`
- [x] 3.4 Rename `RegionPlaceholder.tsx` → `PositionPlaceholder.tsx` — rename `RegionPlaceholder` → `PositionPlaceholder`, `EnginePlaceholder` → `EnginePositionPlaceholder`, `ShootPlaceholder` → `ShootPositionPlaceholder`
- [x] 3.5 Rename `utils.ts` → `utils.ts` (same file) — rename `updateSpritePosition` → `updatePositionData`
- [x] 3.6 Fix `UnitSpritEdior.tsx` → `UnitPositionEditor.tsx` — rename wrapper to `UnitPositionEditor`, fix spelling typo

## 4. Integration Updates

- [x] 4.1 Update `EditorShell.tsx` lazy import — import from `position-editor/UnitPositionEditor` instead of `sprite/UnitSpritEdior`
- [x] 4.2 Update `UnitPanel.tsx` — update route type and toggle references

## 5. i18n Updates

- [x] 5.1 Update `apps/web/src/i18n/locales/en/common.ts` — rename `sprite-editor.open`/`sprite-editor.close` to `position-editor.open`/`position-editor.close`
- [x] 5.2 Update `apps/web/src/i18n/locales/vi/common.ts` — same rename

## 6. Verify

- [x] 6.1 Run `pnpm typecheck` across the monorepo to catch any stale references
- [x] 6.2 Run `pnpm lint` to verify no lint errors (pre-existing errors only, none from this change)
