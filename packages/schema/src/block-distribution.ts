import * as v from "valibot"
import { TextureFieldSchema } from "./texture"
import { ArrayTextureSchema } from "./textures"
import { metadata } from "./utils"

// Distribution variant schemas
export const conveyorObjectSchema = v.object({
	textures: ArrayTextureSchema("@-#-#", [7, 3]),
	speed: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-conveyor.speed",
			description: "editor.block-conveyor.speed-description",
		}),
	),
	displayedSpeed: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-conveyor.displayed-speed",
			description: "editor.block-conveyor.displayed-speed-description",
		}),
	),
	pushUnits: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-conveyor.push-units",
			description: "editor.block-conveyor.push-units-description",
		}),
	),
});

export const stackConveyorObjectSchema = v.object({
	texture1: TextureFieldSchema("@-1"),
	texture2: TextureFieldSchema("@-2"),
	texture3: TextureFieldSchema("@-3"),
	edgeTexture: TextureFieldSchema("@-edge"),
	stackTexture: TextureFieldSchema("@-stack"),
	glowAlpha: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-stack-conveyor.glow-alpha",
			description: "editor.block-stack-conveyor.glow-alpha-description",
		}),
	),
	baseEfficiency: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-stack-conveyor.base-efficiency",
			description: "editor.block-stack-conveyor.base-efficiency-description",
		}),
	),
	speed: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-stack-conveyor.speed",
			description: "editor.block-stack-conveyor.speed-description",
		}),
	),
	outputRouter: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-stack-conveyor.output-router",
			description: "editor.block-stack-conveyor.output-router-description",
		}),
	),
	recharge: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-stack-conveyor.recharge",
			description: "editor.block-stack-conveyor.recharge-description",
		}),
	),
});

export const routerObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-router.speed",
			description: "editor.block-router.speed-description",
		}),
	),
});

export const junctionObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 26),
		metadata({
			name: "editor.block-junction.speed",
			description: "editor.block-junction.speed-description",
		}),
	),
	capacity: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-junction.capacity",
			description: "editor.block-junction.capacity-description",
		}),
	),
	displayedSpeed: v.pipe(
		v.optional(v.number(), 13),
		metadata({
			name: "editor.block-junction.displayed-speed",
			description: "editor.block-junction.displayed-speed-description",
		}),
	),
});

export const sorterObjectSchema = v.object({
	crossTexture: TextureFieldSchema("@-cross", "cross-full"),
	invert: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-sorter.invert",
			description: "editor.block-sorter.invert-description",
		}),
	),
});

export const overflowGateObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-overflow-gate.speed",
			description: "editor.block-overflow-gate.speed-description",
		}),
	),
	invert: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-overflow-gate.invert",
			description: "editor.block-overflow-gate.invert-description",
		}),
	),
});

export const itemBridgeObjectSchema = v.object({
	endTexture: TextureFieldSchema("@-end"),
	bridgeTexture: TextureFieldSchema("@-bridge"),
	arrowTexture: TextureFieldSchema("@-arrow"),
	range: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-item-bridge.range",
			description: "editor.block-item-bridge.range-description",
		}),
	),
	transportTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-item-bridge.transport-time",
			description: "editor.block-item-bridge.transport-time-description",
		}),
	),
	fadeIn: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-item-bridge.fade-in",
			description: "editor.block-item-bridge.fade-in-description",
		}),
	),
	moveArrows: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-item-bridge.move-arrows",
			description: "editor.block-item-bridge.move-arrows-description",
		}),
	),
	pulse: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-item-bridge.pulse",
			description: "editor.block-item-bridge.pulse-description",
		}),
	),
	arrowSpacing: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-item-bridge.arrow-spacing",
			description: "editor.block-item-bridge.arrow-spacing-description",
		}),
	),
	arrowOffset: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-item-bridge.arrow-offset",
			description: "editor.block-item-bridge.arrow-offset-description",
		}),
	),
	arrowPeriod: v.pipe(
		v.optional(v.number(), 0.4),
		metadata({
			name: "editor.block-item-bridge.arrow-period",
			description: "editor.block-item-bridge.arrow-period-description",
		}),
	),
	arrowTimeScl: v.pipe(
		v.optional(v.number(), 6.2),
		metadata({
			name: "editor.block-item-bridge.arrow-time-scl",
			description: "editor.block-item-bridge.arrow-time-scl-description",
		}),
	),
	bridgeWidth: v.pipe(
		v.optional(v.number(), 6.5),
		metadata({
			name: "editor.block-item-bridge.bridge-width",
			description: "editor.block-item-bridge.bridge-width-description",
		}),
	),
});

