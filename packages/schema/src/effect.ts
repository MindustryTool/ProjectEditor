import * as v from "valibot";
import { CachedSchema } from "./utils";
import { Interps } from "./interps";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { SoundHjsonSchema } from "./sound";
import type { SchemaFn } from "./utils";
import { metadata } from "./utils";
import { ClassMap, classSchema, createClassHjsonSchema } from "./class";

export const effectClasses = [
	"ParticleEffect",
	"MultiEffect",
	"ExplosionEffect",
	"RadialEffect",
	"SeqEffect",
	"SoundEffect",
	"WaveEffect",
	"WrapEffect",
] as const;

export type EffectType = (typeof effectClasses)[number];

const effectBaseObjectSchema = v.object({
	type: v.pipe(
		classSchema(effectClasses, "ParticleEffect"),
		metadata({ name: "editor.effect.type", description: "editor.effect.type-description" }),
	),
	lifetime: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(1)), 50),
		metadata({ name: "editor.effect.lifetime", description: "editor.effect.lifetime-description" }),
	),
	clip: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.effect.clip", description: "editor.effect.clip-description" })),
	startDelay: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.start-delay", description: "editor.effect.start-delay-description" }),
	),
	baseRotation: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.base-rotation", description: "editor.effect.base-rotation-description" }),
	),
	followParent: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.effect.follow-parent", description: "editor.effect.follow-parent-description" }),
	),
	rotWithParent: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.effect.rot-with-parent", description: "editor.effect.rot-with-parent-description" }),
	),
	layerDuration: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.layer-duration", description: "editor.effect.layer-duration-description" }),
	),
});

export const particleEffectObjectSchema = v.object({
	colorFrom: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.color-from", description: "editor.effect.color-from-description" }),
	),
	colorTo: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.color-to", description: "editor.effect.color-to-description" }),
	),
	particles: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(1)), 6),
		metadata({ name: "editor.effect.particles", description: "editor.effect.particles-description" }),
	),
	randLength: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.effect.rand-length", description: "editor.effect.rand-length-description" }),
	),
	casingFlip: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.effect.casing-flip", description: "editor.effect.casing-flip-description" }),
	),
	cone: v.pipe(v.optional(v.number(), 180), metadata({ name: "editor.effect.cone", description: "editor.effect.cone-description" })),
	length: v.pipe(v.optional(v.number(), 20), metadata({ name: "editor.effect.length", description: "editor.effect.length-description" })),
	baseLength: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.base-length", description: "editor.effect.base-length-description" }),
	),
	interp: v.pipe(
		v.optional(v.picklist(Interps), "linear"),
		metadata({ name: "editor.effect.interp", description: "editor.effect.interp-description" }),
	),
	sizeInterp: v.pipe(
		v.optional(v.picklist(Interps), "linear"),
		metadata({ name: "editor.effect.size-interp", description: "editor.effect.size-interp-description" }),
	),
	offsetX: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.offset-x", description: "editor.effect.offset-x-description" }),
	),
	offsetY: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.offset-y", description: "editor.effect.offset-y-description" }),
	),
	lightScl: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.light-scl", description: "editor.effect.light-scl-description" }),
	),
	lightOpacity: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({ name: "editor.effect.light-opacity", description: "editor.effect.light-opacity-description" }),
	),
	lightColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.light-color", description: "editor.effect.light-color-description" }),
	),
	spin: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.effect.spin", description: "editor.effect.spin-description" })),
	sizeFrom: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.size-from", description: "editor.effect.size-from-description" }),
	),
	sizeTo: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.effect.size-to", description: "editor.effect.size-to-description" })),
	sizeChangeStart: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.size-change-start", description: "editor.effect.size-change-start-description" }),
	),
	useRotation: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.effect.use-rotation", description: "editor.effect.use-rotation-description" }),
	),
	offset: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.effect.offset", description: "editor.effect.offset-description" })),
	region: v.pipe(
		v.optional(v.string(), "circle"),
		metadata({ name: "editor.effect.region", description: "editor.effect.region-description" }),
	),
	line: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.effect.line", description: "editor.effect.line-description" })),
	strokeFrom: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.effect.stroke-from",
			description: "editor.effect.stroke-from-description",
			visibleWhen: { field: "line", value: true },
		}),
	),
	strokeTo: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.effect.stroke-to",
			description: "editor.effect.stroke-to-description",
			visibleWhen: { field: "line", value: true },
		}),
	),
	lenFrom: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.effect.len-from",
			description: "editor.effect.len-from-description",
			visibleWhen: { field: "line", value: true },
		}),
	),
	lenTo: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.effect.len-to",
			description: "editor.effect.len-to-description",
			visibleWhen: { field: "line", value: true },
		}),
	),
	cap: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.effect.cap", description: "editor.effect.cap-description", visibleWhen: { field: "line", value: true } }),
	),
});

