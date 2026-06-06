import * as v from "valibot";
import { CachedSchema, MindustryHexColorSchema, type SchemaFn } from "./base";
import { EffectFieldSchema } from "./effect";

const metadata = { type: "part" };

export const partClasses = ["RegionPart", "DrawPart", "EffectSpawnerPart", "FlarePart", "HaloPart", "HoverPart", "ShapePart"] as const;

export type PartClass = (typeof partClasses)[number];

export const PartProgresses = ["reload", "smoothReload", "warmup", "charge", "recoil", "heat", "life", "time"] as const;

export const BlendingModes = ["normal", "additive", "subtractive", "multiply", "screen"] as const;

const partMoveSchema = v.object({
	progress: v.optional(v.picklist(PartProgresses), "warmup"),
	x: v.optional(v.number(), 0),
	y: v.optional(v.number(), 0),
	gx: v.optional(v.number(), 0),
	gy: v.optional(v.number(), 0),
	rot: v.optional(v.number(), 0),
});

const drawPartBaseObjectSchema = v.object({
	type: v.optional(v.picklist(partClasses)),
	under: v.optional(v.boolean(), false),
	weaponIndex: v.optional(v.number(), 0),
	recoilIndex: v.optional(v.number(), -1),
});

export const flarePartObjectSchema = v.object({
	sides: v.optional(v.number(), 4),
	radius: v.optional(v.number(), 100),
	radiusTo: v.optional(v.number(), -1),
	stroke: v.optional(v.number(), 6),
	innerScl: v.optional(v.number(), 0.5),
	innerRadScl: v.optional(v.number(), 0.33),
	x: v.optional(v.number(), 0),
	y: v.optional(v.number(), 0),
	rotation: v.optional(v.number(), 0),
	rotMove: v.optional(v.number(), 0),
	spinSpeed: v.optional(v.number(), 0),
	followRotation: v.optional(v.boolean(), false),
	color1: v.optional(MindustryHexColorSchema),
	color2: v.optional(MindustryHexColorSchema),
	clampProgress: v.optional(v.boolean(), true),
	progress: v.optional(v.picklist(PartProgresses), "warmup"),
	layer: v.optional(v.number(), 100),
});

export const haloPartObjectSchema = v.object({
	hollow: v.optional(v.boolean(), false),
	tri: v.optional(v.boolean(), false),
	shapes: v.optional(v.number(), 3),
	sides: v.optional(v.number(), 3),
	radius: v.optional(v.number(), 3),
	radiusTo: v.optional(v.number(), -1),
	stroke: v.optional(v.number(), 1),
	strokeTo: v.optional(v.number(), -1),
	triLength: v.optional(v.number(), 1),
	triLengthTo: v.optional(v.number(), -1),
	haloRadius: v.optional(v.number(), 10),
	haloRadiusTo: v.optional(v.number(), -1),
	x: v.optional(v.number(), 0),
	y: v.optional(v.number(), 0),
	shapeRotation: v.optional(v.number(), 0),
	moveX: v.optional(v.number(), 0),
	moveY: v.optional(v.number(), 0),
	shapeMoveRot: v.optional(v.number(), 0),
	haloRotateSpeed: v.optional(v.number(), 0),
	haloRotation: v.optional(v.number(), 0),
	rotateSpeed: v.optional(v.number(), 0),
	color: v.optional(MindustryHexColorSchema),
	colorTo: v.optional(MindustryHexColorSchema),
	mirror: v.optional(v.boolean(), false),
	clampProgress: v.optional(v.boolean(), true),
	progress: v.optional(v.picklist(PartProgresses), "warmup"),
	layer: v.optional(v.number(), -1),
	layerOffset: v.optional(v.number(), 0),
});

export const hoverPartObjectSchema = v.object({
	radius: v.optional(v.number(), 4),
	x: v.optional(v.number(), 0),
	y: v.optional(v.number(), 0),
	rotation: v.optional(v.number(), 0),
	phase: v.optional(v.number(), 50),
	stroke: v.optional(v.number(), 3),
	minStroke: v.optional(v.number(), 0.12),
	circles: v.optional(v.number(), 2),
	sides: v.optional(v.number(), 4),
	color: v.optional(MindustryHexColorSchema),
	mirror: v.optional(v.boolean(), false),
	layer: v.optional(v.number(), -1),
	layerOffset: v.optional(v.number(), 0),
});

