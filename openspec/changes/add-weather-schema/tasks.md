## 1. Weather schema

- [x] 1.1 Create `packages/schema/src/weather.ts` with `weatherClasses = ["Weather", "ParticleWeather", "RainWeather", "SolarFlare", "MagneticStorm"] as const` (type `WeatherClass`) and a static `weatherBaseObjectSchema` (`v.object` with `type: classSchema(weatherClasses, "ParticleWeather")`, `...databaseContent`, `texture: TextureFieldSchema("@")`) covering base `Weather` fields: `duration` (optional number), `opacityMultiplier` (1), `attrs` (AttributesSchema), `sound` (SoundHjsonSchema), `soundVol` (0.1), `soundVolMin` (0), `soundVolOscMag` (0), `soundVolOscScl` (20), `hidden` (false), `status` (StatusFieldSchema via ClassMap baseSchema), `statusDuration` (120), `statusAir` (true), `statusGround` (true) — each wrapped in `metadata({ name: "editor.weather.<field>", description: "editor.weather.<field>-description" })` like liquid.ts
- [x] 1.2 Define `particleWeatherObjectSchema` with `ParticleWeather` fields (default type): `particleRegion` ("circle-shadow"), `color` (hex), `yspeed` (-2), `xspeed` (0.25), `padding` (16), `sizeMin` (2.4), `sizeMax` (12), `density` (1200), `minAlpha` (1), `maxAlpha` (1), `force` (0), `noiseScale` (2000), `baseSpeed` (6.1), `sinSclMin` (30), `sinSclMax` (80), `sinMagMin` (1), `sinMagMax` (7), `noiseColor` (optional), `drawNoise` (false), `drawParticles` (true), `useWindVector` (false), `randomParticleRotation` (false), `noiseLayers` (1), `noiseLayerSpeedM` (1.1), `noiseLayerAlphaM` (0.8), `noiseLayerSclM` (0.99), `noiseLayerColorM` (1), `noisePath` ("noiseAlpha")
- [x] 1.3 Define `rainWeatherObjectSchema` with `RainWeather` fields (own Java defaults): `stroke` (0.75), `splashTimeScale` (22), plus shared-name fields with RainWeather defaults `yspeed` (5), `xspeed` (1.5), `padding` (10), `density` (100), `sizeMin` (8), `sizeMax` (40), `color` ("7a95eaff"); exclude `splashes`
- [x] 1.4 Define `WeatherHjsonSchema: SchemaFn = new ClassMap<WeatherClass>({ Weather: () => ({}), ParticleWeather: () => particleWeatherObjectSchema.entries, RainWeather: (context) => ({ ...rainWeatherObjectSchema.entries, liquid: LiquidFieldSchema(context) }), SolarFlare: () => ({}), MagneticStorm: () => ({}) }, { baseSchema: (context) => ({ ...weatherBaseObjectSchema.entries, status: StatusFieldSchema(context) }), extra: (context) => ({ research: v.optional(ResearchSchema(context)) }) }).schema` — ClassMap pattern per ability.ts/block.ts
- [x] 1.5 Export `WeatherHjsonSchema` from `packages/schema/src/index.ts` (after the LiquidHjsonSchema export)

## 2. Validator and context wiring

- [x] 2.1 Register `weathers-hjson` validator in `packages/core/src/validation/validators.ts` matching `content/weather*` paths (`.json`/`.hjson`) using `createValibotValidator(() => import("@project/schema").then((mod) => mod.WeatherHjsonSchema))`, placed after the `liquids-hjson` entry
- [x] 2.2 Add `type Weather = { name: string }` and `readonly weathers: readonly Weather[]` to `ProjectContents` in `packages/types/src/index.ts`
- [x] 2.3 Add `readonly weathers: FileEntry[]` to `TreeSnapshot` in `packages/core/src/types.ts`, collecting entries where `entry.path.includes("content/weathers")`, including the change-compare branches and constructor assignments (mirror the `liquids` block)
- [x] 2.4 Create `apps/web/src/hooks/use-base-weathers.ts` returning an empty array
- [x] 2.5 Create `apps/web/src/hooks/use-weathers.ts` following `use-liquids.ts` (base entries via `useBaseWeathers()`, project entries from `treeSnapshot.weathers` with `contentType: "weathers"`)
- [x] 2.6 Wire `useWeathers(metadata)` into `ProjectProvider.tsx` and add `weathers` to the `ProjectContents` memo

## 3. i18n

- [x] 3.1 Add `editor.weather.*` + `-description` keys for every weather field to `apps/web/src/i18n/locales/en/schema.ts` (after the `editor.liquid.*` block)
- [x] 3.2 Add matching `editor.weather.*` keys to `apps/web/src/i18n/locales/vi/schema.ts`

## 4. Tests and verification

- [x] 4.1 Add unit tests for `WeatherHjsonSchema` in `packages/schema/tests/` (valid weather object, default type ParticleWeather, per-class defaults, invalid hex color, unknown type rejection, valid/unknown liquid reference, status reference) following the existing `planet.test.ts` mock context pattern
- [x] 4.2 Run schema package tests (`pnpm --filter @project/schema test`) and typecheck
- [x] 4.3 Run typecheck on `@project/types`, `@project/core`, and web app; verify no `ProjectContents` construction sites are missed (grep for `ProjectContents` object literals)
