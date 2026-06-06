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
	type: v.pipe(
		v.picklist(effectClasses),
		metadata({ name: "editor.effect.type", description: "editor.effect.type-description" }),
	),
	lifetime: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(1)), 50),
		metadata({ name: "editor.effect.lifetime", description: "editor.effect.lifetime-description" }),
	),
	clip: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.clip", description: "editor.effect.clip-description" }),
	),
	startDelay: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.startDelay", description: "editor.effect.startDelay-description" }),
	),
	baseRotation: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.baseRotation", description: "editor.effect.baseRotation-description" }),
	),
	followParent: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.effect.followParent", description: "editor.effect.followParent-description" }),
	),
	rotWithParent: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.effect.rotWithParent", description: "editor.effect.rotWithParent-description" }),
	),
	layerDuration: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.layerDuration", description: "editor.effect.layerDuration-description" }),
	),
});

export const particleEffectObjectSchema = v.object({
	colorFrom: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.colorFrom", description: "editor.effect.colorFrom-description" }),
	),
	colorTo: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.colorTo", description: "editor.effect.colorTo-description" }),
	),
	particles: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(1)), 6),
		metadata({ name: "editor.effect.particles", description: "editor.effect.particles-description" }),
	),
	randLength: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.effect.randLength", description: "editor.effect.randLength-description" }),
	),
	casingFlip: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.effect.casingFlip", description: "editor.effect.casingFlip-description" }),
	),
	cone: v.pipe(
		v.optional(v.number(), 180),
		metadata({ name: "editor.effect.cone", description: "editor.effect.cone-description" }),
	),
	length: v.pipe(
		v.optional(v.number(), 20),
		metadata({ name: "editor.effect.length", description: "editor.effect.length-description" }),
	),
	baseLength: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.baseLength", description: "editor.effect.baseLength-description" }),
	),
	interp: v.pipe(
		v.optional(v.picklist(Interps), "linear"),
		metadata({ name: "editor.effect.interp", description: "editor.effect.interp-description" }),
	),
	sizeInterp: v.pipe(
		v.optional(v.picklist(Interps), "linear"),
		metadata({ name: "editor.effect.sizeInterp", description: "editor.effect.sizeInterp-description" }),
	),
	offsetX: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.offsetX", description: "editor.effect.offsetX-description" }),
	),
	offsetY: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.offsetY", description: "editor.effect.offsetY-description" }),
	),
	lightScl: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.lightScl", description: "editor.effect.lightScl-description" }),
	),
	lightOpacity: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({ name: "editor.effect.lightOpacity", description: "editor.effect.lightOpacity-description" }),
	),
	lightColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.lightColor", description: "editor.effect.lightColor-description" }),
	),
	spin: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.spin", description: "editor.effect.spin-description" }),
	),
	sizeFrom: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.sizeFrom", description: "editor.effect.sizeFrom-description" }),
	),
	sizeTo: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.sizeTo", description: "editor.effect.sizeTo-description" }),
	),
	sizeChangeStart: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.sizeChangeStart", description: "editor.effect.sizeChangeStart-description" }),
	),
	useRotation: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.effect.useRotation", description: "editor.effect.useRotation-description" }),
	),
	offset: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.offset", description: "editor.effect.offset-description" }),
	),
	region: v.pipe(
		v.optional(v.string(), "circle"),
		metadata({ name: "editor.effect.region", description: "editor.effect.region-description" }),
	),
	line: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.effect.line", description: "editor.effect.line-description" }),
	),
	strokeFrom: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.strokeFrom", description: "editor.effect.strokeFrom-description", visibleWhen: { field: "line", value: true } }),
	),
	strokeTo: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.strokeTo", description: "editor.effect.strokeTo-description", visibleWhen: { field: "line", value: true } }),
	),
	lenFrom: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "editor.effect.lenFrom", description: "editor.effect.lenFrom-description", visibleWhen: { field: "line", value: true } }),
	),
	lenTo: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.lenTo", description: "editor.effect.lenTo-description", visibleWhen: { field: "line", value: true } }),
	),
	cap: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.effect.cap", description: "editor.effect.cap-description", visibleWhen: { field: "line", value: true } }),
	),
});

export const explosionEffectObjectSchema = v.object({
	waveColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.waveColor", description: "editor.effect.waveColor-description" }),
	),
	smokeColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.smokeColor", description: "editor.effect.smokeColor-description" }),
	),
	sparkColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.sparkColor", description: "editor.effect.sparkColor-description" }),
	),
	waveLife: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "editor.effect.waveLife", description: "editor.effect.waveLife-description" }),
	),
	waveStroke: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "editor.effect.waveStroke", description: "editor.effect.waveStroke-description" }),
	),
	waveRad: v.pipe(
		v.optional(v.number(), 15),
		metadata({ name: "editor.effect.waveRad", description: "editor.effect.waveRad-description" }),
	),
	waveRadBase: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.waveRadBase", description: "editor.effect.waveRadBase-description" }),
	),
	sparkStroke: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "editor.effect.sparkStroke", description: "editor.effect.sparkStroke-description" }),
	),
	sparkRad: v.pipe(
		v.optional(v.number(), 23),
		metadata({ name: "editor.effect.sparkRad", description: "editor.effect.sparkRad-description" }),
	),
	sparkLen: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "editor.effect.sparkLen", description: "editor.effect.sparkLen-description" }),
	),
	smokeSize: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "editor.effect.smokeSize", description: "editor.effect.smokeSize-description" }),
	),
	smokeSizeBase: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({ name: "editor.effect.smokeSizeBase", description: "editor.effect.smokeSizeBase-description" }),
	),
	smokeRad: v.pipe(
		v.optional(v.number(), 23),
		metadata({ name: "editor.effect.smokeRad", description: "editor.effect.smokeRad-description" }),
	),
	smokes: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "editor.effect.smokes", description: "editor.effect.smokes-description" }),
	),
	sparks: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "editor.effect.sparks", description: "editor.effect.sparks-description" }),
	),
});

