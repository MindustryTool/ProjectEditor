import * as v from "valibot";
import { TextureFieldSchema } from "./texture";
import { metadata, fixed } from "./utils";
import { blockObjectSchema } from "./block-object";

// Campaign variant schemas
export const launchPadObjectSchema = v.object({
	lightTexture: TextureFieldSchema("@-light"),
	podTexture: TextureFieldSchema("@-pod"),
	previewTexture: TextureFieldSchema("@-preview", "@"),
	hasItems: fixed(blockObjectSchema, "hasItems", true),
	solid: fixed(blockObjectSchema, "solid", true),
	update: fixed(blockObjectSchema, "update", true),
	configurable: fixed(blockObjectSchema, "configurable", true),
	flags: fixed(blockObjectSchema, "flags", ["launchPad"]),
	launchTime: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-launch-pad.launch-time",
			description: "editor.block-launch-pad.launch-time-description",
		}),
	),
	launchSoundPitchRand: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.block-launch-pad.launch-sound-pitch-rand",
			description: "editor.block-launch-pad.launch-sound-pitch-rand-description",
		}),
	),
	acceptMultipleItems: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-launch-pad.accept-multiple-items",
			description: "editor.block-launch-pad.accept-multiple-items-description",
		}),
	),
	lightStep: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-launch-pad.light-step",
			description: "editor.block-launch-pad.light-step-description",
		}),
	),
	lightSteps: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-launch-pad.light-steps",
			description: "editor.block-launch-pad.light-steps-description",
		}),
	),
	liquidPad: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-launch-pad.liquid-pad",
			description: "editor.block-launch-pad.liquid-pad-description",
		}),
	),
});

export const landingPadObjectSchema = v.object({
	podTexture: TextureFieldSchema("@-pod", "advanced-launch-pad-pod"),
	hasItems: fixed(blockObjectSchema, "hasItems", true),
	hasLiquids: fixed(blockObjectSchema, "hasLiquids", true),
	solid: fixed(blockObjectSchema, "solid", true),
	update: fixed(blockObjectSchema, "update", true),
	configurable: fixed(blockObjectSchema, "configurable", true),
	acceptsItems: fixed(blockObjectSchema, "acceptsItems", false),
	emitLight: fixed(blockObjectSchema, "emitLight", true),
	lightRadius: fixed(blockObjectSchema, "lightRadius", 90),

	arrivalDuration: v.pipe(
		v.optional(v.number(), 150),
		metadata({
			name: "editor.block-landing-pad.arrival-duration",
			description: "editor.block-landing-pad.arrival-duration-description",
		}),
	),
	cooldownTime: v.pipe(
		v.optional(v.number(), 150),
		metadata({
			name: "editor.block-landing-pad.cooldown-time",
			description: "editor.block-landing-pad.cooldown-time-description",
		}),
	),
	consumeLiquidAmount: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-landing-pad.consume-liquid-amount",
			description: "editor.block-landing-pad.consume-liquid-amount-description",
		}),
	),
	coolingEffectChance: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({
			name: "editor.block-landing-pad.cooling-effect-chance",
			description: "editor.block-landing-pad.cooling-effect-chance-description",
		}),
	),
	liquidPad: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-landing-pad.liquid-pad",
			description: "editor.block-landing-pad.liquid-pad-description",
		}),
	),
	landSoundVolume: v.pipe(
		v.optional(v.number(), 0.75),
		metadata({
			name: "editor.block-landing-pad.land-sound-volume",
			description: "editor.block-landing-pad.land-sound-volume-description",
		}),
	),
});

