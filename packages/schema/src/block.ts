import * as v from "valibot";
import { EnvSchema, Envs, ItemRequirementSchema, MindustryHexColorSchema, ResearchSchema, SoundHjsonSchema, type SchemaFn } from "./base";
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

const metadata = { type: "block" };

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
	powerProduction: v.optional(v.number(), 0),
	generationType: v.optional(v.string(), "basePowerGeneration"),
	explosionRadius: v.optional(v.number(), 12),
	explosionDamage: v.optional(v.number(), 0),
	explosionPuddles: v.optional(v.number(), 10),
	explosionPuddleRange: v.optional(v.number(), 16),
	explosionPuddleAmount: v.optional(v.number(), 100),
	explosionMinWarmup: v.optional(v.number(), 0),
	explosionShake: v.optional(v.number(), 0),
	explosionShakeDuration: v.optional(v.number(), 6),
});

const consumeGeneratorObjectSchema = v.object({
	itemDuration: v.optional(v.number(), 120),
	warmupSpeed: v.optional(v.number(), 0.05),
	effectChance: v.optional(v.number(), 0.01),
	generateEffectRange: v.optional(v.number(), 3),
	baseLightRadius: v.optional(v.number(), 65),
	explodeOnFull: v.optional(v.boolean(), false),
	itemDurationMultipliers: v.optional(v.record(v.string(), v.number())),
});

const heaterGeneratorObjectSchema = v.object({
	heatOutput: v.optional(v.number(), 10),
	warmupRate: v.optional(v.number(), 0.15),
});

const thermalGeneratorObjectSchema = v.object({
	effectChance: v.optional(v.number(), 0.05),
	minEfficiency: v.optional(v.number(), 0),
	displayEfficiencyScale: v.optional(v.number(), 1),
	displayEfficiency: v.optional(v.boolean(), true),
	attribute: v.optional(v.string(), "heat"),
});

const nuclearReactorObjectSchema = v.object({
	itemDuration: v.optional(v.number(), 120),
	heating: v.optional(v.number(), 0.01),
	heatOutput: v.optional(v.number(), 15),
	heatWarmupRate: v.optional(v.number(), 1),
	ambientCooldownTime: v.optional(v.number(), 1200),
	smokeThreshold: v.optional(v.number(), 0.3),
	flashThreshold: v.optional(v.number(), 0.46),
	coolantPower: v.optional(v.number(), 0.5),
	fuelItem: v.optional(v.string()),
});

const impactReactorObjectSchema = v.object({
	warmupSpeed: v.optional(v.number(), 0.001),
	itemDuration: v.optional(v.number(), 60),
});

const variableReactorObjectSchema = v.object({
	maxHeat: v.optional(v.number(), 100),
	warmupSpeed: v.optional(v.number(), 0.1),
	unstableSpeed: v.optional(v.number(), 1 / 180),
	effectChance: v.optional(v.number(), 0.05),
	flashThreshold: v.optional(v.number(), 0.01),
	flashAlpha: v.optional(v.number(), 0.4),
	flashSpeed: v.optional(v.number(), 7),
});

const lightBlockObjectSchema = v.object({
	brightness: v.optional(v.number(), 0.9),
	radius: v.optional(v.number(), 200),
});

const powerNodeObjectSchema = v.object({
	laserRange: v.optional(v.number(), 6),
	maxNodes: v.optional(v.number(), 3),
	autolink: v.optional(v.boolean(), true),
	drawRange: v.optional(v.boolean(), true),
	sameBlockConnection: v.optional(v.boolean(), false),
	laserScale: v.optional(v.number(), 0.25),
});

const longPowerNodeObjectSchema = v.object({
	glowScl: v.optional(v.number(), 16),
	glowMag: v.optional(v.number(), 0.6),
});

const beamNodeObjectSchema = v.object({
	range: v.optional(v.number(), 5),
	pulseScl: v.optional(v.number(), 7),
	pulseMag: v.optional(v.number(), 0.05),
	laserWidth: v.optional(v.number(), 0.4),
});

const powerSourceObjectSchema = v.object({
	powerProduction: v.optional(v.number(), 10000),
});

// Storage variant schemas
const storageBlockObjectSchema = v.object({
	coreMerge: v.optional(v.boolean(), true),
});

const coreBlockObjectSchema = v.object({
	thrusterLength: v.optional(v.number(), 3.5),
	thrusterOffset: v.optional(v.number(), 0),
	isFirstTier: v.optional(v.boolean(), false),
	allowSpawn: v.optional(v.boolean(), true),
	requiresCoreZone: v.optional(v.boolean(), false),
	incinerateNonBuildable: v.optional(v.boolean(), false),
	landDuration: v.optional(v.number(), 160),
	launchSoundVolume: v.optional(v.number(), 1),
	landSoundVolume: v.optional(v.number(), 1),
	captureInvicibility: v.optional(v.number(), 900),
});

const unloaderObjectSchema = v.object({
	speed: v.optional(v.number(), 1),
	allowCoreUnload: v.optional(v.boolean(), true),
});

// Liquid variant schemas
const liquidRouterObjectSchema = v.object({
	liquidPadding: v.optional(v.number(), 0),
});

const conduitObjectSchema = v.object({
	padCorners: v.optional(v.boolean(), true),
	leaks: v.optional(v.boolean(), true),
});

const pumpObjectSchema = v.object({
	pumpAmount: v.optional(v.number(), 0.2),
	consumeTime: v.optional(v.number(), 300),
	warmupSpeed: v.optional(v.number(), 0.019),
});