export const explosionEffectObjectSchema = v.object({
	waveColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.wave-color", description: "editor.effect.wave-color-description" }),
	),
	smokeColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.smoke-color", description: "editor.effect.smoke-color-description" }),
	),
	sparkColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.spark-color", description: "editor.effect.spark-color-description" }),
	),
	waveLife: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "editor.effect.wave-life", description: "editor.effect.wave-life-description" }),
	),
	waveStroke: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "editor.effect.wave-stroke", description: "editor.effect.wave-stroke-description" }),
	),
	waveRad: v.pipe(
		v.optional(v.number(), 15),
		metadata({ name: "editor.effect.wave-rad", description: "editor.effect.wave-rad-description" }),
	),
	waveRadBase: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.wave-rad-base", description: "editor.effect.wave-rad-base-description" }),
	),
	sparkStroke: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "editor.effect.spark-stroke", description: "editor.effect.spark-stroke-description" }),
	),
	sparkRad: v.pipe(
		v.optional(v.number(), 23),
		metadata({ name: "editor.effect.spark-rad", description: "editor.effect.spark-rad-description" }),
	),
	sparkLen: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "editor.effect.spark-len", description: "editor.effect.spark-len-description" }),
	),
	smokeSize: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "editor.effect.smoke-size", description: "editor.effect.smoke-size-description" }),
	),
	smokeSizeBase: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({ name: "editor.effect.smoke-size-base", description: "editor.effect.smoke-size-base-description" }),
	),
	smokeRad: v.pipe(
		v.optional(v.number(), 23),
		metadata({ name: "editor.effect.smoke-rad", description: "editor.effect.smoke-rad-description" }),
	),
	smokes: v.pipe(v.optional(v.number(), 5), metadata({ name: "editor.effect.smokes", description: "editor.effect.smokes-description" })),
	sparks: v.pipe(v.optional(v.number(), 4), metadata({ name: "editor.effect.sparks", description: "editor.effect.sparks-description" })),
});

export const waveEffectObjectSchema = v.object({
	colorFrom: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.wave-color-from", description: "editor.effect.wave-color-from-description" }),
	),
	colorTo: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.wave-color-to", description: "editor.effect.wave-color-to-description" }),
	),
	lightColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.wave-light-color", description: "editor.effect.wave-light-color-description" }),
	),
	sizeFrom: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.wave-size-from", description: "editor.effect.wave-size-from-description" }),
	),
	sizeTo: v.pipe(
		v.optional(v.number(), 100),
		metadata({ name: "editor.effect.wave-size-to", description: "editor.effect.wave-size-to-description" }),
	),
	lightScl: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "editor.effect.wave-light-scl", description: "editor.effect.wave-light-scl-description" }),
	),
	lightOpacity: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({ name: "editor.effect.wave-light-opacity", description: "editor.effect.wave-light-opacity-description" }),
	),
	sides: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "editor.effect.wave-sides", description: "editor.effect.wave-sides-description" }),
	),
	rotation: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.wave-rotation", description: "editor.effect.wave-rotation-description" }),
	),
	strokeFrom: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.wave-stroke-from", description: "editor.effect.wave-stroke-from-description" }),
	),
	strokeTo: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.wave-stroke-to", description: "editor.effect.wave-stroke-to-description" }),
	),
	interp: v.pipe(
		v.optional(v.picklist(Interps), "linear"),
		metadata({ name: "editor.effect.wave-interp", description: "editor.effect.wave-interp-description" }),
	),
	lightInterp: v.pipe(
		v.optional(v.picklist(Interps), "reverse"),
		metadata({ name: "editor.effect.wave-light-interp", description: "editor.effect.wave-light-interp-description" }),
	),
});

