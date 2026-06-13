import * as v from "valibot"
import { TextureFieldSchema } from "./texture"
import { metadata } from "./utils"
import { MindustryHexColorSchema } from "./mindustry-hex-color"

// Defense variant schemas

export const wallObjectSchema = v.object({
	lightningChance: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block-wall.lightning-chance",
			description: "editor.block-wall.lightning-chance-description",
		}),
	),
	lightningDamage: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.block-wall.lightning-damage",
			description: "editor.block-wall.lightning-damage-description",
		}),
	),
	lightningLength: v.pipe(
		v.optional(v.number(), 17),
		metadata({
			name: "editor.block-wall.lightning-length",
			description: "editor.block-wall.lightning-length-description",
		}),
	),
	chanceDeflect: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block-wall.chance-deflect",
			description: "editor.block-wall.chance-deflect-description",
		}),
	),
	flashHit: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-wall.flash-hit",
			description: "editor.block-wall.flash-hit-description",
		}),
	),
});

export const staticWallObjectSchema = v.object({
	largeTexture: TextureFieldSchema("@-large"),
	autotile: v.optional(v.boolean(), false),
	autotileMidVariants: v.optional(v.pipe(v.number(), v.integer()), 1),
});

export const coloredWallObjectSchema = v.object({
	color: v.pipe(
		MindustryHexColorSchema,
		metadata({
			name: "editor.block-wall.color",
			description: "editor.block-wall.color-description",
		}),
	),
});

export const shieldWallObjectSchema = v.object({
	...wallObjectSchema.entries,
	glowTexture: TextureFieldSchema("@-glow"),
	shieldHealth: v.pipe(
		v.optional(v.number(), 900),
		metadata({
			name: "editor.block-shield-wall.shield-health",
			description: "editor.block-shield-wall.shield-health-description",
		}),
	),
	breakCooldown: v.pipe(
		v.optional(v.number(), 600),
		metadata({
			name: "editor.block-shield-wall.break-cooldown",
			description: "editor.block-shield-wall.break-cooldown-description",
		}),
	),
	regenSpeed: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-shield-wall.regen-speed",
			description: "editor.block-shield-wall.regen-speed-description",
		}),
	),
	glowMag: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.block-shield-wall.glow-mag",
			description: "editor.block-shield-wall.glow-mag-description",
		}),
	),
	glowScl: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-shield-wall.glow-scl",
			description: "editor.block-shield-wall.glow-scl-description",
		}),
	),
});

export const doorObjectSchema = v.object({
	openTexture: TextureFieldSchema("@-open"),
	...wallObjectSchema.entries,
	chainEffect: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-door.chain-effect",
			description: "editor.block-door.chain-effect-description",
		}),
	),
});

export const autoDoorObjectSchema = v.object({
	...wallObjectSchema.entries,
	openTexture: TextureFieldSchema("@-open"),
	checkInterval: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.block-auto-door.check-interval",
			description: "editor.block-auto-door.check-interval-description",
		}),
	),
	triggerMargin: v.pipe(
		v.optional(v.number(), 12),
		metadata({
			name: "editor.block-auto-door.trigger-margin",
			description: "editor.block-auto-door.trigger-margin-description",
		}),
	),
});

export const shockwaveTowerObjectSchema = v.object({
	heatTexture: TextureFieldSchema("@-heat"),
	range: v.pipe(
		v.optional(v.number(), 110),
		metadata({
			name: "editor.block-shockwave-tower.range",
			description: "editor.block-shockwave-tower.range-description",
		}),
	),
	reload: v.pipe(
		v.optional(v.number(), 90),
		metadata({
			name: "editor.block-shockwave-tower.reload",
			description: "editor.block-shockwave-tower.reload-description",
		}),
	),
	bulletDamage: v.pipe(
		v.optional(v.number(), 160),
		metadata({
			name: "editor.block-shockwave-tower.bullet-damage",
			description: "editor.block-shockwave-tower.bullet-damage-description",
		}),
	),
	falloffCount: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.block-shockwave-tower.falloff-count",
			description: "editor.block-shockwave-tower.falloff-count-description",
		}),
	),
	shake: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-shockwave-tower.shake",
			description: "editor.block-shockwave-tower.shake-description",
		}),
	),
	checkInterval: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-shockwave-tower.check-interval",
			description: "editor.block-shockwave-tower.check-interval-description",
		}),
	),
	cooldownMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-shockwave-tower.cooldown-multiplier",
			description: "editor.block-shockwave-tower.cooldown-multiplier-description",
		}),
	),
	shapeRotateSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-shockwave-tower.shape-rotate-speed",
			description: "editor.block-shockwave-tower.shape-rotate-speed-description",
		}),
	),
	shapeRadius: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-shockwave-tower.shape-radius",
			description: "editor.block-shockwave-tower.shape-radius-description",
		}),
	),
	shapeSides: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-shockwave-tower.shape-sides",
			description: "editor.block-shockwave-tower.shape-sides-description",
		}),
	),
});