export const shapePartObjectSchema = v.object({
	circle: v.optional(v.boolean(), false),
	hollow: v.optional(v.boolean(), false),
	sides: v.optional(v.number(), 3),
	radius: v.optional(v.number(), 3),
	radiusTo: v.optional(v.number(), -1),
	stroke: v.optional(v.number(), 1),
	strokeTo: v.optional(v.number(), -1),
	x: v.optional(v.number(), 0),
	y: v.optional(v.number(), 0),
	rotation: v.optional(v.number(), 0),
	moveX: v.optional(v.number(), 0),
	moveY: v.optional(v.number(), 0),
	moveRot: v.optional(v.number(), 0),
	rotateSpeed: v.optional(v.number(), 0),
	color: v.optional(MindustryHexColorSchema),
	colorTo: v.optional(MindustryHexColorSchema),
	mirror: v.optional(v.boolean(), false),
	clampProgress: v.optional(v.boolean(), true),
	progress: v.optional(v.picklist(PartProgresses), "warmup"),
	layer: v.optional(v.number(), -1),
	layerOffset: v.optional(v.number(), 0),
});

const classSchemaMap: Record<PartClass, SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>> = {
	DrawPart: (_context) => v.object({}),
	RegionPart: (context) =>
		v.object({
			suffix: v.optional(v.string(), ""),
			name: v.optional(v.string()),
			mirror: v.optional(v.boolean(), false),
			outline: v.optional(v.boolean(), true),
			replaceOutline: v.optional(v.boolean(), false),
			drawRegion: v.optional(v.boolean(), true),
			heatLight: v.optional(v.boolean(), false),
			clampProgress: v.optional(v.boolean(), true),
			progress: v.optional(v.picklist(PartProgresses), "warmup"),
			growProgress: v.optional(v.picklist(PartProgresses), "warmup"),
			heatProgress: v.optional(v.picklist(PartProgresses), "heat"),
			blending: v.optional(v.picklist(BlendingModes), "normal"),
			layer: v.optional(v.number(), -1),
			layerOffset: v.optional(v.number(), 0),
			heatLayerOffset: v.optional(v.number(), 1),
			turretHeatLayer: v.optional(v.number(), 50),
			outlineLayerOffset: v.optional(v.number(), -0.001),
			x: v.optional(v.number(), 0),
			y: v.optional(v.number(), 0),
			xScl: v.optional(v.number(), 1),
			yScl: v.optional(v.number(), 1),
			rotation: v.optional(v.number(), 0),
			originX: v.optional(v.number(), 0),
			originY: v.optional(v.number(), 0),
			moveX: v.optional(v.number(), 0),
			moveY: v.optional(v.number(), 0),
			growX: v.optional(v.number(), 0),
			growY: v.optional(v.number(), 0),
			moveRot: v.optional(v.number(), 0),
			heatLightOpacity: v.optional(v.number(), 0.3),
			color: v.optional(MindustryHexColorSchema),
			colorTo: v.optional(MindustryHexColorSchema),
			mixColor: v.optional(MindustryHexColorSchema),
			mixColorTo: v.optional(MindustryHexColorSchema),
			heatColor: v.optional(MindustryHexColorSchema),
			children: v.optional(PartHjsonSchema(context)),
			moves: v.optional(v.array(partMoveSchema), []),
		}),
	EffectSpawnerPart: (context) =>
		v.object({
			x: v.optional(v.number(), 0),
			y: v.optional(v.number(), 0),
			width: v.optional(v.number(), 0),
			height: v.optional(v.number(), 0),
			rotation: v.optional(v.number(), 0),
			mirror: v.optional(v.boolean(), false),
			effectRot: v.optional(v.number(), 0),
			effectRandRot: v.optional(v.number(), 0),
			effectInterval: v.optional(v.number(), 0),
			effectIntervalFrom: v.optional(v.number(), 0),
			effectChance: v.optional(v.number(), 0.1),
			effect: EffectFieldSchema(context),
			effectColor: v.optional(MindustryHexColorSchema),
			useProgress: v.optional(v.boolean(), true),
			progress: v.optional(v.picklist(PartProgresses), "warmup"),
		}),
	FlarePart: (_context) => flarePartObjectSchema,
	HaloPart: (_context) => haloPartObjectSchema,
	HoverPart: (_context) => hoverPartObjectSchema,
	ShapePart: (_context) => shapePartObjectSchema,
};

export const PartHjsonSchema: SchemaFn = CachedSchema((context) => {
	return v.lazy((input) => {
		if (input && typeof input === "object" && "type" in input) {
			const type = input.type;

			if (type && classSchemaMap[type as PartClass]) {
				const schemaFn = classSchemaMap[type as PartClass];
				return v.pipe(v.object({ ...drawPartBaseObjectSchema.entries, ...schemaFn(context).entries }), v.metadata(metadata));
			}
		}

		return v.pipe(drawPartBaseObjectSchema, v.metadata(metadata));
	});
});
