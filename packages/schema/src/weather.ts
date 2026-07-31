import * as v from "valibot";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import type { SchemaFn } from "./utils";
import { metadata } from "./utils";
import { databaseContent } from "./content";
import { TextureFieldSchema } from "./texture";
import { SoundHjsonSchema } from "./sound";
import { AttributesSchema } from "./attributes";
import { StatusFieldSchema } from "./status";
import { LiquidFieldSchema } from "./liquid";
import { ClassMap, classSchema } from "./class";

export const weatherClasses = [
	"Weather",
	"ParticleWeather",
	"RainWeather",
	"SolarFlare",
	"MagneticStorm",
] as const;

export type WeatherClass = (typeof weatherClasses)[number];

const weatherBaseObjectSchema = v.object({
	type: classSchema(weatherClasses, "ParticleWeather"),

	...databaseContent,
	texture: TextureFieldSchema("@"),
	duration: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.weather.duration",
			description: "editor.weather.duration-description",
		}),
	),
	opacityMultiplier: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.weather.opacity-multiplier",
			description: "editor.weather.opacity-multiplier-description",
		}),
	),
	attrs: v.pipe(
		v.optional(AttributesSchema),
		metadata({
			name: "editor.weather.attrs",
			description: "editor.weather.attrs-description",
		}),
	),
	sound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.weather.sound",
			description: "editor.weather.sound-description",
		}),
	),
	soundVol: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.weather.sound-vol",
			description: "editor.weather.sound-vol-description",
		}),
	),
	soundVolMin: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.weather.sound-vol-min",
			description: "editor.weather.sound-vol-min-description",
		}),
	),
	soundVolOscMag: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.weather.sound-vol-osc-mag",
			description: "editor.weather.sound-vol-osc-mag-description",
		}),
	),
	soundVolOscScl: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.weather.sound-vol-osc-scl",
			description: "editor.weather.sound-vol-osc-scl-description",
		}),
	),
	hidden: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weather.hidden",
			description: "editor.weather.hidden-description",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.weather.status-duration",
			description: "editor.weather.status-duration-description",
		}),
	),
	statusAir: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weather.status-air",
			description: "editor.weather.status-air-description",
		}),
	),
	statusGround: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weather.status-ground",
			description: "editor.weather.status-ground-description",
		}),
	),
});

const particleWeatherObjectSchema = v.object({
	particleRegion: v.pipe(
		v.optional(v.string(), "circle-shadow"),
		metadata({
			name: "editor.weather.particle-region",
			description: "editor.weather.particle-region-description",
		}),
	),
	color: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.weather.color",
			description: "editor.weather.color-description",
		}),
	),
	yspeed: v.pipe(
		v.optional(v.number(), -2),
		metadata({
			name: "editor.weather.yspeed",
			description: "editor.weather.yspeed-description",
		}),
	),
	xspeed: v.pipe(
		v.optional(v.number(), 0.25),
		metadata({
			name: "editor.weather.xspeed",
			description: "editor.weather.xspeed-description",
		}),
	),
	padding: v.pipe(
		v.optional(v.number(), 16),
		metadata({
			name: "editor.weather.padding",
			description: "editor.weather.padding-description",
		}),
	),
	sizeMin: v.pipe(
		v.optional(v.number(), 2.4),
		metadata({
			name: "editor.weather.size-min",
			description: "editor.weather.size-min-description",
		}),
	),
	sizeMax: v.pipe(
		v.optional(v.number(), 12),
		metadata({
			name: "editor.weather.size-max",
			description: "editor.weather.size-max-description",
		}),
	),
	density: v.pipe(
		v.optional(v.number(), 1200),
		metadata({
			name: "editor.weather.density",
			description: "editor.weather.density-description",
		}),
	),
	minAlpha: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.weather.min-alpha",
			description: "editor.weather.min-alpha-description",
		}),
	),
	maxAlpha: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.weather.max-alpha",
			description: "editor.weather.max-alpha-description",
		}),
	),
	force: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.weather.force",
			description: "editor.weather.force-description",
		}),
	),
	noiseScale: v.pipe(
		v.optional(v.number(), 2000),
		metadata({
			name: "editor.weather.noise-scale",
			description: "editor.weather.noise-scale-description",
		}),
	),
	baseSpeed: v.pipe(
		v.optional(v.number(), 6.1),
		metadata({
			name: "editor.weather.base-speed",
			description: "editor.weather.base-speed-description",
		}),
	),
	sinSclMin: v.pipe(
		v.optional(v.number(), 30),
		metadata({
			name: "editor.weather.sin-scl-min",
			description: "editor.weather.sin-scl-min-description",
		}),
	),
	sinSclMax: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.weather.sin-scl-max",
			description: "editor.weather.sin-scl-max-description",
		}),
	),
	sinMagMin: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.weather.sin-mag-min",
			description: "editor.weather.sin-mag-min-description",
		}),
	),
	sinMagMax: v.pipe(
		v.optional(v.number(), 7),
		metadata({
			name: "editor.weather.sin-mag-max",
			description: "editor.weather.sin-mag-max-description",
		}),
	),
	noiseColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.weather.noise-color",
			description: "editor.weather.noise-color-description",
		}),
	),
	drawNoise: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weather.draw-noise",
			description: "editor.weather.draw-noise-description",
		}),
	),
	drawParticles: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weather.draw-particles",
			description: "editor.weather.draw-particles-description",
		}),
	),
	useWindVector: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weather.use-wind-vector",
			description: "editor.weather.use-wind-vector-description",
		}),
	),
	randomParticleRotation: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weather.random-particle-rotation",
			description: "editor.weather.random-particle-rotation-description",
		}),
	),
	noiseLayers: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.weather.noise-layers",
			description: "editor.weather.noise-layers-description",
		}),
	),
	noiseLayerSpeedM: v.pipe(
		v.optional(v.number(), 1.1),
		metadata({
			name: "editor.weather.noise-layer-speed-m",
			description: "editor.weather.noise-layer-speed-m-description",
		}),
	),
	noiseLayerAlphaM: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "editor.weather.noise-layer-alpha-m",
			description: "editor.weather.noise-layer-alpha-m-description",
		}),
	),
	noiseLayerSclM: v.pipe(
		v.optional(v.number(), 0.99),
		metadata({
			name: "editor.weather.noise-layer-scl-m",
			description: "editor.weather.noise-layer-scl-m-description",
		}),
	),
	noiseLayerColorM: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.weather.noise-layer-color-m",
			description: "editor.weather.noise-layer-color-m-description",
		}),
	),
	noisePath: v.pipe(
		v.optional(v.string(), "noiseAlpha"),
		metadata({
			name: "editor.weather.noise-path",
			description: "editor.weather.noise-path-description",
		}),
	),
});