export const shockMineObjectSchema = v.object({
	teamTopTexture: TextureFieldSchema("@-team-top"),
	cooldown: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-shock-mine.cooldown",
			description: "editor.block-shock-mine.cooldown-description",
		}),
	),
	tileDamage: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-shock-mine.tile-damage",
			description: "editor.block-shock-mine.tile-damage-description",
		}),
	),
	damage: v.pipe(
		v.optional(v.number(), 13),
		metadata({
			name: "editor.block-shock-mine.damage",
			description: "editor.block-shock-mine.damage-description",
		}),
	),
	length: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block-shock-mine.length",
			description: "editor.block-shock-mine.length-description",
		}),
	),
	tendrils: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-shock-mine.tendrils",
			description: "editor.block-shock-mine.tendrils-description",
		}),
	),
	shots: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-shock-mine.shots",
			description: "editor.block-shock-mine.shots-description",
		}),
	),
	inaccuracy: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-shock-mine.inaccuracy",
			description: "editor.block-shock-mine.inaccuracy-description",
		}),
	),
	teamAlpha: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "editor.block-shock-mine.team-alpha",
			description: "editor.block-shock-mine.team-alpha-description",
		}),
	),
});

export const regenProjectorObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 14),
		metadata({
			name: "editor.block-regen-projector.range",
			description: "editor.block-regen-projector.range-description",
		}),
	),
	healPercent: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({
			name: "editor.block-regen-projector.heal-percent",
			description: "editor.block-regen-projector.heal-percent-description",
		}),
	),
	optionalMultiplier: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-regen-projector.optional-multiplier",
			description: "editor.block-regen-projector.optional-multiplier-description",
		}),
	),
	optionalUseTime: v.pipe(
		v.optional(v.number(), 480),
		metadata({
			name: "editor.block-regen-projector.optional-use-time",
			description: "editor.block-regen-projector.optional-use-time-description",
		}),
	),
	effectChance: v.pipe(
		v.optional(v.number(), 0.003),
		metadata({
			name: "editor.block-regen-projector.effect-chance",
			description: "editor.block-regen-projector.effect-chance-description",
		}),
	),
});

export const radarObjectSchema = v.object({
	baseTexture: TextureFieldSchema("@-base"),
	glowTexture: TextureFieldSchema("@-glow"),
	discoveryTime: v.pipe(
		v.optional(v.number(), 600),
		metadata({
			name: "editor.block-radar.discovery-time",
			description: "editor.block-radar.discovery-time-description",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-radar.rotate-speed",
			description: "editor.block-radar.rotate-speed-description",
		}),
	),
	glowScl: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-radar.glow-scl",
			description: "editor.block-radar.glow-scl-description",
		}),
	),
	glowMag: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.block-radar.glow-mag",
			description: "editor.block-radar.glow-mag-description",
		}),
	),
});

export const overdriveProjectorObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	reload: v.pipe(
		v.optional(v.number(), 60),
		metadata({
			name: "editor.block-overdrive-projector.reload",
			description: "editor.block-overdrive-projector.reload-description",
		}),
	),
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-overdrive-projector.range",
			description: "editor.block-overdrive-projector.range-description",
		}),
	),
	speedBoost: v.pipe(
		v.optional(v.number(), 1.5),
		metadata({
			name: "editor.block-overdrive-projector.speed-boost",
			description: "editor.block-overdrive-projector.speed-boost-description",
		}),
	),
	speedBoostPhase: v.pipe(
		v.optional(v.number(), 0.75),
		metadata({
			name: "editor.block-overdrive-projector.speed-boost-phase",
			description: "editor.block-overdrive-projector.speed-boost-phase-description",
		}),
	),
	useTime: v.pipe(
		v.optional(v.number(), 400),
		metadata({
			name: "editor.block-overdrive-projector.use-time",
			description: "editor.block-overdrive-projector.use-time-description",
		}),
	),
	phaseRangeBoost: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.block-overdrive-projector.phase-range-boost",
			description: "editor.block-overdrive-projector.phase-range-boost-description",
		}),
	),
	hasBoost: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-overdrive-projector.has-boost",
			description: "editor.block-overdrive-projector.has-boost-description",
		}),
	),
});

export const mendProjectorObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	reload: v.pipe(
		v.optional(v.number(), 250),
		metadata({
			name: "editor.block-mend-projector.reload",
			description: "editor.block-mend-projector.reload-description",
		}),
	),
	range: v.pipe(
		v.optional(v.number(), 60),
		metadata({
			name: "editor.block-mend-projector.range",
			description: "editor.block-mend-projector.range-description",
		}),
	),
	healPercent: v.pipe(
		v.optional(v.number(), 12),
		metadata({
			name: "editor.block-mend-projector.heal-percent",
			description: "editor.block-mend-projector.heal-percent-description",
		}),
	),
	phaseBoost: v.pipe(
		v.optional(v.number(), 12),
		metadata({
			name: "editor.block-mend-projector.phase-boost",
			description: "editor.block-mend-projector.phase-boost-description",
		}),
	),
	phaseRangeBoost: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.block-mend-projector.phase-range-boost",
			description: "editor.block-mend-projector.phase-range-boost-description",
		}),
	),
	useTime: v.pipe(
		v.optional(v.number(), 400),
		metadata({
			name: "editor.block-mend-projector.use-time",
			description: "editor.block-mend-projector.use-time-description",
		}),
	),
	mendSoundVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.block-mend-projector.mend-sound-volume",
			description: "editor.block-mend-projector.mend-sound-volume-description",
		}),
	),
});

