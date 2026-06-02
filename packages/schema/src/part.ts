import * as v from "valibot";
import type { AnySchema } from "./schema-utils";
import { MindustryHexColorSchema, type SchemaFn } from "./base";
import { EffectHjsonSchema, effectItemUnionSchema } from "./effect";
import { lazyArray } from "./lazy-array";

const metadata = { type: "part" };

export const partClasses = ["RegionPart", "DrawPart", "EffectSpawnerPart", "FlarePart", "HaloPart", "HoverPart", "ShapePart"] as const;

export type PartClass = (typeof partClasses)[number];

export const PartProgresses = ["reload", "smoothReload", "warmup", "charge", "recoil", "heat", "life", "time"] as const;

export const BlendingModes = ["normal", "additive", "subtractive", "multiply", "screen"] as const;

const partMoveSchema = v.object({
	progress: v.nullish(v.picklist(PartProgresses), "warmup"),
	x: v.nullish(v.number(), 0),
	y: v.nullish(v.number(), 0),
	gx: v.nullish(v.number(), 0),
	gy: v.nullish(v.number(), 0),
	rot: v.nullish(v.number(), 0),
});

const drawPartBaseObjectSchema = v.object({
	type: v.picklist(partClasses),
	under: v.nullish(v.boolean(), false),
	weaponIndex: v.nullish(v.number(), 0),
	recoilIndex: v.nullish(v.number(), -1),
});

const partEffectSchema = v.nullish(
	v.pipe(
		v.lazy(() => effectItemUnionSchema),
		v.metadata({ type: "effect" }),
	),
);

function createPartEffectFieldSchema(value?: Parameters<SchemaFn>[0], context?: Parameters<SchemaFn>[1]) {
	if (value && context) {
		return v.nullish(EffectHjsonSchema(value.get("effect"), context));
	}

	return partEffectSchema;
}

const classSchemaMap: Record<
	PartClass,
	(
		value?: Parameters<SchemaFn>[0],
		context?: Parameters<SchemaFn>[1],
	) => v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>
