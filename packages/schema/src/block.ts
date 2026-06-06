import * as v from "valibot";
import {
	CachedSchema,
	EnvSchema,
	Envs,
	ItemRequirementSchema,
	MindustryHexColorSchema,
	ResearchSchema,
	SoundHjsonSchema,
	type SchemaFn,
} from "./base";
import { EffectFieldSchema } from "./effect";
import { ItemFieldSchema } from "./item";
import { LiquidFieldSchema } from "./liquid";
import { BulletHjsonSchema } from "./bullet";
import { AttributesSchema } from "./attributes";
import { CacheLayerSchema } from "./cache-layer";
import { BlockGroupSchema } from "./block-group";
import { BlockFlagSchema } from "./block-flag";
import { CategorySchema } from "./category";
import { BuildVisibilitySchema } from "./build-visibility";
import { TeamSchema } from "./team";
import { metadata } from "./utils";

export const blockTypes = [
	// Power
	"PowerBlock",
	"PowerDistributor",
	"PowerGenerator",
	"ConsumeGenerator",
	"HeaterGenerator",
	"SolarGenerator",
	"ThermalGenerator",
	"NuclearReactor",
	"ImpactReactor",
	"VariableReactor",
	"Battery",
	"PowerNode",
	"LongPowerNode",
	"BeamNode",
	"PowerDiode",
	"LightBlock",
	"PowerVoid",
	"PowerSource",
	// Storage
	"StorageBlock",
	"CoreBlock",
	"Unloader",
	// Liquid
	"LiquidBlock",
	"LiquidRouter",
	"LiquidJunction",
	"Conduit",
	"ArmoredConduit",
	"LiquidBridge",
	"Pump",
	"SolidPump",
	"Fracker",
	// Production
	"GenericCrafter",
	"HeatCrafter",
	"AttributeCrafter",
	"Separator",
	"Drill",
	"BurstDrill",
	"BeamDrill",
	"WallCrafter",
	"ItemIncinerator",
	"Incinerator",
	"HeatProducer",
	// Defense
	"Wall",
	"Thruster",
	"ShieldWall",
	"Door",
	"AutoDoor",
	"ShockwaveTower",
	"ShockMine",
	"RegenProjector",
	"Radar",
	"OverdriveProjector",
	"MendProjector",
	"ForceProjector",
	"DirectionalForceProjector",
	"BaseShield",
	"ConstructBlock",
	// Turrets
	"BaseTurret",
	"ReloadTurret",
	"Turret",
	"PowerTurret",
	"LaserTurret",
	"ItemTurret",
	"LiquidTurret",
	"ContinuousTurret",
	"ContinuousLiquidTurret",
	"PayloadAmmoTurret",
	"PointDefenseTurret",
	"TractorBeamTurret",
	"BuildTurret",
	// Distribution
	"Conveyor",
	"ArmoredConveyor",
	"StackConveyor",
	"Router",
	"Junction",
	"Sorter",
	"OverflowGate",
	"ItemBridge",
	"BufferedItemBridge",
	"DirectionBridge",
	"DirectionLiquidBridge",
	"DuctBridge",
	"Duct",
	"DuctRouter",
	"StackRouter",
	"DuctJunction",
	"OverflowDuct",
	"MassDriver",
	"DirectionalUnloader",
	// Payload
	"PayloadBlock",
	"PayloadConveyor",
	"PayloadRouter",
	"PayloadVoid",
	"PayloadSource",
	"PayloadMassDriver",
	"PayloadLoader",
	"PayloadUnloader",
	"PayloadDeconstructor",
	"BlockProducer",
	"Constructor",
	"SingleBlockProducer",
	// Unit
	"UnitBlock",
	"UnitFactory",
	"Reconstructor",
	"UnitAssemblerModule",
	"UnitAssembler",
	"UnitCargoUnloadPoint",
	"UnitCargoLoader",
	"RepairTurret",
	"RepairTower",
	"DroneCenter",
	// Logic
	"LogicBlock",
	"LogicDisplay",
	"TileableLogicDisplay",
	"SwitchBlock",
	"MessageBlock",
	"MemoryBlock",
	"CanvasBlock",
	// Heat
	"HeatConductor",
	// Environment
	"Floor",
	"OverlayFloor",
	"OreBlock",
	"ColoredFloor",
	"EmptyFloor",
	"AirBlock",
	"Prop",
	"StaticWall",
	"TiledWall",
	"StaticTree",
	"ColoredWall",
	"TreeBlock",
	"TallBlock",
	"RemoveWall",
	"Cliff",
	// Campaign
	"LaunchPad",
	"LandingPad",
	"Accelerator",
	// Sandbox
	"ItemSource",
	"ItemVoid",
	"LiquidSource",
	"LiquidVoid",
] as const;

export type BlockType = (typeof blockTypes)[number];

// Power variant schemas
const powerGeneratorObjectSchema = v.object({
	powerProduction: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "powerProduction",
			type: "number",
			description: "editor.block-power-generator.power-production",
			category: "power",
		}),
	),
	generationType: v.pipe(
		v.optional(v.string(), "basePowerGeneration"),
		metadata({ name: "generationType", type: "string", description: "editor.block-power-generator.generation-type", category: "power" }),
	),
	explosionRadius: v.pipe(
		v.optional(v.number(), 12),
		metadata({
			name: "explosionRadius",
			type: "number",
			description: "editor.block-power-generator.explosion-radius",
			category: "combat",
		}),
	),
	explosionDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "explosionDamage",
			type: "number",
			description: "editor.block-power-generator.explosion-damage",
			category: "combat",
		}),
	),
	explosionPuddles: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "explosionPuddles",
			type: "number",
			description: "editor.block-power-generator.explosion-puddles",
			category: "combat",
		}),
	),
	explosionPuddleRange: v.pipe(
		v.optional(v.number(), 16),
		metadata({
			name: "explosionPuddleRange",
			type: "number",
			description: "editor.block-power-generator.explosion-puddle-range",
			category: "combat",
		}),
	),
	explosionPuddleAmount: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "explosionPuddleAmount",
			type: "number",
			description: "editor.block-power-generator.explosion-puddle-amount",
			category: "combat",
		}),
	),
	explosionMinWarmup: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "explosionMinWarmup",
			type: "number",
			description: "editor.block-power-generator.explosion-min-warmup",
			category: "combat",
		}),
	),
	explosionShake: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "explosionShake", type: "number", description: "editor.block-power-generator.explosion-shake", category: "combat" }),
	),
	explosionShakeDuration: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "explosionShakeDuration",
			type: "number",
			description: "editor.block-power-generator.explosion-shake-duration",
			category: "combat",
		}),
	),
});

const consumeGeneratorObjectSchema = v.object({
	itemDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({ name: "itemDuration", type: "number", description: "editor.block-consume-generator.item-duration", category: "items" }),
	),
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({ name: "warmupSpeed", type: "number", description: "editor.block-consume-generator.warmup-speed", category: "power" }),
	),
	effectChance: v.pipe(
		v.optional(v.number(), 0.01),
		metadata({
			name: "effectChance",
			type: "number",
			description: "editor.block-consume-generator.effect-chance",
			category: "rendering",
		}),
	),
	generateEffectRange: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "generateEffectRange",
			type: "number",
			description: "editor.block-consume-generator.generate-effect-range",
			category: "rendering",
		}),
	),
	baseLightRadius: v.pipe(
		v.optional(v.number(), 65),
		metadata({
			name: "baseLightRadius",
			type: "number",
			description: "editor.block-consume-generator.base-light-radius",
			category: "rendering",
		}),
	),
	explodeOnFull: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "explodeOnFull",
			type: "boolean",
			description: "editor.block-consume-generator.explode-on-full",
			category: "combat",
		}),
	),
	itemDurationMultipliers: v.pipe(
		v.optional(v.record(v.string(), v.number())),
		metadata({
			name: "itemDurationMultipliers",
			type: "object",
			description: "editor.block-consume-generator.item-duration-multipliers",
			category: "items",
		}),
	),
});

const heaterGeneratorObjectSchema = v.object({
	heatOutput: v.pipe(
		v.optional(v.number(), 10),
		metadata({ name: "heatOutput", type: "number", description: "editor.block-heater-generator.heat-output", category: "power" }),
	),
	warmupRate: v.pipe(
		v.optional(v.number(), 0.15),
		metadata({ name: "warmupRate", type: "number", description: "editor.block-heater-generator.warmup-rate", category: "power" }),
	),
});

const thermalGeneratorObjectSchema = v.object({
	effectChance: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({
			name: "effectChance",
			type: "number",
			description: "editor.block-thermal-generator.effect-chance",
			category: "rendering",
		}),
	),
	minEfficiency: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "minEfficiency", type: "number", description: "editor.block-thermal-generator.min-efficiency", category: "power" }),
	),
	displayEfficiencyScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "displayEfficiencyScale",
			type: "number",
			description: "editor.block-thermal-generator.display-efficiency-scale",
			category: "power",
		}),
	),
	displayEfficiency: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "displayEfficiency",
			type: "boolean",
			description: "editor.block-thermal-generator.display-efficiency",
			category: "power",
		}),
	),
	attribute: v.pipe(
		v.optional(v.string(), "heat"),
		metadata({ name: "attribute", type: "string", description: "editor.block-thermal-generator.attribute", category: "power" }),
	),
});

const nuclearReactorObjectSchema = v.object({
	itemDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({ name: "itemDuration", type: "number", description: "editor.block-nuclear-reactor.item-duration", category: "items" }),
	),
	heating: v.pipe(
		v.optional(v.number(), 0.01),
		metadata({ name: "heating", type: "number", description: "editor.block-nuclear-reactor.heating", category: "power" }),
	),
	heatOutput: v.pipe(
		v.optional(v.number(), 15),
		metadata({ name: "heatOutput", type: "number", description: "editor.block-nuclear-reactor.heat-output", category: "power" }),
	),
	heatWarmupRate: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "heatWarmupRate", type: "number", description: "editor.block-nuclear-reactor.heat-warmup-rate", category: "power" }),
	),
	ambientCooldownTime: v.pipe(
		v.optional(v.number(), 1200),
		metadata({
			name: "ambientCooldownTime",
			type: "number",
			description: "editor.block-nuclear-reactor.ambient-cooldown-time",
			category: "power",
		}),
	),
	smokeThreshold: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "smokeThreshold",
			type: "number",
			description: "editor.block-nuclear-reactor.smoke-threshold",
			category: "rendering",
		}),
	),
	flashThreshold: v.pipe(
		v.optional(v.number(), 0.46),
		metadata({
			name: "flashThreshold",
			type: "number",
			description: "editor.block-nuclear-reactor.flash-threshold",
			category: "rendering",
		}),
	),
	coolantPower: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({ name: "coolantPower", type: "number", description: "editor.block-nuclear-reactor.coolant-power", category: "power" }),
	),
	fuelItem: v.pipe(
		v.optional(v.string()),
		metadata({ name: "fuelItem", type: "string", description: "editor.block-nuclear-reactor.fuel-item", category: "items" }),
	),
});

const impactReactorObjectSchema = v.object({
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.001),
		metadata({ name: "warmupSpeed", type: "number", description: "editor.block-impact-reactor.warmup-speed", category: "power" }),
	),
	itemDuration: v.pipe(
		v.optional(v.number(), 60),
		metadata({ name: "itemDuration", type: "number", description: "editor.block-impact-reactor.item-duration", category: "items" }),
	),
});

const variableReactorObjectSchema = v.object({
	maxHeat: v.pipe(
		v.optional(v.number(), 100),
		metadata({ name: "maxHeat", type: "number", description: "editor.block-variable-reactor.max-heat", category: "power" }),
	),
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({ name: "warmupSpeed", type: "number", description: "editor.block-variable-reactor.warmup-speed", category: "power" }),
	),
	unstableSpeed: v.pipe(
		v.optional(v.number(), 1 / 180),
		metadata({ name: "unstableSpeed", type: "number", description: "editor.block-variable-reactor.unstable-speed", category: "combat" }),
	),
	effectChance: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({ name: "effectChance", type: "number", description: "editor.block-variable-reactor.effect-chance", category: "rendering" }),
	),
	flashThreshold: v.pipe(
		v.optional(v.number(), 0.01),
		metadata({
			name: "flashThreshold",
			type: "number",
			description: "editor.block-variable-reactor.flash-threshold",
			category: "rendering",
		}),
	),
	flashAlpha: v.pipe(
		v.optional(v.number(), 0.4),
		metadata({ name: "flashAlpha", type: "number", description: "editor.block-variable-reactor.flash-alpha", category: "rendering" }),
	),
	flashSpeed: v.pipe(
		v.optional(v.number(), 7),
		metadata({ name: "flashSpeed", type: "number", description: "editor.block-variable-reactor.flash-speed", category: "rendering" }),
	),
});

const lightBlockObjectSchema = v.object({
	brightness: v.pipe(
		v.optional(v.number(), 0.9),
		metadata({ name: "brightness", type: "number", description: "editor.block-light-block.brightness", category: "rendering" }),
	),
	radius: v.pipe(
		v.optional(v.number(), 200),
		metadata({ name: "radius", type: "number", description: "editor.block-light-block.radius", category: "rendering" }),
	),
});

const powerNodeObjectSchema = v.object({
	laserRange: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "laserRange", type: "number", description: "editor.block-power-node.laser-range", category: "distribution" }),
	),
	maxNodes: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "maxNodes", type: "number", description: "editor.block-power-node.max-nodes", category: "distribution" }),
	),
	autolink: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "autolink", type: "boolean", description: "editor.block-power-node.autolink", category: "config" }),
	),
	drawRange: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawRange", type: "boolean", description: "editor.block-power-node.draw-range", category: "rendering" }),
	),
	sameBlockConnection: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "sameBlockConnection",
			type: "boolean",
			description: "editor.block-power-node.same-block-connection",
			category: "config",
		}),
	),
	laserScale: v.pipe(
		v.optional(v.number(), 0.25),
		metadata({ name: "laserScale", type: "number", description: "editor.block-power-node.laser-scale", category: "rendering" }),
	),
});

const longPowerNodeObjectSchema = v.object({
	glowScl: v.pipe(
		v.optional(v.number(), 16),
		metadata({ name: "glowScl", type: "number", description: "editor.block-long-power-node.glow-scl", category: "rendering" }),
	),
	glowMag: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({ name: "glowMag", type: "number", description: "editor.block-long-power-node.glow-mag", category: "rendering" }),
	),
});

const beamNodeObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "range", type: "number", description: "editor.block-beam-node.range", category: "distribution" }),
	),
	pulseScl: v.pipe(
		v.optional(v.number(), 7),
		metadata({ name: "pulseScl", type: "number", description: "editor.block-beam-node.pulse-scl", category: "rendering" }),
	),
	pulseMag: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({ name: "pulseMag", type: "number", description: "editor.block-beam-node.pulse-mag", category: "rendering" }),
	),
	laserWidth: v.pipe(
		v.optional(v.number(), 0.4),
		metadata({ name: "laserWidth", type: "number", description: "editor.block-beam-node.laser-width", category: "rendering" }),
	),
});

const powerSourceObjectSchema = v.object({
	powerProduction: v.pipe(
		v.optional(v.number(), 10000),
		metadata({ name: "powerProduction", type: "number", description: "editor.block-power-source.power-production", category: "power" }),
	),
});

// Storage variant schemas
const storageBlockObjectSchema = v.object({
	coreMerge: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "coreMerge", type: "boolean", description: "editor.block-storage-block.core-merge", category: "items" }),
	),
});

