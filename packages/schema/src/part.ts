import * as v from "valibot";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { EffectFieldSchema } from "./effect";
import { metadata } from "./utils";
import type { SchemaFn } from "./utils";
import { ClassMap, classSchema } from "./class";

export const partClasses = ["RegionPart", "DrawPart", "EffectSpawnerPart", "FlarePart", "HaloPart", "HoverPart", "ShapePart"] as const;

export type PartClass = (typeof partClasses)[number];

export const PartProgresses = ["reload", "smoothReload", "warmup", "charge", "recoil", "heat", "life", "time"] as const;

export const BlendingModes = ["normal", "additive", "subtractive", "multiply", "screen"] as const;

const partMoveSchema = v.object({
	progress: v.pipe(v.optional(v.picklist(PartProgresses), "warmup"), metadata({ name: "editor.part.progress" })),
	x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.x" })),
	y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.y" })),
	gx: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.gx" })),
	gy: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.gy" })),
	rot: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.rot" })),
});

const drawPartBaseObjectSchema = v.object({
	type: v.pipe(classSchema(partClasses, "RegionPart"), metadata({ name: "editor.part.type" })),
	under: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.part.under", description: "editor.part.under-description" }),
	),
	weaponIndex: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.part.weapon-index",
			description: "editor.part.weapon-index-description",
		}),
	),
	recoilIndex: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.part.recoil-index",
			description: "editor.part.recoil-index-description",
		}),
	),
});

export const flarePartObjectSchema = v.object({
	sides: v.pipe(v.optional(v.number(), 4), metadata({ name: "editor.part.sides" })),
	radius: v.pipe(v.optional(v.number(), 100), metadata({ name: "editor.part.radius" })),
	radiusTo: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.radius-to" })),
	stroke: v.pipe(v.optional(v.number(), 6), metadata({ name: "editor.part.stroke" })),
	innerScl: v.pipe(v.optional(v.number(), 0.5), metadata({ name: "editor.part.inner-scl" })),
	innerRadScl: v.pipe(v.optional(v.number(), 0.33), metadata({ name: "editor.part.inner-rad-scl" })),
	x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.x" })),
	y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.y" })),
	rotation: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.rotation" })),
	rotMove: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.rot-move" })),
	spinSpeed: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.spin-speed" })),
	followRotation: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.part.follow-rotation" })),
	color1: v.pipe(v.optional(MindustryHexColorSchema), metadata({ name: "editor.part.color1" })),
	color2: v.pipe(v.optional(MindustryHexColorSchema), metadata({ name: "editor.part.color2" })),
	clampProgress: v.pipe(v.optional(v.boolean(), true), metadata({ name: "editor.part.clamp-progress" })),
	progress: v.pipe(v.optional(v.picklist(PartProgresses), "warmup"), metadata({ name: "editor.part.progress" })),
	layer: v.pipe(v.optional(v.number(), 100), metadata({ name: "editor.part.layer" })),
});

export const haloPartObjectSchema = v.object({
	hollow: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.part.hollow" })),
	tri: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.part.tri" })),
	shapes: v.pipe(v.optional(v.number(), 3), metadata({ name: "editor.part.shapes" })),
	sides: v.pipe(v.optional(v.number(), 3), metadata({ name: "editor.part.sides" })),
	radius: v.pipe(v.optional(v.number(), 3), metadata({ name: "editor.part.radius" })),
	radiusTo: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.radius-to" })),
	stroke: v.pipe(v.optional(v.number(), 1), metadata({ name: "editor.part.stroke" })),
	strokeTo: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.stroke-to" })),
	triLength: v.pipe(v.optional(v.number(), 1), metadata({ name: "editor.part.tri-length" })),
	triLengthTo: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.tri-length-to" })),
	haloRadius: v.pipe(v.optional(v.number(), 10), metadata({ name: "editor.part.halo-radius" })),
	haloRadiusTo: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.halo-radius-to" })),
	x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.x" })),
	y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.y" })),
	shapeRotation: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.shape-rotation" })),
	moveX: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.move-x" })),
	moveY: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.move-y" })),
	shapeMoveRot: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.shape-move-rot" })),
	haloRotateSpeed: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.halo-rotate-speed" })),
	haloRotation: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.halo-rotation" })),
	rotateSpeed: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.rotate-speed" })),
	color: v.pipe(v.optional(MindustryHexColorSchema), metadata({ name: "editor.part.color" })),
	colorTo: v.pipe(v.optional(MindustryHexColorSchema), metadata({ name: "editor.part.color-to" })),
	mirror: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.part.mirror" })),
	clampProgress: v.pipe(v.optional(v.boolean(), true), metadata({ name: "editor.part.clamp-progress" })),
	progress: v.pipe(v.optional(v.picklist(PartProgresses), "warmup"), metadata({ name: "editor.part.progress" })),
	layer: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.layer" })),
	layerOffset: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.layer-offset" })),
});

