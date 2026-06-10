import * as v from "valibot"
import { TextureFieldSchema } from "./texture"
import { metadata } from "./utils"
import { ItemStackSchema } from "./item-stack"
import { LiquidStackSchema } from "./liquid-stack"
import type { ProjectContents } from "@project/types"

// Production variant schemas
export const genericCrafterObjectSchema = (context: ProjectContents) =>
	v.object({
		outputItem: v.pipe(
			v.optional(ItemStackSchema(context)),
			metadata({
				name: "editor.block-generic-crafter.output-item",
				description: "editor.block-generic-crafter.output-item-description",
			}),
		),
		outputItems: v.pipe(
			v.optional(v.array(ItemStackSchema(context))),
			metadata({
				name: "editor.block-generic-crafter.output-items",
				description: "editor.block-generic-crafter.output-items-description",
			}),
		),
		outputLiquid: v.pipe(
			v.optional(LiquidStackSchema(context)),
			metadata({
				name: "editor.block-generic-crafter.output-liquid",
				description: "editor.block-generic-crafter.output-liquid-description",
			}),
		),
		outputLiquids: v.pipe(
			v.optional(v.array(LiquidStackSchema(context))),
			metadata({
				name: "editor.block-generic-crafter.output-liquids",
				description: "editor.block-generic-crafter.output-liquids-description",
			}),
		),
		liquidOutputDirections: v.pipe(
			v.optional(v.array(v.number()), [-1]),
			metadata({
				name: "editor.block-generic-crafter.liquid-output-directions",
				description: "editor.block-generic-crafter.liquid-output-directions-description",
			}),
		),
		dumpExtraLiquid: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-generic-crafter.dump-extra-liquid",
				description: "editor.block-generic-crafter.dump-extra-liquid-description",
			}),
		),
		ignoreLiquidFullness: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-generic-crafter.ignore-liquid-fullness",
				description: "editor.block-generic-crafter.ignore-liquid-fullness-description",
			}),
		),
		craftTime: v.pipe(
			v.optional(v.number(), 80),
			metadata({
				name: "editor.block-generic-crafter.craft-time",
				description: "editor.block-generic-crafter.craft-time-description",
			}),
		),
		updateEffectChance: v.pipe(
			v.optional(v.number(), 0.04),
			metadata({
				name: "editor.block-generic-crafter.update-effect-chance",
				description: "editor.block-generic-crafter.update-effect-chance-description",
			}),
		),
		updateEffectSpread: v.pipe(
			v.optional(v.number(), 4),
			metadata({
				name: "editor.block-generic-crafter.update-effect-spread",
				description: "editor.block-generic-crafter.update-effect-spread-description",
			}),
		),
		warmupSpeed: v.pipe(
			v.optional(v.number(), 0.019),
			metadata({
				name: "editor.block-generic-crafter.warmup-speed",
				description: "editor.block-generic-crafter.warmup-speed-description",
			}),
		),
	});

export const heatCrafterObjectSchema = (context: ProjectContents) =>
	v.object({
		...genericCrafterObjectSchema(context).entries,
		heatRequirement: v.pipe(
			v.optional(v.number(), 10),
			metadata({
				name: "editor.block-heat-crafter.heat-requirement",
				description: "editor.block-heat-crafter.heat-requirement-description",
			}),
		),
		overheatScale: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-heat-crafter.overheat-scale",
				description: "editor.block-heat-crafter.overheat-scale-description",
			}),
		),
		maxEfficiency: v.pipe(
			v.optional(v.number(), 4),
			metadata({
				name: "editor.block-heat-crafter.max-efficiency",
				description: "editor.block-heat-crafter.max-efficiency-description",
			}),
		),
	});

