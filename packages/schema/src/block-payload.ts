import * as v from "valibot";
import { TextureFieldSchema } from "./texture";
import { metadata } from "./utils";

// Payload variant schemas
export const payloadBlockObjectSchema = v.object({
	payloadSpeed: v.pipe(
		v.optional(v.number(), 0.7),
		metadata({
			name: "editor.block-payload-block.payload-speed",
			description: "editor.block-payload-block.payload-speed-description",
		}),
	),
	payloadRotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-payload-block.payload-rotate-speed",
			description: "editor.block-payload-block.payload-rotate-speed-description",
		}),
	),
});

export const payloadConveyorObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	edgeTexture: TextureFieldSchema("@-edge"),
	moveTime: v.pipe(
		v.optional(v.number(), 45),
		metadata({
			name: "editor.block-payload-conveyor.move-time",
			description: "editor.block-payload-conveyor.move-time-description",
		}),
	),
	moveForce: v.pipe(
		v.optional(v.number(), 201),
		metadata({
			name: "editor.block-payload-conveyor.move-force",
			description: "editor.block-payload-conveyor.move-force-description",
		}),
	),
	payloadLimit: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-payload-conveyor.payload-limit",
			description: "editor.block-payload-conveyor.payload-limit-description",
		}),
	),
	pushUnits: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-payload-conveyor.push-units",
			description: "editor.block-payload-conveyor.push-units-description",
		}),
	),
});

export const payloadRouterObjectSchema = v.object({
	overTexture: TextureFieldSchema("@-over"),
	...payloadConveyorObjectSchema.entries,
	invert: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-payload-router.invert",
			description: "editor.block-payload-router.invert-description",
		}),
	),
});

export const payloadVoidObjectSchema = v.object({ ...payloadBlockObjectSchema.entries });

export const payloadMassDriverObjectSchema = v.object({
	baseTexture: TextureFieldSchema("@-base"),
	capTexture: TextureFieldSchema("@-cap"),
	leftTexture: TextureFieldSchema("@-left"),
	rightTexture: TextureFieldSchema("@-right"),
	...payloadBlockObjectSchema.entries,
	range: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-payload-mass-driver.range",
			description: "editor.block-payload-mass-driver.range-description",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-payload-mass-driver.rotate-speed",
			description: "editor.block-payload-mass-driver.rotate-speed-description",
		}),
	),
	length: v.pipe(
		v.optional(v.number(), 11.125),
		metadata({
			name: "editor.block-payload-mass-driver.length",
			description: "editor.block-payload-mass-driver.length-description",
		}),
	),
	knockback: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-payload-mass-driver.knockback",
			description: "editor.block-payload-mass-driver.knockback-description",
		}),
	),
	reload: v.pipe(
		v.optional(v.number(), 30),
		metadata({
			name: "editor.block-payload-mass-driver.reload",
			description: "editor.block-payload-mass-driver.reload-description",
		}),
	),
	chargeTime: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-payload-mass-driver.charge-time",
			description: "editor.block-payload-mass-driver.charge-time-description",
		}),
	),
	maxPayloadSize: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-payload-mass-driver.max-payload-size",
			description: "editor.block-payload-mass-driver.max-payload-size-description",
		}),
	),
	grabWidth: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-payload-mass-driver.grab-width",
			description: "editor.block-payload-mass-driver.grab-width-description",
		}),
	),
	grabHeight: v.pipe(
		v.optional(v.number(), 2.75),
		metadata({
			name: "editor.block-payload-mass-driver.grab-height",
			description: "editor.block-payload-mass-driver.grab-height-description",
		}),
	),
	shootSoundVolume: v.pipe(
		v.optional(v.number(), 0.7),
		metadata({
			name: "editor.block-payload-mass-driver.shoot-sound-volume",
			description: "editor.block-payload-mass-driver.shoot-sound-volume-description",
		}),
	),
	shake: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-payload-mass-driver.shake",
			description: "editor.block-payload-mass-driver.shake-description",
		}),
	),
});

export const payloadLoaderObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
	loadTime: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-payload-loader.load-time",
			description: "editor.block-payload-loader.load-time-description",
		}),
	),
	itemsLoaded: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-payload-loader.items-loaded",
			description: "editor.block-payload-loader.items-loaded-description",
		}),
	),
	liquidsLoaded: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.block-payload-loader.liquids-loaded",
			description: "editor.block-payload-loader.liquids-loaded-description",
		}),
	),
	maxBlockSize: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-payload-loader.max-block-size",
			description: "editor.block-payload-loader.max-block-size-description",
		}),
	),
	maxPowerConsumption: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.block-payload-loader.max-power-consumption",
			description: "editor.block-payload-loader.max-power-consumption-description",
		}),
	),
	loadPowerDynamic: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-payload-loader.load-power-dynamic",
			description: "editor.block-payload-loader.load-power-dynamic-description",
		}),
	),
	basePowerUse: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-payload-loader.base-power-use",
			description: "editor.block-payload-loader.base-power-use-description",
		}),
	),
});

export const payloadUnloaderObjectSchema = v.object({
	...payloadLoaderObjectSchema.entries,
	offloadSpeed: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-payload-unloader.offload-speed",
			description: "editor.block-payload-unloader.offload-speed-description",
		}),
	),
	maxPowerUnload: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-payload-unloader.max-power-unload",
			description: "editor.block-payload-unloader.max-power-unload-description",
		}),
	),
});

export const payloadDeconstructorObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
	maxPayloadSize: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-payload-deconstructor.max-payload-size",
			description: "editor.block-payload-deconstructor.max-payload-size-description",
		}),
	),
	deconstructSpeed: v.pipe(
		v.optional(v.number(), 2.5),
		metadata({
			name: "editor.block-payload-deconstructor.deconstruct-speed",
			description: "editor.block-payload-deconstructor.deconstruct-speed-description",
		}),
	),
	dumpRate: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-payload-deconstructor.dump-rate",
			description: "editor.block-payload-deconstructor.dump-rate-description",
		}),
	),
});

export const blockProducerObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
	buildSpeed: v.pipe(
		v.optional(v.number(), 0.4),
		metadata({
			name: "editor.block-block-producer.build-speed",
			description: "editor.block-block-producer.build-speed-description",
		}),
	),
});

export const unitBlockObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
});

export const constructorObjectSchema = v.object({
	...blockProducerObjectSchema.entries,
	minBlockSize: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-constructor.min-block-size",
			description: "editor.block-constructor.min-block-size-description",
		}),
	),
	maxBlockSize: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-constructor.max-block-size",
			description: "editor.block-constructor.max-block-size-description",
		}),
	),
});

export const singleBlockProducerObjectSchema = v.object({
	...blockProducerObjectSchema.entries,
	result: v.pipe(
		v.optional(v.string()),
		metadata({
			name: "editor.block-single-block-producer.result",
			description: "editor.block-single-block-producer.result-description",
		}),
	),
});
