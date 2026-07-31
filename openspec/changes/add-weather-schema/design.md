## Context

The editor can create `content/weathers/*.hjson` files (`CreateFileDialog.tsx` lists `weather` as a content type, `packages/fs` creates the `content/weathers` folder), but no valibot schema exists for them. Every other supported content type has one in `packages/schema/src/` (e.g. `liquid.ts`, `item.ts`, `status.ts`) registered as a validator in `packages/core/src/validation/validators.ts`.

The Java side (`ContentParser.java` at `.mindustry/core/src/mindustry/mod/ContentParser.java`) parses weather files into `Weather.java` (base class), defaulting the `type` to `ParticleWeather` (line 678), with `RainWeather`, `SolarFlare`, `MagneticStorm` as other types. `Weather.java` extends `UnlockableContent`, so it shares the common `databaseContent` fields.

## Goals / Non-Goals

**Goals:**
- A `weather.ts` schema in `packages/schema/src/` following the exact structure/patterns of `liquid.ts`, covering the union of `Weather`, `ParticleWeather`, and `RainWeather` public fields that `ContentParser` reads.
- Full wiring: export from `index.ts`, `weathers-hjson` validator registration, i18n keys (en + vi), `ProjectContents.weathers` context array with a `useWeathers` hook, and `TreeSnapshot.weathers`.

**Non-Goals:**
- No changes to any `.mindustry` Java sources or the backend API.
- No flat merged schema — per-class schemas split by `type` via the existing `ClassMap` pattern (ability.ts/block.ts), not a single object union of all classes.
- No `SolarFlare`/`MagneticStorm` fields (empty classes).
- No new schema helpers or field schemas — reuse existing ones only.
- No base API data fetch for weathers (backend has no `/weathers` endpoint; base list stays empty).

## Decisions

### 1. ClassMap with per-class schemas, not a flat merged schema
Weather types are selected via the `type` field. `Weather`, `ParticleWeather`, and `RainWeather` each define their own fields with different defaults (e.g. `yspeed` is -2 in ParticleWeather but 5 in RainWeather), so merging them into one flat object would conflate class-specific defaults. The schema uses the existing `ClassMap` pattern (ability.ts/block.ts): a static `weatherBaseObjectSchema` (base `Weather` fields + `type: classSchema(weatherClasses, "ParticleWeather")`), per-class object schemas (`particleWeatherObjectSchema`, `rainWeatherObjectSchema`), and `WeatherHjsonSchema = new ClassMap<WeatherClass>({...}, {...}).schema`.

### 2. Schema structure mirrors ability.ts/block.ts
- `weatherBaseObjectSchema` (static): `type: classSchema(weatherClasses, "ParticleWeather")`, `...databaseContent`, `texture: TextureFieldSchema("@")`, and base `Weather` fields. `classSchema` normalizes package prefixes and casing, matching how `ClassMap.collect` resolves the class key from `input.type`.
- Context-dependent fields go through `ClassMap` options like block.ts:
  - `baseSchema: (context) => ({ ...weatherBaseObjectSchema.entries, status: StatusFieldSchema(context) })` — `status` is a base Weather field but needs context.
  - `extra: (context) => ({ research: v.optional(ResearchSchema(context)) })` — applies to all classes (Weather extends UnlockableContent).
- Per-class map entries mirror ability.ts: `ParticleWeather: () => particleWeatherObjectSchema.entries`, `RainWeather: (context) => ({ ...rainWeatherObjectSchema.entries, liquid: LiquidFieldSchema(context) })`.
- Reused existing schemas (no new ones): `TextureFieldSchema` (texture.ts), `MindustryHexColorSchema`, `AttributesSchema` (attributes.ts), `SoundHjsonSchema` (sound.ts), `StatusFieldSchema` (status.ts), `LiquidFieldSchema` (liquid.ts), `ResearchSchema` (research.ts), `databaseContent` (content.ts).

### 3. Field list (from the three Java classes)

**Base `Weather.java`:** `duration` (Java default `10f * Time.toMinutes` = 36000; kept as `v.optional(v.number())` with no schema default, liquid.ts style), `opacityMultiplier` (1), `attrs` (AttributesSchema), `sound` (SoundHjsonSchema), `soundVol` (0.1), `soundVolMin` (0), `soundVolOscMag` (0), `soundVolOscScl` (20), `hidden` (false), `status` (StatusFieldSchema(context), added via ClassMap `baseSchema` since it needs context), `statusDuration` (120), `statusAir` (true), `statusGround` (true).