const coreBlockObjectSchema = v.object({
	thrusterLength: v.pipe(
		v.optional(v.number(), 3.5),
		metadata({ name: "thrusterLength", type: "number", description: "editor.block-core-block.thruster-length", category: "rendering" }),
	),
	thrusterOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "thrusterOffset", type: "number", description: "editor.block-core-block.thruster-offset", category: "rendering" }),
	),
	isFirstTier: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "isFirstTier", type: "boolean", description: "editor.block-core-block.is-first-tier", category: "structure" }),
	),
	allowSpawn: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "allowSpawn", type: "boolean", description: "editor.block-core-block.allow-spawn", category: "misc" }),
	),
	requiresCoreZone: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "requiresCoreZone",
			type: "boolean",
			description: "editor.block-core-block.requires-core-zone",
			category: "placement",
		}),
	),
	incinerateNonBuildable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "incinerateNonBuildable",
			type: "boolean",
			description: "editor.block-core-block.incinerate-non-buildable",
			category: "items",
		}),
	),
	landDuration: v.pipe(
		v.optional(v.number(), 160),
		metadata({ name: "landDuration", type: "number", description: "editor.block-core-block.land-duration", category: "misc" }),
	),
	launchSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "launchSoundVolume",
			type: "number",
			description: "editor.block-core-block.launch-sound-volume",
			category: "audio",
		}),
	),
	landSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "landSoundVolume", type: "number", description: "editor.block-core-block.land-sound-volume", category: "audio" }),
	),
	captureInvicibility: v.pipe(
		v.optional(v.number(), 900),
		metadata({
			name: "captureInvicibility",
			type: "number",
			description: "editor.block-core-block.capture-invicibility",
			category: "combat",
		}),
	),
});

const unloaderObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "speed", type: "number", description: "editor.block-unloader.speed", category: "config" }),
	),
	allowCoreUnload: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "allowCoreUnload", type: "boolean", description: "editor.block-unloader.allow-core-unload", category: "config" }),
	),
});

// Liquid variant schemas
const liquidRouterObjectSchema = v.object({
	liquidPadding: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "liquidPadding", type: "number", description: "editor.block-liquid-router.liquid-padding", category: "liquids" }),
	),
});

const conduitObjectSchema = v.object({
	padCorners: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "padCorners", type: "boolean", description: "editor.block-conduit.pad-corners", category: "rendering" }),
	),
	leaks: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "leaks", type: "boolean", description: "editor.block-conduit.leaks", category: "liquids" }),
	),
});

const pumpObjectSchema = v.object({
	pumpAmount: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({ name: "pumpAmount", type: "number", description: "editor.block-pump.pump-amount", category: "liquids" }),
	),
	consumeTime: v.pipe(
		v.optional(v.number(), 300),
		metadata({ name: "consumeTime", type: "number", description: "editor.block-pump.consume-time", category: "production" }),
	),
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.019),
		metadata({ name: "warmupSpeed", type: "number", description: "editor.block-pump.warmup-speed", category: "production" }),
	),
});

const solidPumpObjectSchema = v.object({
	result: v.pipe(
		v.optional(v.string(), "water"),
		metadata({ name: "result", type: "string", description: "editor.block-solid-pump.result", category: "liquids" }),
	),
	updateEffectChance: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({
			name: "updateEffectChance",
			type: "number",
			description: "editor.block-solid-pump.update-effect-chance",
			category: "rendering",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "rotateSpeed", type: "number", description: "editor.block-solid-pump.rotate-speed", category: "rendering" }),
	),
	baseEfficiency: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "baseEfficiency", type: "number", description: "editor.block-solid-pump.base-efficiency", category: "production" }),
	),
	attribute: v.pipe(
		v.optional(v.string()),
		metadata({ name: "attribute", type: "string", description: "editor.block-solid-pump.attribute", category: "production" }),
	),
});

const frackerObjectSchema = v.object({
	itemUseTime: v.pipe(
		v.optional(v.number(), 100),
		metadata({ name: "itemUseTime", type: "number", description: "editor.block-fracker.item-use-time", category: "production" }),
	),
});

// Production variant schemas
const genericCrafterObjectSchema = v.object({
	outputItem: v.pipe(
		v.optional(v.string()),
		metadata({ name: "outputItem", type: "string", description: "editor.block-generic-crafter.output-item", category: "items" }),
	),
	outputItems: v.pipe(
		v.optional(v.array(v.string())),
		metadata({ name: "outputItems", type: "array", description: "editor.block-generic-crafter.output-items", category: "items" }),
	),
	outputLiquid: v.pipe(
		v.optional(v.string()),
		metadata({ name: "outputLiquid", type: "string", description: "editor.block-generic-crafter.output-liquid", category: "liquids" }),
	),
	outputLiquids: v.pipe(
		v.optional(v.array(v.string())),
		metadata({ name: "outputLiquids", type: "array", description: "editor.block-generic-crafter.output-liquids", category: "liquids" }),
	),
	liquidOutputDirections: v.pipe(
		v.optional(v.array(v.number()), [-1]),
		metadata({
			name: "liquidOutputDirections",
			type: "array",
			description: "editor.block-generic-crafter.liquid-output-directions",
			category: "liquids",
		}),
	),
	dumpExtraLiquid: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "dumpExtraLiquid",
			type: "boolean",
			description: "editor.block-generic-crafter.dump-extra-liquid",
			category: "liquids",
		}),
	),
	ignoreLiquidFullness: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "ignoreLiquidFullness",
			type: "boolean",
			description: "editor.block-generic-crafter.ignore-liquid-fullness",
			category: "liquids",
		}),
	),
	craftTime: v.pipe(
		v.optional(v.number(), 80),
		metadata({ name: "craftTime", type: "number", description: "editor.block-generic-crafter.craft-time", category: "production" }),
	),
	updateEffectChance: v.pipe(
		v.optional(v.number(), 0.04),
		metadata({
			name: "updateEffectChance",
			type: "number",
			description: "editor.block-generic-crafter.update-effect-chance",
			category: "rendering",
		}),
	),
	updateEffectSpread: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "updateEffectSpread",
			type: "number",
			description: "editor.block-generic-crafter.update-effect-spread",
			category: "rendering",
		}),
	),
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.019),
		metadata({ name: "warmupSpeed", type: "number", description: "editor.block-generic-crafter.warmup-speed", category: "production" }),
	),
});

const heatCrafterObjectSchema = v.object({
	heatRequirement: v.pipe(
		v.optional(v.number(), 10),
		metadata({ name: "heatRequirement", type: "number", description: "editor.block-heat-crafter.heat-requirement", category: "power" }),
	),
	overheatScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "overheatScale", type: "number", description: "editor.block-heat-crafter.overheat-scale", category: "power" }),
	),
	maxEfficiency: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "maxEfficiency", type: "number", description: "editor.block-heat-crafter.max-efficiency", category: "production" }),
	),
});

const attributeCrafterObjectSchema = v.object({
	attribute: v.pipe(
		v.optional(v.string(), "heat"),
		metadata({ name: "attribute", type: "string", description: "editor.block-attribute-crafter.attribute", category: "production" }),
	),
	baseEfficiency: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "baseEfficiency",
			type: "number",
			description: "editor.block-attribute-crafter.base-efficiency",
			category: "production",
		}),
	),
	boostScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "boostScale", type: "number", description: "editor.block-attribute-crafter.boost-scale", category: "production" }),
	),
	maxBoost: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "maxBoost", type: "number", description: "editor.block-attribute-crafter.max-boost", category: "production" }),
	),
	minEfficiency: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "minEfficiency",
			type: "number",
			description: "editor.block-attribute-crafter.min-efficiency",
			category: "production",
		}),
	),
	displayEfficiencyScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "displayEfficiencyScale",
			type: "number",
			description: "editor.block-attribute-crafter.display-efficiency-scale",
			category: "production",
		}),
	),
	displayEfficiency: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "displayEfficiency",
			type: "boolean",
			description: "editor.block-attribute-crafter.display-efficiency",
			category: "production",
		}),
	),
	scaleLiquidConsumption: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "scaleLiquidConsumption",
			type: "boolean",
			description: "editor.block-attribute-crafter.scale-liquid-consumption",
			category: "liquids",
		}),
	),
});

const separatorObjectSchema = v.object({
	results: v.pipe(
		v.optional(v.array(v.string())),
		metadata({ name: "results", type: "array", description: "editor.block-separator.results", category: "items" }),
	),
	craftTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "craftTime", type: "number", description: "editor.block-separator.craft-time", category: "production" }),
	),
});

const drillObjectSchema = v.object({
	tier: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "tier", type: "number", description: "editor.block-drill.tier", category: "production" }),
	),
	drillTime: v.pipe(
		v.optional(v.number(), 300),
		metadata({ name: "drillTime", type: "number", description: "editor.block-drill.drill-time", category: "production" }),
	),
	hardnessDrillMultiplier: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "hardnessDrillMultiplier",
			type: "number",
			description: "editor.block-drill.hardness-drill-multiplier",
			category: "production",
		}),
	),
	liquidBoostIntensity: v.pipe(
		v.optional(v.number(), 1.6),
		metadata({
			name: "liquidBoostIntensity",
			type: "number",
			description: "editor.block-drill.liquid-boost-intensity",
			category: "liquids",
		}),
	),
	warmupSpeed: v.pipe(
		v.optional(v.number(), 0.015),
		metadata({ name: "warmupSpeed", type: "number", description: "editor.block-drill.warmup-speed", category: "production" }),
	),
	blockedItem: v.pipe(
		v.optional(v.string()),
		metadata({ name: "blockedItem", type: "string", description: "editor.block-drill.blocked-item", category: "items" }),
	),
	blockedItems: v.pipe(
		v.optional(v.array(v.string())),
		metadata({ name: "blockedItems", type: "array", description: "editor.block-drill.blocked-items", category: "items" }),
	),
	drawMineItem: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawMineItem", type: "boolean", description: "editor.block-drill.draw-mine-item", category: "rendering" }),
	),
	drillEffectRnd: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "drillEffectRnd", type: "number", description: "editor.block-drill.drill-effect-rnd", category: "rendering" }),
	),
	drillEffectChance: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({ name: "drillEffectChance", type: "number", description: "editor.block-drill.drill-effect-chance", category: "rendering" }),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "rotateSpeed", type: "number", description: "editor.block-drill.rotate-speed", category: "rendering" }),
	),
	updateEffectChance: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({
			name: "updateEffectChance",
			type: "number",
			description: "editor.block-drill.update-effect-chance",
			category: "rendering",
		}),
	),
	drillMultipliers: v.pipe(
		v.optional(v.record(v.string(), v.number())),
		metadata({ name: "drillMultipliers", type: "object", description: "editor.block-drill.drill-multipliers", category: "production" }),
	),
	drawRim: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "drawRim", type: "boolean", description: "editor.block-drill.draw-rim", category: "rendering" }),
	),
	drawSpinSprite: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawSpinSprite", type: "boolean", description: "editor.block-drill.draw-spin-sprite", category: "rendering" }),
	),
});

const burstDrillObjectSchema = v.object({
	shake: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "shake", type: "number", description: "editor.block-burst-drill.shake", category: "rendering" }),
	),
	invertedTime: v.pipe(
		v.optional(v.number(), 200),
		metadata({ name: "invertedTime", type: "number", description: "editor.block-burst-drill.inverted-time", category: "production" }),
	),
	arrowSpacing: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "arrowSpacing", type: "number", description: "editor.block-burst-drill.arrow-spacing", category: "rendering" }),
	),
	arrowOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "arrowOffset", type: "number", description: "editor.block-burst-drill.arrow-offset", category: "rendering" }),
	),
	arrows: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "arrows", type: "number", description: "editor.block-burst-drill.arrows", category: "rendering" }),
	),
	drillSoundVolume: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({ name: "drillSoundVolume", type: "number", description: "editor.block-burst-drill.drill-sound-volume", category: "audio" }),
	),
	drillSoundPitchRand: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "drillSoundPitchRand",
			type: "number",
			description: "editor.block-burst-drill.drill-sound-pitch-rand",
			category: "audio",
		}),
	),
});

const beamDrillObjectSchema = v.object({
	drillTime: v.pipe(
		v.optional(v.number(), 200),
		metadata({ name: "drillTime", type: "number", description: "editor.block-beam-drill.drill-time", category: "production" }),
	),
	range: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "range", type: "number", description: "editor.block-beam-drill.range", category: "production" }),
	),
	tier: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "tier", type: "number", description: "editor.block-beam-drill.tier", category: "production" }),
	),
	laserWidth: v.pipe(
		v.optional(v.number(), 0.65),
		metadata({ name: "laserWidth", type: "number", description: "editor.block-beam-drill.laser-width", category: "rendering" }),
	),
	optionalBoostIntensity: v.pipe(
		v.optional(v.number(), 2.5),
		metadata({
			name: "optionalBoostIntensity",
			type: "number",
			description: "editor.block-beam-drill.optional-boost-intensity",
			category: "production",
		}),
	),
	drillMultipliers: v.pipe(
		v.optional(v.record(v.string(), v.number())),
		metadata({
			name: "drillMultipliers",
			type: "object",
			description: "editor.block-beam-drill.drill-multipliers",
			category: "production",
		}),
	),
	blockedItem: v.pipe(
		v.optional(v.string()),
		metadata({ name: "blockedItem", type: "string", description: "editor.block-beam-drill.blocked-item", category: "items" }),
	),
	blockedItems: v.pipe(
		v.optional(v.array(v.string())),
		metadata({ name: "blockedItems", type: "array", description: "editor.block-beam-drill.blocked-items", category: "items" }),
	),
	glowIntensity: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({ name: "glowIntensity", type: "number", description: "editor.block-beam-drill.glow-intensity", category: "rendering" }),
	),
	pulseIntensity: v.pipe(
		v.optional(v.number(), 0.07),
		metadata({ name: "pulseIntensity", type: "number", description: "editor.block-beam-drill.pulse-intensity", category: "rendering" }),
	),
	glowScl: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "glowScl", type: "number", description: "editor.block-beam-drill.glow-scl", category: "rendering" }),
	),
	sparks: v.pipe(
		v.optional(v.number(), 7),
		metadata({ name: "sparks", type: "number", description: "editor.block-beam-drill.sparks", category: "rendering" }),
	),
	sparkRange: v.pipe(
		v.optional(v.number(), 10),
		metadata({ name: "sparkRange", type: "number", description: "editor.block-beam-drill.spark-range", category: "rendering" }),
	),
	sparkLife: v.pipe(
		v.optional(v.number(), 27),
		metadata({ name: "sparkLife", type: "number", description: "editor.block-beam-drill.spark-life", category: "rendering" }),
	),
	sparkRecurrence: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "sparkRecurrence", type: "number", description: "editor.block-beam-drill.spark-recurrence", category: "rendering" }),
	),
	sparkSpread: v.pipe(
		v.optional(v.number(), 45),
		metadata({ name: "sparkSpread", type: "number", description: "editor.block-beam-drill.spark-spread", category: "rendering" }),
	),
	sparkSize: v.pipe(
		v.optional(v.number(), 3.5),
		metadata({ name: "sparkSize", type: "number", description: "editor.block-beam-drill.spark-size", category: "rendering" }),
	),
	heatPulse: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({ name: "heatPulse", type: "number", description: "editor.block-beam-drill.heat-pulse", category: "rendering" }),
	),
	heatPulseScl: v.pipe(
		v.optional(v.number(), 7),
		metadata({ name: "heatPulseScl", type: "number", description: "editor.block-beam-drill.heat-pulse-scl", category: "rendering" }),
	),
});

const wallCrafterObjectSchema = v.object({
	drillTime: v.pipe(
		v.optional(v.number(), 150),
		metadata({ name: "drillTime", type: "number", description: "editor.block-wall-crafter.drill-time", category: "production" }),
	),
	liquidBoostIntensity: v.pipe(
		v.optional(v.number(), 1.6),
		metadata({
			name: "liquidBoostIntensity",
			type: "number",
			description: "editor.block-wall-crafter.liquid-boost-intensity",
			category: "liquids",
		}),
	),
	updateEffectChance: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({
			name: "updateEffectChance",
			type: "number",
			description: "editor.block-wall-crafter.update-effect-chance",
			category: "rendering",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "rotateSpeed", type: "number", description: "editor.block-wall-crafter.rotate-speed", category: "rendering" }),
	),
	attribute: v.pipe(
		v.optional(v.string(), "sand"),
		metadata({ name: "attribute", type: "string", description: "editor.block-wall-crafter.attribute", category: "production" }),
	),
	output: v.pipe(
		v.optional(v.string(), "sand"),
		metadata({ name: "output", type: "string", description: "editor.block-wall-crafter.output", category: "items" }),
	),
	boostItemUseTime: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "boostItemUseTime",
			type: "number",
			description: "editor.block-wall-crafter.boost-item-use-time",
			category: "production",
		}),
	),
	itemBoostIntensity: v.pipe(
		v.optional(v.number(), 1.6),
		metadata({
			name: "itemBoostIntensity",
			type: "number",
			description: "editor.block-wall-crafter.item-boost-intensity",
			category: "production",
		}),
	),
	hasLiquidBooster: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "hasLiquidBooster",
			type: "boolean",
			description: "editor.block-wall-crafter.has-liquid-booster",
			category: "liquids",
		}),
	),
});

