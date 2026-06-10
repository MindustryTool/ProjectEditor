import * as v from "valibot"
import { TextureFieldSchema } from "./texture"
import { ArrayTextureSchema } from "./textures"
import { metadata } from "./utils"

export const liquidBlockObjectSchema = v.object({
	liquidRegion: TextureFieldSchema("@-liquid"),
	topRegion: TextureFieldSchema("@-top"),
	bottomRegion: TextureFieldSchema("@bottom"),
});

// Liquid variant schemas
export const liquidRouterObjectSchema = v.object({
	liquidPadding: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-liquid-router.liquid-padding",
			description: "editor.block-liquid-router.liquid-padding-description",
		}),
	),
});

export const conduitObjectSchema = v.object({
	topTextures: ArrayTextureSchema("@-top-#", 5),
	bottomTextures: ArrayTextureSchema("@-bottom-#", 5),
	capTexture: TextureFieldSchema("@-cap"),
	padCorners: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-conduit.pad-corners",
			description: "editor.block-conduit.pad-corners-description",
		}),
	),
	leaks: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-conduit.leaks",
			description: "editor.block-conduit.leaks-description",
		}),
	),
});

export const pumpObjectSchema = v.object({
	...liquidBlockObjectSchema.entries,
	pumpAmount: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({
			name: "editor.block-pump.pump-amount",
			description: "editor.block-pump.pump-amount-description",
		}),
	),
	consumeTime: v.pipe(
		v.optional(v.number(), 300),
		metadata({
			name: "editor.block-pump.consume-time",
			description: "editor.block-pump.consume-time-description",
		}),
	),
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.019),
		metadata({
			name: "editor.block-pump.warmup-speed",
			description: "editor.block-pump.warmup-speed-description",
		}),
	),
});

export const solidPumpObjectSchema = v.object({
	...pumpObjectSchema.entries,
	rotatorTexture: TextureFieldSchema("@-rotator"),
	result: v.pipe(
		v.optional(v.string(), "water"),
		metadata({
			name: "editor.block-solid-pump.result",
			description: "editor.block-solid-pump.result-description",
		}),
	),
	updateEffectChance: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({
			name: "editor.block-solid-pump.update-effect-chance",
			description: "editor.block-solid-pump.update-effect-chance-description",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-solid-pump.rotate-speed",
			description: "editor.block-solid-pump.rotate-speed-description",
		}),
	),
	baseEfficiency: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-solid-pump.base-efficiency",
			description: "editor.block-solid-pump.base-efficiency-description",
		}),
	),
	attribute: v.pipe(
		v.optional(v.string()),
		metadata({
			name: "editor.block-solid-pump.attribute",
			description: "editor.block-solid-pump.attribute-description",
		}),
	),
});

export const frackerObjectSchema = v.object({
	...solidPumpObjectSchema.entries,
	itemUseTime: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-fracker.item-use-time",
			description: "editor.block-fracker.item-use-time-description",
		}),
	),
});