const solidPumpObjectSchema = v.object({
	result: v.optional(v.string(), "water"),
	updateEffectChance: v.optional(v.number(), 0.02),
	rotateSpeed: v.optional(v.number(), 1),
	baseEfficiency: v.optional(v.number(), 1),
	attribute: v.optional(v.string()),
});

const frackerObjectSchema = v.object({
	itemUseTime: v.optional(v.number(), 100),
});

// Production variant schemas
const genericCrafterObjectSchema = v.object({
	outputItem: v.optional(v.string()),
	outputItems: v.optional(v.array(v.string())),
	outputLiquid: v.optional(v.string()),
	outputLiquids: v.optional(v.array(v.string())),
	liquidOutputDirections: v.optional(v.array(v.number()), [-1]),
	dumpExtraLiquid: v.optional(v.boolean(), true),
	ignoreLiquidFullness: v.optional(v.boolean(), false),
	craftTime: v.optional(v.number(), 80),
	updateEffectChance: v.optional(v.number(), 0.04),
	updateEffectSpread: v.optional(v.number(), 4),
	warmupSpeed: v.optional(v.number(), 0.019),
});

const heatCrafterObjectSchema = v.object({
	heatRequirement: v.optional(v.number(), 10),
	overheatScale: v.optional(v.number(), 1),
	maxEfficiency: v.optional(v.number(), 4),
});

const attributeCrafterObjectSchema = v.object({
	attribute: v.optional(v.string(), "heat"),
	baseEfficiency: v.optional(v.number(), 1),
	boostScale: v.optional(v.number(), 1),
	maxBoost: v.optional(v.number(), 1),
	minEfficiency: v.optional(v.number(), -1),
	displayEfficiencyScale: v.optional(v.number(), 1),
	displayEfficiency: v.optional(v.boolean(), true),
	scaleLiquidConsumption: v.optional(v.boolean(), false),
});

const separatorObjectSchema = v.object({
	results: v.optional(v.array(v.string())),
	craftTime: v.optional(v.number(), 0),
});

const drillObjectSchema = v.object({
	tier: v.optional(v.number(), 0),
	drillTime: v.optional(v.number(), 300),
	hardnessDrillMultiplier: v.optional(v.number(), 50),
	liquidBoostIntensity: v.optional(v.number(), 1.6),
	warmupSpeed: v.optional(v.number(), 0.015),
	blockedItem: v.optional(v.string()),
	blockedItems: v.optional(v.array(v.string())),
	drawMineItem: v.optional(v.boolean(), true),
	drillEffectRnd: v.optional(v.number(), -1),
	drillEffectChance: v.optional(v.number(), 0.02),
	rotateSpeed: v.optional(v.number(), 2),
	updateEffectChance: v.optional(v.number(), 0.02),
	drillMultipliers: v.optional(v.record(v.string(), v.number())),
	drawRim: v.optional(v.boolean(), false),
	drawSpinSprite: v.optional(v.boolean(), true),
});

const burstDrillObjectSchema = v.object({
	shake: v.optional(v.number(), 2),
	invertedTime: v.optional(v.number(), 200),
	arrowSpacing: v.optional(v.number(), 4),
	arrowOffset: v.optional(v.number(), 0),
	arrows: v.optional(v.number(), 3),
	drillSoundVolume: v.optional(v.number(), 0.6),
	drillSoundPitchRand: v.optional(v.number(), 0.1),
});

const beamDrillObjectSchema = v.object({
	drillTime: v.optional(v.number(), 200),
	range: v.optional(v.number(), 5),
	tier: v.optional(v.number(), 1),
	laserWidth: v.optional(v.number(), 0.65),
	optionalBoostIntensity: v.optional(v.number(), 2.5),
	drillMultipliers: v.optional(v.record(v.string(), v.number())),
	blockedItem: v.optional(v.string()),
	blockedItems: v.optional(v.array(v.string())),
	glowIntensity: v.optional(v.number(), 0.2),
	pulseIntensity: v.optional(v.number(), 0.07),
	glowScl: v.optional(v.number(), 3),
	sparks: v.optional(v.number(), 7),
	sparkRange: v.optional(v.number(), 10),
	sparkLife: v.optional(v.number(), 27),
	sparkRecurrence: v.optional(v.number(), 4),
	sparkSpread: v.optional(v.number(), 45),
	sparkSize: v.optional(v.number(), 3.5),
	heatPulse: v.optional(v.number(), 0.3),
	heatPulseScl: v.optional(v.number(), 7),
});

const wallCrafterObjectSchema = v.object({
	drillTime: v.optional(v.number(), 150),
	liquidBoostIntensity: v.optional(v.number(), 1.6),
	updateEffectChance: v.optional(v.number(), 0.02),
	rotateSpeed: v.optional(v.number(), 2),
	attribute: v.optional(v.string(), "sand"),
	output: v.optional(v.string(), "sand"),
	boostItemUseTime: v.optional(v.number(), 120),
	itemBoostIntensity: v.optional(v.number(), 1.6),
	hasLiquidBooster: v.optional(v.boolean(), false),
});

const itemIncineratorObjectSchema = v.object({
	effectChance: v.optional(v.number(), 0.2),
});

const heatProducerObjectSchema = v.object({
	heatOutput: v.optional(v.number(), 10),
	warmupRate: v.optional(v.number(), 0.15),
});

// Defense variant schemas
const wallObjectSchema = v.object({
	lightningChance: v.optional(v.number(), -1),
	lightningDamage: v.optional(v.number(), 20),
	lightningLength: v.optional(v.number(), 17),
	chanceDeflect: v.optional(v.number(), -1),
	flashHit: v.optional(v.boolean(), false),
});

