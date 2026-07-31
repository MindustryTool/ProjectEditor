## ADDED Requirements

### Requirement: Weather schema
The system SHALL provide a `WeatherHjsonSchema` in `packages/schema/src/weather.ts` covering the fields that `ContentParser.java` reads into `Weather.java`, `ParticleWeather.java`, and `RainWeather.java`, split per class via the existing `ClassMap` pattern (ability.ts/block.ts).

The schema SHALL:
- define `weatherClasses = ["Weather", "ParticleWeather", "RainWeather", "SolarFlare", "MagneticStorm"] as const` and a `WeatherClass` type
- define a static `weatherBaseObjectSchema` (`v.object` with `type: classSchema(weatherClasses, "ParticleWeather")` — the Java default type — spreading `databaseContent`, `texture: TextureFieldSchema("@")`, and the base `Weather` fields)
- define `WeatherHjsonSchema: SchemaFn = new ClassMap<WeatherClass>({...}).schema` with:
  - per-class entries: `Weather` and the empty classes return `{}`; `ParticleWeather` returns `particleWeatherObjectSchema.entries`; `RainWeather` returns `rainWeatherObjectSchema.entries` plus `liquid: LiquidFieldSchema(context)`
  - `baseSchema: (context) => ({ ...weatherBaseObjectSchema.entries, status: StatusFieldSchema(context) })` — `status` is a base field needing context
  - `extra: (context) => ({ research: v.optional(ResearchSchema(context)) })` — applies to every class
- include base `Weather` fields: `duration`, `opacityMultiplier`, `attrs`, `sound`, `soundVol`, `soundVolMin`, `soundVolOscMag`, `soundVolOscScl`, `hidden`, `status`, `statusDuration`, `statusAir`, `statusGround`
- include `ParticleWeather` fields (in `particleWeatherObjectSchema`, with ParticleWeather Java defaults): `particleRegion`, `color`, `yspeed` (-2), `xspeed` (0.25), `padding` (16), `sizeMin` (2.4), `sizeMax` (12), `density` (1200), `minAlpha`, `maxAlpha`, `force`, `noiseScale` (2000), `baseSpeed`, `sinSclMin`, `sinSclMax`, `sinMagMin`, `sinMagMax`, `noiseColor`, `drawNoise`, `drawParticles`, `useWindVector`, `randomParticleRotation`, `noiseLayers`, `noiseLayerSpeedM`, `noiseLayerAlphaM`, `noiseLayerSclM`, `noiseLayerColorM`, `noisePath`
- include `RainWeather` fields (in `rainWeatherObjectSchema`, with RainWeather Java defaults that differ from ParticleWeather): `stroke` (0.75), `splashTimeScale` (22), `liquid` (using `LiquidFieldSchema(context)`), and shared-name fields with RainWeather defaults `yspeed` (5), `xspeed` (1.5), `sizeMin` (8), `sizeMax` (40), `color` ("7a95eaff"); `padding` (16) and `density` (1200) match ParticleWeather's defaults
- reuse only existing field schemas (`TextureFieldSchema`, `MindustryHexColorSchema`, `AttributesSchema`, `SoundHjsonSchema`, `StatusFieldSchema`, `LiquidFieldSchema`, `ResearchSchema`, `classSchema`) and define no new schema helpers
- annotate every field with `metadata({ name: "editor.weather.<field>", description: "editor.weather.<field>-description" })`
- apply Java default values for booleans (`hidden: false`, `statusAir: true`, `statusGround: true`, `drawNoise: false`, `drawParticles: true`, `useWindVector: false`, `randomParticleRotation: false`)

#### Scenario: Valid weather object passes
- **WHEN** an object containing a valid `name`, a hex `color`, a boolean `drawNoise`, and numeric `duration` is validated against `WeatherHjsonSchema(context)`
- **THEN** the schema SHALL accept it and apply Java defaults for missing fields

#### Scenario: Default type is ParticleWeather
- **WHEN** a weather object without a `type` field is validated
- **THEN** the schema SHALL treat it as `ParticleWeather` and apply ParticleWeather defaults

#### Scenario: RainWeather applies its own defaults
- **WHEN** a weather object with `type: "RainWeather"` and no other fields is validated
- **THEN** the schema SHALL apply RainWeather defaults (`yspeed: 5`, `xspeed: 1.5`, `sizeMin: 8`, `sizeMax: 40`, `color: "7a95eaff"`)

#### Scenario: Unknown weather type rejected
- **WHEN** a weather object has `type: "NotAWeather"`
- **THEN** the schema SHALL reject with a validation error

#### Scenario: Invalid color rejected
- **WHEN** a weather object has `color: "not-a-color"`
- **THEN** the schema SHALL reject with a validation error

#### Scenario: RainWeather liquid references a known liquid
- **WHEN** a weather object has `type: "RainWeather"` and `liquid: "water"`
- **THEN** the schema SHALL accept it when `water` exists in `context.liquids`

#### Scenario: Unknown liquid rejected
- **WHEN** a weather object has `type: "RainWeather"` and `liquid: "unknown-liquid"`
- **THEN** the schema SHALL reject with a validation error

### Requirement: Weather schema exported
The system SHALL export `WeatherHjsonSchema` from `packages/schema/src/index.ts`.

#### Scenario: Schema module exposes weather schema
- **WHEN** `@project/schema` is imported
- **THEN** `mod.WeatherHjsonSchema` SHALL be available and be the weather schema

### Requirement: Weather file validator
The system SHALL register a `weathers-hjson` validator in `packages/core/src/validation/validators.ts` that validates `content/weather*` paths (both `.json` and `.hjson`) against `WeatherHjsonSchema`.

#### Scenario: Weather hjson file validated
- **WHEN** a file at `content/weathers/my-weather.hjson` is validated
- **THEN** the `weathers-hjson` validator SHALL run `WeatherHjsonSchema` against its content

#### Scenario: Non-weather file not matched
- **WHEN** a file at `content/items/my-item.hjson` is validated
- **THEN** the `weathers-hjson` validator SHALL NOT match its path

### Requirement: Weather i18n labels
The system SHALL provide `editor.weather.*` and `editor.weather.*-description` translation keys for every weather schema field in both `en` and `vi` locale files (`apps/web/src/i18n/locales/<locale>/schema.ts`).

#### Scenario: English labels exist
- **WHEN** the `en` schema locale is loaded
- **THEN** every `editor.weather.*` key referenced by the weather schema SHALL resolve to a non-empty English string

#### Scenario: Vietnamese labels exist
- **WHEN** the `vi` schema locale is loaded
- **THEN** every `editor.weather.*` key referenced by the weather schema SHALL resolve to a non-empty Vietnamese string

### Requirement: Weather content context
The system SHALL expose `weathers` in `ProjectContents` (`packages/types/src/index.ts`), populate it from project files via a `useWeathers` hook (`apps/web/src/hooks/use-weathers.ts` following the `use-liquids.ts` pattern with a `useBaseWeathers` hook returning an empty base list), and track weather files in `TreeSnapshot` (`packages/core/src/types.ts`) via the `content/weathers` path.

#### Scenario: Project weather files tracked
- **WHEN** a project contains a file at `content/weathers/rain.hjson`
- **THEN** `treeSnapshot.weathers` SHALL contain that file entry

#### Scenario: Contents contains weathers
- **WHEN** `ProjectProvider` builds the `ProjectContents` object for a project with weather files
- **THEN** `contents.weathers` SHALL include the project's weather entries with `type: "project"`

#### Scenario: Base weather list is empty
- **WHEN** `useBaseWeathers()` is called
- **THEN** it SHALL return an empty array
