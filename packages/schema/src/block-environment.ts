import * as v from "valibot";
import { TextureFieldSchema } from "./texture";
import { ArrayTextureSchema } from "./textures";
import { metadata } from "./utils";

// Environment variant schemas
export const floorObjectSchema = v.object({
	edge: v.pipe(
		v.optional(v.string(), "stone"),
		metadata({
			name: "editor.block-floor.edge",
			description: "editor.block-floor.edge-description",
		}),
	),
	speedMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-floor.speed-multiplier",
			description: "editor.block-floor.speed-multiplier-description",
		}),
	),
	dragMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-floor.drag-multiplier",
			description: "editor.block-floor.drag-multiplier-description",
		}),
	),
	damageTaken: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-floor.damage-taken",
			description: "editor.block-floor.damage-taken-description",
		}),
	),
	drownTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-floor.drown-time",
			description: "editor.block-floor.drown-time-description",
		}),
	),
	walkSoundVolume: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.block-floor.walk-sound-volume",
			description: "editor.block-floor.walk-sound-volume-description",
		}),
	),
	walkSoundPitchMin: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "editor.block-floor.walk-sound-pitch-min",
			description: "editor.block-floor.walk-sound-pitch-min-description",
		}),
	),
	walkSoundPitchMax: v.pipe(
		v.optional(v.number(), 1.2),
		metadata({
			name: "editor.block-floor.walk-sound-pitch-max",
			description: "editor.block-floor.walk-sound-pitch-max-description",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 60),
		metadata({
			name: "editor.block-floor.status-duration",
			description: "editor.block-floor.status-duration-description",
		}),
	),
	isLiquid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.is-liquid",
			description: "editor.block-floor.is-liquid-description",
		}),
	),
	overlayAlpha: v.pipe(
		v.optional(v.number(), 0.65),
		metadata({
			name: "editor.block-floor.overlay-alpha",
			description: "editor.block-floor.overlay-alpha-description",
		}),
	),
	supportsOverlay: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.supports-overlay",
			description: "editor.block-floor.supports-overlay-description",
		}),
	),
	shallow: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.shallow",
			description: "editor.block-floor.shallow-description",
		}),
	),
	oreDefault: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.ore-default",
			description: "editor.block-floor.ore-default-description",
		}),
	),
	oreScale: v.pipe(
		v.optional(v.number(), 24),
		metadata({
			name: "editor.block-floor.ore-scale",
			description: "editor.block-floor.ore-scale-description",
		}),
	),
	oreThreshold: v.pipe(
		v.optional(v.number(), 0.828),
		metadata({
			name: "editor.block-floor.ore-threshold",
			description: "editor.block-floor.ore-threshold-description",
		}),
	),
	canShadow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-floor.can-shadow",
			description: "editor.block-floor.can-shadow-description",
		}),
	),
	forceDrawLight: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.force-draw-light",
			description: "editor.block-floor.force-draw-light-description",
		}),
	),
	needsSurface: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-floor.needs-surface",
			description: "editor.block-floor.needs-surface-description",
		}),
	),
	allowCorePlacement: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.allow-core-placement",
			description: "editor.block-floor.allow-core-placement-description",
		}),
	),
	wallOre: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.wall-ore",
			description: "editor.block-floor.wall-ore-description",
		}),
	),
	blendId: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block-floor.blend-id",
			description: "editor.block-floor.blend-id-description",
		}),
	),
	tilingVariants: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-floor.tiling-variants",
			description: "editor.block-floor.tiling-variants-description",
		}),
	),
	autotile: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.autotile",
			description: "editor.block-floor.autotile-description",
		}),
	),
	autotileMidVariants: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-floor.autotile-mid-variants",
			description: "editor.block-floor.autotile-mid-variants-description",
		}),
	),
	autotileVariants: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-floor.autotile-variants",
			description: "editor.block-floor.autotile-variants-description",
		}),
	),
	drawEdgeIn: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-floor.draw-edge-in",
			description: "editor.block-floor.draw-edge-in-description",
		}),
	),
	drawEdgeOut: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-floor.draw-edge-out",
			description: "editor.block-floor.draw-edge-out-description",
		}),
	),
});

export const coloredFloorObjectSchema = v.object({
	...floorObjectSchema.entries,
});

export const treeBlockObjectSchema = v.object({
	shadowTexture: TextureFieldSchema("@-shadow"),
	shadowOffset: v.pipe(
		v.optional(v.number(), -4),
		metadata({
			name: "editor.block-tree-block.shadow-offset",
			description: "editor.block-tree-block.shadow-offset-description",
		}),
	),
});

export const tallBlockObjectSchema = v.object({
	shadowOffset: v.pipe(
		v.optional(v.number(), -3),
		metadata({
			name: "editor.block-tall-block.shadow-offset",
			description: "editor.block-tall-block.shadow-offset-description",
		}),
	),
	layer: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.block-tall-block.layer",
			description: "editor.block-tall-block.layer-description",
		}),
	),
	shadowLayer: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.block-tall-block.shadow-layer",
			description: "editor.block-tall-block.shadow-layer-description",
		}),
	),
	rotationRand: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.block-tall-block.rotation-rand",
			description: "editor.block-tall-block.rotation-rand-description",
		}),
	),
	shadowAlpha: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.block-tall-block.shadow-alpha",
			description: "editor.block-tall-block.shadow-alpha-description",
		}),
	),
});

export const cliffObjectSchema = v.object({
	cliffmaskTexture: ArrayTextureSchema("cliffmask#", 128),
	size: v.pipe(
		v.optional(v.number(), 11),
		metadata({
			name: "editor.block-cliff.size",
			description: "editor.block-cliff.size-description",
		}),
	),
});