const shieldWallObjectSchema = v.object({
	shieldHealth: v.optional(v.number(), 900),
	breakCooldown: v.optional(v.number(), 600),
	regenSpeed: v.optional(v.number(), 2),
	glowMag: v.optional(v.number(), 0.6),
	glowScl: v.optional(v.number(), 8),
});

const doorObjectSchema = v.object({
	chainEffect: v.optional(v.boolean(), false),
});

const autoDoorObjectSchema = v.object({
	checkInterval: v.optional(v.number(), 20),
	triggerMargin: v.optional(v.number(), 12),
});

const shockwaveTowerObjectSchema = v.object({
	range: v.optional(v.number(), 110),
	reload: v.optional(v.number(), 90),
	bulletDamage: v.optional(v.number(), 160),
	falloffCount: v.optional(v.number(), 20),
	shake: v.optional(v.number(), 2),
	checkInterval: v.optional(v.number(), 8),
	cooldownMultiplier: v.optional(v.number(), 1),
	shapeRotateSpeed: v.optional(v.number(), 1),
	shapeRadius: v.optional(v.number(), 6),
	shapeSides: v.optional(v.number(), 4),
});

const shockMineObjectSchema = v.object({
	cooldown: v.optional(v.number(), 80),
	tileDamage: v.optional(v.number(), 5),
	damage: v.optional(v.number(), 13),
	length: v.optional(v.number(), 10),
	tendrils: v.optional(v.number(), 6),
	shots: v.optional(v.number(), 6),
	inaccuracy: v.optional(v.number(), 0),
	teamAlpha: v.optional(v.number(), 0.3),
});

const regenProjectorObjectSchema = v.object({
	range: v.optional(v.number(), 14),
	healPercent: v.optional(v.number(), 0.2),
	optionalMultiplier: v.optional(v.number(), 2),
	optionalUseTime: v.optional(v.number(), 480),
	effectChance: v.optional(v.number(), 0.003),
});

const radarObjectSchema = v.object({
	discoveryTime: v.optional(v.number(), 600),
	rotateSpeed: v.optional(v.number(), 2),
	glowScl: v.optional(v.number(), 5),
	glowMag: v.optional(v.number(), 0.6),
});

const overdriveProjectorObjectSchema = v.object({
	reload: v.optional(v.number(), 60),
	range: v.optional(v.number(), 80),
	speedBoost: v.optional(v.number(), 1.5),
	speedBoostPhase: v.optional(v.number(), 0.75),
	useTime: v.optional(v.number(), 400),
	phaseRangeBoost: v.optional(v.number(), 20),
	hasBoost: v.optional(v.boolean(), true),
});

const mendProjectorObjectSchema = v.object({
	reload: v.optional(v.number(), 250),
	range: v.optional(v.number(), 60),
	healPercent: v.optional(v.number(), 12),
	phaseBoost: v.optional(v.number(), 12),
	phaseRangeBoost: v.optional(v.number(), 50),
	useTime: v.optional(v.number(), 400),
	mendSoundVolume: v.optional(v.number(), 0.5),
});

const forceProjectorObjectSchema = v.object({
	phaseUseTime: v.optional(v.number(), 350),
	phaseRadiusBoost: v.optional(v.number(), 80),
	phaseShieldBoost: v.optional(v.number(), 400),
	radius: v.optional(v.number(), 101.7),
	sides: v.optional(v.number(), 6),
	shieldRotation: v.optional(v.number(), 0),
	shieldHealth: v.optional(v.number(), 700),
	cooldownNormal: v.optional(v.number(), 1.75),
	cooldownLiquid: v.optional(v.number(), 1.5),
	cooldownBrokenBase: v.optional(v.number(), 0.35),
	coolantConsumption: v.optional(v.number(), 0.1),
	consumeCoolant: v.optional(v.boolean(), true),
	crashDamageMultiplier: v.optional(v.number(), 2),
	hitSoundVolume: v.optional(v.number(), 0.12),
});

const directionalForceProjectorObjectSchema = v.object({
	width: v.optional(v.number(), 30),
	shieldHealth: v.optional(v.number(), 3000),
	cooldownNormal: v.optional(v.number(), 1.75),
	cooldownLiquid: v.optional(v.number(), 1.5),
	cooldownBrokenBase: v.optional(v.number(), 0.35),
	length: v.optional(v.number(), 40),
	padSize: v.optional(v.number(), 40),
});

const baseShieldObjectSchema = v.object({
	radius: v.optional(v.number(), 200),
	sides: v.optional(v.number(), 24),
});

// Turret variant schemas
const baseTurretObjectSchema = v.object({
	range: v.optional(v.number(), 80),
	placeOverlapMargin: v.optional(v.number(), 56),
	rotateSpeed: v.optional(v.number(), 5),
	fogRadiusMultiplier: v.optional(v.number(), 1),
	disableOverlapCheck: v.optional(v.boolean(), false),
	activationTime: v.optional(v.number(), 0),
	coolantMultiplier: v.optional(v.number(), 5),
});

const reloadTurretObjectSchema = v.object({
	reload: v.optional(v.number(), 10),
});