export const attributeCrafterObjectSchema = (context: ProjectContents) =>
	v.object({
		...genericCrafterObjectSchema(context).entries,
		attribute: v.pipe(
			v.optional(v.string(), "heat"),
			metadata({
				name: "editor.block-attribute-crafter.attribute",
				description: "editor.block-attribute-crafter.attribute-description",
			}),
		),
		baseEfficiency: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-attribute-crafter.base-efficiency",
				description: "editor.block-attribute-crafter.base-efficiency-description",
			}),
		),
		boostScale: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-attribute-crafter.boost-scale",
				description: "editor.block-attribute-crafter.boost-scale-description",
			}),
		),
		maxBoost: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-attribute-crafter.max-boost",
				description: "editor.block-attribute-crafter.max-boost-description",
			}),
		),
		minEfficiency: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-attribute-crafter.min-efficiency",
				description: "editor.block-attribute-crafter.min-efficiency-description",
			}),
		),
		displayEfficiencyScale: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-attribute-crafter.display-efficiency-scale",
				description: "editor.block-attribute-crafter.display-efficiency-scale-description",
			}),
		),
		displayEfficiency: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-attribute-crafter.display-efficiency",
				description: "editor.block-attribute-crafter.display-efficiency-description",
			}),
		),
		scaleLiquidConsumption: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-attribute-crafter.scale-liquid-consumption",
				description: "editor.block-attribute-crafter.scale-liquid-consumption-description",
			}),
		),
	});

export const separatorObjectSchema = (context: ProjectContents) =>
	v.object({
		results: v.pipe(
			v.optional(v.array(ItemStackSchema(context))),
			metadata({
				name: "editor.block-separator.results",
				description: "editor.block-separator.results-description",
			}),
		),
		craftTime: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-separator.craft-time",
				description: "editor.block-separator.craft-time-description",
			}),
		),
	});

export const drillObjectSchema = v.object({
	rimTexture: TextureFieldSchema("@-rim"),
	rotatorRegion: TextureFieldSchema("@-rotator"),
	topRegion: TextureFieldSchema("@-top"),
	bottomRegion: TextureFieldSchema("@-bottom"),
	itemRegion: TextureFieldSchema("@-item", "drill-item-@size"),
	tier: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-drill.tier",
			description: "editor.block-drill.tier-description",
		}),
	),
	drillTime: v.pipe(
		v.optional(v.number(), 300),
		metadata({
			name: "editor.block-drill.drill-time",
			description: "editor.block-drill.drill-time-description",
		}),
	),
	hardnessDrillMultiplier: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.block-drill.hardness-drill-multiplier",
			description: "editor.block-drill.hardness-drill-multiplier-description",
		}),
	),
	liquidBoostIntensity: v.pipe(
		v.optional(v.number(), 1.6),
		metadata({
			name: "editor.block-drill.liquid-boost-intensity",
			description: "editor.block-drill.liquid-boost-intensity-description",
		}),
	),
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.015),
		metadata({
			name: "editor.block-drill.warmup-speed",
			description: "editor.block-drill.warmup-speed-description",
		}),
	),
	blockedItem: v.pipe(
		v.optional(v.string()),
		metadata({
			name: "editor.block-drill.blocked-item",
			description: "editor.block-drill.blocked-item-description",
		}),
	),
	blockedItems: v.pipe(
		v.optional(v.array(v.string())),
		metadata({
			name: "editor.block-drill.blocked-items",
			description: "editor.block-drill.blocked-items-description",
		}),
	),
	drawMineItem: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-drill.draw-mine-item",
			description: "editor.block-drill.draw-mine-item-description",
		}),
	),
	drillEffectRnd: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block-drill.drill-effect-rnd",
			description: "editor.block-drill.drill-effect-rnd-description",
		}),
	),
	drillEffectChance: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({
			name: "editor.block-drill.drill-effect-chance",
			description: "editor.block-drill.drill-effect-chance-description",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-drill.rotate-speed",
			description: "editor.block-drill.rotate-speed-description",
		}),
	),
	updateEffectChance: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({
			name: "editor.block-drill.update-effect-chance",
			description: "editor.block-drill.update-effect-chance-description",
		}),
	),
	drillMultipliers: v.pipe(
		v.optional(v.record(v.string(), v.number())),
		metadata({
			name: "editor.block-drill.drill-multipliers",
			description: "editor.block-drill.drill-multipliers-description",
		}),
	),
	drawRim: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-drill.draw-rim",
			description: "editor.block-drill.draw-rim-description",
		}),
	),
	drawSpinSprite: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-drill.draw-spin-sprite",
			description: "editor.block-drill.draw-spin-sprite-description",
		}),
	),
});

