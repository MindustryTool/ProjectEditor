import * as v from "valibot";
import { TextureFieldSchema } from "./texture";
import { metadata } from "./utils";
import { AttributeSchema } from "./attributes";

export const powerBlockObjectSchema = v.object({});

export const powerDistributorObjectSchema = v.object({
	...powerBlockObjectSchema.entries,
});

// Power variant schemas
export const powerGeneratorObjectSchema = v.object({
	...powerDistributorObjectSchema.entries,
	powerProduction: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-power-generator.power-production",
			description: "editor.block-power-generator.power-production-description",
		}),
	),
	generationType: v.pipe(
		v.optional(v.string(), "basePowerGeneration"),
		metadata({
			name: "editor.block-power-generator.generation-type",
			description: "editor.block-power-generator.generation-type-description",
		}),
	),
	explosionRadius: v.pipe(
		v.optional(v.number(), 12),
		metadata({
			name: "editor.block-power-generator.explosion-radius",
			description: "editor.block-power-generator.explosion-radius-description",
		}),
	),
	explosionDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-power-generator.explosion-damage",
			description: "editor.block-power-generator.explosion-damage-description",
		}),
	),
	explosionPuddles: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block-power-generator.explosion-puddles",
			description: "editor.block-power-generator.explosion-puddles-description",
		}),
	),
	explosionPuddleRange: v.pipe(
		v.optional(v.number(), 16),
		metadata({
			name: "editor.block-power-generator.explosion-puddle-range",
			description: "editor.block-power-generator.explosion-puddle-range-description",
		}),
	),
	explosionPuddleAmount: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-power-generator.explosion-puddle-amount",
			description: "editor.block-power-generator.explosion-puddle-amount-description",
		}),
	),
	explosionMinWarmup: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-power-generator.explosion-min-warmup",
			description: "editor.block-power-generator.explosion-min-warmup-description",
		}),
	),
	explosionShake: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-power-generator.explosion-shake",
			description: "editor.block-power-generator.explosion-shake-description",
		}),
	),
	explosionShakeDuration: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-power-generator.explosion-shake-duration",
			description: "editor.block-power-generator.explosion-shake-duration-description",
		}),
	),
});

export const consumeGeneratorObjectSchema = v.object({
	...powerGeneratorObjectSchema.entries,
	itemDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-consume-generator.item-duration",
			description: "editor.block-consume-generator.item-duration-description",
		}),
	),
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({
			name: "editor.block-consume-generator.warmup-speed",
			description: "editor.block-consume-generator.warmup-speed-description",
		}),
	),
	effectChance: v.pipe(
		v.optional(v.number(), 0.01),
		metadata({
			name: "editor.block-consume-generator.effect-chance",
			description: "editor.block-consume-generator.effect-chance-description",
		}),
	),
	generateEffectRange: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-consume-generator.generate-effect-range",
			description: "editor.block-consume-generator.generate-effect-range-description",
		}),
	),
	baseLightRadius: v.pipe(
		v.optional(v.number(), 65),
		metadata({
			name: "editor.block-consume-generator.base-light-radius",
			description: "editor.block-consume-generator.base-light-radius-description",
		}),
	),
	explodeOnFull: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-consume-generator.explode-on-full",
			description: "editor.block-consume-generator.explode-on-full-description",
		}),
	),
	itemDurationMultipliers: v.pipe(
		v.optional(v.record(v.string(), v.number())),
		metadata({
			name: "editor.block-consume-generator.item-duration-multipliers",
			description: "editor.block-consume-generator.item-duration-multipliers-description",
		}),
	),
});

export const heaterGeneratorObjectSchema = v.object({
	...powerGeneratorObjectSchema.entries,
	heatOutput: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block-heater-generator.heat-output",
			description: "editor.block-heater-generator.heat-output-description",
		}),
	),
	warmupRate: v.pipe(
		v.optional(v.number(), 0.15),
		metadata({
			name: "editor.block-heater-generator.warmup-rate",
			description: "editor.block-heater-generator.warmup-rate-description",
		}),
	),
});