const effectClassMap = new ClassMap<EffectType>({
	ParticleEffect: (_context) => particleEffectObjectSchema,
	MultiEffect: (context) =>
		v.object({
			effects: v.pipe(
				v.array(EffectFieldSchema(context)),
				metadata({ name: "editor.effect.multi-effects", description: "editor.effect.multi-effects-description" }),
			),
		}),
	ExplosionEffect: (_context) => explosionEffectObjectSchema,
	RadialEffect: (context) =>
		v.object({
			effect: v.pipe(
				EffectFieldSchema(context),
				metadata({ name: "editor.effect.radial-effect", description: "editor.effect.radial-effect-description" }),
			),
			rotationSpacing: v.pipe(
				v.optional(v.number(), 90),
				metadata({ name: "editor.effect.rotation-spacing", description: "editor.effect.rotation-spacing-description" }),
			),
			rotationOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.effect.rotation-offset", description: "editor.effect.rotation-offset-description" }),
			),
			effectRotationOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.effect.effect-rotation-offset", description: "editor.effect.effect-rotation-offset-description" }),
			),
			lengthOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.effect.length-offset", description: "editor.effect.length-offset-description" }),
			),
			amount: v.pipe(
				v.optional(v.number(), 4),
				metadata({ name: "editor.effect.amount", description: "editor.effect.amount-description" }),
			),
		}),
	SeqEffect: (context) =>
		v.object({
			effects: v.pipe(
				v.array(EffectFieldSchema(context)),
				metadata({ name: "editor.effect.seq-effects", description: "editor.effect.seq-effects-description" }),
			),
		}),
	SoundEffect: (context) =>
		v.object({
			sound: v.pipe(
				v.optional(SoundHjsonSchema(context)),
				metadata({ name: "editor.effect.sound", description: "editor.effect.sound-description" }),
			),
			minPitch: v.pipe(
				v.optional(v.number(), 0.8),
				metadata({ name: "editor.effect.min-pitch", description: "editor.effect.min-pitch-description" }),
			),
			maxPitch: v.pipe(
				v.optional(v.number(), 1.2),
				metadata({ name: "editor.effect.max-pitch", description: "editor.effect.max-pitch-description" }),
			),
			minVolume: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.effect.min-volume", description: "editor.effect.min-volume-description" }),
			),
			maxVolume: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.effect.max-volume", description: "editor.effect.max-volume-description" }),
			),
			effect: v.pipe(
				EffectFieldSchema(context),
				metadata({ name: "editor.effect.sound-effect", description: "editor.effect.sound-effect-description" }),
			),
		}),
	WaveEffect: (_context) => waveEffectObjectSchema,
	WrapEffect: (context) =>
		v.object({
			effect: v.pipe(
				EffectFieldSchema(context),
				metadata({ name: "editor.effect.wrap-effect", description: "editor.effect.wrap-effect-description" }),
			),
			color: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.effect.wrap-color", description: "editor.effect.wrap-color-description" }),
			),
			rotation: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.effect.wrap-rotation", description: "editor.effect.wrap-rotation-description" }),
			),
		}),
});

export const EffectFieldSchema: SchemaFn = CachedSchema((context) => {
	return v.pipe(
		v.lazy((input) => {
			if (typeof input === "string") {
				return v.pipe(
					v.string(),
					v.transform((v) => v.replaceAll(context.name + "-", "")),
					v.picklist(context.effects.map((effect) => effect.name.replaceAll(context.name + "-", ""))),
				);
			}

			return EffectHjsonSchema(context);
		}),
		metadata({ type: "effect" }),
	);
});

export const EffectHjsonSchema = createClassHjsonSchema({
	classMap: effectClassMap,
	baseSchema: effectBaseObjectSchema.entries,
	type: "effect",
});