const itemIncineratorObjectSchema = v.object({
	effectChance: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({ name: "effectChance", type: "number", description: "editor.block-item-incinerator.effect-chance", category: "rendering" }),
	),
});

const heatProducerObjectSchema = v.object({
	heatOutput: v.pipe(
		v.optional(v.number(), 10),
		metadata({ name: "heatOutput", type: "number", description: "editor.block-heat-producer.heat-output", category: "power" }),
	),
	warmupRate: v.pipe(
		v.optional(v.number(), 0.15),
		metadata({ name: "warmupRate", type: "number", description: "editor.block-heat-producer.warmup-rate", category: "power" }),
	),
});

// Defense variant schemas
const wallObjectSchema = v.object({
	lightningChance: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "lightningChance", type: "number", description: "editor.block-wall.lightning-chance", category: "combat" }),
	),
	lightningDamage: v.pipe(
		v.optional(v.number(), 20),
		metadata({ name: "lightningDamage", type: "number", description: "editor.block-wall.lightning-damage", category: "combat" }),
	),
	lightningLength: v.pipe(
		v.optional(v.number(), 17),
		metadata({ name: "lightningLength", type: "number", description: "editor.block-wall.lightning-length", category: "combat" }),
	),
	chanceDeflect: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "chanceDeflect", type: "number", description: "editor.block-wall.chance-deflect", category: "combat" }),
	),
	flashHit: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "flashHit", type: "boolean", description: "editor.block-wall.flash-hit", category: "combat" }),
	),
});

const shieldWallObjectSchema = v.object({
	shieldHealth: v.pipe(
		v.optional(v.number(), 900),
		metadata({ name: "shieldHealth", type: "number", description: "editor.block-shield-wall.shield-health", category: "combat" }),
	),
	breakCooldown: v.pipe(
		v.optional(v.number(), 600),
		metadata({ name: "breakCooldown", type: "number", description: "editor.block-shield-wall.break-cooldown", category: "combat" }),
	),
	regenSpeed: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "regenSpeed", type: "number", description: "editor.block-shield-wall.regen-speed", category: "combat" }),
	),
	glowMag: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({ name: "glowMag", type: "number", description: "editor.block-shield-wall.glow-mag", category: "combat" }),
	),
	glowScl: v.pipe(
		v.optional(v.number(), 8),
		metadata({ name: "glowScl", type: "number", description: "editor.block-shield-wall.glow-scl", category: "combat" }),
	),
});

const doorObjectSchema = v.object({
	chainEffect: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "chainEffect", type: "boolean", description: "editor.block-door.chain-effect", category: "combat" }),
	),
});

const autoDoorObjectSchema = v.object({
	checkInterval: v.pipe(
		v.optional(v.number(), 20),
		metadata({ name: "checkInterval", type: "number", description: "editor.block-auto-door.check-interval", category: "combat" }),
	),
	triggerMargin: v.pipe(
		v.optional(v.number(), 12),
		metadata({ name: "triggerMargin", type: "number", description: "editor.block-auto-door.trigger-margin", category: "combat" }),
	),
});

const shockwaveTowerObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 110),
		metadata({ name: "range", type: "number", description: "editor.block-shockwave-tower.range", category: "combat" }),
	),
	reload: v.pipe(
		v.optional(v.number(), 90),
		metadata({ name: "reload", type: "number", description: "editor.block-shockwave-tower.reload", category: "combat" }),
	),
	bulletDamage: v.pipe(
		v.optional(v.number(), 160),
		metadata({ name: "bulletDamage", type: "number", description: "editor.block-shockwave-tower.bullet-damage", category: "combat" }),
	),
	falloffCount: v.pipe(
		v.optional(v.number(), 20),
		metadata({ name: "falloffCount", type: "number", description: "editor.block-shockwave-tower.falloff-count", category: "combat" }),
	),
	shake: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "shake", type: "number", description: "editor.block-shockwave-tower.shake", category: "combat" }),
	),
	checkInterval: v.pipe(
		v.optional(v.number(), 8),
		metadata({ name: "checkInterval", type: "number", description: "editor.block-shockwave-tower.check-interval", category: "combat" }),
	),
	cooldownMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "cooldownMultiplier",
			type: "number",
			description: "editor.block-shockwave-tower.cooldown-multiplier",
			category: "combat",
		}),
	),
	shapeRotateSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "shapeRotateSpeed",
			type: "number",
			description: "editor.block-shockwave-tower.shape-rotate-speed",
			category: "combat",
		}),
	),
	shapeRadius: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "shapeRadius", type: "number", description: "editor.block-shockwave-tower.shape-radius", category: "combat" }),
	),
	shapeSides: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "shapeSides", type: "number", description: "editor.block-shockwave-tower.shape-sides", category: "combat" }),
	),
});

const shockMineObjectSchema = v.object({
	cooldown: v.pipe(
		v.optional(v.number(), 80),
		metadata({ name: "cooldown", type: "number", description: "editor.block-shock-mine.cooldown", category: "combat" }),
	),
	tileDamage: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "tileDamage", type: "number", description: "editor.block-shock-mine.tile-damage", category: "combat" }),
	),
	damage: v.pipe(
		v.optional(v.number(), 13),
		metadata({ name: "damage", type: "number", description: "editor.block-shock-mine.damage", category: "combat" }),
	),
	length: v.pipe(
		v.optional(v.number(), 10),
		metadata({ name: "length", type: "number", description: "editor.block-shock-mine.length", category: "combat" }),
	),
	tendrils: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "tendrils", type: "number", description: "editor.block-shock-mine.tendrils", category: "combat" }),
	),
	shots: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "shots", type: "number", description: "editor.block-shock-mine.shots", category: "combat" }),
	),
	inaccuracy: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "inaccuracy", type: "number", description: "editor.block-shock-mine.inaccuracy", category: "combat" }),
	),
	teamAlpha: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({ name: "teamAlpha", type: "number", description: "editor.block-shock-mine.team-alpha", category: "combat" }),
	),
});

const regenProjectorObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 14),
		metadata({ name: "range", type: "number", description: "editor.block-regen-projector.range", category: "combat" }),
	),
	healPercent: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({ name: "healPercent", type: "number", description: "editor.block-regen-projector.heal-percent", category: "combat" }),
	),
	optionalMultiplier: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "optionalMultiplier",
			type: "number",
			description: "editor.block-regen-projector.optional-multiplier",
			category: "combat",
		}),
	),
	optionalUseTime: v.pipe(
		v.optional(v.number(), 480),
		metadata({
			name: "optionalUseTime",
			type: "number",
			description: "editor.block-regen-projector.optional-use-time",
			category: "combat",
		}),
	),
	effectChance: v.pipe(
		v.optional(v.number(), 0.003),
		metadata({ name: "effectChance", type: "number", description: "editor.block-regen-projector.effect-chance", category: "combat" }),
	),
});

const radarObjectSchema = v.object({
	discoveryTime: v.pipe(
		v.optional(v.number(), 600),
		metadata({ name: "discoveryTime", type: "number", description: "editor.block-radar.discovery-time", category: "combat" }),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "rotateSpeed", type: "number", description: "editor.block-radar.rotate-speed", category: "combat" }),
	),
	glowScl: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "glowScl", type: "number", description: "editor.block-radar.glow-scl", category: "combat" }),
	),
	glowMag: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({ name: "glowMag", type: "number", description: "editor.block-radar.glow-mag", category: "combat" }),
	),
});

const overdriveProjectorObjectSchema = v.object({
	reload: v.pipe(
		v.optional(v.number(), 60),
		metadata({ name: "reload", type: "number", description: "editor.block-overdrive-projector.reload", category: "combat" }),
	),
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({ name: "range", type: "number", description: "editor.block-overdrive-projector.range", category: "combat" }),
	),
	speedBoost: v.pipe(
		v.optional(v.number(), 1.5),
		metadata({ name: "speedBoost", type: "number", description: "editor.block-overdrive-projector.speed-boost", category: "combat" }),
	),
	speedBoostPhase: v.pipe(
		v.optional(v.number(), 0.75),
		metadata({
			name: "speedBoostPhase",
			type: "number",
			description: "editor.block-overdrive-projector.speed-boost-phase",
			category: "combat",
		}),
	),
	useTime: v.pipe(
		v.optional(v.number(), 400),
		metadata({ name: "useTime", type: "number", description: "editor.block-overdrive-projector.use-time", category: "combat" }),
	),
	phaseRangeBoost: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "phaseRangeBoost",
			type: "number",
			description: "editor.block-overdrive-projector.phase-range-boost",
			category: "combat",
		}),
	),
	hasBoost: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "hasBoost", type: "boolean", description: "editor.block-overdrive-projector.has-boost", category: "combat" }),
	),
});

const mendProjectorObjectSchema = v.object({
	reload: v.pipe(
		v.optional(v.number(), 250),
		metadata({ name: "reload", type: "number", description: "editor.block-mend-projector.reload", category: "combat" }),
	),
	range: v.pipe(
		v.optional(v.number(), 60),
		metadata({ name: "range", type: "number", description: "editor.block-mend-projector.range", category: "combat" }),
	),
	healPercent: v.pipe(
		v.optional(v.number(), 12),
		metadata({ name: "healPercent", type: "number", description: "editor.block-mend-projector.heal-percent", category: "combat" }),
	),
	phaseBoost: v.pipe(
		v.optional(v.number(), 12),
		metadata({ name: "phaseBoost", type: "number", description: "editor.block-mend-projector.phase-boost", category: "combat" }),
	),
	phaseRangeBoost: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "phaseRangeBoost",
			type: "number",
			description: "editor.block-mend-projector.phase-range-boost",
			category: "combat",
		}),
	),
	useTime: v.pipe(
		v.optional(v.number(), 400),
		metadata({ name: "useTime", type: "number", description: "editor.block-mend-projector.use-time", category: "combat" }),
	),
	mendSoundVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "mendSoundVolume",
			type: "number",
			description: "editor.block-mend-projector.mend-sound-volume",
			category: "combat",
		}),
	),
});

const forceProjectorObjectSchema = v.object({
	phaseUseTime: v.pipe(
		v.optional(v.number(), 350),
		metadata({ name: "phaseUseTime", type: "number", description: "editor.block-force-projector.phase-use-time", category: "combat" }),
	),
	phaseRadiusBoost: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "phaseRadiusBoost",
			type: "number",
			description: "editor.block-force-projector.phase-radius-boost",
			category: "combat",
		}),
	),
	phaseShieldBoost: v.pipe(
		v.optional(v.number(), 400),
		metadata({
			name: "phaseShieldBoost",
			type: "number",
			description: "editor.block-force-projector.phase-shield-boost",
			category: "combat",
		}),
	),
	radius: v.pipe(
		v.optional(v.number(), 101.7),
		metadata({ name: "radius", type: "number", description: "editor.block-force-projector.radius", category: "combat" }),
	),
	sides: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "sides", type: "number", description: "editor.block-force-projector.sides", category: "combat" }),
	),
	shieldRotation: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "shieldRotation", type: "number", description: "editor.block-force-projector.shield-rotation", category: "combat" }),
	),
	shieldHealth: v.pipe(
		v.optional(v.number(), 700),
		metadata({ name: "shieldHealth", type: "number", description: "editor.block-force-projector.shield-health", category: "combat" }),
	),
	cooldownNormal: v.pipe(
		v.optional(v.number(), 1.75),
		metadata({ name: "cooldownNormal", type: "number", description: "editor.block-force-projector.cooldown-normal", category: "combat" }),
	),
	cooldownLiquid: v.pipe(
		v.optional(v.number(), 1.5),
		metadata({ name: "cooldownLiquid", type: "number", description: "editor.block-force-projector.cooldown-liquid", category: "combat" }),
	),
	cooldownBrokenBase: v.pipe(
		v.optional(v.number(), 0.35),
		metadata({
			name: "cooldownBrokenBase",
			type: "number",
			description: "editor.block-force-projector.cooldown-broken-base",
			category: "combat",
		}),
	),
	coolantConsumption: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "coolantConsumption",
			type: "number",
			description: "editor.block-force-projector.coolant-consumption",
			category: "combat",
		}),
	),
	consumeCoolant: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "consumeCoolant",
			type: "boolean",
			description: "editor.block-force-projector.consume-coolant",
			category: "combat",
		}),
	),
	crashDamageMultiplier: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "crashDamageMultiplier",
			type: "number",
			description: "editor.block-force-projector.crash-damage-multiplier",
			category: "combat",
		}),
	),
	hitSoundVolume: v.pipe(
		v.optional(v.number(), 0.12),
		metadata({
			name: "hitSoundVolume",
			type: "number",
			description: "editor.block-force-projector.hit-sound-volume",
			category: "combat",
		}),
	),
});

const directionalForceProjectorObjectSchema = v.object({
	width: v.pipe(
		v.optional(v.number(), 30),
		metadata({ name: "width", type: "number", description: "editor.block-directional-force-projector.width", category: "combat" }),
	),
	shieldHealth: v.pipe(
		v.optional(v.number(), 3000),
		metadata({
			name: "shieldHealth",
			type: "number",
			description: "editor.block-directional-force-projector.shield-health",
			category: "combat",
		}),
	),
	cooldownNormal: v.pipe(
		v.optional(v.number(), 1.75),
		metadata({
			name: "cooldownNormal",
			type: "number",
			description: "editor.block-directional-force-projector.cooldown-normal",
			category: "combat",
		}),
	),
	cooldownLiquid: v.pipe(
		v.optional(v.number(), 1.5),
		metadata({
			name: "cooldownLiquid",
			type: "number",
			description: "editor.block-directional-force-projector.cooldown-liquid",
			category: "combat",
		}),
	),
	cooldownBrokenBase: v.pipe(
		v.optional(v.number(), 0.35),
		metadata({
			name: "cooldownBrokenBase",
			type: "number",
			description: "editor.block-directional-force-projector.cooldown-broken-base",
			category: "combat",
		}),
	),
	length: v.pipe(
		v.optional(v.number(), 40),
		metadata({ name: "length", type: "number", description: "editor.block-directional-force-projector.length", category: "combat" }),
	),
	padSize: v.pipe(
		v.optional(v.number(), 40),
		metadata({ name: "padSize", type: "number", description: "editor.block-directional-force-projector.pad-size", category: "combat" }),
	),
});

const baseShieldObjectSchema = v.object({
	radius: v.pipe(
		v.optional(v.number(), 200),
		metadata({ name: "radius", type: "number", description: "editor.block-base-shield.radius", category: "combat" }),
	),
	sides: v.pipe(
		v.optional(v.number(), 24),
		metadata({ name: "sides", type: "number", description: "editor.block-base-shield.sides", category: "combat" }),
	),
});

// Turret variant schemas
const baseTurretObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({ name: "range", type: "number", description: "editor.block-base-turret.range", category: "combat" }),
	),
	placeOverlapMargin: v.pipe(
		v.optional(v.number(), 56),
		metadata({
			name: "placeOverlapMargin",
			type: "number",
			description: "editor.block-base-turret.place-overlap-margin",
			category: "combat",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "rotateSpeed", type: "number", description: "editor.block-base-turret.rotate-speed", category: "combat" }),
	),
	fogRadiusMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "fogRadiusMultiplier",
			type: "number",
			description: "editor.block-base-turret.fog-radius-multiplier",
			category: "combat",
		}),
	),
	disableOverlapCheck: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "disableOverlapCheck",
			type: "boolean",
			description: "editor.block-base-turret.disable-overlap-check",
			category: "combat",
		}),
	),
	activationTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "activationTime", type: "number", description: "editor.block-base-turret.activation-time", category: "combat" }),
	),
	coolantMultiplier: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "coolantMultiplier",
			type: "number",
			description: "editor.block-base-turret.coolant-multiplier",
			category: "combat",
		}),
	),
});

