import * as v from "valibot";
import { Interps, MindustryHexColorSchema, SoundSchema, type SchemaFn } from "./base";

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

const classSchemaMap: Record<EffectClass, () => v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>> = {
	ParticleEffect: () =>
		v.object({
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

			//line only
			line: v.nullish(v.boolean(), false),
			strokeFrom: v.nullish(v.number(), 2),
			strokeTo: v.nullish(v.number(), 0),
			lenFrom: v.nullish(v.number(), 4),
			lenTo: v.nullish(v.number(), 2),
			cap: v.nullish(v.boolean(), true),
		}),
	MultiEffect: () =>
		v.object({
			effects: v.array(
				v.pipe(
					v.lazy(() => effectItemUnionSchema),
					v.metadata(metadata),
				),
			),
		}),
	ExplosionEffect: () =>
		v.object({
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
	RadialEffect: () =>
		v.object({
			effect: v.nullish(
				v.pipe(
					v.lazy(() => effectItemUnionSchema),
					v.metadata(metadata),
				),
			),
			rotationSpacing: v.nullish(v.number(), 90),
			rotationOffset: v.nullish(v.number(), 0),
			effectRotationOffset: v.nullish(v.number(), 0),
			lengthOffset: v.nullish(v.number(), 0),
			amount: v.nullish(v.number(), 4),
		}),
	SeqEffect: () =>
		v.object({
			effects: v.array(
				v.pipe(
					v.lazy(() => effectItemUnionSchema),
					v.metadata(metadata),
				),
			),
		}),
	SoundEffect: () =>
		v.object({
			sound: v.nullish(SoundSchema),
			minPitch: v.nullish(v.number(), 0.8),
			maxPitch: v.nullish(v.number(), 1.2),
			minVolume: v.nullish(v.number(), 1),
			maxVolume: v.nullish(v.number(), 1),
			effect: v.nullish(
				v.pipe(
					v.lazy(() => effectItemUnionSchema),
					v.metadata(metadata),
				),
			),
		}),
	WaveEffect: () =>
		v.object({
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
		}),
	WrapEffect: () =>
		v.object({
			effect: v.nullish(
				v.pipe(
					v.lazy(() => effectItemUnionSchema),
					v.metadata(metadata),
				),
			),
			color: v.nullish(MindustryHexColorSchema),
			rotation: v.nullish(v.number(), 0),
		}),
};

const effectItemUnionSchema = v.pipe(
	v.lazy((input) => {
		if (typeof input === "object" && input !== null && "type" in input) {
			const type = input.type as EffectClass;

			const schemaFn = classSchemaMap[type];

			if (schemaFn) {
				return v.object({ ...effectBaseObjectSchema.entries, ...schemaFn().entries });
			}

			return effectBaseObjectSchema;
		}

		return v.pipe(v.string(), v.minLength(1), v.maxLength(127));
	}),
	v.metadata(metadata),
);

export const EffectSchema: SchemaFn = (value, context) => {
	return buildEffectSchema(value, context);
};

const buildEffectSchema: SchemaFn = (value) => {
	if (value.isObject()) {
		const type = value.get("type");

		if (type.isString() && classSchemaMap[type.valueOf() as EffectClass]) {
			const schema = classSchemaMap[type.valueOf() as EffectClass];
			return v.pipe(v.object({ ...effectBaseObjectSchema.entries, ...schema().entries }), v.metadata(metadata));
		}

		return v.pipe(effectBaseObjectSchema, v.metadata(metadata));
	}

	return v.pipe(v.string(), v.minLength(1), v.maxLength(127), v.metadata(metadata));
};