const rainWeatherObjectSchema = v.object({
	yspeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.weather.yspeed",
			description: "editor.weather.yspeed-description",
		}),
	),
	xspeed: v.pipe(
		v.optional(v.number(), 1.5),
		metadata({
			name: "editor.weather.xspeed",
			description: "editor.weather.xspeed-description",
		}),
	),
	padding: v.pipe(
		v.optional(v.number(), 16),
		metadata({
			name: "editor.weather.padding",
			description: "editor.weather.padding-description",
		}),
	),
	density: v.pipe(
		v.optional(v.number(), 1200),
		metadata({
			name: "editor.weather.density",
			description: "editor.weather.density-description",
		}),
	),
	stroke: v.pipe(
		v.optional(v.number(), 0.75),
		metadata({
			name: "editor.weather.stroke",
			description: "editor.weather.stroke-description",
		}),
	),
	sizeMin: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.weather.size-min",
			description: "editor.weather.size-min-description",
		}),
	),
	sizeMax: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.weather.size-max",
			description: "editor.weather.size-max-description",
		}),
	),
	splashTimeScale: v.pipe(
		v.optional(v.number(), 22),
		metadata({
			name: "editor.weather.splash-time-scale",
			description: "editor.weather.splash-time-scale-description",
		}),
	),
	color: v.pipe(
		v.optional(MindustryHexColorSchema, "7a95eaff"),
		metadata({
			name: "editor.weather.color",
			description: "editor.weather.color-description",
		}),
	),
});

export const WeatherHjsonSchema: SchemaFn = new ClassMap<WeatherClass>(
	{
		Weather: () => ({}),
		ParticleWeather: () => particleWeatherObjectSchema.entries,
		RainWeather: (context) => ({
			...rainWeatherObjectSchema.entries,
			liquid: v.pipe(
				v.optional(LiquidFieldSchema(context)),
				metadata({
					name: "editor.weather.liquid",
					description: "editor.weather.liquid-description",
				}),
			),
		}),
		SolarFlare: () => ({}),
		MagneticStorm: () => ({}),
	},
	{
		baseSchema: (context) => ({
			...weatherBaseObjectSchema.entries,
			status: v.pipe(
				v.optional(StatusFieldSchema(context)),
				metadata({
					name: "editor.weather.status",
					description: "editor.weather.status-description",
				}),
			),
		}),
	},
).schema;