export const hoverPartObjectSchema = v.object({
	radius: v.pipe(v.optional(v.number(), 4), metadata({ name: "editor.part.radius" })),
	x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.x" })),
	y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.y" })),
	rotation: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.rotation" })),
	phase: v.pipe(v.optional(v.number(), 50), metadata({ name: "editor.part.phase" })),
	stroke: v.pipe(v.optional(v.number(), 3), metadata({ name: "editor.part.stroke" })),
	minStroke: v.pipe(v.optional(v.number(), 0.12), metadata({ name: "editor.part.min-stroke" })),
	circles: v.pipe(v.optional(v.number(), 2), metadata({ name: "editor.part.circles" })),
	sides: v.pipe(v.optional(v.number(), 4), metadata({ name: "editor.part.sides" })),
	color: v.pipe(v.optional(MindustryHexColorSchema), metadata({ name: "editor.part.color" })),
	mirror: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.part.mirror" })),
	layer: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.layer" })),
	layerOffset: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.layer-offset" })),
});

export const shapePartObjectSchema = v.object({
	circle: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.part.circle" })),
	hollow: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.part.hollow" })),
	sides: v.pipe(v.optional(v.number(), 3), metadata({ name: "editor.part.sides" })),
	radius: v.pipe(v.optional(v.number(), 3), metadata({ name: "editor.part.radius" })),
	radiusTo: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.radius-to" })),
	stroke: v.pipe(v.optional(v.number(), 1), metadata({ name: "editor.part.stroke" })),
	strokeTo: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.stroke-to" })),
	x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.x" })),
	y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.y" })),
	rotation: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.rotation" })),
	moveX: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.move-x" })),
	moveY: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.move-y" })),
	moveRot: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.move-rot" })),
	rotateSpeed: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.rotate-speed" })),
	color: v.pipe(v.optional(MindustryHexColorSchema), metadata({ name: "editor.part.color" })),
	colorTo: v.pipe(v.optional(MindustryHexColorSchema), metadata({ name: "editor.part.color-to" })),
	mirror: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.part.mirror" })),
	clampProgress: v.pipe(v.optional(v.boolean(), true), metadata({ name: "editor.part.clamp-progress" })),
	progress: v.pipe(v.optional(v.picklist(PartProgresses), "warmup"), metadata({ name: "editor.part.progress" })),
	layer: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.layer" })),
	layerOffset: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.layer-offset" })),
});