const turretObjectSchema = v.object({
	targetInterval: v.optional(v.number(), 20),
	newTargetInterval: v.optional(v.number(), -1),
	maxAmmo: v.optional(v.number(), 30),
	ammoPerShot: v.optional(v.number(), 1),
	consumeAmmoOnce: v.optional(v.boolean(), true),
	heatRequirement: v.optional(v.number(), -1),
	maxHeatEfficiency: v.optional(v.number(), 3),
	inaccuracy: v.optional(v.number(), 0),
	velocityRnd: v.optional(v.number(), 0),
	scaleLifetimeOffset: v.optional(v.number(), 0),
	shootCone: v.optional(v.number(), 8),
	shootX: v.optional(v.number(), 0),
	shootY: v.optional(v.number()),
	xRand: v.optional(v.number(), 0),
	drawMinRange: v.optional(v.boolean(), false),
	trackingRange: v.optional(v.number(), 0),
	minRange: v.optional(v.number(), 0),
	minWarmup: v.optional(v.number(), 0),
	accurateDelay: v.optional(v.boolean(), true),
	moveWhileCharging: v.optional(v.boolean(), true),
	reloadWhileCharging: v.optional(v.boolean(), true),
	warmupMaintainTime: v.optional(v.number(), 0),
	targetAir: v.optional(v.boolean(), true),
	targetGround: v.optional(v.boolean(), true),
	targetBlocks: v.optional(v.boolean(), true),
	targetHealing: v.optional(v.boolean(), false),
	playerControllable: v.optional(v.boolean(), true),
	displayAmmoMultiplier: v.optional(v.boolean(), true),
	targetUnderBlocks: v.optional(v.boolean(), true),
	alwaysShooting: v.optional(v.boolean(), false),
	predictTarget: v.optional(v.boolean(), true),
	shootSoundVolume: v.optional(v.number(), 1),
	loopSoundVolume: v.optional(v.number(), 0.5),
	soundPitchMin: v.optional(v.number(), 0.9),
	soundPitchMax: v.optional(v.number(), 1.1),
	ammoEjectBack: v.optional(v.number(), 1),
	shootWarmupSpeed: v.optional(v.number(), 0.1),
	linearWarmup: v.optional(v.boolean(), false),
	recoil: v.optional(v.number(), 1),
	recoils: v.optional(v.number(), -1),
	recoilTime: v.optional(v.number(), -1),
	recoilPow: v.optional(v.number(), 1.8),
	cooldownTime: v.optional(v.number(), 20),
	elevation: v.optional(v.number(), -1),
	shake: v.optional(v.number(), 0),
});

const powerTurretObjectSchema = v.object({
	shootType: v.optional(v.string()),
});

const laserTurretObjectSchema = v.object({
	firingMoveFract: v.optional(v.number(), 0.25),
	shootDuration: v.optional(v.number(), 100),
});

const continuousTurretObjectSchema = v.object({
	shootType: v.optional(v.string()),
	aimChangeSpeed: v.optional(v.number()),
	scaleDamageEfficiency: v.optional(v.boolean(), false),
});

const continuousLiquidTurretObjectSchema = v.object({
	liquidConsumed: v.optional(v.number(), 1 / 60),
});

const pointDefenseTurretObjectSchema = v.object({
	retargetTime: v.optional(v.number(), 5),
	shootCone: v.optional(v.number(), 5),
	bulletDamage: v.optional(v.number(), 10),
	shootLength: v.optional(v.number(), 3),
});

const tractorBeamTurretObjectSchema = v.object({
	retargetTime: v.optional(v.number(), 5),
	shootCone: v.optional(v.number(), 6),
	shootLength: v.optional(v.number(), 5),
	laserWidth: v.optional(v.number(), 0.6),
	force: v.optional(v.number(), 0.3),
	scaledForce: v.optional(v.number(), 0),
	damage: v.optional(v.number(), 0),
	targetAir: v.optional(v.boolean(), true),
	targetGround: v.optional(v.boolean(), false),
	statusDuration: v.optional(v.number(), 300),
	shootSoundVolume: v.optional(v.number(), 0.9),
});

const buildTurretObjectSchema = v.object({
	targetInterval: v.optional(v.number(), 15),
	buildSpeed: v.optional(v.number(), 1),
	buildBeamOffset: v.optional(v.number(), 5),
	elevation: v.optional(v.number(), -1),
});

// Distribution variant schemas
const conveyorObjectSchema = v.object({
	speed: v.optional(v.number(), 0),
	displayedSpeed: v.optional(v.number(), 0),
	pushUnits: v.optional(v.boolean(), true),
});

const stackConveyorObjectSchema = v.object({
	glowAlpha: v.optional(v.number(), 1),
	baseEfficiency: v.optional(v.number(), 0),
	speed: v.optional(v.number(), 0),
	outputRouter: v.optional(v.boolean(), true),
	recharge: v.optional(v.number(), 2),
});

const routerObjectSchema = v.object({
	speed: v.optional(v.number(), 8),
});

const junctionObjectSchema = v.object({
	speed: v.optional(v.number(), 26),
	capacity: v.optional(v.number(), 6),
	displayedSpeed: v.optional(v.number(), 13),
});

const sorterObjectSchema = v.object({
	invert: v.optional(v.boolean(), false),
});

const overflowGateObjectSchema = v.object({
	speed: v.optional(v.number(), 1),
	invert: v.optional(v.boolean(), false),
});

const itemBridgeObjectSchema = v.object({
	range: v.optional(v.number(), 0),
	transportTime: v.optional(v.number(), 0),
	fadeIn: v.optional(v.boolean(), true),
	moveArrows: v.optional(v.boolean(), true),
	pulse: v.optional(v.boolean(), false),
	arrowSpacing: v.optional(v.number(), 4),
	arrowOffset: v.optional(v.number(), 2),
	arrowPeriod: v.optional(v.number(), 0.4),
	arrowTimeScl: v.optional(v.number(), 6.2),
	bridgeWidth: v.optional(v.number(), 6.5),
});

const bufferedItemBridgeObjectSchema = v.object({
	speed: v.optional(v.number(), 40),
	bufferCapacity: v.optional(v.number(), 50),
	displayedSpeed: v.optional(v.number(), 11),
});