const reloadTurretObjectSchema = v.object({
	reload: v.pipe(
		v.optional(v.number(), 10),
		metadata({ name: "reload", type: "number", description: "editor.block-reload-turret.reload", category: "combat" }),
	),
});

const turretObjectSchema = v.object({
	targetInterval: v.pipe(
		v.optional(v.number(), 20),
		metadata({ name: "targetInterval", type: "number", description: "editor.block-turret.target-interval", category: "combat" }),
	),
	newTargetInterval: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "newTargetInterval", type: "number", description: "editor.block-turret.new-target-interval", category: "combat" }),
	),
	maxAmmo: v.pipe(
		v.optional(v.number(), 30),
		metadata({ name: "maxAmmo", type: "number", description: "editor.block-turret.max-ammo", category: "combat" }),
	),
	ammoPerShot: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "ammoPerShot", type: "number", description: "editor.block-turret.ammo-per-shot", category: "combat" }),
	),
	consumeAmmoOnce: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "consumeAmmoOnce", type: "boolean", description: "editor.block-turret.consume-ammo-once", category: "combat" }),
	),
	heatRequirement: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "heatRequirement", type: "number", description: "editor.block-turret.heat-requirement", category: "combat" }),
	),
	maxHeatEfficiency: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "maxHeatEfficiency", type: "number", description: "editor.block-turret.max-heat-efficiency", category: "combat" }),
	),
	inaccuracy: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "inaccuracy", type: "number", description: "editor.block-turret.inaccuracy", category: "combat" }),
	),
	velocityRnd: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "velocityRnd", type: "number", description: "editor.block-turret.velocity-rnd", category: "combat" }),
	),
	scaleLifetimeOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "scaleLifetimeOffset",
			type: "number",
			description: "editor.block-turret.scale-lifetime-offset",
			category: "combat",
		}),
	),
	shootCone: v.pipe(
		v.optional(v.number(), 8),
		metadata({ name: "shootCone", type: "number", description: "editor.block-turret.shoot-cone", category: "combat" }),
	),
	shootX: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "shootX", type: "number", description: "editor.block-turret.shoot-x", category: "combat" }),
	),
	shootY: v.pipe(
		v.optional(v.number()),
		metadata({ name: "shootY", type: "number", description: "editor.block-turret.shoot-y", category: "combat" }),
	),
	xRand: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "xRand", type: "number", description: "editor.block-turret.x-rand", category: "combat" }),
	),
	drawMinRange: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "drawMinRange", type: "boolean", description: "editor.block-turret.draw-min-range", category: "combat" }),
	),
	trackingRange: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "trackingRange", type: "number", description: "editor.block-turret.tracking-range", category: "combat" }),
	),
	minRange: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "minRange", type: "number", description: "editor.block-turret.min-range", category: "combat" }),
	),
	minWarmup: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "minWarmup", type: "number", description: "editor.block-turret.min-warmup", category: "combat" }),
	),
	accurateDelay: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "accurateDelay", type: "boolean", description: "editor.block-turret.accurate-delay", category: "combat" }),
	),
	moveWhileCharging: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "moveWhileCharging", type: "boolean", description: "editor.block-turret.move-while-charging", category: "combat" }),
	),
	reloadWhileCharging: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "reloadWhileCharging",
			type: "boolean",
			description: "editor.block-turret.reload-while-charging",
			category: "combat",
		}),
	),
	warmupMaintainTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "warmupMaintainTime", type: "number", description: "editor.block-turret.warmup-maintain-time", category: "combat" }),
	),
	targetAir: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "targetAir", type: "boolean", description: "editor.block-turret.target-air", category: "combat" }),
	),
	targetGround: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "targetGround", type: "boolean", description: "editor.block-turret.target-ground", category: "combat" }),
	),
	targetBlocks: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "targetBlocks", type: "boolean", description: "editor.block-turret.target-blocks", category: "combat" }),
	),
	targetHealing: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "targetHealing", type: "boolean", description: "editor.block-turret.target-healing", category: "combat" }),
	),
	playerControllable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "playerControllable", type: "boolean", description: "editor.block-turret.player-controllable", category: "combat" }),
	),
	displayAmmoMultiplier: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "displayAmmoMultiplier",
			type: "boolean",
			description: "editor.block-turret.display-ammo-multiplier",
			category: "combat",
		}),
	),
	targetUnderBlocks: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "targetUnderBlocks", type: "boolean", description: "editor.block-turret.target-under-blocks", category: "combat" }),
	),
	alwaysShooting: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "alwaysShooting", type: "boolean", description: "editor.block-turret.always-shooting", category: "combat" }),
	),
	predictTarget: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "predictTarget", type: "boolean", description: "editor.block-turret.predict-target", category: "combat" }),
	),
	shootSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "shootSoundVolume", type: "number", description: "editor.block-turret.shoot-sound-volume", category: "combat" }),
	),
	loopSoundVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({ name: "loopSoundVolume", type: "number", description: "editor.block-turret.loop-sound-volume", category: "combat" }),
	),
	soundPitchMin: v.pipe(
		v.optional(v.number(), 0.9),
		metadata({ name: "soundPitchMin", type: "number", description: "editor.block-turret.sound-pitch-min", category: "combat" }),
	),
	soundPitchMax: v.pipe(
		v.optional(v.number(), 1.1),
		metadata({ name: "soundPitchMax", type: "number", description: "editor.block-turret.sound-pitch-max", category: "combat" }),
	),
	ammoEjectBack: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "ammoEjectBack", type: "number", description: "editor.block-turret.ammo-eject-back", category: "combat" }),
	),
	shootWarmupSpeed: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({ name: "shootWarmupSpeed", type: "number", description: "editor.block-turret.shoot-warmup-speed", category: "combat" }),
	),
	linearWarmup: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "linearWarmup", type: "boolean", description: "editor.block-turret.linear-warmup", category: "combat" }),
	),
	recoil: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "recoil", type: "number", description: "editor.block-turret.recoil", category: "combat" }),
	),
	recoils: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "recoils", type: "number", description: "editor.block-turret.recoils", category: "combat" }),
	),
	recoilTime: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "recoilTime", type: "number", description: "editor.block-turret.recoil-time", category: "combat" }),
	),
	recoilPow: v.pipe(
		v.optional(v.number(), 1.8),
		metadata({ name: "recoilPow", type: "number", description: "editor.block-turret.recoil-pow", category: "combat" }),
	),
	cooldownTime: v.pipe(
		v.optional(v.number(), 20),
		metadata({ name: "cooldownTime", type: "number", description: "editor.block-turret.cooldown-time", category: "combat" }),
	),
	elevation: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "elevation", type: "number", description: "editor.block-turret.elevation", category: "combat" }),
	),
	shake: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "shake", type: "number", description: "editor.block-turret.shake", category: "combat" }),
	),
});

const powerTurretObjectSchema = v.object({
	shootType: v.pipe(
		v.optional(v.string()),
		metadata({ name: "shootType", type: "bullet", description: "editor.block-power-turret.shoot-type", category: "combat" }),
	),
});

const laserTurretObjectSchema = v.object({
	firingMoveFract: v.pipe(
		v.optional(v.number(), 0.25),
		metadata({ name: "firingMoveFract", type: "number", description: "editor.block-laser-turret.firing-move-fract", category: "combat" }),
	),
	shootDuration: v.pipe(
		v.optional(v.number(), 100),
		metadata({ name: "shootDuration", type: "number", description: "editor.block-laser-turret.shoot-duration", category: "combat" }),
	),
});

const continuousTurretObjectSchema = v.object({
	shootType: v.pipe(
		v.optional(v.string()),
		metadata({ name: "shootType", type: "bullet", description: "editor.block-continuous-turret.shoot-type", category: "combat" }),
	),
	aimChangeSpeed: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "aimChangeSpeed",
			type: "number",
			description: "editor.block-continuous-turret.aim-change-speed",
			category: "combat",
		}),
	),
	scaleDamageEfficiency: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "scaleDamageEfficiency",
			type: "boolean",
			description: "editor.block-continuous-turret.scale-damage-efficiency",
			category: "combat",
		}),
	),
});

const continuousLiquidTurretObjectSchema = v.object({
	liquidConsumed: v.pipe(
		v.optional(v.number(), 1 / 60),
		metadata({
			name: "liquidConsumed",
			type: "number",
			description: "editor.block-continuous-liquid-turret.liquid-consumed",
			category: "combat",
		}),
	),
});

const pointDefenseTurretObjectSchema = v.object({
	retargetTime: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "retargetTime",
			type: "number",
			description: "editor.block-point-defense-turret.retarget-time",
			category: "combat",
		}),
	),
	shootCone: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "shootCone", type: "number", description: "editor.block-point-defense-turret.shoot-cone", category: "combat" }),
	),
	bulletDamage: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "bulletDamage",
			type: "number",
			description: "editor.block-point-defense-turret.bullet-damage",
			category: "combat",
		}),
	),
	shootLength: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "shootLength", type: "number", description: "editor.block-point-defense-turret.shoot-length", category: "combat" }),
	),
});

const tractorBeamTurretObjectSchema = v.object({
	retargetTime: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "retargetTime", type: "number", description: "editor.block-tractor-beam-turret.retarget-time", category: "combat" }),
	),
	shootCone: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "shootCone", type: "number", description: "editor.block-tractor-beam-turret.shoot-cone", category: "combat" }),
	),
	shootLength: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "shootLength", type: "number", description: "editor.block-tractor-beam-turret.shoot-length", category: "combat" }),
	),
	laserWidth: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({ name: "laserWidth", type: "number", description: "editor.block-tractor-beam-turret.laser-width", category: "combat" }),
	),
	force: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({ name: "force", type: "number", description: "editor.block-tractor-beam-turret.force", category: "combat" }),
	),
	scaledForce: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "scaledForce", type: "number", description: "editor.block-tractor-beam-turret.scaled-force", category: "combat" }),
	),
	damage: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "damage", type: "number", description: "editor.block-tractor-beam-turret.damage", category: "combat" }),
	),
	targetAir: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "targetAir", type: "boolean", description: "editor.block-tractor-beam-turret.target-air", category: "combat" }),
	),
	targetGround: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "targetGround",
			type: "boolean",
			description: "editor.block-tractor-beam-turret.target-ground",
			category: "combat",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 300),
		metadata({
			name: "statusDuration",
			type: "number",
			description: "editor.block-tractor-beam-turret.status-duration",
			category: "combat",
		}),
	),
	shootSoundVolume: v.pipe(
		v.optional(v.number(), 0.9),
		metadata({
			name: "shootSoundVolume",
			type: "number",
			description: "editor.block-tractor-beam-turret.shoot-sound-volume",
			category: "combat",
		}),
	),
});

const buildTurretObjectSchema = v.object({
	targetInterval: v.pipe(
		v.optional(v.number(), 15),
		metadata({ name: "targetInterval", type: "number", description: "editor.block-build-turret.target-interval", category: "combat" }),
	),
	buildSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "buildSpeed", type: "number", description: "editor.block-build-turret.build-speed", category: "combat" }),
	),
	buildBeamOffset: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "buildBeamOffset", type: "number", description: "editor.block-build-turret.build-beam-offset", category: "combat" }),
	),
	elevation: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "elevation", type: "number", description: "editor.block-build-turret.elevation", category: "combat" }),
	),
});

// Distribution variant schemas
const conveyorObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "speed", type: "number", description: "editor.block-conveyor.speed", category: "distribution" }),
	),
	displayedSpeed: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "displayedSpeed", type: "number", description: "editor.block-conveyor.displayed-speed", category: "distribution" }),
	),
	pushUnits: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "pushUnits", type: "boolean", description: "editor.block-conveyor.push-units", category: "distribution" }),
	),
});

const stackConveyorObjectSchema = v.object({
	glowAlpha: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "glowAlpha", type: "number", description: "editor.block-stack-conveyor.glow-alpha", category: "distribution" }),
	),
	baseEfficiency: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "baseEfficiency",
			type: "number",
			description: "editor.block-stack-conveyor.base-efficiency",
			category: "distribution",
		}),
	),
	speed: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "speed", type: "number", description: "editor.block-stack-conveyor.speed", category: "distribution" }),
	),
	outputRouter: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "outputRouter",
			type: "boolean",
			description: "editor.block-stack-conveyor.output-router",
			category: "distribution",
		}),
	),
	recharge: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "recharge", type: "number", description: "editor.block-stack-conveyor.recharge", category: "distribution" }),
	),
});

const routerObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 8),
		metadata({ name: "speed", type: "number", description: "editor.block-router.speed", category: "distribution" }),
	),
});

const junctionObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 26),
		metadata({ name: "speed", type: "number", description: "editor.block-junction.speed", category: "distribution" }),
	),
	capacity: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "capacity", type: "number", description: "editor.block-junction.capacity", category: "distribution" }),
	),
	displayedSpeed: v.pipe(
		v.optional(v.number(), 13),
		metadata({ name: "displayedSpeed", type: "number", description: "editor.block-junction.displayed-speed", category: "distribution" }),
	),
});

const sorterObjectSchema = v.object({
	invert: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "invert", type: "boolean", description: "editor.block-sorter.invert", category: "distribution" }),
	),
});

const overflowGateObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "speed", type: "number", description: "editor.block-overflow-gate.speed", category: "distribution" }),
	),
	invert: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "invert", type: "boolean", description: "editor.block-overflow-gate.invert", category: "distribution" }),
	),
});

const itemBridgeObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "range", type: "number", description: "editor.block-item-bridge.range", category: "distribution" }),
	),
	transportTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "transportTime", type: "number", description: "editor.block-item-bridge.transport-time", category: "distribution" }),
	),
	fadeIn: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "fadeIn", type: "boolean", description: "editor.block-item-bridge.fade-in", category: "distribution" }),
	),
	moveArrows: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "moveArrows", type: "boolean", description: "editor.block-item-bridge.move-arrows", category: "distribution" }),
	),
	pulse: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "pulse", type: "boolean", description: "editor.block-item-bridge.pulse", category: "distribution" }),
	),
	arrowSpacing: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "arrowSpacing", type: "number", description: "editor.block-item-bridge.arrow-spacing", category: "distribution" }),
	),
	arrowOffset: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "arrowOffset", type: "number", description: "editor.block-item-bridge.arrow-offset", category: "distribution" }),
	),
	arrowPeriod: v.pipe(
		v.optional(v.number(), 0.4),
		metadata({ name: "arrowPeriod", type: "number", description: "editor.block-item-bridge.arrow-period", category: "distribution" }),
	),
	arrowTimeScl: v.pipe(
		v.optional(v.number(), 6.2),
		metadata({ name: "arrowTimeScl", type: "number", description: "editor.block-item-bridge.arrow-time-scl", category: "distribution" }),
	),
	bridgeWidth: v.pipe(
		v.optional(v.number(), 6.5),
		metadata({ name: "bridgeWidth", type: "number", description: "editor.block-item-bridge.bridge-width", category: "distribution" }),
	),
});

const bufferedItemBridgeObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 40),
		metadata({ name: "speed", type: "number", description: "editor.block-buffered-item-bridge.speed", category: "distribution" }),
	),
	bufferCapacity: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "bufferCapacity",
			type: "number",
			description: "editor.block-buffered-item-bridge.buffer-capacity",
			category: "distribution",
		}),
	),
	displayedSpeed: v.pipe(
		v.optional(v.number(), 11),
		metadata({
			name: "displayedSpeed",
			type: "number",
			description: "editor.block-buffered-item-bridge.displayed-speed",
			category: "distribution",
		}),
	),
});

const directionBridgeObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "range", type: "number", description: "editor.block-direction-bridge.range", category: "distribution" }),
	),
});

const directionLiquidBridgeObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "speed", type: "number", description: "editor.block-direction-liquid-bridge.speed", category: "distribution" }),
	),
	liquidPadding: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "liquidPadding",
			type: "number",
			description: "editor.block-direction-liquid-bridge.liquid-padding",
			category: "distribution",
		}),
	),
});

const ductObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "speed", type: "number", description: "editor.block-duct.speed", category: "distribution" }),
	),
	armored: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "armored", type: "boolean", description: "editor.block-duct.armored", category: "distribution" }),
	),
});

const ductRouterObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "speed", type: "number", description: "editor.block-duct-router.speed", category: "distribution" }),
	),
});

const stackRouterObjectSchema = v.object({
	baseEfficiency: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "baseEfficiency",
			type: "number",
			description: "editor.block-stack-router.base-efficiency",
			category: "distribution",
		}),
	),
	glowAlpha: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "glowAlpha", type: "number", description: "editor.block-stack-router.glow-alpha", category: "distribution" }),
	),
});

const ductJunctionObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "speed", type: "number", description: "editor.block-duct-junction.speed", category: "distribution" }),
	),
});

const overflowDuctObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "speed", type: "number", description: "editor.block-overflow-duct.speed", category: "distribution" }),
	),
	invert: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "invert", type: "boolean", description: "editor.block-overflow-duct.invert", category: "distribution" }),
	),
});

const ductBridgeObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "speed", type: "number", description: "editor.block-duct-bridge.speed", category: "distribution" }),
	),
});

const massDriverObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "range", type: "number", description: "editor.block-mass-driver.range", category: "distribution" }),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "rotateSpeed", type: "number", description: "editor.block-mass-driver.rotate-speed", category: "distribution" }),
	),
	translation: v.pipe(
		v.optional(v.number(), 7),
		metadata({ name: "translation", type: "number", description: "editor.block-mass-driver.translation", category: "distribution" }),
	),
	minDistribute: v.pipe(
		v.optional(v.number(), 10),
		metadata({ name: "minDistribute", type: "number", description: "editor.block-mass-driver.min-distribute", category: "distribution" }),
	),
	knockback: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "knockback", type: "number", description: "editor.block-mass-driver.knockback", category: "distribution" }),
	),
	reload: v.pipe(
		v.optional(v.number(), 100),
		metadata({ name: "reload", type: "number", description: "editor.block-mass-driver.reload", category: "distribution" }),
	),
	bulletSpeed: v.pipe(
		v.optional(v.number(), 5.5),
		metadata({ name: "bulletSpeed", type: "number", description: "editor.block-mass-driver.bullet-speed", category: "distribution" }),
	),
	bulletLifetime: v.pipe(
		v.optional(v.number(), 200),
		metadata({
			name: "bulletLifetime",
			type: "number",
			description: "editor.block-mass-driver.bullet-lifetime",
			category: "distribution",
		}),
	),
	shootSoundVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "shootSoundVolume",
			type: "number",
			description: "editor.block-mass-driver.shoot-sound-volume",
			category: "distribution",
		}),
	),
	shake: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "shake", type: "number", description: "editor.block-mass-driver.shake", category: "distribution" }),
	),
});

const directionalUnloaderObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "speed", type: "number", description: "editor.block-directional-unloader.speed", category: "distribution" }),
	),
	allowCoreUnload: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "allowCoreUnload",
			type: "boolean",
			description: "editor.block-directional-unloader.allow-core-unload",
			category: "distribution",
		}),
	),
});

// Payload variant schemas
const payloadBlockObjectSchema = v.object({
	payloadSpeed: v.pipe(
		v.optional(v.number(), 0.7),
		metadata({ name: "payloadSpeed", type: "number", description: "editor.block-payload-block.payload-speed", category: "payload" }),
	),
	payloadRotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "payloadRotateSpeed",
			type: "number",
			description: "editor.block-payload-block.payload-rotate-speed",
			category: "payload",
		}),
	),
});

const payloadConveyorObjectSchema = v.object({
	moveTime: v.pipe(
		v.optional(v.number(), 45),
		metadata({ name: "moveTime", type: "number", description: "editor.block-payload-conveyor.move-time", category: "payload" }),
	),
	moveForce: v.pipe(
		v.optional(v.number(), 201),
		metadata({ name: "moveForce", type: "number", description: "editor.block-payload-conveyor.move-force", category: "payload" }),
	),
	payloadLimit: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "payloadLimit", type: "number", description: "editor.block-payload-conveyor.payload-limit", category: "payload" }),
	),
	pushUnits: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "pushUnits", type: "boolean", description: "editor.block-payload-conveyor.push-units", category: "payload" }),
	),
});

const payloadRouterObjectSchema = v.object({
	invert: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "invert", type: "boolean", description: "editor.block-payload-router.invert", category: "payload" }),
	),
});

const payloadVoidObjectSchema = v.object({});

const payloadMassDriverObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 100),
		metadata({ name: "range", type: "number", description: "editor.block-payload-mass-driver.range", category: "payload" }),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "rotateSpeed", type: "number", description: "editor.block-payload-mass-driver.rotate-speed", category: "payload" }),
	),
	length: v.pipe(
		v.optional(v.number(), 11.125),
		metadata({ name: "length", type: "number", description: "editor.block-payload-mass-driver.length", category: "payload" }),
	),
	knockback: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "knockback", type: "number", description: "editor.block-payload-mass-driver.knockback", category: "payload" }),
	),
	reload: v.pipe(
		v.optional(v.number(), 30),
		metadata({ name: "reload", type: "number", description: "editor.block-payload-mass-driver.reload", category: "payload" }),
	),
	chargeTime: v.pipe(
		v.optional(v.number(), 100),
		metadata({ name: "chargeTime", type: "number", description: "editor.block-payload-mass-driver.charge-time", category: "payload" }),
	),
	maxPayloadSize: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "maxPayloadSize",
			type: "number",
			description: "editor.block-payload-mass-driver.max-payload-size",
			category: "payload",
		}),
	),
	grabWidth: v.pipe(
		v.optional(v.number(), 8),
		metadata({ name: "grabWidth", type: "number", description: "editor.block-payload-mass-driver.grab-width", category: "payload" }),
	),
	grabHeight: v.pipe(
		v.optional(v.number(), 2.75),
		metadata({ name: "grabHeight", type: "number", description: "editor.block-payload-mass-driver.grab-height", category: "payload" }),
	),
	shootSoundVolume: v.pipe(
		v.optional(v.number(), 0.7),
		metadata({
			name: "shootSoundVolume",
			type: "number",
			description: "editor.block-payload-mass-driver.shoot-sound-volume",
			category: "payload",
		}),
	),
	shake: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "shake", type: "number", description: "editor.block-payload-mass-driver.shake", category: "payload" }),
	),
});

const payloadLoaderObjectSchema = v.object({
	loadTime: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "loadTime", type: "number", description: "editor.block-payload-loader.load-time", category: "payload" }),
	),
	itemsLoaded: v.pipe(
		v.optional(v.number(), 8),
		metadata({ name: "itemsLoaded", type: "number", description: "editor.block-payload-loader.items-loaded", category: "payload" }),
	),
	liquidsLoaded: v.pipe(
		v.optional(v.number(), 40),
		metadata({ name: "liquidsLoaded", type: "number", description: "editor.block-payload-loader.liquids-loaded", category: "payload" }),
	),
	maxBlockSize: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "maxBlockSize", type: "number", description: "editor.block-payload-loader.max-block-size", category: "payload" }),
	),
	maxPowerConsumption: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "maxPowerConsumption",
			type: "number",
			description: "editor.block-payload-loader.max-power-consumption",
			category: "payload",
		}),
	),
	loadPowerDynamic: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "loadPowerDynamic",
			type: "boolean",
			description: "editor.block-payload-loader.load-power-dynamic",
			category: "payload",
		}),
	),
	basePowerUse: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "basePowerUse", type: "number", description: "editor.block-payload-loader.base-power-use", category: "payload" }),
	),
});

const payloadUnloaderObjectSchema = v.object({
	offloadSpeed: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "offloadSpeed", type: "number", description: "editor.block-payload-unloader.offload-speed", category: "payload" }),
	),
	maxPowerUnload: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "maxPowerUnload",
			type: "number",
			description: "editor.block-payload-unloader.max-power-unload",
			category: "payload",
		}),
	),
});

const payloadDeconstructorObjectSchema = v.object({
	maxPayloadSize: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "maxPayloadSize",
			type: "number",
			description: "editor.block-payload-deconstructor.max-payload-size",
			category: "payload",
		}),
	),
	deconstructSpeed: v.pipe(
		v.optional(v.number(), 2.5),
		metadata({
			name: "deconstructSpeed",
			type: "number",
			description: "editor.block-payload-deconstructor.deconstruct-speed",
			category: "payload",
		}),
	),
	dumpRate: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "dumpRate", type: "number", description: "editor.block-payload-deconstructor.dump-rate", category: "payload" }),
	),
});

const blockProducerObjectSchema = v.object({
	buildSpeed: v.pipe(
		v.optional(v.number(), 0.4),
		metadata({ name: "buildSpeed", type: "number", description: "editor.block-block-producer.build-speed", category: "payload" }),
	),
});

const constructorObjectSchema = v.object({
	minBlockSize: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "minBlockSize", type: "number", description: "editor.block-constructor.min-block-size", category: "payload" }),
	),
	maxBlockSize: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "maxBlockSize", type: "number", description: "editor.block-constructor.max-block-size", category: "payload" }),
	),
});

const singleBlockProducerObjectSchema = v.object({
	result: v.pipe(
		v.optional(v.string()),
		metadata({ name: "result", type: "string", description: "editor.block-single-block-producer.result", category: "payload" }),
	),
});

// Unit variant schemas
const unitFactoryObjectSchema = v.object({
	capacities: v.pipe(
		v.optional(v.array(v.number()), []),
		metadata({ name: "capacities", type: "array", description: "editor.block-unit-factory.capacities", category: "units" }),
	),
	createSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "createSoundVolume",
			type: "number",
			description: "editor.block-unit-factory.create-sound-volume",
			category: "units",
		}),
	),
});

const reconstructorObjectSchema = v.object({
	constructTime: v.pipe(
		v.optional(v.number(), 120),
		metadata({ name: "constructTime", type: "number", description: "editor.block-reconstructor.construct-time", category: "units" }),
	),
	capacities: v.pipe(
		v.optional(v.array(v.number()), []),
		metadata({ name: "capacities", type: "array", description: "editor.block-reconstructor.capacities", category: "units" }),
	),
	createSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "createSoundVolume",
			type: "number",
			description: "editor.block-reconstructor.create-sound-volume",
			category: "units",
		}),
	),
});

const unitAssemblerModuleObjectSchema = v.object({
	tier: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "tier", type: "number", description: "editor.block-unit-assembler-module.tier", category: "units" }),
	),
});

const unitAssemblerObjectSchema = v.object({
	areaSize: v.pipe(
		v.optional(v.number(), 11),
		metadata({ name: "areaSize", type: "number", description: "editor.block-unit-assembler.area-size", category: "units" }),
	),
	dronesCreated: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "dronesCreated", type: "number", description: "editor.block-unit-assembler.drones-created", category: "units" }),
	),
	droneConstructTime: v.pipe(
		v.optional(v.number(), 240),
		metadata({
			name: "droneConstructTime",
			type: "number",
			description: "editor.block-unit-assembler.drone-construct-time",
			category: "units",
		}),
	),
	capacities: v.pipe(
		v.optional(v.array(v.number()), []),
		metadata({ name: "capacities", type: "array", description: "editor.block-unit-assembler.capacities", category: "units" }),
	),
	createSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "createSoundVolume",
			type: "number",
			description: "editor.block-unit-assembler.create-sound-volume",
			category: "units",
		}),
	),
});

const unitCargoUnloadPointObjectSchema = v.object({
	staleTimeDuration: v.pipe(
		v.optional(v.number(), 360),
		metadata({
			name: "staleTimeDuration",
			type: "number",
			description: "editor.block-unit-cargo-unload-point.stale-time-duration",
			category: "units",
		}),
	),
});

const unitCargoLoaderObjectSchema = v.object({
	unitBuildTime: v.pipe(
		v.optional(v.number(), 480),
		metadata({ name: "unitBuildTime", type: "number", description: "editor.block-unit-cargo-loader.unit-build-time", category: "units" }),
	),
	polyStroke: v.pipe(
		v.optional(v.number(), 1.8),
		metadata({ name: "polyStroke", type: "number", description: "editor.block-unit-cargo-loader.poly-stroke", category: "units" }),
	),
	polyRadius: v.pipe(
		v.optional(v.number(), 8),
		metadata({ name: "polyRadius", type: "number", description: "editor.block-unit-cargo-loader.poly-radius", category: "units" }),
	),
	polySides: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "polySides", type: "number", description: "editor.block-unit-cargo-loader.poly-sides", category: "units" }),
	),
	polyRotateSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "polyRotateSpeed",
			type: "number",
			description: "editor.block-unit-cargo-loader.poly-rotate-speed",
			category: "units",
		}),
	),
});

const repairTurretObjectSchema = v.object({
	repairRadius: v.pipe(
		v.optional(v.number(), 50),
		metadata({ name: "repairRadius", type: "number", description: "editor.block-repair-turret.repair-radius", category: "units" }),
	),
	repairSpeed: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({ name: "repairSpeed", type: "number", description: "editor.block-repair-turret.repair-speed", category: "units" }),
	),
	powerUse: v.pipe(
		v.optional(v.number()),
		metadata({ name: "powerUse", type: "number", description: "editor.block-repair-turret.power-use", category: "units" }),
	),
	length: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "length", type: "number", description: "editor.block-repair-turret.length", category: "units" }),
	),
	beamWidth: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "beamWidth", type: "number", description: "editor.block-repair-turret.beam-width", category: "units" }),
	),
	pulseRadius: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "pulseRadius", type: "number", description: "editor.block-repair-turret.pulse-radius", category: "units" }),
	),
	pulseStroke: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "pulseStroke", type: "number", description: "editor.block-repair-turret.pulse-stroke", category: "units" }),
	),
	acceptCoolant: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "acceptCoolant", type: "boolean", description: "editor.block-repair-turret.accept-coolant", category: "units" }),
	),
	coolantUse: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({ name: "coolantUse", type: "number", description: "editor.block-repair-turret.coolant-use", category: "units" }),
	),
	coolantMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "coolantMultiplier",
			type: "number",
			description: "editor.block-repair-turret.coolant-multiplier",
			category: "units",
		}),
	),
});

const repairTowerObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({ name: "range", type: "number", description: "editor.block-repair-tower.range", category: "units" }),
	),
	circleSpeed: v.pipe(
		v.optional(v.number(), 120),
		metadata({ name: "circleSpeed", type: "number", description: "editor.block-repair-tower.circle-speed", category: "units" }),
	),
	circleStroke: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "circleStroke", type: "number", description: "editor.block-repair-tower.circle-stroke", category: "units" }),
	),
	squareRad: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "squareRad", type: "number", description: "editor.block-repair-tower.square-rad", category: "units" }),
	),
	squareSpinScl: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({ name: "squareSpinScl", type: "number", description: "editor.block-repair-tower.square-spin-scl", category: "units" }),
	),
	glowMag: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({ name: "glowMag", type: "number", description: "editor.block-repair-tower.glow-mag", category: "units" }),
	),
	glowScl: v.pipe(
		v.optional(v.number(), 8),
		metadata({ name: "glowScl", type: "number", description: "editor.block-repair-tower.glow-scl", category: "units" }),
	),
	healAmount: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "healAmount", type: "number", description: "editor.block-repair-tower.heal-amount", category: "units" }),
	),
});

const droneCenterObjectSchema = v.object({
	unitsSpawned: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "unitsSpawned", type: "number", description: "editor.block-drone-center.units-spawned", category: "units" }),
	),
	droneConstructTime: v.pipe(
		v.optional(v.number(), 180),
		metadata({
			name: "droneConstructTime",
			type: "number",
			description: "editor.block-drone-center.drone-construct-time",
			category: "units",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({ name: "statusDuration", type: "number", description: "editor.block-drone-center.status-duration", category: "units" }),
	),
	droneRange: v.pipe(
		v.optional(v.number(), 50),
		metadata({ name: "droneRange", type: "number", description: "editor.block-drone-center.drone-range", category: "units" }),
	),
});