> = {
	DrawPart: () => v.object({}),
	RegionPart: () =>
		v.object({
			suffix: v.nullish(v.string(), ""),
			name: v.nullish(v.string()),
			mirror: v.nullish(v.boolean(), false),
			outline: v.nullish(v.boolean(), true),
			replaceOutline: v.nullish(v.boolean(), false),
			drawRegion: v.nullish(v.boolean(), true),
			heatLight: v.nullish(v.boolean(), false),
			clampProgress: v.nullish(v.boolean(), true),
			progress: v.nullish(v.picklist(PartProgresses), "warmup"),
			growProgress: v.nullish(v.picklist(PartProgresses), "warmup"),
			heatProgress: v.nullish(v.picklist(PartProgresses), "heat"),
			blending: v.nullish(v.picklist(BlendingModes), "normal"),
			layer: v.nullish(v.number(), -1),
			layerOffset: v.nullish(v.number(), 0),
			heatLayerOffset: v.nullish(v.number(), 1),
			turretHeatLayer: v.nullish(v.number(), 50), // Layer.turretHeat
			outlineLayerOffset: v.nullish(v.number(), -0.001),
			x: v.nullish(v.number(), 0),
			y: v.nullish(v.number(), 0),
			xScl: v.nullish(v.number(), 1),
			yScl: v.nullish(v.number(), 1),
			rotation: v.nullish(v.number(), 0),
			originX: v.nullish(v.number(), 0),
			originY: v.nullish(v.number(), 0),
			moveX: v.nullish(v.number(), 0),
			moveY: v.nullish(v.number(), 0),
			growX: v.nullish(v.number(), 0),
			growY: v.nullish(v.number(), 0),
			moveRot: v.nullish(v.number(), 0),
			heatLightOpacity: v.nullish(v.number(), 0.3),
			color: v.nullish(MindustryHexColorSchema),
			colorTo: v.nullish(MindustryHexColorSchema),
			mixColor: v.nullish(MindustryHexColorSchema),
			mixColorTo: v.nullish(MindustryHexColorSchema),
			heatColor: v.nullish(MindustryHexColorSchema),
			children: v.nullish(lazyArray(() => partItemUnionSchema), []),
			moves: v.nullish(v.array(partMoveSchema), []),
		}),
	EffectSpawnerPart: (value, context) =>
		v.object({
			x: v.nullish(v.number(), 0),
			y: v.nullish(v.number(), 0),
			width: v.nullish(v.number(), 0),
			height: v.nullish(v.number(), 0),
			rotation: v.nullish(v.number(), 0),
			mirror: v.nullish(v.boolean(), false),
			effectRot: v.nullish(v.number(), 0),
			effectRandRot: v.nullish(v.number(), 0),
			effectInterval: v.nullish(v.number(), 0),
			effectIntervalFrom: v.nullish(v.number(), 0),
			effectChance: v.nullish(v.number(), 0.1),
			effect: createPartEffectFieldSchema(value, context),
			effectColor: v.nullish(MindustryHexColorSchema),
			useProgress: v.nullish(v.boolean(), true),
			progress: v.nullish(v.picklist(PartProgresses), "warmup"),
		}),
	FlarePart: () =>
		v.object({
			sides: v.nullish(v.number(), 4),
			radius: v.nullish(v.number(), 100),
			radiusTo: v.nullish(v.number(), -1),
			stroke: v.nullish(v.number(), 6),
			innerScl: v.nullish(v.number(), 0.5),
			innerRadScl: v.nullish(v.number(), 0.33),
			x: v.nullish(v.number(), 0),
			y: v.nullish(v.number(), 0),
			rotation: v.nullish(v.number(), 0),
			rotMove: v.nullish(v.number(), 0),
			spinSpeed: v.nullish(v.number(), 0),
			followRotation: v.nullish(v.boolean(), false),
			color1: v.nullish(MindustryHexColorSchema),
			color2: v.nullish(MindustryHexColorSchema),
			clampProgress: v.nullish(v.boolean(), true),
			progress: v.nullish(v.picklist(PartProgresses), "warmup"),
			layer: v.nullish(v.number(), 100), // Layer.effect
		}),
	HaloPart: () =>
		v.object({
			hollow: v.nullish(v.boolean(), false),
			tri: v.nullish(v.boolean(), false),
			shapes: v.nullish(v.number(), 3),
			sides: v.nullish(v.number(), 3),
			radius: v.nullish(v.number(), 3),
			radiusTo: v.nullish(v.number(), -1),
			stroke: v.nullish(v.number(), 1),
			strokeTo: v.nullish(v.number(), -1),
			triLength: v.nullish(v.number(), 1),
			triLengthTo: v.nullish(v.number(), -1),
			haloRadius: v.nullish(v.number(), 10),
			haloRadiusTo: v.nullish(v.number(), -1),
			x: v.nullish(v.number(), 0),
			y: v.nullish(v.number(), 0),
			shapeRotation: v.nullish(v.number(), 0),
			moveX: v.nullish(v.number(), 0),
			moveY: v.nullish(v.number(), 0),
			shapeMoveRot: v.nullish(v.number(), 0),
			haloRotateSpeed: v.nullish(v.number(), 0),
			haloRotation: v.nullish(v.number(), 0),
			rotateSpeed: v.nullish(v.number(), 0),
			color: v.nullish(MindustryHexColorSchema),
			colorTo: v.nullish(MindustryHexColorSchema),
			mirror: v.nullish(v.boolean(), false),
			clampProgress: v.nullish(v.boolean(), true),
			progress: v.nullish(v.picklist(PartProgresses), "warmup"),
			layer: v.nullish(v.number(), -1),
			layerOffset: v.nullish(v.number(), 0),
		}),
	HoverPart: () =>
		v.object({
			radius: v.nullish(v.number(), 4),
			x: v.nullish(v.number(), 0),
			y: v.nullish(v.number(), 0),
			rotation: v.nullish(v.number(), 0),
			phase: v.nullish(v.number(), 50),
			stroke: v.nullish(v.number(), 3),
			minStroke: v.nullish(v.number(), 0.12),
			circles: v.nullish(v.number(), 2),
			sides: v.nullish(v.number(), 4),
			color: v.nullish(MindustryHexColorSchema),
			mirror: v.nullish(v.boolean(), false),
			layer: v.nullish(v.number(), -1),
			layerOffset: v.nullish(v.number(), 0),
		}),
	ShapePart: () =>
		v.object({
			circle: v.nullish(v.boolean(), false),
			hollow: v.nullish(v.boolean(), false),
			sides: v.nullish(v.number(), 3),
			radius: v.nullish(v.number(), 3),
			radiusTo: v.nullish(v.number(), -1),
			stroke: v.nullish(v.number(), 1),
			strokeTo: v.nullish(v.number(), -1),
			x: v.nullish(v.number(), 0),
			y: v.nullish(v.number(), 0),
			rotation: v.nullish(v.number(), 0),
			moveX: v.nullish(v.number(), 0),
			moveY: v.nullish(v.number(), 0),
			moveRot: v.nullish(v.number(), 0),
			rotateSpeed: v.nullish(v.number(), 0),
			color: v.nullish(MindustryHexColorSchema),
			colorTo: v.nullish(MindustryHexColorSchema),
			mirror: v.nullish(v.boolean(), false),
			clampProgress: v.nullish(v.boolean(), true),
			progress: v.nullish(v.picklist(PartProgresses), "warmup"),
			layer: v.nullish(v.number(), -1),
			layerOffset: v.nullish(v.number(), 0),
		}),
};

const partItemUnionSchema: AnySchema = v.pipe(
	v.lazy((input) => {
		if (typeof input === "object" && input !== null && "type" in input) {
			const type = input.type as PartClass;
			const schemaFn = classSchemaMap[type];

			if (schemaFn) {
				return v.object({ ...drawPartBaseObjectSchema.entries, ...schemaFn().entries });
			}

			return drawPartBaseObjectSchema;
		}

		return v.pipe(v.string(), v.minLength(1), v.maxLength(127));
	}),
	v.metadata(metadata),
);

export const PartHjsonSchema: SchemaFn = (value, context) => {
	return buildPartHjsonSchema(value, context);
};

const buildPartHjsonSchema: SchemaFn = (value, context) => {
	if (value.isObject()) {
		const type = value.get("type");

		if (type.isString() && classSchemaMap[type.valueOf() as PartClass]) {
			const schemaFn = classSchemaMap[type.valueOf() as PartClass];
			return v.pipe(v.object({ ...drawPartBaseObjectSchema.entries, ...schemaFn(value, context).entries }), v.metadata(metadata));
		}

		return v.pipe(drawPartBaseObjectSchema, v.metadata(metadata));
	}

	return v.pipe(v.string(), v.minLength(1), v.maxLength(127), v.metadata(metadata));
};