export const burstDrillObjectSchema = v.object({
	...drillObjectSchema.entries,
	topInvertTexture: TextureFieldSchema("@-top-invert"),
	glowTexture: TextureFieldSchema("@-glow"),
	arrowTexture: TextureFieldSchema("@-arrow"),
	arrowBlurTexture: TextureFieldSchema("@-arrow-blur"),
	shake: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-burst-drill.shake",
			description: "editor.block-burst-drill.shake-description",
		}),
	),
	invertedTime: v.pipe(
		v.optional(v.number(), 200),
		metadata({
			name: "editor.block-burst-drill.inverted-time",
			description: "editor.block-burst-drill.inverted-time-description",
		}),
	),
	arrowSpacing: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-burst-drill.arrow-spacing",
			description: "editor.block-burst-drill.arrow-spacing-description",
		}),
	),
	arrowOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-burst-drill.arrow-offset",
			description: "editor.block-burst-drill.arrow-offset-description",
		}),
	),
	arrows: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-burst-drill.arrows",
			description: "editor.block-burst-drill.arrows-description",
		}),
	),
	drillSoundVolume: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.block-burst-drill.drill-sound-volume",
			description: "editor.block-burst-drill.drill-sound-volume-description",
		}),
	),
	drillSoundPitchRand: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.block-burst-drill.drill-sound-pitch-rand",
			description: "editor.block-burst-drill.drill-sound-pitch-rand-description",
		}),
	),
});

export const beamDrillObjectSchema = v.object({
	beamTexture: TextureFieldSchema("@-beam", "drill-laser"),
	beamEndTexture: TextureFieldSchema("@-beam-end", "drill-laser-end"),
	beamCenterTexture: TextureFieldSchema("@-beam-center", "drill-laser-center"),
	beamBoostTexture: TextureFieldSchema("@-beam-boost", "drill-laser-boost"),
	beamBoostEndTexture: TextureFieldSchema("@-beam-boost-end", "drill-laser-boost-end"),
	beamBoostCenterTexture: TextureFieldSchema("@-beam-boost-center", "drill-laser-boost-center"),
	topTexture: TextureFieldSchema("@-top"),
	glowTexture: TextureFieldSchema("@-glow"),
	drillTime: v.pipe(
		v.optional(v.number(), 200),
		metadata({
			name: "editor.block-beam-drill.drill-time",
			description: "editor.block-beam-drill.drill-time-description",
		}),
	),
	range: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-beam-drill.range",
			description: "editor.block-beam-drill.range-description",
		}),
	),
	tier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-beam-drill.tier",
			description: "editor.block-beam-drill.tier-description",
		}),
	),
	laserWidth: v.pipe(
		v.optional(v.number(), 0.65),
		metadata({
			name: "editor.block-beam-drill.laser-width",
			description: "editor.block-beam-drill.laser-width-description",
		}),
	),
	optionalBoostIntensity: v.pipe(
		v.optional(v.number(), 2.5),
		metadata({
			name: "editor.block-beam-drill.optional-boost-intensity",
			description: "editor.block-beam-drill.optional-boost-intensity-description",
		}),
	),
	drillMultipliers: v.pipe(
		v.optional(v.record(v.string(), v.number())),
		metadata({
			name: "editor.block-beam-drill.drill-multipliers",
			description: "editor.block-beam-drill.drill-multipliers-description",
		}),
	),
	blockedItem: v.pipe(
		v.optional(v.string()),
		metadata({
			name: "editor.block-beam-drill.blocked-item",
			description: "editor.block-beam-drill.blocked-item-description",
		}),
	),
	blockedItems: v.pipe(
		v.optional(v.array(v.string())),
		metadata({
			name: "editor.block-beam-drill.blocked-items",
			description: "editor.block-beam-drill.blocked-items-description",
		}),
	),
	glowIntensity: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({
			name: "editor.block-beam-drill.glow-intensity",
			description: "editor.block-beam-drill.glow-intensity-description",
		}),
	),
	pulseIntensity: v.pipe(
		v.optional(v.number(), 0.07),
		metadata({
			name: "editor.block-beam-drill.pulse-intensity",
			description: "editor.block-beam-drill.pulse-intensity-description",
		}),
	),
	glowScl: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-beam-drill.glow-scl",
			description: "editor.block-beam-drill.glow-scl-description",
		}),
	),
	sparks: v.pipe(
		v.optional(v.number(), 7),
		metadata({
			name: "editor.block-beam-drill.sparks",
			description: "editor.block-beam-drill.sparks-description",
		}),
	),
	sparkRange: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block-beam-drill.spark-range",
			description: "editor.block-beam-drill.spark-range-description",
		}),
	),
	sparkLife: v.pipe(
		v.optional(v.number(), 27),
		metadata({
			name: "editor.block-beam-drill.spark-life",
			description: "editor.block-beam-drill.spark-life-description",
		}),
	),
	sparkRecurrence: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-beam-drill.spark-recurrence",
			description: "editor.block-beam-drill.spark-recurrence-description",
		}),
	),
	sparkSpread: v.pipe(
		v.optional(v.number(), 45),
		metadata({
			name: "editor.block-beam-drill.spark-spread",
			description: "editor.block-beam-drill.spark-spread-description",
		}),
	),
	sparkSize: v.pipe(
		v.optional(v.number(), 3.5),
		metadata({
			name: "editor.block-beam-drill.spark-size",
			description: "editor.block-beam-drill.spark-size-description",
		}),
	),
	heatPulse: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "editor.block-beam-drill.heat-pulse",
			description: "editor.block-beam-drill.heat-pulse-description",
		}),
	),
	heatPulseScl: v.pipe(
		v.optional(v.number(), 7),
		metadata({
			name: "editor.block-beam-drill.heat-pulse-scl",
			description: "editor.block-beam-drill.heat-pulse-scl-description",
		}),
	),
});