const directionBridgeObjectSchema = v.object({
	range: v.optional(v.number(), 4),
});

const directionLiquidBridgeObjectSchema = v.object({
	speed: v.optional(v.number(), 5),
	liquidPadding: v.optional(v.number(), 1),
});

const ductObjectSchema = v.object({
	speed: v.optional(v.number(), 5),
	armored: v.optional(v.boolean(), false),
});

const ductRouterObjectSchema = v.object({
	speed: v.optional(v.number(), 5),
});

const stackRouterObjectSchema = v.object({
	baseEfficiency: v.optional(v.number(), 0),
	glowAlpha: v.optional(v.number(), 1),
});

const ductJunctionObjectSchema = v.object({
	speed: v.optional(v.number(), 5),
});

const overflowDuctObjectSchema = v.object({
	speed: v.optional(v.number(), 5),
	invert: v.optional(v.boolean(), false),
});

const ductBridgeObjectSchema = v.object({
	speed: v.optional(v.number(), 5),
});

const massDriverObjectSchema = v.object({
	range: v.optional(v.number(), 0),
	rotateSpeed: v.optional(v.number(), 5),
	translation: v.optional(v.number(), 7),
	minDistribute: v.optional(v.number(), 10),
	knockback: v.optional(v.number(), 4),
	reload: v.optional(v.number(), 100),
	bulletSpeed: v.optional(v.number(), 5.5),
	bulletLifetime: v.optional(v.number(), 200),
	shootSoundVolume: v.optional(v.number(), 0.5),
	shake: v.optional(v.number(), 3),
});

const directionalUnloaderObjectSchema = v.object({
	speed: v.optional(v.number(), 1),
	allowCoreUnload: v.optional(v.boolean(), false),
});

// Payload variant schemas
const payloadBlockObjectSchema = v.object({
	payloadSpeed: v.optional(v.number(), 0.7),
	payloadRotateSpeed: v.optional(v.number(), 5),
});

const payloadConveyorObjectSchema = v.object({
	moveTime: v.optional(v.number(), 45),
	moveForce: v.optional(v.number(), 201),
	payloadLimit: v.optional(v.number(), 3),
	pushUnits: v.optional(v.boolean(), true),
});

const payloadRouterObjectSchema = v.object({
	invert: v.optional(v.boolean(), false),
});

const payloadVoidObjectSchema = v.object({});

const payloadMassDriverObjectSchema = v.object({
	range: v.optional(v.number(), 100),
	rotateSpeed: v.optional(v.number(), 5),
	length: v.optional(v.number(), 11.125),
	knockback: v.optional(v.number(), 5),
	reload: v.optional(v.number(), 30),
	chargeTime: v.optional(v.number(), 100),
	maxPayloadSize: v.optional(v.number(), 3),
	grabWidth: v.optional(v.number(), 8),
	grabHeight: v.optional(v.number(), 2.75),
	shootSoundVolume: v.optional(v.number(), 0.7),
	shake: v.optional(v.number(), 3),
});

const payloadLoaderObjectSchema = v.object({
	loadTime: v.optional(v.number(), 2),
	itemsLoaded: v.optional(v.number(), 8),
	liquidsLoaded: v.optional(v.number(), 40),
	maxBlockSize: v.optional(v.number(), 3),
	maxPowerConsumption: v.optional(v.number(), 40),
	loadPowerDynamic: v.optional(v.boolean(), true),
	basePowerUse: v.optional(v.number(), 0),
});

const payloadUnloaderObjectSchema = v.object({
	offloadSpeed: v.optional(v.number(), 4),
	maxPowerUnload: v.optional(v.number(), 80),
});

const payloadDeconstructorObjectSchema = v.object({
	maxPayloadSize: v.optional(v.number(), 4),
	deconstructSpeed: v.optional(v.number(), 2.5),
	dumpRate: v.optional(v.number(), 4),
});

const blockProducerObjectSchema = v.object({
	buildSpeed: v.optional(v.number(), 0.4),
});

const constructorObjectSchema = v.object({
	minBlockSize: v.optional(v.number(), 1),
	maxBlockSize: v.optional(v.number(), 2),
});

const singleBlockProducerObjectSchema = v.object({
	result: v.optional(v.string()),
});

// Unit variant schemas
const unitFactoryObjectSchema = v.object({
	capacities: v.optional(v.array(v.number()), []),
	createSoundVolume: v.optional(v.number(), 1),
});

const reconstructorObjectSchema = v.object({
	constructTime: v.optional(v.number(), 120),
	capacities: v.optional(v.array(v.number()), []),
	createSoundVolume: v.optional(v.number(), 1),
});

const unitAssemblerModuleObjectSchema = v.object({
	tier: v.optional(v.number(), 1),
});

const unitAssemblerObjectSchema = v.object({
	areaSize: v.optional(v.number(), 11),
	dronesCreated: v.optional(v.number(), 4),
	droneConstructTime: v.optional(v.number(), 240),
	capacities: v.optional(v.array(v.number()), []),
	createSoundVolume: v.optional(v.number(), 1),
});

const unitCargoUnloadPointObjectSchema = v.object({
	staleTimeDuration: v.optional(v.number(), 360),
});

const unitCargoLoaderObjectSchema = v.object({
	unitBuildTime: v.optional(v.number(), 480),
	polyStroke: v.optional(v.number(), 1.8),
	polyRadius: v.optional(v.number(), 8),
	polySides: v.optional(v.number(), 6),
	polyRotateSpeed: v.optional(v.number(), 1),
});

