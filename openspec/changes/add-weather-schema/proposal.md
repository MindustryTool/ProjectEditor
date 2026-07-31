## Why

The editor supports creating `weather` content files (`content/weathers/*.hjson`, see `CreateFileDialog.tsx`), but has no validation schema for them. Other content types (item, liquid, status, unit, ...) already have schemas in `packages/schema/src/` registered as validators, so weather files currently get no autocompletion, no field metadata, and no validation feedback.

## What Changes

- Add `packages/schema/src/weather.ts` modeled after `liquid.ts` (same valibot structure: `v.object` base schema with `metadata()`, cached `HjsonSchema` function).
- The schema covers fields from `Weather.java` (base), `ParticleWeather.java` (default type), and `RainWeather.java`, reusing existing field schemas (`TextureFieldSchema`, `MindustryHexColorSchema`, `EffectFieldSchema`, `SoundHjsonSchema`, `StatusFieldSchema`, `AttributesSchema`, `ResearchSchema`) — no new schema helpers.
- Export `WeatherHjsonSchema` from `packages/schema/src/index.ts`.
- Register a `weathers-hjson` validator in `packages/core/src/validation/validators.ts` matching `content/weather*` paths (same pattern as `liquids-hjson`).
- Add `weathers` array to `ProjectContents` in `packages/types/src/index.ts` and populate it wherever other content arrays are populated.
- Add `editor.weather.*` i18n keys (en + vi) in `apps/web/src/i18n/locales/*/schema.ts`.

## Capabilities

### New Capabilities
- `weather-schema`: Valibot schema for Mindustry weather content files (base Weather + ParticleWeather + RainWeather fields), its validator registration, i18n labels, and the `ProjectContents.weathers` context array.

### Modified Capabilities
<!-- No existing spec-level requirements change; validator registration is implementation detail covered by the new capability. -->

## Impact

- `packages/schema/src/weather.ts` (new), `packages/schema/src/index.ts` (export)
- `packages/core/src/validation/validators.ts` (new registration)
- `packages/types/src/index.ts` (`ProjectContents.weathers`)
- Content loading code that populates `ProjectContents` (wherever `liquids`/`statuses` arrays are filled)
- `apps/web/src/i18n/locales/en/schema.ts` and `vi/schema.ts`
- No changes to `.mindustry` Java sources — the schema mirrors the fields `ContentParser.java` reads into `Weather.java`/`ParticleWeather.java`/`RainWeather.java`