export const thermalGeneratorObjectSchema = v.object({
	...powerGeneratorObjectSchema.entries,
	effectChance: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({
			name: "editor.block-thermal-generator.effect-chance",
			description: "editor.block-thermal-generator.effect-chance-description",
		}),
	),
	minEfficiency: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-thermal-generator.min-efficiency",
			description: "editor.block-thermal-generator.min-efficiency-description",
		}),
	),
	displayEfficiencyScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-thermal-generator.display-efficiency-scale",
			description: "editor.block-thermal-generator.display-efficiency-scale-description",
		}),
	),
	displayEfficiency: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-thermal-generator.display-efficiency",
			description: "editor.block-thermal-generator.display-efficiency-description",
		}),
	),
	attribute: v.pipe(
		v.optional(AttributeSchema, "heat"),
		metadata({
			name: "editor.block-thermal-generator.attribute",
			description: "editor.block-thermal-generator.attribute-description",
		}),
	),
});

export const nuclearReactorObjectSchema = v.object({
	...powerGeneratorObjectSchema.entries,
	topTexture: TextureFieldSchema("@-top"),
	lightsTexture: TextureFieldSchema("@-lights"),
	itemDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-nuclear-reactor.item-duration",
			description: "editor.block-nuclear-reactor.item-duration-description",
		}),
	),
	heating: v.pipe(
		v.optional(v.number(), 0.01),
		metadata({
			name: "editor.block-nuclear-reactor.heating",
			description: "editor.block-nuclear-reactor.heating-description",
		}),
	),
	heatOutput: v.pipe(
		v.optional(v.number(), 15),
		metadata({
			name: "editor.block-nuclear-reactor.heat-output",
			description: "editor.block-nuclear-reactor.heat-output-description",
		}),
	),
	heatWarmupRate: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-nuclear-reactor.heat-warmup-rate",
			description: "editor.block-nuclear-reactor.heat-warmup-rate-description",
		}),
	),
	ambientCooldownTime: v.pipe(
		v.optional(v.number(), 1200),
		metadata({
			name: "editor.block-nuclear-reactor.ambient-cooldown-time",
			description: "editor.block-nuclear-reactor.ambient-cooldown-time-description",
		}),
	),
	smokeThreshold: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "editor.block-nuclear-reactor.smoke-threshold",
			description: "editor.block-nuclear-reactor.smoke-threshold-description",
		}),
	),
	flashThreshold: v.pipe(
		v.optional(v.number(), 0.46),
		metadata({
			name: "editor.block-nuclear-reactor.flash-threshold",
			description: "editor.block-nuclear-reactor.flash-threshold-description",
		}),
	),
	coolantPower: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.block-nuclear-reactor.coolant-power",
			description: "editor.block-nuclear-reactor.coolant-power-description",
		}),
	),
	fuelItem: v.pipe(
		v.optional(v.string()),
		metadata({
			name: "editor.block-nuclear-reactor.fuel-item",
			description: "editor.block-nuclear-reactor.fuel-item-description",
		}),
	),
});

export const impactReactorObjectSchema = v.object({
	...powerGeneratorObjectSchema.entries,
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.001),
		metadata({
			name: "editor.block-impact-reactor.warmup-speed",
			description: "editor.block-impact-reactor.warmup-speed-description",
		}),
	),
	itemDuration: v.pipe(
		v.optional(v.number(), 60),
		metadata({
			name: "editor.block-impact-reactor.item-duration",
			description: "editor.block-impact-reactor.item-duration-description",
		}),
	),
});