export const waveEffectObjectSchema = v.object({
	colorFrom: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.waveColorFrom", description: "editor.effect.waveColorFrom-description" }),
	),
	colorTo: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.waveColorTo", description: "editor.effect.waveColorTo-description" }),
	),
	lightColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.effect.waveLightColor", description: "editor.effect.waveLightColor-description" }),
	),
	sizeFrom: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.waveSizeFrom", description: "editor.effect.waveSizeFrom-description" }),
	),
	sizeTo: v.pipe(
		v.optional(v.number(), 100),
		metadata({ name: "editor.effect.waveSizeTo", description: "editor.effect.waveSizeTo-description" }),
	),
	lightScl: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "editor.effect.waveLightScl", description: "editor.effect.waveLightScl-description" }),
	),
	lightOpacity: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({ name: "editor.effect.waveLightOpacity", description: "editor.effect.waveLightOpacity-description" }),
	),
	sides: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "editor.effect.waveSides", description: "editor.effect.waveSides-description" }),
	),
	rotation: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.waveRotation", description: "editor.effect.waveRotation-description" }),
	),
	strokeFrom: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.effect.waveStrokeFrom", description: "editor.effect.waveStrokeFrom-description" }),
	),
	strokeTo: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.effect.waveStrokeTo", description: "editor.effect.waveStrokeTo-description" }),
	),
	interp: v.pipe(
		v.optional(v.picklist(Interps), "linear"),
		metadata({ name: "editor.effect.waveInterp", description: "editor.effect.waveInterp-description" }),
	),
	lightInterp: v.pipe(
		v.optional(v.picklist(Interps), "reverse"),
		metadata({ name: "editor.effect.waveLightInterp", description: "editor.effect.waveLightInterp-description" }),
	),
});

const classSchemaMap: Record<EffectClass, SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>> = {
	ParticleEffect: (_context) => particleEffectObjectSchema,
	MultiEffect: (context) =>
		v.object({
			effects: v.pipe(
				v.array(EffectFieldSchema(context)),
				metadata({ name: "editor.effect.multiEffects", description: "editor.effect.multiEffects-description" }),
			),
		}),
	ExplosionEffect: (_context) => explosionEffectObjectSchema,
	RadialEffect: (context) =>
		v.object({
			effect: v.pipe(
				EffectFieldSchema(context),
				metadata({ name: "editor.effect.radialEffect", description: "editor.effect.radialEffect-description" }),
			),
			rotationSpacing: v.pipe(
				v.optional(v.number(), 90),
				metadata({ name: "editor.effect.rotationSpacing", description: "editor.effect.rotationSpacing-description" }),
			),
			rotationOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.effect.rotationOffset", description: "editor.effect.rotationOffset-description" }),
			),
			effectRotationOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.effect.effectRotationOffset", description: "editor.effect.effectRotationOffset-description" }),
			),
			lengthOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.effect.lengthOffset", description: "editor.effect.lengthOffset-description" }),
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
				metadata({ name: "editor.effect.seqEffects", description: "editor.effect.seqEffects-description" }),
			),
		}),
	SoundEffect: (context) =>
		v.object({
			sound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({ name: "editor.effect.sound", description: "editor.effect.sound-description" }),
			),
			minPitch: v.pipe(
				v.optional(v.number(), 0.8),
				metadata({ name: "editor.effect.minPitch", description: "editor.effect.minPitch-description" }),
			),
			maxPitch: v.pipe(
				v.optional(v.number(), 1.2),
				metadata({ name: "editor.effect.maxPitch", description: "editor.effect.maxPitch-description" }),
			),
			minVolume: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.effect.minVolume", description: "editor.effect.minVolume-description" }),
			),
			maxVolume: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.effect.maxVolume", description: "editor.effect.maxVolume-description" }),
			),
			effect: v.pipe(
				EffectFieldSchema(context),
				metadata({ name: "editor.effect.soundEffect", description: "editor.effect.soundEffect-description" }),
			),
		}),
	WaveEffect: (_context) => waveEffectObjectSchema,
	WrapEffect: (context) =>
		v.object({
			effect: v.pipe(
				EffectFieldSchema(context),
				metadata({ name: "editor.effect.wrapEffect", description: "editor.effect.wrapEffect-description" }),
			),
			color: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.effect.wrapColor", description: "editor.effect.wrapColor-description" }),
			),
			rotation: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.effect.wrapRotation", description: "editor.effect.wrapRotation-description" }),
			),
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
