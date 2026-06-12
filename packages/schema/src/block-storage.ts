import * as v from "valibot";
import { TextureFieldSchema } from "./texture";
import { metadata } from "./utils";
import { UnitFieldSchema } from "./unit";
import type { ProjectContents } from "@project/types";

// Storage variant schemas
export const storageBlockObjectSchema = v.object({
	coreMerge: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-storage-block.core-merge",
			description: "editor.block-storage-block.core-merge-description",
		}),
	),
});

export const coreBlockObjectSchema = (context: ProjectContents) => v.object({
	...storageBlockObjectSchema.entries,
    unitType: UnitFieldSchema(context),
	thruster1Texture: TextureFieldSchema("@-thruster1", "clear-effect"),
	thruster2Texture: TextureFieldSchema("@-thruster2", "clear-effect"),
	thrusterLength: v.pipe(
		v.optional(v.number(), 3.5),
		metadata({
			name: "editor.block-core-block.thruster-length",
			description: "editor.block-core-block.thruster-length-description",
		}),
	),
	thrusterOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-core-block.thruster-offset",
			description: "editor.block-core-block.thruster-offset-description",
		}),
	),
	isFirstTier: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-core-block.is-first-tier",
			description: "editor.block-core-block.is-first-tier-description",
		}),
	),
	allowSpawn: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-core-block.allow-spawn",
			description: "editor.block-core-block.allow-spawn-description",
		}),
	),
	requiresCoreZone: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-core-block.requires-core-zone",
			description: "editor.block-core-block.requires-core-zone-description",
		}),
	),
	incinerateNonBuildable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-core-block.incinerate-non-buildable",
			description: "editor.block-core-block.incinerate-non-buildable-description",
		}),
	),
	landDuration: v.pipe(
		v.optional(v.number(), 160),
		metadata({
			name: "editor.block-core-block.land-duration",
			description: "editor.block-core-block.land-duration-description",
		}),
	),
	launchSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-core-block.launch-sound-volume",
			description: "editor.block-core-block.launch-sound-volume-description",
		}),
	),
	landSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-core-block.land-sound-volume",
			description: "editor.block-core-block.land-sound-volume-description",
		}),
	),
	captureInvicibility: v.pipe(
		v.optional(v.number(), 900),
		metadata({
			name: "editor.block-core-block.capture-invicibility",
			description: "editor.block-core-block.capture-invicibility-description",
		}),
	),
});

export const unloaderObjectSchema = v.object({
	centerTexture: TextureFieldSchema("@-center", "unloader-center"),
	speed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-unloader.speed",
			description: "editor.block-unloader.speed-description",
		}),
	),
	allowCoreUnload: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-unloader.allow-core-unload",
			description: "editor.block-unloader.allow-core-unload-description",
		}),
	),
});