export const wallCrafterObjectSchema = v.object({
	topRegion: TextureFieldSchema("@-top"),
	rotatorBottomRegion: TextureFieldSchema("@-rotator-bottom"),
	rotatorRegion: TextureFieldSchema("@-rotator"),
	drillTime: v.pipe(
		v.optional(v.number(), 150),
		metadata({
			name: "editor.block-wall-crafter.drill-time",
			description: "editor.block-wall-crafter.drill-time-description",
		}),
	),
	liquidBoostIntensity: v.pipe(
		v.optional(v.number(), 1.6),
		metadata({
			name: "editor.block-wall-crafter.liquid-boost-intensity",
			description: "editor.block-wall-crafter.liquid-boost-intensity-description",
		}),
	),
	updateEffectChance: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({
			name: "editor.block-wall-crafter.update-effect-chance",
			description: "editor.block-wall-crafter.update-effect-chance-description",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-wall-crafter.rotate-speed",
			description: "editor.block-wall-crafter.rotate-speed-description",
		}),
	),
	attribute: v.pipe(
		v.optional(v.string(), "sand"),
		metadata({
			name: "editor.block-wall-crafter.attribute",
			description: "editor.block-wall-crafter.attribute-description",
		}),
	),
	output: v.pipe(
		v.optional(v.string(), "sand"),
		metadata({
			name: "editor.block-wall-crafter.output",
			description: "editor.block-wall-crafter.output-description",
		}),
	),
	boostItemUseTime: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-wall-crafter.boost-item-use-time",
			description: "editor.block-wall-crafter.boost-item-use-time-description",
		}),
	),
	itemBoostIntensity: v.pipe(
		v.optional(v.number(), 1.6),
		metadata({
			name: "editor.block-wall-crafter.item-boost-intensity",
			description: "editor.block-wall-crafter.item-boost-intensity-description",
		}),
	),
	hasLiquidBooster: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-wall-crafter.has-liquid-booster",
			description: "editor.block-wall-crafter.has-liquid-booster-description",
		}),
	),
});

export const itemIncineratorObjectSchema = v.object({
	liquidRegion: TextureFieldSchema("@-liquid"),
	topRegion: TextureFieldSchema("@-top"),
	effectChance: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({
			name: "editor.block-item-incinerator.effect-chance",
			description: "editor.block-item-incinerator.effect-chance-description",
		}),
	),
});

export const heatProducerObjectSchema = (context: ProjectContents) =>
	v.object({
		...genericCrafterObjectSchema(context).entries,
		heatOutput: v.pipe(
			v.optional(v.number(), 10),
			metadata({
				name: "editor.block-heat-producer.heat-output",
				description: "editor.block-heat-producer.heat-output-description",
			}),
		),
		warmupRate: v.pipe(
			v.optional(v.number(), 0.15),
			metadata({
				name: "editor.block-heat-producer.warmup-rate",
				description: "editor.block-heat-producer.warmup-rate-description",
			}),
		),
	});