**`ParticleWeather.java` (default type):**
`particleRegion` (default "circle-shadow", plain string — not a TextureFieldSchema since vanilla regions like `circle-shadow` may not exist in the sprite list), `color` (white hex, no default — Java white at runtime), `yspeed` (-2), `xspeed` (0.25), `padding` (16), `sizeMin` (2.4), `sizeMax` (12), `density` (1200), `minAlpha` (1), `maxAlpha` (1), `force` (0), `noiseScale` (2000), `baseSpeed` (6.1), `sinSclMin` (30), `sinSclMax` (80), `sinMagMin` (1), `sinMagMax` (7), `noiseColor` (optional, no default — Java defaults it to `color` at runtime), `drawNoise` (false), `drawParticles` (true), `useWindVector` (false), `randomParticleRotation` (false), `noiseLayers` (1), `noiseLayerSpeedM` (1.1), `noiseLayerAlphaM` (0.8), `noiseLayerSclM` (0.99), `noiseLayerColorM` (1), `noisePath` ("noiseAlpha").

**`RainWeather.java`:**
`stroke` (0.75), `splashTimeScale` (22), `liquid` (LiquidFieldSchema(context), added in the RainWeather ClassMap entry since it needs context). Shared-name fields (`yspeed`, `xspeed`, `padding`, `density`, `sizeMin`, `sizeMax`, `color`) have their own RainWeather Java defaults, which differ from ParticleWeather: `yspeed` 5, `xspeed` 1.5, `padding` 10, `density` 100, `sizeMin` 8, `sizeMax` 40, `color` "7a95eaff". `splashes` is excluded — it is auto-loaded from the atlas in `load()` (RainWeather.java:24-27), not meaningful user config.

### 4. Type field
`type` is not part of the Java field set (it is consumed by `getType(value)` and removed at ContentParser.java:679). It uses `classSchema(weatherClasses, "ParticleWeather")` — the existing picklist helper from `class.ts` that normalizes package prefixes/casing and defaults to the Java default type. The five vanilla classes are offered (`Weather`, `ParticleWeather`, `RainWeather`, `SolarFlare`, `MagneticStorm`); unknown values are rejected since the editor only supports these five classes.

### 5. Validator registration
Add to `defaultValidatorRegistrations` in `packages/core/src/validation/validators.ts` (after `liquids-hjson`):
`{ name: "weathers-hjson", pattern: (path) => path.startsWith("content/weather") && (path.endsWith(".json") || path.endsWith(".hjson")), validate: createValibotValidator(() => import("@project/schema").then((mod) => mod.WeatherHjsonSchema)) }`
This matches the folder `content/weathers/` and both extensions — identical to the `liquids-hjson` pattern.

### 6. ProjectContents.weathers (requested by user, no data source yet)
- `packages/types/src/index.ts`: add `type Weather = { name: string }` and `readonly weathers: readonly Weather[]` to `ProjectContents`.
- `apps/web/src/hooks/use-base-weathers.ts`: returns `[]` (no backend `/weathers` endpoint exists — `packages/data/scripts/fetch.ts` ENDPOINTS has no weather entry; the backend has no Weather controller).
- `apps/web/src/hooks/use-weathers.ts`: follows `use-liquids.ts` exactly (base entries from `useBaseWeathers()`, project entries from `useProjectSession((s) => s.treeSnapshot.weathers)`).
- `packages/core/src/types.ts` `TreeSnapshot`: add `weathers: FileEntry[]` collected from `entry.path.includes("content/weathers")` — mirroring the `liquids` block (lines 78, 120-124, 164).
- `apps/web/src/components/editor/ProjectProvider.tsx`: add `useWeathers(metadata)` and the `weathers` entry in the `ProjectContents` memo.
- `@project/api`/`@project/data`: unchanged (documented limitation).

### 7. i18n
Add `editor.weather.*` keys to `apps/web/src/i18n/locales/en/schema.ts` and `vi/schema.ts`, one `name` + `name-description` pair per field, placed after the `editor.liquid.*` block. Descriptions taken from the Java field javadoc/comments and existing Mindustry knowledge.

## Risks / Trade-offs

- [Shared field names (yspeed, xspeed, padding, density, sizeMin, sizeMax, color) have different Java defaults in ParticleWeather vs RainWeather] → Per-class schemas each carry their own Java defaults (ParticleWeather: yspeed -2, xspeed 0.25, sizeMin 2.4, sizeMax 12; RainWeather: yspeed 5, xspeed 1.5, sizeMin 8, sizeMax 40, color "7a95eaff"), so defaults never conflate across classes.
- [`particleRegion`/`noisePath` are plain strings, not sprite-validated] → Accepted: vanilla atlas regions (e.g. `circle-shadow`, `noiseAlpha`) are not in the editor sprite list; validation would produce false errors.
- [`ProjectContents.weathers` has no base data source] → `useBaseWeathers` returns an empty list; a future backend `/weathers` endpoint can populate it via `fetch.ts` without further changes.
- [`splashes` excluded] → Auto-loaded internal asset (RainWeather.java:24-27); not meaningful mod configuration. Low risk of user confusion; field is always regenerated on load.
- [`SolarFlare`/`MagneticStorm` have no fields] → ClassMap entries return `{}` so the classes validate but expose no fields; safe for future extension.

## Open Questions

- None. `duration` default: kept as `v.optional(v.number())` without a schema default (liquid.ts style); Java's 36000 (`10f * Time.toMinutes`) is a runtime default not reflected in the schema.