// Logic variant schemas
const logicBlockObjectSchema = v.object({
	maxInstructionScale: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "maxInstructionScale",
			type: "number",
			description: "editor.block-logic-block.max-instruction-scale",
			category: "logic",
		}),
	),
	instructionsPerTick: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "instructionsPerTick",
			type: "number",
			description: "editor.block-logic-block.instructions-per-tick",
			category: "logic",
		}),
	),
	maxInstructionsPerTick: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "maxInstructionsPerTick",
			type: "number",
			description: "editor.block-logic-block.max-instructions-per-tick",
			category: "logic",
		}),
	),
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({ name: "range", type: "number", description: "editor.block-logic-block.range", category: "logic" }),
	),
});

const logicDisplayObjectSchema = v.object({
	maxSides: v.pipe(
		v.optional(v.number(), 25),
		metadata({ name: "maxSides", type: "number", description: "editor.block-logic-display.max-sides", category: "logic" }),
	),
	displaySize: v.pipe(
		v.optional(v.number(), 64),
		metadata({ name: "displaySize", type: "number", description: "editor.block-logic-display.display-size", category: "logic" }),
	),
	scaleFactor: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "scaleFactor", type: "number", description: "editor.block-logic-display.scale-factor", category: "logic" }),
	),
});

const tileableLogicDisplayObjectSchema = v.object({
	maxDisplayDimensions: v.pipe(
		v.optional(v.number(), 16),
		metadata({
			name: "maxDisplayDimensions",
			type: "number",
			description: "editor.block-tileable-logic-display.max-display-dimensions",
			category: "logic",
		}),
	),
	frameSize: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "frameSize", type: "number", description: "editor.block-tileable-logic-display.frame-size", category: "logic" }),
	),
});

const messageBlockObjectSchema = v.object({
	maxTextLength: v.pipe(
		v.optional(v.number(), 400),
		metadata({ name: "maxTextLength", type: "number", description: "editor.block-message-block.max-text-length", category: "logic" }),
	),
	maxNewlines: v.pipe(
		v.optional(v.number(), 24),
		metadata({ name: "maxNewlines", type: "number", description: "editor.block-message-block.max-newlines", category: "logic" }),
	),
});

const memoryBlockObjectSchema = v.object({
	memoryCapacity: v.pipe(
		v.optional(v.number(), 32),
		metadata({ name: "memoryCapacity", type: "number", description: "editor.block-memory-block.memory-capacity", category: "logic" }),
	),
});

const canvasBlockObjectSchema = v.object({
	padding: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "padding", type: "number", description: "editor.block-canvas-block.padding", category: "logic" }),
	),
	canvasSize: v.pipe(
		v.optional(v.number(), 8),
		metadata({ name: "canvasSize", type: "number", description: "editor.block-canvas-block.canvas-size", category: "logic" }),
	),
	palette: v.pipe(
		v.optional(v.array(v.number())),
		metadata({ name: "palette", type: "array", description: "editor.block-canvas-block.palette", category: "logic" }),
	),
	bitsPerPixel: v.pipe(
		v.optional(v.number()),
		metadata({ name: "bitsPerPixel", type: "number", description: "editor.block-canvas-block.bits-per-pixel", category: "logic" }),
	),
});

// Heat variant schemas
const heatConductorObjectSchema = v.object({
	visualMaxHeat: v.pipe(
		v.optional(v.number(), 15),
		metadata({ name: "visualMaxHeat", type: "number", description: "editor.block-heat-conductor.visual-max-heat", category: "heat" }),
	),
	splitHeat: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "splitHeat", type: "boolean", description: "editor.block-heat-conductor.split-heat", category: "heat" }),
	),
});

// Environment variant schemas
const floorObjectSchema = v.object({
	edge: v.pipe(
		v.optional(v.string(), "stone"),
		metadata({ name: "edge", type: "string", description: "editor.block-floor.edge", category: "environment" }),
	),
	speedMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "speedMultiplier", type: "number", description: "editor.block-floor.speed-multiplier", category: "environment" }),
	),
	dragMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "dragMultiplier", type: "number", description: "editor.block-floor.drag-multiplier", category: "environment" }),
	),
	damageTaken: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "damageTaken", type: "number", description: "editor.block-floor.damage-taken", category: "environment" }),
	),
	drownTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "drownTime", type: "number", description: "editor.block-floor.drown-time", category: "environment" }),
	),
	walkSoundVolume: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({ name: "walkSoundVolume", type: "number", description: "editor.block-floor.walk-sound-volume", category: "environment" }),
	),
	walkSoundPitchMin: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "walkSoundPitchMin",
			type: "number",
			description: "editor.block-floor.walk-sound-pitch-min",
			category: "environment",
		}),
	),
	walkSoundPitchMax: v.pipe(
		v.optional(v.number(), 1.2),
		metadata({
			name: "walkSoundPitchMax",
			type: "number",
			description: "editor.block-floor.walk-sound-pitch-max",
			category: "environment",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 60),
		metadata({ name: "statusDuration", type: "number", description: "editor.block-floor.status-duration", category: "environment" }),
	),
	isLiquid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "isLiquid", type: "boolean", description: "editor.block-floor.is-liquid", category: "environment" }),
	),
	overlayAlpha: v.pipe(
		v.optional(v.number(), 0.65),
		metadata({ name: "overlayAlpha", type: "number", description: "editor.block-floor.overlay-alpha", category: "environment" }),
	),
	supportsOverlay: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "supportsOverlay", type: "boolean", description: "editor.block-floor.supports-overlay", category: "environment" }),
	),
	shallow: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "shallow", type: "boolean", description: "editor.block-floor.shallow", category: "environment" }),
	),
	oreDefault: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "oreDefault", type: "boolean", description: "editor.block-floor.ore-default", category: "environment" }),
	),
	oreScale: v.pipe(
		v.optional(v.number(), 24),
		metadata({ name: "oreScale", type: "number", description: "editor.block-floor.ore-scale", category: "environment" }),
	),
	oreThreshold: v.pipe(
		v.optional(v.number(), 0.828),
		metadata({ name: "oreThreshold", type: "number", description: "editor.block-floor.ore-threshold", category: "environment" }),
	),
	canShadow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "canShadow", type: "boolean", description: "editor.block-floor.can-shadow", category: "environment" }),
	),
	forceDrawLight: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "forceDrawLight", type: "boolean", description: "editor.block-floor.force-draw-light", category: "environment" }),
	),
	needsSurface: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "needsSurface", type: "boolean", description: "editor.block-floor.needs-surface", category: "environment" }),
	),
	allowCorePlacement: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "allowCorePlacement",
			type: "boolean",
			description: "editor.block-floor.allow-core-placement",
			category: "environment",
		}),
	),
	wallOre: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "wallOre", type: "boolean", description: "editor.block-floor.wall-ore", category: "environment" }),
	),
	blendId: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "blendId", type: "number", description: "editor.block-floor.blend-id", category: "environment" }),
	),
	tilingVariants: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "tilingVariants", type: "number", description: "editor.block-floor.tiling-variants", category: "environment" }),
	),
	autotile: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "autotile", type: "boolean", description: "editor.block-floor.autotile", category: "environment" }),
	),
	autotileMidVariants: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "autotileMidVariants",
			type: "number",
			description: "editor.block-floor.autotile-mid-variants",
			category: "environment",
		}),
	),
	autotileVariants: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "autotileVariants", type: "number", description: "editor.block-floor.autotile-variants", category: "environment" }),
	),
	drawEdgeIn: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawEdgeIn", type: "boolean", description: "editor.block-floor.draw-edge-in", category: "environment" }),
	),
	drawEdgeOut: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawEdgeOut", type: "boolean", description: "editor.block-floor.draw-edge-out", category: "environment" }),
	),
});

const coloredFloorObjectSchema = v.object({});

const treeBlockObjectSchema = v.object({
	shadowOffset: v.pipe(
		v.optional(v.number(), -4),
		metadata({ name: "shadowOffset", type: "number", description: "editor.block-tree-block.shadow-offset", category: "environment" }),
	),
});

const tallBlockObjectSchema = v.object({
	shadowOffset: v.pipe(
		v.optional(v.number(), -3),
		metadata({ name: "shadowOffset", type: "number", description: "editor.block-tall-block.shadow-offset", category: "environment" }),
	),
	layer: v.pipe(
		v.optional(v.number()),
		metadata({ name: "layer", type: "number", description: "editor.block-tall-block.layer", category: "environment" }),
	),
	shadowLayer: v.pipe(
		v.optional(v.number()),
		metadata({ name: "shadowLayer", type: "number", description: "editor.block-tall-block.shadow-layer", category: "environment" }),
	),
	rotationRand: v.pipe(
		v.optional(v.number(), 20),
		metadata({ name: "rotationRand", type: "number", description: "editor.block-tall-block.rotation-rand", category: "environment" }),
	),
	shadowAlpha: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({ name: "shadowAlpha", type: "number", description: "editor.block-tall-block.shadow-alpha", category: "environment" }),
	),
});

const cliffObjectSchema = v.object({
	size: v.pipe(
		v.optional(v.number(), 11),
		metadata({ name: "size", type: "number", description: "editor.block-cliff.size", category: "environment" }),
	),
});

// Campaign variant schemas
const launchPadObjectSchema = v.object({
	launchTime: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "launchTime", type: "number", description: "editor.block-launch-pad.launch-time", category: "campaign" }),
	),
	launchSoundPitchRand: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "launchSoundPitchRand",
			type: "number",
			description: "editor.block-launch-pad.launch-sound-pitch-rand",
			category: "campaign",
		}),
	),
	acceptMultipleItems: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "acceptMultipleItems",
			type: "boolean",
			description: "editor.block-launch-pad.accept-multiple-items",
			category: "campaign",
		}),
	),
	lightStep: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "lightStep", type: "number", description: "editor.block-launch-pad.light-step", category: "campaign" }),
	),
	lightSteps: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "lightSteps", type: "number", description: "editor.block-launch-pad.light-steps", category: "campaign" }),
	),
	liquidPad: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "liquidPad", type: "number", description: "editor.block-launch-pad.liquid-pad", category: "campaign" }),
	),
});

const landingPadObjectSchema = v.object({
	arrivalDuration: v.pipe(
		v.optional(v.number(), 150),
		metadata({ name: "arrivalDuration", type: "number", description: "editor.block-landing-pad.arrival-duration", category: "campaign" }),
	),
	cooldownTime: v.pipe(
		v.optional(v.number(), 150),
		metadata({ name: "cooldownTime", type: "number", description: "editor.block-landing-pad.cooldown-time", category: "campaign" }),
	),
	consumeLiquidAmount: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "consumeLiquidAmount",
			type: "number",
			description: "editor.block-landing-pad.consume-liquid-amount",
			category: "campaign",
		}),
	),
	coolingEffectChance: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({
			name: "coolingEffectChance",
			type: "number",
			description: "editor.block-landing-pad.cooling-effect-chance",
			category: "campaign",
		}),
	),
	liquidPad: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "liquidPad", type: "number", description: "editor.block-landing-pad.liquid-pad", category: "campaign" }),
	),
	landSoundVolume: v.pipe(
		v.optional(v.number(), 0.75),
		metadata({
			name: "landSoundVolume",
			type: "number",
			description: "editor.block-landing-pad.land-sound-volume",
			category: "campaign",
		}),
	),
});

const acceleratorObjectSchema = v.object({
	lightningSoundVolume: v.pipe(
		v.optional(v.number(), 0.85),
		metadata({
			name: "lightningSoundVolume",
			type: "number",
			description: "editor.block-accelerator.lightning-sound-volume",
			category: "campaign",
		}),
	),
	launchDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({ name: "launchDuration", type: "number", description: "editor.block-accelerator.launch-duration", category: "campaign" }),
	),
	chargeDuration: v.pipe(
		v.optional(v.number(), 220),
		metadata({ name: "chargeDuration", type: "number", description: "editor.block-accelerator.charge-duration", category: "campaign" }),
	),
	buildDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({ name: "buildDuration", type: "number", description: "editor.block-accelerator.build-duration", category: "campaign" }),
	),
	landZoomFrom: v.pipe(
		v.optional(v.number(), 0.02),
		metadata({ name: "landZoomFrom", type: "number", description: "editor.block-accelerator.land-zoom-from", category: "campaign" }),
	),
	landZoomTo: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "landZoomTo", type: "number", description: "editor.block-accelerator.land-zoom-to", category: "campaign" }),
	),
	chargeZoomTo: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "chargeZoomTo", type: "number", description: "editor.block-accelerator.charge-zoom-to", category: "campaign" }),
	),
	chargeRings: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "chargeRings", type: "number", description: "editor.block-accelerator.charge-rings", category: "campaign" }),
	),
	ringRadBase: v.pipe(
		v.optional(v.number(), 60),
		metadata({ name: "ringRadBase", type: "number", description: "editor.block-accelerator.ring-rad-base", category: "campaign" }),
	),
	ringRadSpacing: v.pipe(
		v.optional(v.number(), 25),
		metadata({ name: "ringRadSpacing", type: "number", description: "editor.block-accelerator.ring-rad-spacing", category: "campaign" }),
	),
	ringRadPow: v.pipe(
		v.optional(v.number(), 1.6),
		metadata({ name: "ringRadPow", type: "number", description: "editor.block-accelerator.ring-rad-pow", category: "campaign" }),
	),
	ringStroke: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "ringStroke", type: "number", description: "editor.block-accelerator.ring-stroke", category: "campaign" }),
	),
	ringSpeedup: v.pipe(
		v.optional(v.number(), 1.4),
		metadata({ name: "ringSpeedup", type: "number", description: "editor.block-accelerator.ring-speedup", category: "campaign" }),
	),
	chargeRingMerge: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "chargeRingMerge",
			type: "number",
			description: "editor.block-accelerator.charge-ring-merge",
			category: "campaign",
		}),
	),
	ringArrowRad: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "ringArrowRad", type: "number", description: "editor.block-accelerator.ring-arrow-rad", category: "campaign" }),
	),
	ringHandleTilt: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({ name: "ringHandleTilt", type: "number", description: "editor.block-accelerator.ring-handle-tilt", category: "campaign" }),
	),
	ringHandleLen: v.pipe(
		v.optional(v.number(), 30),
		metadata({ name: "ringHandleLen", type: "number", description: "editor.block-accelerator.ring-handle-len", category: "campaign" }),
	),
	launchLightning: v.pipe(
		v.optional(v.number(), 20),
		metadata({ name: "launchLightning", type: "number", description: "editor.block-accelerator.launch-lightning", category: "campaign" }),
	),
	lightningDamage: v.pipe(
		v.optional(v.number(), 40),
		metadata({ name: "lightningDamage", type: "number", description: "editor.block-accelerator.lightning-damage", category: "campaign" }),
	),
	lightningOffset: v.pipe(
		v.optional(v.number(), 24),
		metadata({ name: "lightningOffset", type: "number", description: "editor.block-accelerator.lightning-offset", category: "campaign" }),
	),
	lightningLengthMin: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "lightningLengthMin",
			type: "number",
			description: "editor.block-accelerator.lightning-length-min",
			category: "campaign",
		}),
	),
	lightningLengthMax: v.pipe(
		v.optional(v.number(), 25),
		metadata({
			name: "lightningLengthMax",
			type: "number",
			description: "editor.block-accelerator.lightning-length-max",
			category: "campaign",
		}),
	),
	lightningLaunchChance: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "lightningLaunchChance",
			type: "number",
			description: "editor.block-accelerator.lightning-launch-chance",
			category: "campaign",
		}),
	),
});

// Sandbox variant schemas
const itemSourceObjectSchema = v.object({
	itemsPerSecond: v.pipe(
		v.optional(v.number(), 100),
		metadata({ name: "itemsPerSecond", type: "number", description: "editor.block-item-source.items-per-second", category: "sandbox" }),
	),
});