export const PartHjsonSchema: SchemaFn = new ClassMap<PartClass>({
	DrawPart: (_context) => ({}),
	RegionPart: (context) => ({
			suffix: v.pipe(
				v.optional(v.string(), ""),
				metadata({
					name: "editor.part.suffix",
					description: "editor.part.suffix-description",
				}),
			),
			name: v.pipe(
				v.optional(v.string()),
				metadata({ name: "editor.part.name", description: "editor.part.name-description" }),
			),
			mirror: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.part.mirror",
					description: "editor.part.mirror-description",
				}),
			),
			outline: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.part.outline",
					description: "editor.part.outline-description",
				}),
			),
			replaceOutline: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.part.replace-outline",
					description: "editor.part.replace-outline-description",
				}),
			),
			drawRegion: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.part.draw-region",
					description: "editor.part.draw-region-description",
				}),
			),
			heatLight: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.part.heat-light",
					description: "editor.part.heat-light-description",
				}),
			),
			clampProgress: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.part.clamp-progress",
					description: "editor.part.clamp-progress-description",
				}),
			),
			progress: v.pipe(
				v.optional(v.picklist(PartProgresses), "warmup"),
				metadata({
					name: "editor.part.progress",
					description: "editor.part.progress-description",
				}),
			),
			growProgress: v.pipe(
				v.optional(v.picklist(PartProgresses), "warmup"),
				metadata({
					name: "editor.part.grow-progress",
					description: "editor.part.grow-progress-description",
				}),
			),
			heatProgress: v.pipe(
				v.optional(v.picklist(PartProgresses), "heat"),
				metadata({
					name: "editor.part.heat-progress",
					description: "editor.part.heat-progress-description",
				}),
			),
			blending: v.pipe(
				v.optional(v.picklist(BlendingModes), "normal"),
				metadata({ name: "editor.part.blending" }),
			),
			layer: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.part.layer" })),
			layerOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.part.layer-offset" }),
			),
			heatLayerOffset: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.part.heat-layer-offset" }),
			),
			turretHeatLayer: v.pipe(
				v.optional(v.number(), 50),
				metadata({ name: "editor.part.turret-heat-layer" }),
			),
			outlineLayerOffset: v.pipe(
				v.optional(v.number(), -0.001),
				metadata({ name: "editor.part.outline-layer-offset" }),
			),
			x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.x" })),
			y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.y" })),
			xScl: v.pipe(v.optional(v.number(), 1), metadata({ name: "editor.part.x-scl" })),
			yScl: v.pipe(v.optional(v.number(), 1), metadata({ name: "editor.part.y-scl" })),
			rotation: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.part.rotation" }),
			),
			originX: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.part.origin-x",
					description: "editor.part.origin-x-description",
				}),
			),
			originY: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.part.origin-y",
					description: "editor.part.origin-y-description",
				}),
			),
			moveX: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.move-x" })),
			moveY: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.move-y" })),
			growX: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.grow-x" })),
			growY: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.grow-y" })),
			moveRot: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.move-rot" })),
			heatLightOpacity: v.pipe(
				v.optional(v.number(), 0.3),
				metadata({ name: "editor.part.heat-light-opacity" }),
			),
			color: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.part.color" }),
			),
			colorTo: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.part.color-to" }),
			),
			mixColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.part.mix-color" }),
			),
			mixColorTo: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.part.mix-color-to" }),
			),
			heatColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.part.heat-color" }),
			),
			children: v.pipe(
				v.optional(PartHjsonSchema(context)),
				metadata({ name: "editor.part.children" }),
			),
			moves: v.pipe(
				v.optional(v.array(partMoveSchema), []),
				metadata({ name: "editor.part.moves" }),
			),
		}),
	EffectSpawnerPart: (context) => ({
			x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.x" })),
			y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.y" })),
			width: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.width" })),
			height: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.part.height" })),
			rotation: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.part.rotation" }),
			),
			mirror: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.part.mirror" }),
			),
			effectRot: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.part.effect-rot" }),
			),
			effectRandRot: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.part.effect-rand-rot" }),
			),
			effectInterval: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.part.effect-interval",
					description: "editor.part.effect-interval-description",
				}),
			),
			effectIntervalFrom: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.part.effect-interval-from",
					description: "editor.part.effect-interval-from-description",
				}),
			),
			effectChance: v.pipe(
				v.optional(v.number(), 0.1),
				metadata({ name: "editor.part.effect-chance" }),
			),
			effect: v.pipe(EffectFieldSchema(context), metadata({ name: "editor.part.effect" })),
			effectColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.part.effect-color" }),
			),
			useProgress: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.part.use-progress",
					description: "editor.part.use-progress-description",
				}),
			),
			progress: v.pipe(
				v.optional(v.picklist(PartProgresses), "warmup"),
				metadata({ name: "editor.part.progress" }),
			),
		}),
	FlarePart: (_context) => flarePartObjectSchema.entries,
	HaloPart: (_context) => haloPartObjectSchema.entries,
	HoverPart: (_context) => hoverPartObjectSchema.entries,
	ShapePart: (_context) => shapePartObjectSchema.entries,
}, {
	baseSchema: drawPartBaseObjectSchema.entries,
}).schema;