export const forceProjectorObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	phaseUseTime: v.pipe(
		v.optional(v.number(), 350),
		metadata({
			name: "editor.block-force-projector.phase-use-time",
			description: "editor.block-force-projector.phase-use-time-description",
		}),
	),
	phaseRadiusBoost: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-force-projector.phase-radius-boost",
			description: "editor.block-force-projector.phase-radius-boost-description",
		}),
	),
	phaseShieldBoost: v.pipe(
		v.optional(v.number(), 400),
		metadata({
			name: "editor.block-force-projector.phase-shield-boost",
			description: "editor.block-force-projector.phase-shield-boost-description",
		}),
	),
	radius: v.pipe(
		v.optional(v.number(), 101.7),
		metadata({
			name: "editor.block-force-projector.radius",
			description: "editor.block-force-projector.radius-description",
		}),
	),
	sides: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-force-projector.sides",
			description: "editor.block-force-projector.sides-description",
		}),
	),
	shieldRotation: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-force-projector.shield-rotation",
			description: "editor.block-force-projector.shield-rotation-description",
		}),
	),
	shieldHealth: v.pipe(
		v.optional(v.number(), 700),
		metadata({
			name: "editor.block-force-projector.shield-health",
			description: "editor.block-force-projector.shield-health-description",
		}),
	),
	cooldownNormal: v.pipe(
		v.optional(v.number(), 1.75),
		metadata({
			name: "editor.block-force-projector.cooldown-normal",
			description: "editor.block-force-projector.cooldown-normal-description",
		}),
	),
	cooldownLiquid: v.pipe(
		v.optional(v.number(), 1.5),
		metadata({
			name: "editor.block-force-projector.cooldown-liquid",
			description: "editor.block-force-projector.cooldown-liquid-description",
		}),
	),
	cooldownBrokenBase: v.pipe(
		v.optional(v.number(), 0.35),
		metadata({
			name: "editor.block-force-projector.cooldown-broken-base",
			description: "editor.block-force-projector.cooldown-broken-base-description",
		}),
	),
	coolantConsumption: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.block-force-projector.coolant-consumption",
			description: "editor.block-force-projector.coolant-consumption-description",
		}),
	),
	consumeCoolant: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-force-projector.consume-coolant",
			description: "editor.block-force-projector.consume-coolant-description",
		}),
	),
	crashDamageMultiplier: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-force-projector.crash-damage-multiplier",
			description: "editor.block-force-projector.crash-damage-multiplier-description",
		}),
	),
	hitSoundVolume: v.pipe(
		v.optional(v.number(), 0.12),
		metadata({
			name: "editor.block-force-projector.hit-sound-volume",
			description: "editor.block-force-projector.hit-sound-volume-description",
		}),
	),
});

export const directionalForceProjectorObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	width: v.pipe(
		v.optional(v.number(), 30),
		metadata({
			name: "editor.block-directional-force-projector.width",
			description: "editor.block-directional-force-projector.width-description",
		}),
	),
	shieldHealth: v.pipe(
		v.optional(v.number(), 3000),
		metadata({
			name: "editor.block-directional-force-projector.shield-health",
			description: "editor.block-directional-force-projector.shield-health-description",
		}),
	),
	cooldownNormal: v.pipe(
		v.optional(v.number(), 1.75),
		metadata({
			name: "editor.block-directional-force-projector.cooldown-normal",
			description: "editor.block-directional-force-projector.cooldown-normal-description",
		}),
	),
	cooldownLiquid: v.pipe(
		v.optional(v.number(), 1.5),
		metadata({
			name: "editor.block-directional-force-projector.cooldown-liquid",
			description: "editor.block-directional-force-projector.cooldown-liquid-description",
		}),
	),
	cooldownBrokenBase: v.pipe(
		v.optional(v.number(), 0.35),
		metadata({
			name: "editor.block-directional-force-projector.cooldown-broken-base",
			description: "editor.block-directional-force-projector.cooldown-broken-base-description",
		}),
	),
	length: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.block-directional-force-projector.length",
			description: "editor.block-directional-force-projector.length-description",
		}),
	),
	padSize: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.block-directional-force-projector.pad-size",
			description: "editor.block-directional-force-projector.pad-size-description",
		}),
	),
});

export const baseShieldObjectSchema = v.object({
	radius: v.pipe(
		v.optional(v.number(), 200),
		metadata({
			name: "editor.block-base-shield.radius",
			description: "editor.block-base-shield.radius-description",
		}),
	),
	sides: v.pipe(
		v.optional(v.number(), 24),
		metadata({
			name: "editor.block-base-shield.sides",
			description: "editor.block-base-shield.sides-description",
		}),
	),
});