const repairTurretObjectSchema = v.object({
	repairRadius: v.optional(v.number(), 50),
	repairSpeed: v.optional(v.number(), 0.3),
	powerUse: v.optional(v.number()),
	length: v.optional(v.number(), 5),
	beamWidth: v.optional(v.number(), 1),
	pulseRadius: v.optional(v.number(), 6),
	pulseStroke: v.optional(v.number(), 2),
	acceptCoolant: v.optional(v.boolean(), false),
	coolantUse: v.optional(v.number(), 0.5),
	coolantMultiplier: v.optional(v.number(), 1),
});

const repairTowerObjectSchema = v.object({
	range: v.optional(v.number(), 80),
	circleSpeed: v.optional(v.number(), 120),
	circleStroke: v.optional(v.number(), 3),
	squareRad: v.optional(v.number(), 3),
	squareSpinScl: v.optional(v.number(), 0.8),
	glowMag: v.optional(v.number(), 0.5),
	glowScl: v.optional(v.number(), 8),
	healAmount: v.optional(v.number(), 1),
});

const droneCenterObjectSchema = v.object({
	unitsSpawned: v.optional(v.number(), 4),
	droneConstructTime: v.optional(v.number(), 180),
	statusDuration: v.optional(v.number(), 120),
	droneRange: v.optional(v.number(), 50),
});

// Logic variant schemas
const logicBlockObjectSchema = v.object({
	maxInstructionScale: v.optional(v.number(), 5),
	instructionsPerTick: v.optional(v.number(), 1),
	maxInstructionsPerTick: v.optional(v.number(), 40),
	range: v.optional(v.number(), 80),
});

const logicDisplayObjectSchema = v.object({
	maxSides: v.optional(v.number(), 25),
	displaySize: v.optional(v.number(), 64),
	scaleFactor: v.optional(v.number(), 1),
});

const tileableLogicDisplayObjectSchema = v.object({
	maxDisplayDimensions: v.optional(v.number(), 16),
	frameSize: v.optional(v.number(), 6),
});

const messageBlockObjectSchema = v.object({
	maxTextLength: v.optional(v.number(), 400),
	maxNewlines: v.optional(v.number(), 24),
});

const memoryBlockObjectSchema = v.object({
	memoryCapacity: v.optional(v.number(), 32),
});

const canvasBlockObjectSchema = v.object({
	padding: v.optional(v.number(), 0),
	canvasSize: v.optional(v.number(), 8),
	palette: v.optional(v.array(v.number())),
	bitsPerPixel: v.optional(v.number()),
});

// Heat variant schemas
const heatConductorObjectSchema = v.object({
	visualMaxHeat: v.optional(v.number(), 15),
	splitHeat: v.optional(v.boolean(), false),
});

// Environment variant schemas
const floorObjectSchema = v.object({
	edge: v.optional(v.string(), "stone"),
	speedMultiplier: v.optional(v.number(), 1),
	dragMultiplier: v.optional(v.number(), 1),
	damageTaken: v.optional(v.number(), 0),
	drownTime: v.optional(v.number(), 0),
	walkSoundVolume: v.optional(v.number(), 0.1),
	walkSoundPitchMin: v.optional(v.number(), 0.8),
	walkSoundPitchMax: v.optional(v.number(), 1.2),
	statusDuration: v.optional(v.number(), 60),
	isLiquid: v.optional(v.boolean(), false),
	overlayAlpha: v.optional(v.number(), 0.65),
	supportsOverlay: v.optional(v.boolean(), false),
	shallow: v.optional(v.boolean(), false),
	oreDefault: v.optional(v.boolean(), false),
	oreScale: v.optional(v.number(), 24),
	oreThreshold: v.optional(v.number(), 0.828),
	canShadow: v.optional(v.boolean(), true),
	forceDrawLight: v.optional(v.boolean(), false),
	needsSurface: v.optional(v.boolean(), true),
	allowCorePlacement: v.optional(v.boolean(), false),
	wallOre: v.optional(v.boolean(), false),
	blendId: v.optional(v.number(), -1),
	tilingVariants: v.optional(v.number(), 0),
	autotile: v.optional(v.boolean(), false),
	autotileMidVariants: v.optional(v.number(), 1),
	autotileVariants: v.optional(v.number(), 1),
	drawEdgeIn: v.optional(v.boolean(), true),
	drawEdgeOut: v.optional(v.boolean(), true),
});

const coloredFloorObjectSchema = v.object({});

const treeBlockObjectSchema = v.object({
	shadowOffset: v.optional(v.number(), -4),
});

const tallBlockObjectSchema = v.object({
	shadowOffset: v.optional(v.number(), -3),
	layer: v.optional(v.number()),
	shadowLayer: v.optional(v.number()),
	rotationRand: v.optional(v.number(), 20),
	shadowAlpha: v.optional(v.number(), 0.6),
});

const cliffObjectSchema = v.object({
	size: v.optional(v.number(), 11),
});

// Campaign variant schemas
const launchPadObjectSchema = v.object({
	launchTime: v.optional(v.number(), 1),
	launchSoundPitchRand: v.optional(v.number(), 0.1),
	acceptMultipleItems: v.optional(v.boolean(), false),
	lightStep: v.optional(v.number(), 1),
	lightSteps: v.optional(v.number(), 3),
	liquidPad: v.optional(v.number(), 2),
});

const landingPadObjectSchema = v.object({
	arrivalDuration: v.optional(v.number(), 150),
	cooldownTime: v.optional(v.number(), 150),
	consumeLiquidAmount: v.optional(v.number(), 100),
	coolingEffectChance: v.optional(v.number(), 0.2),
	liquidPad: v.optional(v.number(), 2),
	landSoundVolume: v.optional(v.number(), 0.75),
});

