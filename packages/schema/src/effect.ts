import * as v from "valibot";
import { Interps, MindustryHexColorSchema, SoundHjsonSchema, type SchemaFn } from "./base";
import { lazyArray } from "./lazy-array";

const metadata = { type: "effect" };

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
	lifetime: v.nullish(v.pipe(v.number(), v.minValue(1)), 50),
	clip: v.nullish(v.number(), 0),
	startDelay: v.nullish(v.number(), 0),
	baseRotation: v.nullish(v.number(), 0),
	followParent: v.nullish(v.boolean(), true),
	rotWithParent: v.nullish(v.boolean(), false),
	layerDuration: v.nullish(v.number(), 0),
});

export const particleEffectObjectSchema = v.object({
	colorFrom: v.nullish(MindustryHexColorSchema),
	colorTo: v.nullish(MindustryHexColorSchema),
	particles: v.nullish(v.pipe(v.number(), v.minValue(1)), 6),
	randLength: v.nullish(v.boolean(), true),
	casingFlip: v.nullish(v.boolean(), false),
	cone: v.nullish(v.number(), 180),
	length: v.nullish(v.number(), 20),
	baseLength: v.nullish(v.number(), 0),
	interp: v.nullish(v.picklist(Interps), "linear"),
	sizeInterp: v.nullish(v.picklist(Interps), "linear"),
	offsetX: v.nullish(v.number(), 0),
	offsetY: v.nullish(v.number(), 0),
	lightScl: v.nullish(v.number(), 2),
	lightOpacity: v.nullish(v.number(), 0.6),
	lightColor: v.nullish(MindustryHexColorSchema),
	spin: v.nullish(v.number(), 0),
	sizeFrom: v.nullish(v.number(), 2),
	sizeTo: v.nullish(v.number(), 0),
	sizeChangeStart: v.nullish(v.number(), 0),
	useRotation: v.nullish(v.boolean(), true),
	offset: v.nullish(v.number(), 0),
	region: v.nullish(v.string(), "circle"),
	line: v.nullish(v.boolean(), false),
	strokeFrom: v.nullish(v.number(), 2),
	strokeTo: v.nullish(v.number(), 0),
	lenFrom: v.nullish(v.number(), 4),
	lenTo: v.nullish(v.number(), 2),
	cap: v.nullish(v.boolean(), true),
});

export const explosionEffectObjectSchema = v.object({
	waveColor: v.nullish(MindustryHexColorSchema),
	smokeColor: v.nullish(MindustryHexColorSchema),
	sparkColor: v.nullish(MindustryHexColorSchema),
	waveLife: v.nullish(v.number(), 6),
	waveStroke: v.nullish(v.number(), 3),
	waveRad: v.nullish(v.number(), 15),
	waveRadBase: v.nullish(v.number(), 2),
	sparkStroke: v.nullish(v.number(), 1),
	sparkRad: v.nullish(v.number(), 23),
	sparkLen: v.nullish(v.number(), 3),
	smokeSize: v.nullish(v.number(), 4),
	smokeSizeBase: v.nullish(v.number(), 0.5),
	smokeRad: v.nullish(v.number(), 23),
	smokes: v.nullish(v.number(), 5),
	sparks: v.nullish(v.number(), 4),
});

export const waveEffectObjectSchema = v.object({
	colorFrom: v.nullish(MindustryHexColorSchema),
	colorTo: v.nullish(MindustryHexColorSchema),
	lightColor: v.nullish(MindustryHexColorSchema),
	sizeFrom: v.nullish(v.number(), 0),
	sizeTo: v.nullish(v.number(), 100),
	lightScl: v.nullish(v.number(), 3),
	lightOpacity: v.nullish(v.number(), 0.8),
	sides: v.nullish(v.number(), -1),
	rotation: v.nullish(v.number(), 0),
	strokeFrom: v.nullish(v.number(), 2),
	strokeTo: v.nullish(v.number(), 0),
	interp: v.nullish(v.picklist(Interps), "linear"),
	lightInterp: v.nullish(v.picklist(Interps), "reverse"),
});

type EffectObjectSchema = v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>;

type EffectSchemaFactory = (value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1]) => EffectObjectSchema;

function createEffectFieldSchema(value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1], key: "effect") {
	return v.nullish(EffectHjsonSchema(value.get(key), context));
}

function createEffectArraySchema(value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1], key: "effects") {
	return lazyArray((index) => EffectHjsonSchema(value.get(key).get(index), context));
}

const classSchemaMap: Record<EffectClass, EffectSchemaFactory> = {
	ParticleEffect: (_value, _context) => particleEffectObjectSchema,
	MultiEffect: (value, context) =>
		v.object({
			effects: createEffectArraySchema(value, context, "effects"),
		}),
	ExplosionEffect: (_value, _context) => explosionEffectObjectSchema,
	RadialEffect: (value, context) =>
		v.object({
			effect: createEffectFieldSchema(value, context, "effect"),
			rotationSpacing: v.nullish(v.number(), 90),
			rotationOffset: v.nullish(v.number(), 0),
			effectRotationOffset: v.nullish(v.number(), 0),
			lengthOffset: v.nullish(v.number(), 0),
			amount: v.nullish(v.number(), 4),
		}),
	SeqEffect: (value, context) =>
		v.object({
			effects: createEffectArraySchema(value, context, "effects"),
		}),
	SoundEffect: (value, context) =>
		v.object({
			sound: v.nullish(SoundHjsonSchema),
			minPitch: v.nullish(v.number(), 0.8),
			maxPitch: v.nullish(v.number(), 1.2),
			minVolume: v.nullish(v.number(), 1),
			maxVolume: v.nullish(v.number(), 1),
			effect: createEffectFieldSchema(value, context, "effect"),
		}),
	WaveEffect: (_value, _context) => waveEffectObjectSchema,
	WrapEffect: (value, context) =>
		v.object({
			effect: createEffectFieldSchema(value, context, "effect"),
			color: v.nullish(MindustryHexColorSchema),
			rotation: v.nullish(v.number(), 0),
		}),
};

export const EffectHjsonSchema: SchemaFn = (value, context) => {
	if (value.isObject()) {
		const type = value.get("type");

		if (type.isString() && classSchemaMap[type.valueOf() as EffectClass]) {
			const schema = classSchemaMap[type.valueOf() as EffectClass];
			return v.pipe(v.object({ ...effectBaseObjectSchema.entries, ...schema(value, context).entries }), v.metadata(metadata));
		}

		return v.pipe(effectBaseObjectSchema, v.metadata(metadata));
	}

	return v.pipe(v.string(), v.minLength(1), v.maxLength(127), v.metadata(metadata));
};
