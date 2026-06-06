import * as v from "valibot";
import { CachedSchema, Interps, MindustryHexColorSchema, SoundHjsonSchema, type SchemaFn } from "./base";
import { metadata } from "./utils";

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

export type EffectClass = (typeof effectClasses)[number];

const effectBaseObjectSchema = v.object({
	type: v.picklist(effectClasses),
	lifetime: v.optional(v.pipe(v.number(), v.minValue(1)), 50),
	clip: v.optional(v.number(), 0),
	startDelay: v.optional(v.number(), 0),
	baseRotation: v.optional(v.number(), 0),
	followParent: v.optional(v.boolean(), true),
	rotWithParent: v.optional(v.boolean(), false),
	layerDuration: v.optional(v.number(), 0),
});

export const particleEffectObjectSchema = v.object({
	colorFrom: v.optional(MindustryHexColorSchema),
	colorTo: v.optional(MindustryHexColorSchema),
	particles: v.optional(v.pipe(v.number(), v.minValue(1)), 6),
	randLength: v.optional(v.boolean(), true),
	casingFlip: v.optional(v.boolean(), false),
	cone: v.optional(v.number(), 180),
	length: v.optional(v.number(), 20),
	baseLength: v.optional(v.number(), 0),
	interp: v.optional(v.picklist(Interps), "linear"),
	sizeInterp: v.optional(v.picklist(Interps), "linear"),
	offsetX: v.optional(v.number(), 0),
	offsetY: v.optional(v.number(), 0),
	lightScl: v.optional(v.number(), 2),
	lightOpacity: v.optional(v.number(), 0.6),
	lightColor: v.optional(MindustryHexColorSchema),
	spin: v.optional(v.number(), 0),
	sizeFrom: v.optional(v.number(), 2),
	sizeTo: v.optional(v.number(), 0),
	sizeChangeStart: v.optional(v.number(), 0),
	useRotation: v.optional(v.boolean(), true),
	offset: v.optional(v.number(), 0),
	region: v.optional(v.string(), "circle"),
	line: v.optional(v.boolean(), false),
	strokeFrom: v.optional(v.number(), 2),
	strokeTo: v.optional(v.number(), 0),
	lenFrom: v.optional(v.number(), 4),
	lenTo: v.optional(v.number(), 2),
	cap: v.optional(v.boolean(), true),
});

export const explosionEffectObjectSchema = v.object({
	waveColor: v.optional(MindustryHexColorSchema),
	smokeColor: v.optional(MindustryHexColorSchema),
	sparkColor: v.optional(MindustryHexColorSchema),
	waveLife: v.optional(v.number(), 6),
	waveStroke: v.optional(v.number(), 3),
	waveRad: v.optional(v.number(), 15),
	waveRadBase: v.optional(v.number(), 2),
	sparkStroke: v.optional(v.number(), 1),
	sparkRad: v.optional(v.number(), 23),
	sparkLen: v.optional(v.number(), 3),
	smokeSize: v.optional(v.number(), 4),
	smokeSizeBase: v.optional(v.number(), 0.5),
	smokeRad: v.optional(v.number(), 23),
	smokes: v.optional(v.number(), 5),
	sparks: v.optional(v.number(), 4),
});

export const waveEffectObjectSchema = v.object({
	colorFrom: v.optional(MindustryHexColorSchema),
	colorTo: v.optional(MindustryHexColorSchema),
	lightColor: v.optional(MindustryHexColorSchema),
	sizeFrom: v.optional(v.number(), 0),
	sizeTo: v.optional(v.number(), 100),
	lightScl: v.optional(v.number(), 3),
	lightOpacity: v.optional(v.number(), 0.8),
	sides: v.optional(v.number(), -1),
	rotation: v.optional(v.number(), 0),
	strokeFrom: v.optional(v.number(), 2),
	strokeTo: v.optional(v.number(), 0),
	interp: v.optional(v.picklist(Interps), "linear"),
	lightInterp: v.optional(v.picklist(Interps), "reverse"),
});

const classSchemaMap: Record<EffectClass, SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>> = {
	ParticleEffect: (_context) => particleEffectObjectSchema,
	MultiEffect: (context) =>
		v.object({
			effects: v.array(EffectFieldSchema(context)),
		}),
	ExplosionEffect: (_context) => explosionEffectObjectSchema,
	RadialEffect: (context) =>
		v.object({
			effect: EffectFieldSchema(context),
			rotationSpacing: v.optional(v.number(), 90),
			rotationOffset: v.optional(v.number(), 0),
			effectRotationOffset: v.optional(v.number(), 0),
			lengthOffset: v.optional(v.number(), 0),
			amount: v.optional(v.number(), 4),
		}),
	SeqEffect: (context) =>
		v.object({
			effects: v.array(EffectFieldSchema(context)),
		}),
	SoundEffect: (context) =>
		v.object({
			sound: v.optional(SoundHjsonSchema),
			minPitch: v.optional(v.number(), 0.8),
			maxPitch: v.optional(v.number(), 1.2),
			minVolume: v.optional(v.number(), 1),
			maxVolume: v.optional(v.number(), 1),
			effect: EffectFieldSchema(context),
		}),
	WaveEffect: (_context) => waveEffectObjectSchema,
	WrapEffect: (context) =>
		v.object({
			effect: EffectFieldSchema(context),
			color: v.optional(MindustryHexColorSchema),
			rotation: v.optional(v.number(), 0),
		}),
};

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

export const EffectHjsonSchema: SchemaFn = CachedSchema((context) => {
	return v.lazy((input) => {
		if (input && typeof input === "object" && "type" in input) {
			const type = input.type;

			if (typeof type === "string" && classSchemaMap[type as EffectClass]) {
				const schema = classSchemaMap[type as EffectClass];
				return v.pipe(v.object({ ...effectBaseObjectSchema.entries, ...schema(context).entries }), metadata({ type: "effect" }));
			}
		}

		return v.pipe(effectBaseObjectSchema, metadata({ type: "effect" }));
	});
});
