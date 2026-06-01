import * as v from "valibot";
import { MindustryHexColorSchema, SoundSchema, type SchemaFn } from "./base";

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

const classSchemaMap: Record<EffectClass, SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>> = {
	ParticleEffect: () =>
		v.object({
			type: v.literal("ParticleEffect"),
			colorFrom: v.nullish(MindustryHexColorSchema),
			colorTo: v.nullish(MindustryHexColorSchema),
			particles: v.nullish(v.pipe(v.number(), v.minValue(1)), 6),
			randLength: v.nullish(v.boolean(), true),
			casingFlip: v.nullish(v.boolean(), false),
			cone: v.nullish(v.number(), 180),
			length: v.nullish(v.number(), 20),
			baseLength: v.nullish(v.number(), 0),
			interp: v.nullish(v.string(), "linear"),
			offsetX: v.nullish(v.number(), 0),
			offsetY: v.nullish(v.number(), 0),
			lightScl: v.nullish(v.number(), 2),
			lightOpacity: v.nullish(v.number(), 0.6),
			lightColor: v.nullish(MindustryHexColorSchema),
			spin: v.nullish(v.number(), 0),
			/** Controls the initial and final sprite sizes. */
			sizeFrom: v.nullish(v.number(), 2),
			sizeTo: v.nullish(v.number(), 0),
			/** Controls the amount of ticks the effect waits before changing size. */
			sizeChangeStart: v.nullish(v.number(), 0),
			/** Whether the rotation adds with the parent */
			useRotation: v.nullish(v.boolean(), true),
			/** Rotation offset. */
			offset: v.nullish(v.number(), 0),
			/** Sprite to draw. */
			region: v.nullish(v.string(), "circle"),

			//line only
			line: v.nullish(v.boolean(), false),
			strokeFrom: v.nullish(v.number(), 2),
			strokeTo: v.nullish(v.number(), 0),
			lenFrom: v.nullish(v.number(), 4),
			lenTo: v.nullish(v.number(), 2),
			cap: v.nullish(v.boolean(), true),
		}),
	MultiEffect: (value, context) => v.object({ type: v.literal("MultiEffect"), effects: EffectSchema(value, context) }),
	ExplosionEffect: () =>
		v.object({
			type: v.literal("ExplosionEffect"),
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
		}),
	RadialEffect: (value, context) =>
		v.object({
			type: v.literal("RadialEffect"),
			effect: v.nullish(EffectSchema(value, context)),
			rotationSpacing: v.nullish(v.number(), 90),
			rotationOffset: v.nullish(v.number(), 0),
			effectRotationOffset: v.nullish(v.number(), 0),
			lengthOffset: v.nullish(v.number(), 0),
			amount: v.nullish(v.number(), 4),
		}),
	SeqEffect: (value, context) => v.object({ type: v.literal("SeqEffect"), effects: v.array(EffectSchema(value, context)) }),
	SoundEffect: (value, context) =>
		v.object({
			type: v.literal("SoundEffect"),
			sound: v.nullish(SoundSchema),
			minPitch: v.nullish(v.number(), 0.8),
			maxPitch: v.nullish(v.number(), 1.2),
			minVolume: v.nullish(v.number(), 1),
			maxVolume: v.nullish(v.number(), 1),
			effect: v.nullish(EffectSchema(value, context)),
		}),
	WaveEffect: () =>
		v.object({
			type: v.literal("WaveEffect"),
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
			interp: v.nullish(v.string(), "linear"),
			lightInterp: v.nullish(v.string(), "reverse"),
		}),
	WrapEffect: (value, context) =>
		v.object({
			type: v.literal("WrapEffect"),
			effect: v.nullish(EffectSchema(value, context)),
			color: v.nullish(MindustryHexColorSchema),
			rotation: v.nullish(v.number(), 0),
		}),
};

export const EffectSchema: SchemaFn = (value, context) => {
	if (value.isObject()) {
		const baseSchema = v.object({
			type: v.picklist(effectClasses),
			lifetime: v.nullish(v.pipe(v.number(), v.minValue(1)), 50),
			clip: v.nullish(v.number(), 0),
			startDelay: v.nullish(v.number(), 0),
			baseRotation: v.nullish(v.number(), 0),
			followParent: v.nullish(v.boolean(), true),
			rotWithParent: v.nullish(v.boolean(), false),
			layerDuration: v.nullish(v.number(), 0),
		});

		const type = value.get("type");

		if (type.isString() && classSchemaMap[type.valueOf() as EffectClass]) {
			const schema = classSchemaMap[type.valueOf() as EffectClass];
			return v.intersect([baseSchema, schema(value, context)]);
		}

		return baseSchema;
	}

	if (value.isArray()) {
		return v.array(EffectSchema(value, context));
	}

	return v.pipe(v.string(), v.minLength(1), v.maxLength(127));
};