const classSchemaMap: Record<BlockType, SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>> = {
	// Power
	PowerBlock: (_context) => v.object({}),
	PowerDistributor: (_context) => v.object({}),
	PowerGenerator: (_context) => powerGeneratorObjectSchema,
	ConsumeGenerator: (_context) => consumeGeneratorObjectSchema,
	HeaterGenerator: (_context) => heaterGeneratorObjectSchema,
	SolarGenerator: (_context) => v.object({}),
	ThermalGenerator: (_context) => thermalGeneratorObjectSchema,
	NuclearReactor: (_context) => nuclearReactorObjectSchema,
	ImpactReactor: (_context) => impactReactorObjectSchema,
	VariableReactor: (_context) => variableReactorObjectSchema,
	Battery: (_context) => v.object({}),
	PowerNode: (_context) => powerNodeObjectSchema,
	LongPowerNode: (_context) => longPowerNodeObjectSchema,
	BeamNode: (_context) => beamNodeObjectSchema,
	PowerDiode: (_context) => v.object({}),
	LightBlock: (_context) => lightBlockObjectSchema,
	PowerVoid: (_context) => v.object({}),
	PowerSource: (_context) => powerSourceObjectSchema,
	// Storage
	StorageBlock: (_context) => storageBlockObjectSchema,
	CoreBlock: (_context) => coreBlockObjectSchema,
	Unloader: (_context) => unloaderObjectSchema,
	// Liquid
	LiquidBlock: (_context) => v.object({}),
	LiquidRouter: (_context) => liquidRouterObjectSchema,
	LiquidJunction: (_context) => v.object({}),
	Conduit: (_context) => conduitObjectSchema,
	ArmoredConduit: (_context) => v.object({}),
	LiquidBridge: (_context) => v.object({}),
	Pump: (_context) => pumpObjectSchema,
	SolidPump: (_context) => solidPumpObjectSchema,
	Fracker: (_context) => frackerObjectSchema,
	// Production
	GenericCrafter: (_context) => genericCrafterObjectSchema,
	HeatCrafter: (_context) => heatCrafterObjectSchema,
	AttributeCrafter: (_context) => attributeCrafterObjectSchema,
	Separator: (_context) => separatorObjectSchema,
	Drill: (_context) => drillObjectSchema,
	BurstDrill: (_context) => burstDrillObjectSchema,
	BeamDrill: (_context) => beamDrillObjectSchema,
	WallCrafter: (_context) => wallCrafterObjectSchema,
	ItemIncinerator: (_context) => itemIncineratorObjectSchema,
	Incinerator: (_context) => v.object({}),
	HeatProducer: (_context) => heatProducerObjectSchema,
	// Defense
	Wall: (_context) => wallObjectSchema,
	Thruster: (_context) => v.object({}),
	ShieldWall: (_context) => shieldWallObjectSchema,
	Door: (_context) => doorObjectSchema,
	AutoDoor: (_context) => autoDoorObjectSchema,
	ShockwaveTower: (_context) => shockwaveTowerObjectSchema,
	ShockMine: (_context) => shockMineObjectSchema,
	RegenProjector: (_context) => regenProjectorObjectSchema,
	Radar: (_context) => radarObjectSchema,
	OverdriveProjector: (_context) => overdriveProjectorObjectSchema,
	MendProjector: (_context) => mendProjectorObjectSchema,
	ForceProjector: (_context) => forceProjectorObjectSchema,
	DirectionalForceProjector: (_context) => directionalForceProjectorObjectSchema,
	BaseShield: (_context) => baseShieldObjectSchema,
	ConstructBlock: (_context) => v.object({}),
	// Turrets
	BaseTurret: (_context) => baseTurretObjectSchema,
	ReloadTurret: (_context) => reloadTurretObjectSchema,
	Turret: (_context) => turretObjectSchema,
	PowerTurret: (_context) => powerTurretObjectSchema,
	LaserTurret: (_context) => laserTurretObjectSchema,
	ItemTurret: (_context) => v.object({}),
	LiquidTurret: (_context) => v.object({}),
	ContinuousTurret: (_context) => continuousTurretObjectSchema,
	ContinuousLiquidTurret: (_context) => continuousLiquidTurretObjectSchema,
	PayloadAmmoTurret: (_context) => v.object({}),
	PointDefenseTurret: (_context) => pointDefenseTurretObjectSchema,
	TractorBeamTurret: (_context) => tractorBeamTurretObjectSchema,
	BuildTurret: (_context) => buildTurretObjectSchema,
	// Distribution
	Conveyor: (_context) => conveyorObjectSchema,
	ArmoredConveyor: (_context) => v.object({}),
	StackConveyor: (_context) => stackConveyorObjectSchema,
	Router: (_context) => routerObjectSchema,
	Junction: (_context) => junctionObjectSchema,
	Sorter: (_context) => sorterObjectSchema,
	OverflowGate: (_context) => overflowGateObjectSchema,
	ItemBridge: (_context) => itemBridgeObjectSchema,
	BufferedItemBridge: (_context) => bufferedItemBridgeObjectSchema,
	DirectionBridge: (_context) => directionBridgeObjectSchema,
	DirectionLiquidBridge: (_context) => directionLiquidBridgeObjectSchema,
	DuctBridge: (_context) => ductBridgeObjectSchema,
	Duct: (_context) => ductObjectSchema,
	DuctRouter: (_context) => ductRouterObjectSchema,
	StackRouter: (_context) => stackRouterObjectSchema,
	DuctJunction: (_context) => ductJunctionObjectSchema,
	OverflowDuct: (_context) => overflowDuctObjectSchema,
	MassDriver: (_context) => massDriverObjectSchema,
	DirectionalUnloader: (_context) => directionalUnloaderObjectSchema,
	// Payload
	PayloadBlock: (_context) => payloadBlockObjectSchema,
	PayloadConveyor: (_context) => payloadConveyorObjectSchema,
	PayloadRouter: (_context) => payloadRouterObjectSchema,
	PayloadVoid: (_context) => payloadVoidObjectSchema,
	PayloadSource: (_context) => v.object({}),
	PayloadMassDriver: (_context) => payloadMassDriverObjectSchema,
	PayloadLoader: (_context) => payloadLoaderObjectSchema,
	PayloadUnloader: (_context) => payloadUnloaderObjectSchema,
	PayloadDeconstructor: (_context) => payloadDeconstructorObjectSchema,
	BlockProducer: (_context) => blockProducerObjectSchema,
	Constructor: (_context) => constructorObjectSchema,
	SingleBlockProducer: (_context) => singleBlockProducerObjectSchema,
	// Unit
	UnitBlock: (_context) => v.object({}),
	UnitFactory: (_context) => unitFactoryObjectSchema,
	Reconstructor: (_context) => reconstructorObjectSchema,
	UnitAssemblerModule: (_context) => unitAssemblerModuleObjectSchema,
	UnitAssembler: (_context) => unitAssemblerObjectSchema,
	UnitCargoUnloadPoint: (_context) => unitCargoUnloadPointObjectSchema,
	UnitCargoLoader: (_context) => unitCargoLoaderObjectSchema,
	RepairTurret: (_context) => repairTurretObjectSchema,
	RepairTower: (_context) => repairTowerObjectSchema,
	DroneCenter: (_context) => droneCenterObjectSchema,
	// Logic
	LogicBlock: (_context) => logicBlockObjectSchema,
	LogicDisplay: (_context) => logicDisplayObjectSchema,
	TileableLogicDisplay: (_context) => tileableLogicDisplayObjectSchema,
	SwitchBlock: (_context) => v.object({}),
	MessageBlock: (_context) => messageBlockObjectSchema,
	MemoryBlock: (_context) => memoryBlockObjectSchema,
	CanvasBlock: (_context) => canvasBlockObjectSchema,
	// Heat
	HeatConductor: (_context) => heatConductorObjectSchema,
	// Environment
	Floor: (_context) => floorObjectSchema,
	OverlayFloor: (_context) => v.object({}),
	OreBlock: (_context) => v.object({}),
	ColoredFloor: (_context) => coloredFloorObjectSchema,
	EmptyFloor: (_context) => v.object({}),
	AirBlock: (_context) => v.object({}),
	Prop: (_context) => v.object({}),
	StaticWall: (_context) => v.object({}),
	TiledWall: (_context) => v.object({}),
	StaticTree: (_context) => v.object({}),
	ColoredWall: (_context) => coloredFloorObjectSchema,
	TreeBlock: (_context) => treeBlockObjectSchema,
	TallBlock: (_context) => tallBlockObjectSchema,
	RemoveWall: (_context) => v.object({}),
	Cliff: (_context) => cliffObjectSchema,
	// Campaign
	LaunchPad: (_context) => launchPadObjectSchema,
	LandingPad: (_context) => landingPadObjectSchema,
	Accelerator: (_context) => acceleratorObjectSchema,
	// Sandbox
	ItemSource: (_context) => itemSourceObjectSchema,
	ItemVoid: (_context) => v.object({}),
	LiquidSource: (_context) => v.object({}),
	LiquidVoid: (_context) => v.object({}),
};