const acceleratorObjectSchema = v.object({
	lightningSoundVolume: v.optional(v.number(), 0.85),
	launchDuration: v.optional(v.number(), 120),
	chargeDuration: v.optional(v.number(), 220),
	buildDuration: v.optional(v.number(), 120),
	landZoomFrom: v.optional(v.number(), 0.02),
	landZoomTo: v.optional(v.number(), 4),
	chargeZoomTo: v.optional(v.number(), 5),
	chargeRings: v.optional(v.number(), 4),
	ringRadBase: v.optional(v.number(), 60),
	ringRadSpacing: v.optional(v.number(), 25),
	ringRadPow: v.optional(v.number(), 1.6),
	ringStroke: v.optional(v.number(), 3),
	ringSpeedup: v.optional(v.number(), 1.4),
	chargeRingMerge: v.optional(v.number(), 2),
	ringArrowRad: v.optional(v.number(), 3),
	ringHandleTilt: v.optional(v.number(), 0.8),
	ringHandleLen: v.optional(v.number(), 30),
	launchLightning: v.optional(v.number(), 20),
	lightningDamage: v.optional(v.number(), 40),
	lightningOffset: v.optional(v.number(), 24),
	lightningLengthMin: v.optional(v.number(), 5),
	lightningLengthMax: v.optional(v.number(), 25),
	lightningLaunchChance: v.optional(v.number(), 0.8),
});