export const acceleratorObjectSchema = v.object({
	launchArrowTexture: TextureFieldSchema("@-launch-arrow"),
	update: fixed(blockObjectSchema, "update", true),
	solid: fixed(blockObjectSchema, "solid", true),
	hasItems: fixed(blockObjectSchema, "hasItems", true),
	hasPower: fixed(blockObjectSchema, "hasPower", true),
	itemCapacity: fixed(blockObjectSchema, "itemCapacity", 8000),
	configurable: fixed(blockObjectSchema, "configurable", true),
	emitLight: fixed(blockObjectSchema, "emitLight", true),
	lightRadius: fixed(blockObjectSchema, "lightRadius", 70),
	lightColor: fixed(blockObjectSchema, "lightColor"),
	lightningSoundVolume: v.pipe(
		v.optional(v.number(), 0.85),
		metadata({
			name: "editor.block-accelerator.lightning-sound-volume",
			description: "editor.block-accelerator.lightning-sound-volume-description",
		}),
	),
	launchDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-accelerator.launch-duration",
			description: "editor.block-accelerator.launch-duration-description",
		}),
	),
	chargeDuration: v.pipe(
		v.optional(v.number(), 220),
		metadata({
			name: "editor.block-accelerator.charge-duration",
			description: "editor.block-accelerator.charge-duration-description",
		}),
	),
	buildDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-accelerator.build-duration",
			description: "editor.block-accelerator.build-duration-description",
		}),
	),
	landZoomFrom: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({
			name: "editor.block-accelerator.land-zoom-from",
			description: "editor.block-accelerator.land-zoom-from-description",
		}),
	),
	landZoomTo: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-accelerator.land-zoom-to",
			description: "editor.block-accelerator.land-zoom-to-description",
		}),
	),
	chargeZoomTo: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-accelerator.charge-zoom-to",
			description: "editor.block-accelerator.charge-zoom-to-description",
		}),
	),
	chargeRings: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-accelerator.charge-rings",
			description: "editor.block-accelerator.charge-rings-description",
		}),
	),
	ringRadBase: v.pipe(
		v.optional(v.number(), 60),
		metadata({
			name: "editor.block-accelerator.ring-rad-base",
			description: "editor.block-accelerator.ring-rad-base-description",
		}),
	),
	ringRadSpacing: v.pipe(
		v.optional(v.number(), 25),
		metadata({
			name: "editor.block-accelerator.ring-rad-spacing",
			description: "editor.block-accelerator.ring-rad-spacing-description",
		}),
	),
	ringRadPow: v.pipe(
		v.optional(v.number(), 1.6),
		metadata({
			name: "editor.block-accelerator.ring-rad-pow",
			description: "editor.block-accelerator.ring-rad-pow-description",
		}),
	),
	ringStroke: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-accelerator.ring-stroke",
			description: "editor.block-accelerator.ring-stroke-description",
		}),
	),
	ringSpeedup: v.pipe(
		v.optional(v.number(), 1.4),
		metadata({
			name: "editor.block-accelerator.ring-speedup",
			description: "editor.block-accelerator.ring-speedup-description",
		}),
	),
	chargeRingMerge: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-accelerator.charge-ring-merge",
			description: "editor.block-accelerator.charge-ring-merge-description",
		}),
	),
	ringArrowRad: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-accelerator.ring-arrow-rad",
			description: "editor.block-accelerator.ring-arrow-rad-description",
		}),
	),
	ringHandleTilt: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "editor.block-accelerator.ring-handle-tilt",
			description: "editor.block-accelerator.ring-handle-tilt-description",
		}),
	),
	ringHandleLen: v.pipe(
		v.optional(v.number(), 30),
		metadata({
			name: "editor.block-accelerator.ring-handle-len",
			description: "editor.block-accelerator.ring-handle-len-description",
		}),
	),
	launchLightning: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.block-accelerator.launch-lightning",
			description: "editor.block-accelerator.launch-lightning-description",
		}),
	),
	lightningDamage: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.block-accelerator.lightning-damage",
			description: "editor.block-accelerator.lightning-damage-description",
		}),
	),
	lightningOffset: v.pipe(
		v.optional(v.number(), 24),
		metadata({
			name: "editor.block-accelerator.lightning-offset",
			description: "editor.block-accelerator.lightning-offset-description",
		}),
	),
	lightningLengthMin: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-accelerator.lightning-length-min",
			description: "editor.block-accelerator.lightning-length-min-description",
		}),
	),
	lightningLengthMax: v.pipe(
		v.optional(v.number(), 25),
		metadata({
			name: "editor.block-accelerator.lightning-length-max",
			description: "editor.block-accelerator.lightning-length-max-description",
		}),
	),
	lightningLaunchChance: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "editor.block-accelerator.lightning-launch-chance",
			description: "editor.block-accelerator.lightning-launch-chance-description",
		}),
	),
});