export const blockObjectSchema = {
	type: v.pipe(v.optional(v.picklist(blockTypes)), metadata({ name: "type", type: "picklist" })),
	template: v.pipe(v.optional(v.string()), metadata({ name: "template", type: "string" })),

	// Items
	hasItems: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "hasItems", type: "boolean", description: "editor.block.has-items", category: "items" }),
	),
	hasLiquids: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "hasLiquids", type: "boolean", description: "editor.block.has-liquids", category: "liquids" }),
	),
	hasPower: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "hasPower", type: "boolean", description: "editor.block.has-power", category: "power" }),
	),
	outputsLiquid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "outputsLiquid", type: "boolean", description: "editor.block.outputs-liquid", category: "liquids" }),
	),
	consumesPower: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "consumesPower", type: "boolean", description: "editor.block.consumes-power", category: "power" }),
	),
	outputsPower: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "outputsPower", type: "boolean", description: "editor.block.outputs-power", category: "power" }),
	),
	connectedPower: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "connectedPower", type: "boolean", description: "editor.block.connected-power", category: "power" }),
	),
	conductivePower: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "conductivePower", type: "boolean", description: "editor.block.conductive-power", category: "power" }),
	),
	outputsPayload: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "outputsPayload", type: "boolean", description: "editor.block.outputs-payload", category: "payload" }),
	),
	acceptsUnitPayloads: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "acceptsUnitPayloads", type: "boolean", description: "editor.block.accepts-unit-payloads", category: "payload" }),
	),
	acceptsPayload: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "acceptsPayload", type: "boolean", description: "editor.block.accepts-payload", category: "payload" }),
	),
	acceptsItems: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "acceptsItems", type: "boolean", description: "editor.block.accepts-items", category: "items" }),
	),

	itemCapacity: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "itemCapacity",
			type: "number",
			description: "editor.block.item-capacity",
			category: "items",
			visibleWhen: { field: "hasItems", value: true },
		}),
	),
	liquidCapacity: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "liquidCapacity",
			type: "number",
			description: "editor.block.liquid-capacity",
			category: "liquids",
			visibleWhen: { field: "hasLiquids", value: true },
		}),
	),
	liquidPressure: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "liquidPressure",
			type: "number",
			description: "editor.block.liquid-pressure",
			category: "liquids",
			visibleWhen: { field: "hasLiquids", value: true },
		}),
	),
	separateItemCapacity: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "separateItemCapacity",
			type: "boolean",
			description: "editor.block.separate-item-capacity",
			category: "items",
			visibleWhen: { field: "hasItems", value: true },
		}),
	),

	alwaysAllowDeposit: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "alwaysAllowDeposit", type: "boolean", description: "editor.block.always-allow-deposit", category: "items" }),
	),
	depositCooldown: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "depositCooldown", type: "number", description: "editor.block.deposit-cooldown", category: "items" }),
	),
	displayFlow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "displayFlow", type: "boolean", description: "editor.block.display-flow", category: "rendering" }),
	),
	unloadable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "unloadable", type: "boolean", description: "editor.block.unloadable", category: "items" }),
	),
	allowResupply: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "allowResupply", type: "boolean", description: "editor.block.allow-resupply", category: "items" }),
	),

	// Placement & Size
	size: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "size", type: "number", description: "editor.block.size", category: "placement" }),
	),
	offset: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "offset", type: "number", description: "editor.block.offset", category: "placement" }),
	),
	sizeOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "sizeOffset", type: "number", description: "editor.block.size-offset", category: "placement" }),
	),
	rotate: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "rotate", type: "boolean", description: "editor.block.rotate", category: "placement" }),
	),
	rotateDraw: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "rotateDraw",
			type: "boolean",
			description: "editor.block.rotate-draw",
			category: "rendering",
			visibleWhen: { field: "rotate", value: true },
		}),
	),
	rotateDrawEditor: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "rotateDrawEditor",
			type: "boolean",
			description: "editor.block.rotate-draw-editor",
			category: "rendering",
			visibleWhen: { field: "rotate", value: true },
		}),
	),
	visualRotationOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "visualRotationOffset",
			type: "number",
			description: "editor.block.visual-rotation-offset",
			category: "rendering",
			visibleWhen: { field: "rotate", value: true },
		}),
	),
	lockRotation: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "lockRotation", type: "boolean", description: "editor.block.lock-rotation", category: "placement" }),
	),
	ignoreLineRotation: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "ignoreLineRotation", type: "boolean", description: "editor.block.ignore-line-rotation", category: "placement" }),
	),
	invertFlip: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "invertFlip", type: "boolean", description: "editor.block.invert-flip", category: "placement" }),
	),
	variants: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "variants", type: "number", description: "editor.block.variants", category: "rendering" }),
	),
	drawArrow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawArrow", type: "boolean", description: "editor.block.draw-arrow", category: "rendering" }),
	),
	drawTeamOverlay: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawTeamOverlay", type: "boolean", description: "editor.block.draw-team-overlay", category: "rendering" }),
	),
	drawCracks: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawCracks", type: "boolean", description: "editor.block.draw-cracks", category: "rendering" }),
	),
	drawDisabled: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawDisabled", type: "boolean", description: "editor.block.draw-disabled", category: "rendering" }),
	),
	drawLiquidLight: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "drawLiquidLight", type: "boolean", description: "editor.block.draw-liquid-light", category: "rendering" }),
	),
	enableDrawStatus: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "enableDrawStatus", type: "boolean", description: "editor.block.enable-draw-status", category: "rendering" }),
	),
	squareSprite: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "squareSprite", type: "boolean", description: "editor.block.square-sprite", category: "rendering" }),
	),
	fillsTile: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "fillsTile", type: "boolean", description: "editor.block.fills-tile", category: "rendering" }),
	),
	hasShadow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "hasShadow", type: "boolean", description: "editor.block.has-shadow", category: "rendering" }),
	),
	customShadow: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "customShadow", type: "boolean", description: "editor.block.custom-shadow", category: "rendering" }),
	),
	outlineIcon: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "outlineIcon", type: "boolean", description: "editor.block.outline-icon", category: "rendering" }),
	),
	outlineRadius: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "outlineRadius", type: "number", description: "editor.block.outline-radius", category: "rendering" }),
	),
	outlinedIcon: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "outlinedIcon", type: "number", description: "editor.block.outlined-icon", category: "rendering" }),
	),
	albedo: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "albedo", type: "number", description: "editor.block.albedo", category: "rendering" }),
	),
	emitLight: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "emitLight", type: "boolean", description: "editor.block.emit-light", category: "rendering" }),
	),
	obstructsLight: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "obstructsLight",
			type: "boolean",
			description: "editor.block.obstructs-light",
			category: "rendering",
			visibleWhen: { field: "emitLight", value: true },
		}),
	),
	lightRadius: v.pipe(
		v.optional(v.number(), 60),
		metadata({
			name: "lightRadius",
			type: "number",
			description: "editor.block.light-radius",
			category: "rendering",
			visibleWhen: { field: "emitLight", value: true },
		}),
	),
	lightClipSize: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "lightClipSize", type: "number", description: "editor.block.light-clip-size", category: "rendering" }),
	),
	forceDark: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "forceDark", type: "boolean", description: "editor.block.force-dark", category: "rendering" }),
	),
	useColor: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "useColor", type: "boolean", description: "editor.block.use-color", category: "rendering" }),
	),
	hasColor: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "hasColor", type: "boolean", description: "editor.block.has-color", category: "rendering" }),
	),

	// Placement
	placeablePlayer: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "placeablePlayer", type: "boolean", description: "editor.block.placeable-player", category: "placement" }),
	),
	placeableOn: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "placeableOn", type: "boolean", description: "editor.block.placeable-on", category: "placement" }),
	),
	placeableLiquid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "placeableLiquid", type: "boolean", description: "editor.block.placeable-liquid", category: "placement" }),
	),
	requiresWater: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "requiresWater", type: "boolean", description: "editor.block.requires-water", category: "placement" }),
	),
	floating: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "floating", type: "boolean", description: "editor.block.floating", category: "placement" }),
	),
	conveyorPlacement: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "conveyorPlacement", type: "boolean", description: "editor.block.conveyor-placement", category: "placement" }),
	),
	allowDiagonal: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "allowDiagonal", type: "boolean", description: "editor.block.allow-diagonal", category: "placement" }),
	),
	swapDiagonalPlacement: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "swapDiagonalPlacement",
			type: "boolean",
			description: "editor.block.swap-diagonal-placement",
			category: "placement",
		}),
	),
	allowRectanglePlacement: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "allowRectanglePlacement",
			type: "boolean",
			description: "editor.block.allow-rectangle-placement",
			category: "placement",
		}),
	),
	noSideBlend: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "noSideBlend", type: "boolean", description: "editor.block.no-side-blend", category: "rendering" }),
	),
	outputFacing: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "outputFacing", type: "boolean", description: "editor.block.output-facing", category: "placement" }),
	),

	// Health & Durability
	health: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "health", type: "number", description: "editor.block.health", category: "health" }),
	),
	scaledHealth: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "scaledHealth", type: "number", description: "editor.block.scaled-health", category: "health" }),
	),
	armor: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "armor", type: "number", description: "editor.block.armor", category: "health" }),
	),
	saveData: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "saveData", type: "boolean", description: "editor.block.save-data", category: "health" }),
	),
	destructible: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "destructible", type: "boolean", description: "editor.block.destructible", category: "health" }),
	),
	breakable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "breakable", type: "boolean", description: "editor.block.breakable", category: "health" }),
	),
	rebuildable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "rebuildable", type: "boolean", description: "editor.block.rebuildable", category: "health" }),
	),
	crushDamageMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "crushDamageMultiplier", type: "number", description: "editor.block.crush-damage-multiplier", category: "health" }),
	),
	crushFragile: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "crushFragile", type: "boolean", description: "editor.block.crush-fragile", category: "health" }),
	),
	destroyBulletSameTeam: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "destroyBulletSameTeam",
			type: "boolean",
			description: "editor.block.destroy-bullet-same-team",
			category: "health",
		}),
	),

	// Physics
	solid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "solid", type: "boolean", description: "editor.block.solid", category: "physics" }),
	),
	solidifes: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "solidifes", type: "boolean", description: "editor.block.solidifes", category: "physics" }),
	),
	teamPassable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "teamPassable", type: "boolean", description: "editor.block.team-passable", category: "physics" }),
	),
	underBullets: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "underBullets", type: "boolean", description: "editor.block.under-bullets", category: "physics" }),
	),

	// Update & Config
	update: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "update", type: "boolean", description: "editor.block.update", category: "config" }),
	),
	updateInUnits: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "updateInUnits",
			type: "boolean",
			description: "editor.block.update-in-units",
			category: "config",
			visibleWhen: { field: "update", value: true },
		}),
	),
	alwaysUpdateInUnits: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "alwaysUpdateInUnits",
			type: "boolean",
			description: "editor.block.always-update-in-units",
			category: "config",
			visibleWhen: { field: "update", value: true },
		}),
	),
	noUpdateDisabled: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "noUpdateDisabled",
			type: "boolean",
			description: "editor.block.no-update-disabled",
			category: "config",
			visibleWhen: { field: "update", value: true },
		}),
	),
	configurable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "configurable",
			type: "boolean",
			description: "editor.block.configurable",
			category: "config",
			visibleWhen: { field: "update", value: true },
		}),
	),
	configureSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "configureSound",
			type: "string",
			description: "editor.block.configure-sound",
			category: "audio",
			visibleWhen: { field: "configurable", value: true },
		}),
	),
	saveConfig: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "saveConfig",
			type: "boolean",
			description: "editor.block.save-config",
			category: "config",
			visibleWhen: { field: "configurable", value: true },
		}),
	),
	copyConfig: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "copyConfig",
			type: "boolean",
			description: "editor.block.copy-config",
			category: "config",
			visibleWhen: { field: "configurable", value: true },
		}),
	),
	clearOnDoubleTap: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "clearOnDoubleTap",
			type: "boolean",
			description: "editor.block.clear-on-double-tap",
			category: "config",
			visibleWhen: { field: "configurable", value: true },
		}),
	),
	consumesTap: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "consumesTap", type: "boolean", description: "editor.block.consumes-tap", category: "config" }),
	),
	ignoreResizeConfig: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "ignoreResizeConfig", type: "boolean", description: "editor.block.ignore-resize-config", category: "config" }),
	),
	commandable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "commandable", type: "boolean", description: "editor.block.commandable", category: "config" }),
	),
	allowConfigInventory: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "allowConfigInventory", type: "boolean", description: "editor.block.allow-config-inventory", category: "config" }),
	),
	logicConfigurable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "logicConfigurable", type: "boolean", description: "editor.block.logic-configurable", category: "config" }),
	),
	selectionRows: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "selectionRows", type: "number", description: "editor.block.selection-rows", category: "config" }),
	),
	selectionColumns: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "selectionColumns", type: "number", description: "editor.block.selection-columns", category: "config" }),
	),
	delayLandingConfig: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "delayLandingConfig", type: "boolean", description: "editor.block.delay-landing-config", category: "config" }),
	),
	selectScroll: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "selectScroll", type: "number", description: "editor.block.select-scroll", category: "config" }),
	),

	// Environment
	envRequired: v.pipe(
		v.optional(EnvSchema, 0),
		metadata({ name: "envRequired", type: "number", description: "editor.block.env-required", category: "environment" }),
	),
	envEnabled: v.pipe(
		v.optional(EnvSchema, Envs.terrestrial),
		metadata({ name: "envEnabled", type: "number", description: "editor.block.env-enabled", category: "environment" }),
	),
	envDisabled: v.pipe(
		v.optional(EnvSchema, 0),
		metadata({ name: "envDisabled", type: "number", description: "editor.block.env-disabled", category: "environment" }),
	),

	// Network
	sync: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "sync", type: "boolean", description: "editor.block.sync", category: "config" }),
	),

	// Combat & Targeting
	attacks: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "attacks", type: "boolean", description: "editor.block.attacks", category: "combat" }),
	),
	targetable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "targetable", type: "boolean", description: "editor.block.targetable", category: "combat" }),
	),
	suppressable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "suppressable", type: "boolean", description: "editor.block.suppressable", category: "combat" }),
	),
	canOverdrive: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "canOverdrive", type: "boolean", description: "editor.block.can-overdrive", category: "power" }),
	),
	absorbLasers: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "absorbLasers", type: "boolean", description: "editor.block.absorb-lasers", category: "physics" }),
	),
	insulated: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "insulated", type: "boolean", description: "editor.block.insulated", category: "physics" }),
	),

	// Building
	buildVisibility: v.pipe(
		v.optional(BuildVisibilitySchema, "hidden"),
		metadata({ name: "buildVisibility", type: "picklist", description: "editor.block.build-visibility", category: "building" }),
	),
	category: v.pipe(
		v.optional(CategorySchema, "distribution"),
		metadata({ name: "category", type: "picklist", description: "editor.block.category", category: "building" }),
	),
	buildTime: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "buildTime", type: "number", description: "editor.block.build-time", category: "building" }),
	),
	buildCostMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "buildCostMultiplier", type: "number", description: "editor.block.build-cost-multiplier", category: "building" }),
	),
	deconstructThreshold: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "deconstructThreshold", type: "number", description: "editor.block.deconstruct-threshold", category: "building" }),
	),
	instantDeconstruct: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "instantDeconstruct", type: "boolean", description: "editor.block.instant-deconstruct", category: "building" }),
	),
	instantBuild: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "instantBuild", type: "boolean", description: "editor.block.instant-build", category: "building" }),
	),
	ignoreBuildDarkness: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "ignoreBuildDarkness", type: "boolean", description: "editor.block.ignore-build-darkness", category: "building" }),
	),
	schematicPriority: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "schematicPriority", type: "number", description: "editor.block.schematic-priority", category: "building" }),
	),
	researchCostMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "researchCostMultiplier",
			type: "number",
			description: "editor.block.research-cost-multiplier",
			category: "building",
		}),
	),

	// Explosion
	baseExplosiveness: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "baseExplosiveness", type: "number", description: "editor.block.base-explosiveness", category: "health" }),
	),
	explosivenessScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "explosivenessScale", type: "number", description: "editor.block.explosiveness-scale", category: "health" }),
	),
	flammabilityScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "flammabilityScale", type: "number", description: "editor.block.flammability-scale", category: "health" }),
	),
	baseShake: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "baseShake", type: "number", description: "editor.block.base-shake", category: "health" }),
	),
	createRubble: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "createRubble", type: "boolean", description: "editor.block.create-rubble", category: "health" }),
	),

	// Misc Stats
	clipSize: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "clipSize", type: "number", description: "editor.block.clip-size", category: "rendering" }),
	),
	timers: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "timers", type: "number", description: "editor.block.timers", category: "combat" }),
	),
	fogRadius: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "fogRadius", type: "number", description: "editor.block.fog-radius", category: "rendering" }),
	),
	dumpTime: v.pipe(v.optional(v.number(), 5), metadata({ name: "dumpTime", type: "number" })),
	placeOverlapRange: v.pipe(
		v.optional(v.number(), 50),
		metadata({ name: "placeOverlapRange", type: "number", description: "editor.block.place-overlap-range", category: "combat" }),
	),
	unitCapModifier: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "unitCapModifier", type: "number", description: "editor.block.unit-cap-modifier", category: "combat" }),
	),
	priority: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "priority", type: "number", description: "editor.block.priority", category: "combat" }),
	),
	isDuct: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "isDuct", type: "boolean", description: "editor.block.is-duct", category: "physics" }),
	),
	deconstructDropAllLiquid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "deconstructDropAllLiquid",
			type: "boolean",
			description: "editor.block.deconstruct-drop-all-liquid",
			category: "liquids",
			visibleWhen: { field: "hasLiquids", value: true },
		}),
	),
	playerUnmineable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "playerUnmineable", type: "boolean", description: "editor.block.player-unmineable", category: "items" }),
	),

	// Audio
	placePitchChange: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "placePitchChange", type: "boolean", description: "editor.block.place-pitch-change", category: "audio" }),
	),
	breakPitchChange: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "breakPitchChange", type: "boolean", description: "editor.block.break-pitch-change", category: "audio" }),
	),
	destroySoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "destroySoundVolume", type: "number", description: "editor.block.destroy-sound-volume", category: "audio" }),
	),
	destroyPitchMin: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "destroyPitchMin", type: "number", description: "editor.block.destroy-pitch-min", category: "audio" }),
	),
	destroyPitchMax: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "destroyPitchMax", type: "number", description: "editor.block.destroy-pitch-max", category: "audio" }),
	),
	ambientSoundVolume: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({ name: "ambientSoundVolume", type: "number", description: "editor.block.ambient-sound-volume", category: "audio" }),
	),

	// Editor & Misc
	editorConfigurable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editorConfigurable", type: "boolean", description: "editor.block.editor-configurable", category: "config" }),
	),
	inEditor: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "inEditor", type: "boolean", description: "editor.block.in-editor", category: "rendering" }),
	),
	privileged: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "privileged", type: "boolean", description: "editor.block.privileged", category: "building" }),
	),
	autoResetEnabled: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "autoResetEnabled", type: "boolean", description: "editor.block.auto-reset-enabled", category: "config" }),
	),
	canPickup: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "canPickup", type: "boolean", description: "editor.block.can-pickup", category: "payload" }),
	),
	instantTransfer: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "instantTransfer", type: "boolean", description: "editor.block.instant-transfer", category: "items" }),
	),
	quickRotate: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "quickRotate", type: "boolean", description: "editor.block.quick-rotate", category: "placement" }),
	),
	allowDerelictRepair: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "allowDerelictRepair", type: "boolean", description: "editor.block.allow-derelict-repair", category: "building" }),
	),
	forceTeam: v.pipe(
		v.optional(TeamSchema),
		metadata({ name: "forceTeam", type: "unknown", description: "editor.block.force-team", category: "building" }),
	),
	alwaysReplace: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "alwaysReplace", type: "boolean", description: "editor.block.always-replace", category: "placement" }),
	),
	replaceable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "replaceable", type: "boolean", description: "editor.block.replaceable", category: "placement" }),
	),
	unitMoveBreakable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "unitMoveBreakable", type: "boolean", description: "editor.block.unit-move-breakable", category: "physics" }),
	),

	// Visual Systems
	cacheLayer: v.pipe(
		v.optional(CacheLayerSchema, "normal"),
		metadata({ name: "cacheLayer", type: "picklist", description: "editor.block.cache-layer", category: "rendering" }),
	),
	group: v.pipe(
		v.optional(BlockGroupSchema, "none"),
		metadata({ name: "group", type: "picklist", description: "editor.block.group", category: "misc" }),
	),
	flags: v.pipe(
		v.optional(v.array(BlockFlagSchema), []),
		metadata({ name: "flags", type: "array", description: "editor.block.flags", category: "combat" }),
	),

	attributes: v.pipe(
		v.optional(AttributesSchema),
		metadata({ name: "attributes", type: "object", description: "editor.block.attributes", category: "misc" }),
	),

	// Colors
	outlineColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "outlineColor", type: "color", description: "editor.block.outline-color", category: "rendering" }),
	),
	lightColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "lightColor", type: "color", description: "editor.block.light-color", category: "rendering" }),
	),
	mapColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "mapColor", type: "color", description: "editor.block.map-color", category: "rendering" }),
	),

	// Sound refs
	placeSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({ name: "placeSound", type: "string", description: "editor.block.place-sound", category: "audio" }),
	),
	breakSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({ name: "breakSound", type: "string", description: "editor.block.break-sound", category: "audio" }),
	),
	destroySound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({ name: "destroySound", type: "string", description: "editor.block.destroy-sound", category: "audio" }),
	),
	ambientSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({ name: "ambientSound", type: "string", description: "editor.block.ambient-sound", category: "audio" }),
	),

	regionRotated1: v.pipe(v.optional(v.number(), -1), metadata({ name: "regionRotated1", type: "number" })),
	regionRotated2: v.pipe(v.optional(v.number(), -1), metadata({ name: "regionRotated2", type: "number" })),
};

export const BlockFieldSchema: SchemaFn = CachedSchema((context) => {
	return v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.blocks.map((block) => block.name.replaceAll(context.name + "-", ""))),
	);
});

export const BlockHjsonSchema: SchemaFn = CachedSchema((context) => {
	return v.lazy((input) => {
		const variantEntries: v.ObjectEntries = {};

		if (input && typeof input === "object" && "type" in input) {
			const type = input.type;
			if (typeof type === "string" && classSchemaMap[type as BlockType]) {
				const schema = classSchemaMap[type as BlockType];
				Object.assign(variantEntries, schema(context).entries);
			}
		}

		return v.pipe(
			v.object({
				...blockObjectSchema,
				...variantEntries,
				requirements: v.optional(v.array(ItemRequirementSchema), []),
				researchCost: v.optional(v.array(ItemRequirementSchema)),
				researchCostMultipliers: v.optional(v.record(v.string(), v.number())),
				itemDrop: v.optional(ItemFieldSchema(context)),
				lightLiquid: v.optional(LiquidFieldSchema(context)),
				destroyBullet: v.optional(BulletHjsonSchema(context)),
				placeEffect: v.optional(EffectFieldSchema(context)),
				breakEffect: v.optional(EffectFieldSchema(context)),
				destroyEffect: v.optional(EffectFieldSchema(context)),
				research: v.optional(ResearchSchema(context)),
				...blockObjectSchema,
			}),
			metadata({ type: "block" }),
		);
	});
});