export const variableReactorObjectSchema = v.object({
	lightsTexture: TextureFieldSchema("@-lights"),
	...powerGeneratorObjectSchema.entries,
	maxHeat: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-variable-reactor.max-heat",
			description: "editor.block-variable-reactor.max-heat-description",
		}),
	),
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.block-variable-reactor.warmup-speed",
			description: "editor.block-variable-reactor.warmup-speed-description",
		}),
	),
	unstableSpeed: v.pipe(
		v.optional(v.number(), 1 / 180),
		metadata({
			name: "editor.block-variable-reactor.unstable-speed",
			description: "editor.block-variable-reactor.unstable-speed-description",
		}),
	),
	effectChance: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({
			name: "editor.block-variable-reactor.effect-chance",
			description: "editor.block-variable-reactor.effect-chance-description",
		}),
	),
	flashThreshold: v.pipe(
		v.optional(v.number(), 0.01),
		metadata({
			name: "editor.block-variable-reactor.flash-threshold",
			description: "editor.block-variable-reactor.flash-threshold-description",
		}),
	),
	flashAlpha: v.pipe(
		v.optional(v.number(), 0.4),
		metadata({
			name: "editor.block-variable-reactor.flash-alpha",
			description: "editor.block-variable-reactor.flash-alpha-description",
		}),
	),
	flashSpeed: v.pipe(
		v.optional(v.number(), 7),
		metadata({
			name: "editor.block-variable-reactor.flash-speed",
			description: "editor.block-variable-reactor.flash-speed-description",
		}),
	),
});

export const lightBlockObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	brightness: v.pipe(
		v.optional(v.number(), 0.9),
		metadata({
			name: "editor.block-light-block.brightness",
			description: "editor.block-light-block.brightness-description",
		}),
	),
	radius: v.pipe(
		v.optional(v.number(), 200),
		metadata({
			name: "editor.block-light-block.radius",
			description: "editor.block-light-block.radius-description",
		}),
	),
});

export const powerNodeObjectSchema = v.object({
	...powerBlockObjectSchema.entries,
	"@-laser": TextureFieldSchema("laser"),
	"@-laser-end": TextureFieldSchema("laser-end"),
	laserRange: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-power-node.laser-range",
			description: "editor.block-power-node.laser-range-description",
		}),
	),
	maxNodes: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-power-node.max-nodes",
			description: "editor.block-power-node.max-nodes-description",
		}),
	),
	autolink: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-power-node.autolink",
			description: "editor.block-power-node.autolink-description",
		}),
	),
	drawRange: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-power-node.draw-range",
			description: "editor.block-power-node.draw-range-description",
		}),
	),
	sameBlockConnection: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-power-node.same-block-connection",
			description: "editor.block-power-node.same-block-connection-description",
		}),
	),
	laserScale: v.pipe(
		v.optional(v.number(), 0.25),
		metadata({
			name: "editor.block-power-node.laser-scale",
			description: "editor.block-power-node.laser-scale-description",
		}),
	),
});

export const longPowerNodeObjectSchema = v.object({
	glowTexture: TextureFieldSchema("@-glow"),
	...powerNodeObjectSchema.entries,
	glowScl: v.pipe(
		v.optional(v.number(), 16),
		metadata({
			name: "editor.block-long-power-node.glow-scl",
			description: "editor.block-long-power-node.glow-scl-description",
		}),
	),
	glowMag: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.block-long-power-node.glow-mag",
			description: "editor.block-long-power-node.glow-mag-description",
		}),
	),
});

export const beamNodeObjectSchema = v.object({
	beamTexture: TextureFieldSchema("@-beam", "power-beam"),
	beamEndTexture: TextureFieldSchema("@-beam-end", "power-beam-end"),
	...powerBlockObjectSchema.entries,
	range: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-beam-node.range",
			description: "editor.block-beam-node.range-description",
		}),
	),
	pulseScl: v.pipe(
		v.optional(v.number(), 7),
		metadata({
			name: "editor.block-beam-node.pulse-scl",
			description: "editor.block-beam-node.pulse-scl-description",
		}),
	),
	pulseMag: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({
			name: "editor.block-beam-node.pulse-mag",
			description: "editor.block-beam-node.pulse-mag-description",
		}),
	),
	laserWidth: v.pipe(
		v.optional(v.number(), 0.4),
		metadata({
			name: "editor.block-beam-node.laser-width",
			description: "editor.block-beam-node.laser-width-description",
		}),
	),
});

export const powerSourceObjectSchema = v.object({
	...powerBlockObjectSchema.entries,
	powerProduction: v.pipe(
		v.optional(v.number(), 10000),
		metadata({
			name: "editor.block-power-source.power-production",
			description: "editor.block-power-source.power-production-description",
		}),
	),
});