export const bufferedItemBridgeObjectSchema = v.object({
	...itemBridgeObjectSchema.entries,
	speed: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.block-buffered-item-bridge.speed",
			description: "editor.block-buffered-item-bridge.speed-description",
		}),
	),
	bufferCapacity: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.block-buffered-item-bridge.buffer-capacity",
			description: "editor.block-buffered-item-bridge.buffer-capacity-description",
		}),
	),
	displayedSpeed: v.pipe(
		v.optional(v.number(), 11),
		metadata({
			name: "editor.block-buffered-item-bridge.displayed-speed",
			description: "editor.block-buffered-item-bridge.displayed-speed-description",
		}),
	),
});

export const directionBridgeObjectSchema = v.object({
	bridgeTexture: TextureFieldSchema("@-bridge"),
	bridgeBottomTexture: TextureFieldSchema("@-bridge-bottom"),
	bridgeLiquidTexture: TextureFieldSchema("@-bridge-liquid"),
	arrowTexture: TextureFieldSchema("@-arrow"),
	range: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-direction-bridge.range",
			description: "editor.block-direction-bridge.range-description",
		}),
	),
});

export const directionLiquidBridgeObjectSchema = v.object({
	...directionBridgeObjectSchema.entries,
	bottomTexture: TextureFieldSchema("@-bottom"),
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-direction-liquid-bridge.speed",
			description: "editor.block-direction-liquid-bridge.speed-description",
		}),
	),
	liquidPadding: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-direction-liquid-bridge.liquid-padding",
			description: "editor.block-direction-liquid-bridge.liquid-padding-description",
		}),
	),
});

export const ductObjectSchema = v.object({
	topTexture: ArrayTextureSchema("@-top-#", 5),
	bottomTexture: ArrayTextureSchema("@-bottom-#", 5),
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-duct.speed",
			description: "editor.block-duct.speed-description",
		}),
	),
	armored: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-duct.armored",
			description: "editor.block-duct.armored-description",
		}),
	),
});

export const ductRouterObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-duct-router.speed",
			description: "editor.block-duct-router.speed-description",
		}),
	),
});

export const stackRouterObjectSchema = v.object({
	...ductRouterObjectSchema.entries,
	glowTexture: TextureFieldSchema("@-glow", "arrow-glow"),
	baseEfficiency: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-stack-router.base-efficiency",
			description: "editor.block-stack-router.base-efficiency-description",
		}),
	),
	glowAlpha: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-stack-router.glow-alpha",
			description: "editor.block-stack-router.glow-alpha-description",
		}),
	),
});

export const ductJunctionObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	bottomTexture: TextureFieldSchema("@-bottom"),
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-duct-junction.speed",
			description: "editor.block-duct-junction.speed-description",
		}),
	),
});

export const overflowDuctObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-overflow-duct.speed",
			description: "editor.block-overflow-duct.speed-description",
		}),
	),
	invert: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-overflow-duct.invert",
			description: "editor.block-overflow-duct.invert-description",
		}),
	),
});

export const ductBridgeObjectSchema = v.object({
	...directionBridgeObjectSchema.entries,
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-duct-bridge.speed",
			description: "editor.block-duct-bridge.speed-description",
		}),
	),
});

export const massDriverObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-mass-driver.range",
			description: "editor.block-mass-driver.range-description",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-mass-driver.rotate-speed",
			description: "editor.block-mass-driver.rotate-speed-description",
		}),
	),
	translation: v.pipe(
		v.optional(v.number(), 7),
		metadata({
			name: "editor.block-mass-driver.translation",
			description: "editor.block-mass-driver.translation-description",
		}),
	),
	minDistribute: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block-mass-driver.min-distribute",
			description: "editor.block-mass-driver.min-distribute-description",
		}),
	),
	knockback: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-mass-driver.knockback",
			description: "editor.block-mass-driver.knockback-description",
		}),
	),
	reload: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-mass-driver.reload",
			description: "editor.block-mass-driver.reload-description",
		}),
	),
	bulletSpeed: v.pipe(
		v.optional(v.number(), 5.5),
		metadata({
			name: "editor.block-mass-driver.bullet-speed",
			description: "editor.block-mass-driver.bullet-speed-description",
		}),
	),
	bulletLifetime: v.pipe(
		v.optional(v.number(), 200),
		metadata({
			name: "editor.block-mass-driver.bullet-lifetime",
			description: "editor.block-mass-driver.bullet-lifetime-description",
		}),
	),
	shootSoundVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.block-mass-driver.shoot-sound-volume",
			description: "editor.block-mass-driver.shoot-sound-volume-description",
		}),
	),
	shake: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-mass-driver.shake",
			description: "editor.block-mass-driver.shake-description",
		}),
	),
});

export const directionalUnloaderObjectSchema = v.object({
	centerTexture: TextureFieldSchema("@-center", "unloader-center"),
	topTexture: TextureFieldSchema("@-top"),
	arrowTexture: TextureFieldSchema("@-arrow"),
	speed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-directional-unloader.speed",
			description: "editor.block-directional-unloader.speed-description",
		}),
	),
	allowCoreUnload: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-directional-unloader.allow-core-unload",
			description: "editor.block-directional-unloader.allow-core-unload-description",
		}),
	),
});