// Sandbox variant schemas
const itemSourceObjectSchema = v.object({
	itemsPerSecond: v.optional(v.number(), 100),
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
	type: v.optional(v.picklist(blockTypes)),
	template: v.optional(v.string()),

	hasItems: v.optional(v.boolean(), false),
	hasLiquids: v.optional(v.boolean(), false),
	hasPower: v.optional(v.boolean(), false),
	outputsLiquid: v.optional(v.boolean(), false),
	consumesPower: v.optional(v.boolean(), true),
	outputsPower: v.optional(v.boolean(), false),
	connectedPower: v.optional(v.boolean(), true),
	conductivePower: v.optional(v.boolean(), false),
	outputsPayload: v.optional(v.boolean(), false),
	acceptsUnitPayloads: v.optional(v.boolean(), false),
	acceptsPayload: v.optional(v.boolean(), false),
	acceptsItems: v.optional(v.boolean(), false),

	itemCapacity: v.optional(v.number(), 10),
	liquidCapacity: v.optional(v.number(), -1),
	liquidPressure: v.optional(v.number(), 1),
	separateItemCapacity: v.optional(v.boolean(), false),

	alwaysAllowDeposit: v.optional(v.boolean(), false),
	depositCooldown: v.optional(v.number(), -1),
	displayFlow: v.optional(v.boolean(), true),
	unloadable: v.optional(v.boolean(), true),
	allowResupply: v.optional(v.boolean(), false),

	size: v.optional(v.number(), 1),
	offset: v.optional(v.number(), 0),
	sizeOffset: v.optional(v.number(), 0),
	rotate: v.optional(v.boolean(), false),
	rotateDraw: v.optional(v.boolean(), true),
	rotateDrawEditor: v.optional(v.boolean(), true),
	visualRotationOffset: v.optional(v.number(), 0),
	lockRotation: v.optional(v.boolean(), true),
	ignoreLineRotation: v.optional(v.boolean(), false),
	invertFlip: v.optional(v.boolean(), false),
	variants: v.optional(v.number(), 0),
	drawArrow: v.optional(v.boolean(), true),
	drawTeamOverlay: v.optional(v.boolean(), true),
	drawCracks: v.optional(v.boolean(), true),
	drawDisabled: v.optional(v.boolean(), true),
	drawLiquidLight: v.optional(v.boolean(), true),
	enableDrawStatus: v.optional(v.boolean(), true),
	squareSprite: v.optional(v.boolean(), true),
	fillsTile: v.optional(v.boolean(), true),
	hasShadow: v.optional(v.boolean(), true),
	customShadow: v.optional(v.boolean(), false),
	outlineIcon: v.optional(v.boolean(), false),
	outlineRadius: v.optional(v.number(), 4),
	outlinedIcon: v.optional(v.number(), -1),
	albedo: v.optional(v.number(), 0),
	emitLight: v.optional(v.boolean(), false),
	obstructsLight: v.optional(v.boolean(), true),
	lightRadius: v.optional(v.number(), 60),
	lightClipSize: v.optional(v.number(), 0),
	forceDark: v.optional(v.boolean(), false),
	useColor: v.optional(v.boolean(), true),
	hasColor: v.optional(v.boolean(), false),

	placeablePlayer: v.optional(v.boolean(), true),
	placeableOn: v.optional(v.boolean(), true),
	placeableLiquid: v.optional(v.boolean(), false),
	requiresWater: v.optional(v.boolean(), false),
	floating: v.optional(v.boolean(), false),
	conveyorPlacement: v.optional(v.boolean(), false),
	allowDiagonal: v.optional(v.boolean(), true),
	swapDiagonalPlacement: v.optional(v.boolean(), false),
	allowRectanglePlacement: v.optional(v.boolean(), false),
	noSideBlend: v.optional(v.boolean(), false),
	outputFacing: v.optional(v.boolean(), true),

	health: v.optional(v.number(), -1),
	scaledHealth: v.optional(v.number(), -1),
	armor: v.optional(v.number(), 0),
	saveData: v.optional(v.boolean(), false),
	destructible: v.optional(v.boolean(), false),
	breakable: v.optional(v.boolean(), false),
	rebuildable: v.optional(v.boolean(), true),
	crushDamageMultiplier: v.optional(v.number(), 1),
	crushFragile: v.optional(v.boolean(), false),
	destroyBulletSameTeam: v.optional(v.boolean(), false),

	solid: v.optional(v.boolean(), false),
	solidifes: v.optional(v.boolean(), false),
	teamPassable: v.optional(v.boolean(), false),
	underBullets: v.optional(v.boolean(), false),

	update: v.optional(v.boolean(), false),
	updateInUnits: v.optional(v.boolean(), true),
	alwaysUpdateInUnits: v.optional(v.boolean(), false),
	noUpdateDisabled: v.optional(v.boolean(), false),
	configurable: v.optional(v.boolean(), false),
	configureSound: v.optional(SoundHjsonSchema),
	saveConfig: v.optional(v.boolean(), false),
	copyConfig: v.optional(v.boolean(), true),
	clearOnDoubleTap: v.optional(v.boolean(), false),
	consumesTap: v.optional(v.boolean(), false),
	ignoreResizeConfig: v.optional(v.boolean(), false),
	commandable: v.optional(v.boolean(), false),
	allowConfigInventory: v.optional(v.boolean(), true),
	logicConfigurable: v.optional(v.boolean(), false),
	selectionRows: v.optional(v.number(), 5),
	selectionColumns: v.optional(v.number(), 4),
	delayLandingConfig: v.optional(v.boolean(), false),
	selectScroll: v.optional(v.number(), 0),

	envRequired: v.optional(EnvSchema, 0),
	envEnabled: v.optional(EnvSchema, Envs.terrestrial),
	envDisabled: v.optional(EnvSchema, 0),

	sync: v.optional(v.boolean(), false),

	attacks: v.optional(v.boolean(), false),
	targetable: v.optional(v.boolean(), true),
	suppressable: v.optional(v.boolean(), false),
	canOverdrive: v.optional(v.boolean(), true),
	absorbLasers: v.optional(v.boolean(), false),
	insulated: v.optional(v.boolean(), false),

	buildVisibility: v.optional(BuildVisibilitySchema, "hidden"),
	category: v.optional(CategorySchema, "distribution"),
	buildTime: v.optional(v.number(), -1),
	buildCostMultiplier: v.optional(v.number(), 1),
	deconstructThreshold: v.optional(v.number(), 0),
	instantDeconstruct: v.optional(v.boolean(), false),
	instantBuild: v.optional(v.boolean(), false),
	ignoreBuildDarkness: v.optional(v.boolean(), false),
	schematicPriority: v.optional(v.number(), 0),
	researchCostMultiplier: v.optional(v.number(), 1),

	baseExplosiveness: v.optional(v.number(), 0),
	explosivenessScale: v.optional(v.number(), 1),
	flammabilityScale: v.optional(v.number(), 1),
	baseShake: v.optional(v.number(), 3),
	createRubble: v.optional(v.boolean(), true),

	clipSize: v.optional(v.number(), -1),
	timers: v.optional(v.number(), 0),
	fogRadius: v.optional(v.number(), -1),
	dumpTime: v.optional(v.number(), 5),
	placeOverlapRange: v.optional(v.number(), 50),
	unitCapModifier: v.optional(v.number(), 0),
	priority: v.optional(v.number(), 0),
	isDuct: v.optional(v.boolean(), false),
	deconstructDropAllLiquid: v.optional(v.boolean(), false),
	playerUnmineable: v.optional(v.boolean(), false),

	placePitchChange: v.optional(v.boolean(), true),
	breakPitchChange: v.optional(v.boolean(), true),
	destroySoundVolume: v.optional(v.number(), 1),
	destroyPitchMin: v.optional(v.number(), 1),
	destroyPitchMax: v.optional(v.number(), 1),
	ambientSoundVolume: v.optional(v.number(), 0.05),

	editorConfigurable: v.optional(v.boolean(), false),
	inEditor: v.optional(v.boolean(), true),
	privileged: v.optional(v.boolean(), false),
	autoResetEnabled: v.optional(v.boolean(), true),
	canPickup: v.optional(v.boolean(), true),
	instantTransfer: v.optional(v.boolean(), false),
	quickRotate: v.optional(v.boolean(), true),
	allowDerelictRepair: v.optional(v.boolean(), true),
	forceTeam: v.optional(TeamSchema),
	alwaysReplace: v.optional(v.boolean(), false),
	replaceable: v.optional(v.boolean(), true),
	unitMoveBreakable: v.optional(v.boolean(), false),

	cacheLayer: v.optional(CacheLayerSchema, "normal"),
	group: v.optional(BlockGroupSchema, "none"),
	flags: v.optional(v.array(BlockFlagSchema), []),

	attributes: v.optional(AttributesSchema),

	outlineColor: v.optional(MindustryHexColorSchema),
	lightColor: v.optional(MindustryHexColorSchema),
	mapColor: v.optional(MindustryHexColorSchema),

	placeSound: v.optional(SoundHjsonSchema),
	breakSound: v.optional(SoundHjsonSchema),
	destroySound: v.optional(SoundHjsonSchema),
	ambientSound: v.optional(SoundHjsonSchema),

	regionRotated1: v.optional(v.number(), -1),
	regionRotated2: v.optional(v.number(), -1),
};

export const BlockFieldSchema: SchemaFn = (context) =>
	v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.blocks.map((block) => block.name.replaceAll(context.name + "-", ""))),
	);

export const BlockHjsonSchema: SchemaFn = (context) => {
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
			v.metadata(metadata),
		);
	});
};
