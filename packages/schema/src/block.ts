import * as v from "valibot";
import { ArrayTextureSchema } from "./textures";
import { CachedSchema } from "./utils";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { ResearchSchema } from "./research";
import { SoundHjsonSchema } from "./sound";
import { TextureFieldSchema } from "./texture";
import type { SchemaFn } from "./utils";
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
import { fixed, metadata } from "./utils";
import { TargetPriority } from "./target-priority";
import { ConsumesHjsonSchema } from "./consumes";
import { ContentFieldSchema } from "./content";
import { Envs, EnvSchema } from "./envs";
import type { ProjectContents } from "@project/types";
import { ShootPatternHjsonSchema } from "./shoot-pattern";
import { ClassMap, classSchema } from "./class";
import { ItemStackSchema } from "./item-stack";

export const blockTypes = [
	// Power
	"Block",
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
	"BlockProducer",
	"SingleBlockProducer",
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
	"Constructor",
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
	"CharacterOverlay",
	"EmptyFloor",
	"AirBlock",
	"Prop",
	"SeaBush",
	"Seaweed",
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
	"ShallowLiquid",
	"SteamVent",
	"TiledFloor",
] as const;

export type BlockType = (typeof blockTypes)[number];

export const blockObjectSchema = {
	type: classSchema(blockTypes, "Block"),
	shadowTexture: TextureFieldSchema("@-shadow"),
	teamTexture: TextureFieldSchema("@-team"),
	// Items
	hasItems: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.has-items", description: "editor.block.has-items-description" }),
	),
	hasLiquids: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.has-liquids",
			description: "editor.block.has-liquids-description",
		}),
	),
	hasPower: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.has-power", description: "editor.block.has-power-description" }),
	),
	outputsLiquid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.outputs-liquid",
			description: "editor.block.outputs-liquid-description",
		}),
	),
	consumesPower: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.consumes-power",
			description: "editor.block.consumes-power-description",
		}),
	),
	outputsPower: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.outputs-power",
			description: "editor.block.outputs-power-description",
		}),
	),
	connectedPower: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.connected-power",
			description: "editor.block.connected-power-description",
		}),
	),
	conductivePower: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.conductive-power",
			description: "editor.block.conductive-power-description",
		}),
	),
	outputsPayload: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.outputs-payload",
			description: "editor.block.outputs-payload-description",
		}),
	),
	acceptsUnitPayloads: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.accepts-unit-payloads",
			description: "editor.block.accepts-unit-payloads-description",
		}),
	),
	acceptsPayload: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.accepts-payload",
			description: "editor.block.accepts-payload-description",
		}),
	),
	acceptsItems: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.accepts-items",
			description: "editor.block.accepts-items-description",
		}),
	),
	itemCapacity: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block.item-capacity",
			description: "editor.block.item-capacity-description",
			visibleWhen: { field: "hasItems", value: true },
		}),
	),
	liquidCapacity: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block.liquid-capacity",
			description: "editor.block.liquid-capacity-description",
			visibleWhen: { field: "hasLiquids", value: true },
		}),
	),
	liquidPressure: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block.liquid-pressure",
			description: "editor.block.liquid-pressure-description",
			visibleWhen: { field: "hasLiquids", value: true },
		}),
	),
	separateItemCapacity: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.separate-item-capacity",
			description: "editor.block.separate-item-capacity-description",
			visibleWhen: { field: "hasItems", value: true },
		}),
	),
	alwaysAllowDeposit: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.always-allow-deposit",
			description: "editor.block.always-allow-deposit-description",
		}),
	),
	depositCooldown: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block.deposit-cooldown",
			description: "editor.block.deposit-cooldown-description",
		}),
	),
	displayFlow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.display-flow",
			description: "editor.block.display-flow-description",
		}),
	),
	unloadable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.block.unloadable", description: "editor.block.unloadable-description" }),
	),
	allowResupply: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.allow-resupply",
			description: "editor.block.allow-resupply-description",
		}),
	),
	// Placement & Size
	size: v.pipe(v.optional(v.number(), 1), metadata({ name: "editor.block.size", description: "editor.block.size-description" })),
	offset: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.block.offset", description: "editor.block.offset-description" })),
	sizeOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block.size-offset",
			description: "editor.block.size-offset-description",
		}),
	),
	rotate: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.rotate", description: "editor.block.rotate-description" }),
	),
	rotateDraw: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.rotate-draw",
			description: "editor.block.rotate-draw-description",
			visibleWhen: { field: "rotate", value: true },
		}),
	),
	rotateDrawEditor: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.rotate-draw-editor",
			description: "editor.block.rotate-draw-editor-description",
			visibleWhen: { field: "rotate", value: true },
		}),
	),
	visualRotationOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block.visual-rotation-offset",
			description: "editor.block.visual-rotation-offset-description",
			visibleWhen: { field: "rotate", value: true },
		}),
	),
	lockRotation: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.lock-rotation",
			description: "editor.block.lock-rotation-description",
		}),
	),
	ignoreLineRotation: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.ignore-line-rotation",
			description: "editor.block.ignore-line-rotation-description",
		}),
	),
	invertFlip: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.invert-flip",
			description: "editor.block.invert-flip-description",
		}),
	),
	variants: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.block.variants", description: "editor.block.variants-description" }),
	),
	drawArrow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.draw-arrow",
			description: "editor.block.draw-arrow-description",
		}),
	),
	drawTeamOverlay: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.draw-team-overlay",
			description: "editor.block.draw-team-overlay-description",
		}),
	),
	drawCracks: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.draw-cracks",
			description: "editor.block.draw-cracks-description",
		}),
	),
	drawDisabled: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.draw-disabled",
			description: "editor.block.draw-disabled-description",
		}),
	),
	drawLiquidLight: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.draw-liquid-light",
			description: "editor.block.draw-liquid-light-description",
		}),
	),
	enableDrawStatus: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.enable-draw-status",
			description: "editor.block.enable-draw-status-description",
		}),
	),
	squareSprite: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.square-sprite",
			description: "editor.block.square-sprite-description",
		}),
	),
	fillsTile: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.fills-tile",
			description: "editor.block.fills-tile-description",
		}),
	),
	hasShadow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.has-shadow",
			description: "editor.block.has-shadow-description",
		}),
	),
	customShadow: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.custom-shadow",
			description: "editor.block.custom-shadow-description",
		}),
	),
	outlineIcon: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.outline-icon",
			description: "editor.block.outline-icon-description",
		}),
	),
	outlineRadius: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block.outline-radius",
			description: "editor.block.outline-radius-description",
		}),
	),
	outlinedIcon: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block.outlined-icon",
			description: "editor.block.outlined-icon-description",
		}),
	),
	albedo: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.block.albedo", description: "editor.block.albedo-description" })),
	emitLight: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.emit-light",
			description: "editor.block.emit-light-description",
		}),
	),
	obstructsLight: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.obstructs-light",
			description: "editor.block.obstructs-light-description",
			visibleWhen: { field: "emitLight", value: true },
		}),
	),
	lightRadius: v.pipe(
		v.optional(v.number(), 60),
		metadata({
			name: "editor.block.light-radius",
			description: "editor.block.light-radius-description",
			visibleWhen: { field: "emitLight", value: true },
		}),
	),
	lightClipSize: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block.light-clip-size",
			description: "editor.block.light-clip-size-description",
		}),
	),
	forceDark: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.force-dark",
			description: "editor.block.force-dark-description",
		}),
	),
	useColor: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.use-color",
			description: "editor.block.use-color-description",
		}),
	),
	hasColor: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.has-color",
			description: "editor.block.has-color-description",
		}),
	),
	// Placement
	placeablePlayer: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.placeable-player",
			description: "editor.block.placeable-player-description",
		}),
	),
	placeableOn: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.placeable-on",
			description: "editor.block.placeable-on-description",
		}),
	),
	placeableLiquid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.placeable-liquid",
			description: "editor.block.placeable-liquid-description",
		}),
	),
	requiresWater: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.requires-water",
			description: "editor.block.requires-water-description",
		}),
	),
	floating: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.floating", description: "editor.block.floating-description" }),
	),
	conveyorPlacement: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.conveyor-placement",
			description: "editor.block.conveyor-placement-description",
		}),
	),
	allowDiagonal: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.allow-diagonal",
			description: "editor.block.allow-diagonal-description",
		}),
	),
	swapDiagonalPlacement: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.swap-diagonal-placement",
			description: "editor.block.swap-diagonal-placement-description",
		}),
	),
	allowRectanglePlacement: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.allow-rectangle-placement",
			description: "editor.block.allow-rectangle-placement-description",
		}),
	),
	noSideBlend: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.no-side-blend",
			description: "editor.block.no-side-blend-description",
		}),
	),
	outputFacing: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.output-facing",
			description: "editor.block.output-facing-description",
		}),
	),
	// Health & Durability
	health: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.block.health", description: "editor.block.health-description" })),
	scaledHealth: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block.scaled-health",
			description: "editor.block.scaled-health-description",
		}),
	),
	armor: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.block.armor", description: "editor.block.armor-description" })),
	saveData: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.save-data", description: "editor.block.save-data-description" }),
	),
	destructible: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.destructible",
			description: "editor.block.destructible-description",
		}),
	),
	breakable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.breakable", description: "editor.block.breakable-description" }),
	),
	rebuildable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.rebuildable",
			description: "editor.block.rebuildable-description",
		}),
	),
	crushDamageMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block.crush-damage-multiplier",
			description: "editor.block.crush-damage-multiplier-description",
		}),
	),
	crushFragile: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.crush-fragile",
			description: "editor.block.crush-fragile-description",
		}),
	),
	destroyBulletSameTeam: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.destroy-bullet-same-team",
			description: "editor.block.destroy-bullet-same-team-description",
		}),
	),
	// Physics
	solid: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.block.solid", description: "editor.block.solid-description" })),
	solidifes: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.solidifes", description: "editor.block.solidifes-description" }),
	),
	teamPassable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.team-passable",
			description: "editor.block.team-passable-description",
		}),
	),
	underBullets: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.under-bullets",
			description: "editor.block.under-bullets-description",
		}),
	),
	// Update & Config
	update: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.update", description: "editor.block.update-description" }),
	),
	updateInUnits: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.update-in-units",
			description: "editor.block.update-in-units-description",
			visibleWhen: { field: "update", value: true },
		}),
	),
	alwaysUpdateInUnits: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.always-update-in-units",
			description: "editor.block.always-update-in-units-description",
			visibleWhen: { field: "update", value: true },
		}),
	),
	noUpdateDisabled: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.no-update-disabled",
			description: "editor.block.no-update-disabled-description",
			visibleWhen: { field: "update", value: true },
		}),
	),
	configurable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.configurable",
			description: "editor.block.configurable-description",
			visibleWhen: { field: "update", value: true },
		}),
	),
	configureSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.block.configure-sound",
			description: "editor.block.configure-sound-description",
			visibleWhen: { field: "configurable", value: true },
		}),
	),
	saveConfig: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.save-config",
			description: "editor.block.save-config-description",
			visibleWhen: { field: "configurable", value: true },
		}),
	),
	copyConfig: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.copy-config",
			description: "editor.block.copy-config-description",
			visibleWhen: { field: "configurable", value: true },
		}),
	),
	clearOnDoubleTap: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.clear-on-double-tap",
			description: "editor.block.clear-on-double-tap-description",
			visibleWhen: { field: "configurable", value: true },
		}),
	),
	consumesTap: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.consumes-tap",
			description: "editor.block.consumes-tap-description",
		}),
	),
	ignoreResizeConfig: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.ignore-resize-config",
			description: "editor.block.ignore-resize-config-description",
		}),
	),
	commandable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.commandable",
			description: "editor.block.commandable-description",
		}),
	),
	allowConfigInventory: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.allow-config-inventory",
			description: "editor.block.allow-config-inventory-description",
		}),
	),
	logicConfigurable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.logic-configurable",
			description: "editor.block.logic-configurable-description",
		}),
	),
	selectionRows: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block.selection-rows",
			description: "editor.block.selection-rows-description",
		}),
	),
	selectionColumns: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block.selection-columns",
			description: "editor.block.selection-columns-description",
		}),
	),
	delayLandingConfig: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.delay-landing-config",
			description: "editor.block.delay-landing-config-description",
		}),
	),
	selectScroll: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block.select-scroll",
			description: "editor.block.select-scroll-description",
		}),
	),
	// Environment
	envRequired: v.pipe(
		v.optional(EnvSchema, 0),
		metadata({
			name: "editor.block.env-required",
			description: "editor.block.env-required-description",
		}),
	),
	envEnabled: v.pipe(
		v.optional(EnvSchema, Envs.terrestrial),
		metadata({
			name: "editor.block.env-enabled",
			description: "editor.block.env-enabled-description",
		}),
	),
	envDisabled: v.pipe(
		v.optional(EnvSchema, 0),
		metadata({
			name: "editor.block.env-disabled",
			description: "editor.block.env-disabled-description",
		}),
	),
	// Network
	sync: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.block.sync", description: "editor.block.sync-description" })),
	// Combat & Targeting
	attacks: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.attacks", description: "editor.block.attacks-description" }),
	),
	targetable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.targetable",
			description: "editor.block.targetable-description",
		}),
	),
	suppressable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.suppressable",
			description: "editor.block.suppressable-description",
		}),
	),
	canOverdrive: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.can-overdrive",
			description: "editor.block.can-overdrive-description",
		}),
	),
	absorbLasers: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.absorb-lasers",
			description: "editor.block.absorb-lasers-description",
		}),
	),
	insulated: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.insulated", description: "editor.block.insulated-description" }),
	),
	// Building
	buildVisibility: v.pipe(
		v.optional(BuildVisibilitySchema, "hidden"),
		metadata({
			name: "editor.block.build-visibility",
			description: "editor.block.build-visibility-description",
		}),
	),
	category: v.pipe(
		v.optional(CategorySchema, "distribution"),
		metadata({ name: "editor.block.category", description: "editor.block.category-description" }),
	),
	buildTime: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block.build-time",
			description: "editor.block.build-time-description",
		}),
	),
	buildCostMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block.build-cost-multiplier",
			description: "editor.block.build-cost-multiplier-description",
		}),
	),
	deconstructThreshold: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block.deconstruct-threshold",
			description: "editor.block.deconstruct-threshold-description",
		}),
	),
	instantDeconstruct: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.instant-deconstruct",
			description: "editor.block.instant-deconstruct-description",
		}),
	),
	instantBuild: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.instant-build",
			description: "editor.block.instant-build-description",
		}),
	),
	ignoreBuildDarkness: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.ignore-build-darkness",
			description: "editor.block.ignore-build-darkness-description",
		}),
	),
	schematicPriority: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block.schematic-priority",
			description: "editor.block.schematic-priority-description",
		}),
	),
	researchCostMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block.research-cost-multiplier",
			description: "editor.block.research-cost-multiplier-description",
		}),
	),
	// Explosion
	baseExplosiveness: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block.base-explosiveness",
			description: "editor.block.base-explosiveness-description",
		}),
	),
	explosivenessScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block.explosiveness-scale",
			description: "editor.block.explosiveness-scale-description",
		}),
	),
	flammabilityScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block.flammability-scale",
			description: "editor.block.flammability-scale-description",
		}),
	),
	baseShake: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "editor.block.base-shake", description: "editor.block.base-shake-description" }),
	),
	createRubble: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.create-rubble",
			description: "editor.block.create-rubble-description",
		}),
	),
	// Misc Stats
	clipSize: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block.clip-size",
			description: "editor.block.clip-size-description",
		}),
	),
	timers: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.block.timers", description: "editor.block.timers-description" })),
	fogRadius: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block.fog-radius",
			description: "editor.block.fog-radius-description",
		}),
	),
	dumpTime: v.pipe(v.optional(v.number(), 5), metadata({ name: "editor.block.dump-time" })),
	placeOverlapRange: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.block.place-overlap-range",
			description: "editor.block.place-overlap-range-description",
		}),
	),
	unitCapModifier: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block.unit-cap-modifier",
			description: "editor.block.unit-cap-modifier-description",
		}),
	),
	priority: v.pipe(
		v.optional(v.number(), TargetPriority.base),
		metadata({ name: "editor.block.priority", description: "editor.block.priority-description", type: "target-priority" }),
	),
	isDuct: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.block.is-duct", description: "editor.block.is-duct-description" }),
	),
	deconstructDropAllLiquid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.deconstruct-drop-all-liquid",
			description: "editor.block.deconstruct-drop-all-liquid-description",
			visibleWhen: { field: "hasLiquids", value: true },
		}),
	),
	playerUnmineable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.player-unmineable",
			description: "editor.block.player-unmineable-description",
		}),
	),
	// Audio
	placePitchChange: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.place-pitch-change",
			description: "editor.block.place-pitch-change-description",
		}),
	),
	breakPitchChange: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.break-pitch-change",
			description: "editor.block.break-pitch-change-description",
		}),
	),
	destroySoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block.destroy-sound-volume",
			description: "editor.block.destroy-sound-volume-description",
		}),
	),
	destroyPitchMin: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block.destroy-pitch-min",
			description: "editor.block.destroy-pitch-min-description",
		}),
	),
	destroyPitchMax: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block.destroy-pitch-max",
			description: "editor.block.destroy-pitch-max-description",
		}),
	),
	ambientSoundVolume: v.pipe(
		v.optional(v.number(), 0.05),
		metadata({
			name: "editor.block.ambient-sound-volume",
			description: "editor.block.ambient-sound-volume-description",
		}),
	),
	// Editor & Misc
	editorConfigurable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.editor-configurable",
			description: "editor.block.editor-configurable-description",
		}),
	),
	inEditor: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.in-editor",
			description: "editor.block.in-editor-description",
		}),
	),
	privileged: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.privileged",
			description: "editor.block.privileged-description",
		}),
	),
	autoResetEnabled: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.auto-reset-enabled",
			description: "editor.block.auto-reset-enabled-description",
		}),
	),
	canPickup: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.can-pickup",
			description: "editor.block.can-pickup-description",
		}),
	),
	instantTransfer: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.instant-transfer",
			description: "editor.block.instant-transfer-description",
		}),
	),
	quickRotate: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.quick-rotate",
			description: "editor.block.quick-rotate-description",
		}),
	),
	allowDerelictRepair: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.allow-derelict-repair",
			description: "editor.block.allow-derelict-repair-description",
		}),
	),
	forceTeam: v.pipe(
		v.optional(TeamSchema),
		metadata({
			name: "editor.block.force-team",
			description: "editor.block.force-team-description",
		}),
	),
	alwaysReplace: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.always-replace",
			description: "editor.block.always-replace-description",
		}),
	),
	replaceable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block.replaceable",
			description: "editor.block.replaceable-description",
		}),
	),
	unitMoveBreakable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block.unit-move-breakable",
			description: "editor.block.unit-move-breakable-description",
		}),
	),
	// Visual Systems
	cacheLayer: v.pipe(
		v.optional(CacheLayerSchema, "normal"),
		metadata({
			name: "editor.block.cache-layer",
			description: "editor.block.cache-layer-description",
		}),
	),
	group: v.pipe(
		v.optional(BlockGroupSchema, "none"),
		metadata({ name: "editor.block.group", description: "editor.block.group-description" }),
	),
	flags: v.pipe(
		v.optional(v.array(BlockFlagSchema), []),
		metadata({ name: "editor.block.flags", description: "editor.block.flags-description" }),
	),
	attributes: v.pipe(
		v.optional(AttributesSchema),
		metadata({ name: "editor.block.attributes", description: "editor.block.attributes-description" }),
	),
	// Colors
	outlineColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.block.outline-color",
			description: "editor.block.outline-color-description",
		}),
	),
	lightColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.block.light-color",
			description: "editor.block.light-color-description",
		}),
	),
	mapColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.block.map-color", description: "editor.block.map-color-description" }),
	),
	// Sound refs
	placeSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.block.place-sound",
			description: "editor.block.place-sound-description",
		}),
	),
	breakSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.block.break-sound",
			description: "editor.block.break-sound-description",
		}),
	),
	destroySound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.block.destroy-sound",
			description: "editor.block.destroy-sound-description",
		}),
	),
	ambientSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.block.ambient-sound",
			description: "editor.block.ambient-sound-description",
		}),
	),
	regionRotated1: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.block.region-rotated1" })),
	regionRotated2: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.block.region-rotated2" })),
};

const liquidBlockObjectSchema = v.object({
	liquidRegion: TextureFieldSchema("@-liquid"),
	topRegion: TextureFieldSchema("@-top"),
	bottomRegion: TextureFieldSchema("@bottom"),
});

const powerBlockObjectSchema = v.object({});

const powerDistributorObjectSchema = v.object({
	...powerBlockObjectSchema.entries,
});

// Power variant schemas
const powerGeneratorObjectSchema = v.object({
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

const consumeGeneratorObjectSchema = v.object({
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

const heaterGeneratorObjectSchema = v.object({
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

const thermalGeneratorObjectSchema = v.object({
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
		v.optional(v.string(), "heat"),
		metadata({
			name: "editor.block-thermal-generator.attribute",
			description: "editor.block-thermal-generator.attribute-description",
		}),
	),
});

const nuclearReactorObjectSchema = v.object({
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

const impactReactorObjectSchema = v.object({
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

const variableReactorObjectSchema = v.object({
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

const lightBlockObjectSchema = v.object({
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

const powerNodeObjectSchema = v.object({
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

const longPowerNodeObjectSchema = v.object({
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

const beamNodeObjectSchema = v.object({
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

const powerSourceObjectSchema = v.object({
	...powerBlockObjectSchema.entries,
	powerProduction: v.pipe(
		v.optional(v.number(), 10000),
		metadata({
			name: "editor.block-power-source.power-production",
			description: "editor.block-power-source.power-production-description",
		}),
	),
});

// Storage variant schemas
const storageBlockObjectSchema = v.object({
	coreMerge: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-storage-block.core-merge",
			description: "editor.block-storage-block.core-merge-description",
		}),
	),
});

const coreBlockObjectSchema = v.object({
	...storageBlockObjectSchema.entries,
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

const unloaderObjectSchema = v.object({
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

// Liquid variant schemas
const liquidRouterObjectSchema = v.object({
	liquidPadding: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-liquid-router.liquid-padding",
			description: "editor.block-liquid-router.liquid-padding-description",
		}),
	),
});

const conduitObjectSchema = v.object({
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

const pumpObjectSchema = v.object({
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

const solidPumpObjectSchema = v.object({
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

const frackerObjectSchema = v.object({
	...solidPumpObjectSchema.entries,
	itemUseTime: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-fracker.item-use-time",
			description: "editor.block-fracker.item-use-time-description",
		}),
	),
});

// Production variant schemas
const genericCrafterObjectSchema = v.object({
	outputItem: v.pipe(
		v.optional(v.string()),
		metadata({
			name: "editor.block-generic-crafter.output-item",
			description: "editor.block-generic-crafter.output-item-description",
		}),
	),
	outputItems: v.pipe(
		v.optional(v.array(v.string())),
		metadata({
			name: "editor.block-generic-crafter.output-items",
			description: "editor.block-generic-crafter.output-items-description",
		}),
	),
	outputLiquid: v.pipe(
		v.optional(v.string()),
		metadata({
			name: "editor.block-generic-crafter.output-liquid",
			description: "editor.block-generic-crafter.output-liquid-description",
		}),
	),
	outputLiquids: v.pipe(
		v.optional(v.array(v.string())),
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

const heatCrafterObjectSchema = v.object({
	...genericCrafterObjectSchema.entries,
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

const attributeCrafterObjectSchema = v.object({
	...genericCrafterObjectSchema.entries,
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

const separatorObjectSchema = v.object({
	results: v.pipe(
		v.optional(v.array(v.string())),
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

const drillObjectSchema = v.object({
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

const burstDrillObjectSchema = v.object({
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

const beamDrillObjectSchema = v.object({
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

const wallCrafterObjectSchema = v.object({
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

const itemIncineratorObjectSchema = v.object({
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

const heatProducerObjectSchema = v.object({
	...genericCrafterObjectSchema.entries,
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

// Defense variant schemas
const wallObjectSchema = v.object({
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

const staticWallObjectSchema = v.object({
	largeTexture: TextureFieldSchema("@-large"),
	autotile: v.optional(v.boolean(), false),
	autotileMidVariants: v.optional(v.pipe(v.number(), v.integer()), 1),
});

const coloredWallObjectSchema = v.object({
	...staticWallObjectSchema.entries,
	color: v.pipe(
		MindustryHexColorSchema,
		metadata({
			name: "editor.block-wall.color",
			description: "editor.block-wall.color-description",
			category: "editor.block-wall.category.visual",
		}),
	),
});

const shieldWallObjectSchema = v.object({
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

const doorObjectSchema = v.object({
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

const autoDoorObjectSchema = v.object({
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

const shockwaveTowerObjectSchema = v.object({
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

const shockMineObjectSchema = v.object({
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

const regenProjectorObjectSchema = v.object({
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

const radarObjectSchema = v.object({
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

const overdriveProjectorObjectSchema = v.object({
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

const mendProjectorObjectSchema = v.object({
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

const forceProjectorObjectSchema = v.object({
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

const directionalForceProjectorObjectSchema = v.object({
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

const baseShieldObjectSchema = v.object({
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

// Turret variant schemas
const baseTurretObjectSchema = v.object({
	update: fixed(blockObjectSchema, "update", true),
	solid: fixed(blockObjectSchema, "solid", true),
	outlineIcon: fixed(blockObjectSchema, "outlineIcon", true),
	attacks: fixed(blockObjectSchema, "attacks", true),
	priority: fixed(blockObjectSchema, "priority", TargetPriority.turret),
	group: fixed(blockObjectSchema, "group", "turrets"),
	flags: fixed(blockObjectSchema, "flags", ["turret"]),
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-base-turret.range",
			description: "editor.block-base-turret.range-description",
		}),
	),
	placeOverlapMargin: v.pipe(
		v.optional(v.number(), 56),
		metadata({
			name: "editor.block-base-turret.place-overlap-margin",
			description: "editor.block-base-turret.place-overlap-margin-description",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-base-turret.rotate-speed",
			description: "editor.block-base-turret.rotate-speed-description",
		}),
	),
	fogRadiusMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-base-turret.fog-radius-multiplier",
			description: "editor.block-base-turret.fog-radius-multiplier-description",
		}),
	),
	disableOverlapCheck: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-base-turret.disable-overlap-check",
			description: "editor.block-base-turret.disable-overlap-check-description",
		}),
	),
	activationTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-base-turret.activation-time",
			description: "editor.block-base-turret.activation-time-description",
		}),
	),
	coolantMultiplier: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-base-turret.coolant-multiplier",
			description: "editor.block-base-turret.coolant-multiplier-description",
		}),
	),
});

const reloadTurretObjectSchema = v.object({
	...baseTurretObjectSchema.entries,
	reload: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block-reload-turret.reload",
			description: "editor.block-reload-turret.reload-description",
		}),
	),
});

const turretObjectSchema = (context: ProjectContents) =>
	v.object({
		...reloadTurretObjectSchema.entries,
		shoot: v.optional(ShootPatternHjsonSchema(context)),
		ammoUseEffect: v.optional(EffectFieldSchema(context)),
		targetInterval: v.pipe(
			v.optional(v.number(), 20),
			metadata({
				name: "editor.block-turret.target-interval",
				description: "editor.block-turret.target-interval-description",
			}),
		),
		newTargetInterval: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.new-target-interval",
				description: "editor.block-turret.new-target-interval-description",
			}),
		),
		maxAmmo: v.pipe(
			v.optional(v.number(), 30),
			metadata({
				name: "editor.block-turret.max-ammo",
				description: "editor.block-turret.max-ammo-description",
			}),
		),
		ammoPerShot: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-turret.ammo-per-shot",
				description: "editor.block-turret.ammo-per-shot-description",
			}),
		),
		consumeAmmoOnce: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.consume-ammo-once",
				description: "editor.block-turret.consume-ammo-once-description",
			}),
		),
		heatRequirement: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.heat-requirement",
				description: "editor.block-turret.heat-requirement-description",
			}),
		),
		maxHeatEfficiency: v.pipe(
			v.optional(v.number(), 3),
			metadata({
				name: "editor.block-turret.max-heat-efficiency",
				description: "editor.block-turret.max-heat-efficiency-description",
			}),
		),
		inaccuracy: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.inaccuracy",
				description: "editor.block-turret.inaccuracy-description",
			}),
		),
		velocityRnd: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.velocity-rnd",
				description: "editor.block-turret.velocity-rnd-description",
			}),
		),
		scaleLifetimeOffset: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.scale-lifetime-offset",
				description: "editor.block-turret.scale-lifetime-offset-description",
			}),
		),
		shootCone: v.pipe(
			v.optional(v.number(), 8),
			metadata({
				name: "editor.block-turret.shoot-cone",
				description: "editor.block-turret.shoot-cone-description",
			}),
		),
		shootX: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.shoot-x",
				description: "editor.block-turret.shoot-x-description",
			}),
		),
		shootY: v.pipe(
			v.optional(v.number()),
			metadata({
				name: "editor.block-turret.shoot-y",
				description: "editor.block-turret.shoot-y-description",
			}),
		),
		xRand: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.x-rand",
				description: "editor.block-turret.x-rand-description",
			}),
		),
		drawMinRange: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-turret.draw-min-range",
				description: "editor.block-turret.draw-min-range-description",
			}),
		),
		trackingRange: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.tracking-range",
				description: "editor.block-turret.tracking-range-description",
			}),
		),
		minRange: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.min-range",
				description: "editor.block-turret.min-range-description",
			}),
		),
		minWarmup: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.min-warmup",
				description: "editor.block-turret.min-warmup-description",
			}),
		),
		accurateDelay: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.accurate-delay",
				description: "editor.block-turret.accurate-delay-description",
			}),
		),
		moveWhileCharging: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.move-while-charging",
				description: "editor.block-turret.move-while-charging-description",
			}),
		),
		reloadWhileCharging: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.reload-while-charging",
				description: "editor.block-turret.reload-while-charging-description",
			}),
		),
		warmupMaintainTime: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.warmup-maintain-time",
				description: "editor.block-turret.warmup-maintain-time-description",
			}),
		),
		targetAir: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.target-air",
				description: "editor.block-turret.target-air-description",
			}),
		),
		targetGround: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.target-ground",
				description: "editor.block-turret.target-ground-description",
			}),
		),
		targetBlocks: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.target-blocks",
				description: "editor.block-turret.target-blocks-description",
			}),
		),
		targetHealing: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-turret.target-healing",
				description: "editor.block-turret.target-healing-description",
			}),
		),
		playerControllable: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.player-controllable",
				description: "editor.block-turret.player-controllable-description",
			}),
		),
		displayAmmoMultiplier: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.display-ammo-multiplier",
				description: "editor.block-turret.display-ammo-multiplier-description",
			}),
		),
		targetUnderBlocks: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.target-under-blocks",
				description: "editor.block-turret.target-under-blocks-description",
			}),
		),
		alwaysShooting: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-turret.always-shooting",
				description: "editor.block-turret.always-shooting-description",
			}),
		),
		predictTarget: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.predict-target",
				description: "editor.block-turret.predict-target-description",
			}),
		),
		shootSoundVolume: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-turret.shoot-sound-volume",
				description: "editor.block-turret.shoot-sound-volume-description",
			}),
		),
		loopSoundVolume: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({
				name: "editor.block-turret.loop-sound-volume",
				description: "editor.block-turret.loop-sound-volume-description",
			}),
		),
		soundPitchMin: v.pipe(
			v.optional(v.number(), 0.9),
			metadata({
				name: "editor.block-turret.sound-pitch-min",
				description: "editor.block-turret.sound-pitch-min-description",
			}),
		),
		soundPitchMax: v.pipe(
			v.optional(v.number(), 1.1),
			metadata({
				name: "editor.block-turret.sound-pitch-max",
				description: "editor.block-turret.sound-pitch-max-description",
			}),
		),
		ammoEjectBack: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-turret.ammo-eject-back",
				description: "editor.block-turret.ammo-eject-back-description",
			}),
		),
		shootWarmupSpeed: v.pipe(
			v.optional(v.number(), 0.1),
			metadata({
				name: "editor.block-turret.shoot-warmup-speed",
				description: "editor.block-turret.shoot-warmup-speed-description",
			}),
		),
		linearWarmup: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-turret.linear-warmup",
				description: "editor.block-turret.linear-warmup-description",
			}),
		),
		recoil: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-turret.recoil",
				description: "editor.block-turret.recoil-description",
			}),
		),
		recoils: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.recoils",
				description: "editor.block-turret.recoils-description",
			}),
		),
		recoilTime: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.recoil-time",
				description: "editor.block-turret.recoil-time-description",
			}),
		),
		recoilPow: v.pipe(
			v.optional(v.number(), 1.8),
			metadata({
				name: "editor.block-turret.recoil-pow",
				description: "editor.block-turret.recoil-pow-description",
			}),
		),
		cooldownTime: v.pipe(
			v.optional(v.number(), 20),
			metadata({
				name: "editor.block-turret.cooldown-time",
				description: "editor.block-turret.cooldown-time-description",
			}),
		),
		elevation: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.elevation",
				description: "editor.block-turret.elevation-description",
			}),
		),
		shake: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.shake",
				description: "editor.block-turret.shake-description",
			}),
		),
	});

const powerTurretObjectSchema = (context: ProjectContents) =>
	v.object({
		...turretObjectSchema(context).entries,
		shootType: v.pipe(
			v.optional(BulletHjsonSchema(context)),
			metadata({
				name: "editor.block-power-turret.shoot-type",
				description: "editor.block-power-turret.shoot-type-description",
			}),
		),
	});

const laserTurretObjectSchema = (context: ProjectContents) =>
	v.object({
		...powerTurretObjectSchema(context).entries,
		firingMoveFract: v.pipe(
			v.optional(v.number(), 0.25),
			metadata({
				name: "editor.block-laser-turret.firing-move-fract",
				description: "editor.block-laser-turret.firing-move-fract-description",
			}),
		),
		shootDuration: v.pipe(
			v.optional(v.number(), 100),
			metadata({
				name: "editor.block-laser-turret.shoot-duration",
				description: "editor.block-laser-turret.shoot-duration-description",
			}),
		),
	});

const continuousTurretObjectSchema = (context: ProjectContents) =>
	v.object({
		...turretObjectSchema(context).entries,
		shootType: v.pipe(
			v.optional(BulletHjsonSchema(context)),
			metadata({
				name: "editor.block-continuous-turret.shoot-type",
				description: "editor.block-continuous-turret.shoot-type-description",
			}),
		),
		aimChangeSpeed: v.pipe(
			v.optional(v.number()),
			metadata({
				name: "editor.block-continuous-turret.aim-change-speed",
				description: "editor.block-continuous-turret.aim-change-speed-description",
			}),
		),
		scaleDamageEfficiency: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-continuous-turret.scale-damage-efficiency",
				description: "editor.block-continuous-turret.scale-damage-efficiency-description",
			}),
		),
	});

const continuousLiquidTurretObjectSchema = (context: ProjectContents) =>
	v.object({
		...continuousTurretObjectSchema(context).entries,
		liquidConsumed: v.pipe(
			v.optional(v.number(), 1 / 60),
			metadata({
				name: "editor.block-continuous-liquid-turret.liquid-consumed",
				description: "editor.block-continuous-liquid-turret.liquid-consumed-description",
			}),
		),
	});

const pointDefenseTurretObjectSchema = v.object({
	baseTexture: TextureFieldSchema("@-base"),
	...reloadTurretObjectSchema.entries,
	retargetTime: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-point-defense-turret.retarget-time",
			description: "editor.block-point-defense-turret.retarget-time-description",
		}),
	),
	shootCone: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-point-defense-turret.shoot-cone",
			description: "editor.block-point-defense-turret.shoot-cone-description",
		}),
	),
	bulletDamage: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block-point-defense-turret.bullet-damage",
			description: "editor.block-point-defense-turret.bullet-damage-description",
		}),
	),
	shootLength: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-point-defense-turret.shoot-length",
			description: "editor.block-point-defense-turret.shoot-length-description",
		}),
	),
});

const tractorBeamTurretObjectSchema = v.object({
	baseTexture: TextureFieldSchema("@-base"),
	laserTexture: TextureFieldSchema("@-laser"),
	laserStartTexture: TextureFieldSchema("@-laser-start"),
	laserEndTexture: TextureFieldSchema("@-laser-end"),
	...baseTurretObjectSchema.entries,
	retargetTime: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-tractor-beam-turret.retarget-time",
			description: "editor.block-tractor-beam-turret.retarget-time-description",
		}),
	),
	shootCone: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-tractor-beam-turret.shoot-cone",
			description: "editor.block-tractor-beam-turret.shoot-cone-description",
		}),
	),
	shootLength: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-tractor-beam-turret.shoot-length",
			description: "editor.block-tractor-beam-turret.shoot-length-description",
		}),
	),
	laserWidth: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.block-tractor-beam-turret.laser-width",
			description: "editor.block-tractor-beam-turret.laser-width-description",
		}),
	),
	force: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "editor.block-tractor-beam-turret.force",
			description: "editor.block-tractor-beam-turret.force-description",
		}),
	),
	scaledForce: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-tractor-beam-turret.scaled-force",
			description: "editor.block-tractor-beam-turret.scaled-force-description",
		}),
	),
	damage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-tractor-beam-turret.damage",
			description: "editor.block-tractor-beam-turret.damage-description",
		}),
	),
	targetAir: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-tractor-beam-turret.target-air",
			description: "editor.block-tractor-beam-turret.target-air-description",
		}),
	),
	targetGround: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-tractor-beam-turret.target-ground",
			description: "editor.block-tractor-beam-turret.target-ground-description",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 300),
		metadata({
			name: "editor.block-tractor-beam-turret.status-duration",
			description: "editor.block-tractor-beam-turret.status-duration-description",
		}),
	),
	shootSoundVolume: v.pipe(
		v.optional(v.number(), 0.9),
		metadata({
			name: "editor.block-tractor-beam-turret.shoot-sound-volume",
			description: "editor.block-tractor-beam-turret.shoot-sound-volume-description",
		}),
	),
});

const buildTurretObjectSchema = v.object({
	...baseTurretObjectSchema.entries,
	baseTexture: TextureFieldSchema("@-base", "block-@size"),
	glowTexture: TextureFieldSchema("@-glow"),
	targetInterval: v.pipe(
		v.optional(v.number(), 15),
		metadata({
			name: "editor.block-build-turret.target-interval",
			description: "editor.block-build-turret.target-interval-description",
		}),
	),
	buildSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-build-turret.build-speed",
			description: "editor.block-build-turret.build-speed-description",
		}),
	),
	buildBeamOffset: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-build-turret.build-beam-offset",
			description: "editor.block-build-turret.build-beam-offset-description",
		}),
	),
	elevation: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block-build-turret.elevation",
			description: "editor.block-build-turret.elevation-description",
		}),
	),
});

// Distribution variant schemas
const conveyorObjectSchema = v.object({
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

const stackConveyorObjectSchema = v.object({
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

const routerObjectSchema = v.object({
	speed: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-router.speed",
			description: "editor.block-router.speed-description",
		}),
	),
});

const junctionObjectSchema = v.object({
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

const sorterObjectSchema = v.object({
	crossTexture: TextureFieldSchema("@-cross", "cross-full"),
	invert: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-sorter.invert",
			description: "editor.block-sorter.invert-description",
		}),
	),
});

const overflowGateObjectSchema = v.object({
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

const itemBridgeObjectSchema = v.object({
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

const bufferedItemBridgeObjectSchema = v.object({
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

const directionBridgeObjectSchema = v.object({
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

const directionLiquidBridgeObjectSchema = v.object({
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

const ductObjectSchema = v.object({
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

const ductRouterObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-duct-router.speed",
			description: "editor.block-duct-router.speed-description",
		}),
	),
});

const stackRouterObjectSchema = v.object({
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

const ductJunctionObjectSchema = v.object({
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

const overflowDuctObjectSchema = v.object({
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

const ductBridgeObjectSchema = v.object({
	...directionBridgeObjectSchema.entries,
	speed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-duct-bridge.speed",
			description: "editor.block-duct-bridge.speed-description",
		}),
	),
});

const massDriverObjectSchema = v.object({
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

const directionalUnloaderObjectSchema = v.object({
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

// Payload variant schemas
const payloadBlockObjectSchema = v.object({
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

const payloadConveyorObjectSchema = v.object({
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

const payloadRouterObjectSchema = v.object({
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

const payloadVoidObjectSchema = v.object({ ...payloadBlockObjectSchema.entries });

const payloadMassDriverObjectSchema = v.object({
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

const payloadLoaderObjectSchema = v.object({
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

const payloadUnloaderObjectSchema = v.object({
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

const payloadDeconstructorObjectSchema = v.object({
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

const blockProducerObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
	buildSpeed: v.pipe(
		v.optional(v.number(), 0.4),
		metadata({
			name: "editor.block-block-producer.build-speed",
			description: "editor.block-block-producer.build-speed-description",
		}),
	),
});

const unitBlockObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
});

const constructorObjectSchema = v.object({
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

const singleBlockProducerObjectSchema = v.object({
	...blockProducerObjectSchema.entries,
	result: v.pipe(
		v.optional(v.string()),
		metadata({
			name: "editor.block-single-block-producer.result",
			description: "editor.block-single-block-producer.result-description",
		}),
	),
});

// Unit variant schemas
const unitFactoryObjectSchema = v.object({
	...unitBlockObjectSchema.entries,
	capacities: v.pipe(
		v.optional(v.array(v.number()), []),
		metadata({
			name: "editor.block-unit-factory.capacities",
			description: "editor.block-unit-factory.capacities-description",
		}),
	),
	createSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-unit-factory.create-sound-volume",
			description: "editor.block-unit-factory.create-sound-volume-description",
		}),
	),
});

const reconstructorObjectSchema = v.object({
	...unitBlockObjectSchema.entries,
	constructTime: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-reconstructor.construct-time",
			description: "editor.block-reconstructor.construct-time-description",
		}),
	),
	capacities: v.pipe(
		v.optional(v.array(v.number()), []),
		metadata({
			name: "editor.block-reconstructor.capacities",
			description: "editor.block-reconstructor.capacities-description",
		}),
	),
	createSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-reconstructor.create-sound-volume",
			description: "editor.block-reconstructor.create-sound-volume-description",
		}),
	),
});

const unitAssemblerModuleObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
	sideTexture1: TextureFieldSchema("@-side1"),
	sideTexture2: TextureFieldSchema("@-side2"),
	tier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-unit-assembler-module.tier",
			description: "editor.block-unit-assembler-module.tier-description",
		}),
	),
});

const unitAssemblerObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
	sideTexture1: TextureFieldSchema("@-side1"),
	sideTexture2: TextureFieldSchema("@-side2"),
	areaSize: v.pipe(
		v.optional(v.number(), 11),
		metadata({
			name: "editor.block-unit-assembler.area-size",
			description: "editor.block-unit-assembler.area-size-description",
		}),
	),
	dronesCreated: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-unit-assembler.drones-created",
			description: "editor.block-unit-assembler.drones-created-description",
		}),
	),
	droneConstructTime: v.pipe(
		v.optional(v.number(), 240),
		metadata({
			name: "editor.block-unit-assembler.drone-construct-time",
			description: "editor.block-unit-assembler.drone-construct-time-description",
		}),
	),
	capacities: v.pipe(
		v.optional(v.array(v.number()), []),
		metadata({
			name: "editor.block-unit-assembler.capacities",
			description: "editor.block-unit-assembler.capacities-description",
		}),
	),
	createSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-unit-assembler.create-sound-volume",
			description: "editor.block-unit-assembler.create-sound-volume-description",
		}),
	),
});

const unitCargoUnloadPointObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	staleTimeDuration: v.pipe(
		v.optional(v.number(), 360),
		metadata({
			name: "editor.block-unit-cargo-unload-point.stale-time-duration",
			description: "editor.block-unit-cargo-unload-point.stale-time-duration-description",
		}),
	),
});

const unitCargoLoaderObjectSchema = v.object({
	unitBuildTime: v.pipe(
		v.optional(v.number(), 480),
		metadata({
			name: "editor.block-unit-cargo-loader.unit-build-time",
			description: "editor.block-unit-cargo-loader.unit-build-time-description",
		}),
	),
	polyStroke: v.pipe(
		v.optional(v.number(), 1.8),
		metadata({
			name: "editor.block-unit-cargo-loader.poly-stroke",
			description: "editor.block-unit-cargo-loader.poly-stroke-description",
		}),
	),
	polyRadius: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-unit-cargo-loader.poly-radius",
			description: "editor.block-unit-cargo-loader.poly-radius-description",
		}),
	),
	polySides: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-unit-cargo-loader.poly-sides",
			description: "editor.block-unit-cargo-loader.poly-sides-description",
		}),
	),
	polyRotateSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-unit-cargo-loader.poly-rotate-speed",
			description: "editor.block-unit-cargo-loader.poly-rotate-speed-description",
		}),
	),
});

const repairTurretObjectSchema = v.object({
	baseTexture: TextureFieldSchema("@-base"),
	repairRadius: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.block-repair-turret.repair-radius",
			description: "editor.block-repair-turret.repair-radius-description",
		}),
	),
	repairSpeed: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "editor.block-repair-turret.repair-speed",
			description: "editor.block-repair-turret.repair-speed-description",
		}),
	),
	powerUse: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.block-repair-turret.power-use",
			description: "editor.block-repair-turret.power-use-description",
		}),
	),
	length: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-repair-turret.length",
			description: "editor.block-repair-turret.length-description",
		}),
	),
	beamWidth: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-repair-turret.beam-width",
			description: "editor.block-repair-turret.beam-width-description",
		}),
	),
	pulseRadius: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-repair-turret.pulse-radius",
			description: "editor.block-repair-turret.pulse-radius-description",
		}),
	),
	pulseStroke: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-repair-turret.pulse-stroke",
			description: "editor.block-repair-turret.pulse-stroke-description",
		}),
	),
	acceptCoolant: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-repair-turret.accept-coolant",
			description: "editor.block-repair-turret.accept-coolant-description",
		}),
	),
	coolantUse: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.block-repair-turret.coolant-use",
			description: "editor.block-repair-turret.coolant-use-description",
		}),
	),
	coolantMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-repair-turret.coolant-multiplier",
			description: "editor.block-repair-turret.coolant-multiplier-description",
		}),
	),
});

const repairTowerObjectSchema = v.object({
	glowTexture: TextureFieldSchema("@-glow"),
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-repair-tower.range",
			description: "editor.block-repair-tower.range-description",
		}),
	),
	circleSpeed: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-repair-tower.circle-speed",
			description: "editor.block-repair-tower.circle-speed-description",
		}),
	),
	circleStroke: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-repair-tower.circle-stroke",
			description: "editor.block-repair-tower.circle-stroke-description",
		}),
	),
	squareRad: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-repair-tower.square-rad",
			description: "editor.block-repair-tower.square-rad-description",
		}),
	),
	squareSpinScl: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "editor.block-repair-tower.square-spin-scl",
			description: "editor.block-repair-tower.square-spin-scl-description",
		}),
	),
	glowMag: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.block-repair-tower.glow-mag",
			description: "editor.block-repair-tower.glow-mag-description",
		}),
	),
	glowScl: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-repair-tower.glow-scl",
			description: "editor.block-repair-tower.glow-scl-description",
		}),
	),
	healAmount: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-repair-tower.heal-amount",
			description: "editor.block-repair-tower.heal-amount-description",
		}),
	),
});

const droneCenterObjectSchema = v.object({
	unitsSpawned: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-drone-center.units-spawned",
			description: "editor.block-drone-center.units-spawned-description",
		}),
	),
	droneConstructTime: v.pipe(
		v.optional(v.number(), 180),
		metadata({
			name: "editor.block-drone-center.drone-construct-time",
			description: "editor.block-drone-center.drone-construct-time-description",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-drone-center.status-duration",
			description: "editor.block-drone-center.status-duration-description",
		}),
	),
	droneRange: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.block-drone-center.drone-range",
			description: "editor.block-drone-center.drone-range-description",
		}),
	),
});

// Logic variant schemas
const logicBlockObjectSchema = v.object({
	maxInstructionScale: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-logic-block.max-instruction-scale",
			description: "editor.block-logic-block.max-instruction-scale-description",
		}),
	),
	instructionsPerTick: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-logic-block.instructions-per-tick",
			description: "editor.block-logic-block.instructions-per-tick-description",
		}),
	),
	maxInstructionsPerTick: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.block-logic-block.max-instructions-per-tick",
			description: "editor.block-logic-block.max-instructions-per-tick-description",
		}),
	),
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-logic-block.range",
			description: "editor.block-logic-block.range-description",
		}),
	),
});

const logicDisplayObjectSchema = v.object({
	maxSides: v.pipe(
		v.optional(v.number(), 25),
		metadata({
			name: "editor.block-logic-display.max-sides",
			description: "editor.block-logic-display.max-sides-description",
		}),
	),
	displaySize: v.pipe(
		v.optional(v.number(), 64),
		metadata({
			name: "editor.block-logic-display.display-size",
			description: "editor.block-logic-display.display-size-description",
		}),
	),
	scaleFactor: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-logic-display.scale-factor",
			description: "editor.block-logic-display.scale-factor-description",
		}),
	),
});

const tileableLogicDisplayObjectSchema = v.object({
	...logicDisplayObjectSchema.entries,
	backTexture: TextureFieldSchema("@-back"),
	displayTextures: ArrayTextureSchema("@-#", 47),
	maxDisplayDimensions: v.pipe(
		v.optional(v.number(), 16),
		metadata({
			name: "editor.block-tileable-logic-display.max-display-dimensions",
			description: "editor.block-tileable-logic-display.max-display-dimensions-description",
		}),
	),
	frameSize: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-tileable-logic-display.frame-size",
			description: "editor.block-tileable-logic-display.frame-size-description",
		}),
	),
});

const messageBlockObjectSchema = v.object({
	maxTextLength: v.pipe(
		v.optional(v.number(), 400),
		metadata({
			name: "editor.block-message-block.max-text-length",
			description: "editor.block-message-block.max-text-length-description",
		}),
	),
	maxNewlines: v.pipe(
		v.optional(v.number(), 24),
		metadata({
			name: "editor.block-message-block.max-newlines",
			description: "editor.block-message-block.max-newlines-description",
		}),
	),
});

const memoryBlockObjectSchema = v.object({
	memoryCapacity: v.pipe(
		v.optional(v.number(), 32),
		metadata({
			name: "editor.block-memory-block.memory-capacity",
			description: "editor.block-memory-block.memory-capacity-description",
		}),
	),
});

const canvasBlockObjectSchema = v.object({
	sideTexture1: TextureFieldSchema("@-side1"),
	sideTexture2: TextureFieldSchema("@-side2"),
	cornerTexture1: TextureFieldSchema("@-corner1"),
	cornerTexture2: TextureFieldSchema("@-corner2"),
	padding: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-canvas-block.padding",
			description: "editor.block-canvas-block.padding-description",
		}),
	),
	canvasSize: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-canvas-block.canvas-size",
			description: "editor.block-canvas-block.canvas-size-description",
		}),
	),
	palette: v.pipe(
		v.optional(v.array(v.number())),
		metadata({
			name: "editor.block-canvas-block.palette",
			description: "editor.block-canvas-block.palette-description",
		}),
	),
	bitsPerPixel: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.block-canvas-block.bits-per-pixel",
			description: "editor.block-canvas-block.bits-per-pixel-description",
		}),
	),
});

// Heat variant schemas
const heatConductorObjectSchema = v.object({
	visualMaxHeat: v.pipe(
		v.optional(v.number(), 15),
		metadata({
			name: "editor.block-heat-conductor.visual-max-heat",
			description: "editor.block-heat-conductor.visual-max-heat-description",
		}),
	),
	splitHeat: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-heat-conductor.split-heat",
			description: "editor.block-heat-conductor.split-heat-description",
		}),
	),
});

// Environment variant schemas
const floorObjectSchema = v.object({
	edge: v.pipe(
		v.optional(v.string(), "stone"),
		metadata({
			name: "editor.block-floor.edge",
			description: "editor.block-floor.edge-description",
		}),
	),
	speedMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-floor.speed-multiplier",
			description: "editor.block-floor.speed-multiplier-description",
		}),
	),
	dragMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-floor.drag-multiplier",
			description: "editor.block-floor.drag-multiplier-description",
		}),
	),
	damageTaken: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-floor.damage-taken",
			description: "editor.block-floor.damage-taken-description",
		}),
	),
	drownTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-floor.drown-time",
			description: "editor.block-floor.drown-time-description",
		}),
	),
	walkSoundVolume: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.block-floor.walk-sound-volume",
			description: "editor.block-floor.walk-sound-volume-description",
		}),
	),
	walkSoundPitchMin: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "editor.block-floor.walk-sound-pitch-min",
			description: "editor.block-floor.walk-sound-pitch-min-description",
		}),
	),
	walkSoundPitchMax: v.pipe(
		v.optional(v.number(), 1.2),
		metadata({
			name: "editor.block-floor.walk-sound-pitch-max",
			description: "editor.block-floor.walk-sound-pitch-max-description",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 60),
		metadata({
			name: "editor.block-floor.status-duration",
			description: "editor.block-floor.status-duration-description",
		}),
	),
	isLiquid: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.is-liquid",
			description: "editor.block-floor.is-liquid-description",
		}),
	),
	overlayAlpha: v.pipe(
		v.optional(v.number(), 0.65),
		metadata({
			name: "editor.block-floor.overlay-alpha",
			description: "editor.block-floor.overlay-alpha-description",
		}),
	),
	supportsOverlay: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.supports-overlay",
			description: "editor.block-floor.supports-overlay-description",
		}),
	),
	shallow: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.shallow",
			description: "editor.block-floor.shallow-description",
		}),
	),
	oreDefault: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.ore-default",
			description: "editor.block-floor.ore-default-description",
		}),
	),
	oreScale: v.pipe(
		v.optional(v.number(), 24),
		metadata({
			name: "editor.block-floor.ore-scale",
			description: "editor.block-floor.ore-scale-description",
		}),
	),
	oreThreshold: v.pipe(
		v.optional(v.number(), 0.828),
		metadata({
			name: "editor.block-floor.ore-threshold",
			description: "editor.block-floor.ore-threshold-description",
		}),
	),
	canShadow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-floor.can-shadow",
			description: "editor.block-floor.can-shadow-description",
		}),
	),
	forceDrawLight: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.force-draw-light",
			description: "editor.block-floor.force-draw-light-description",
		}),
	),
	needsSurface: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-floor.needs-surface",
			description: "editor.block-floor.needs-surface-description",
		}),
	),
	allowCorePlacement: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.allow-core-placement",
			description: "editor.block-floor.allow-core-placement-description",
		}),
	),
	wallOre: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.wall-ore",
			description: "editor.block-floor.wall-ore-description",
		}),
	),
	blendId: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block-floor.blend-id",
			description: "editor.block-floor.blend-id-description",
		}),
	),
	tilingVariants: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-floor.tiling-variants",
			description: "editor.block-floor.tiling-variants-description",
		}),
	),
	autotile: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-floor.autotile",
			description: "editor.block-floor.autotile-description",
		}),
	),
	autotileMidVariants: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-floor.autotile-mid-variants",
			description: "editor.block-floor.autotile-mid-variants-description",
		}),
	),
	autotileVariants: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-floor.autotile-variants",
			description: "editor.block-floor.autotile-variants-description",
		}),
	),
	drawEdgeIn: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-floor.draw-edge-in",
			description: "editor.block-floor.draw-edge-in-description",
		}),
	),
	drawEdgeOut: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-floor.draw-edge-out",
			description: "editor.block-floor.draw-edge-out-description",
		}),
	),
});

const coloredFloorObjectSchema = v.object({
	...floorObjectSchema.entries,
});

const treeBlockObjectSchema = v.object({
	shadowTexture: TextureFieldSchema("@-shadow"),
	shadowOffset: v.pipe(
		v.optional(v.number(), -4),
		metadata({
			name: "editor.block-tree-block.shadow-offset",
			description: "editor.block-tree-block.shadow-offset-description",
		}),
	),
});

const tallBlockObjectSchema = v.object({
	shadowOffset: v.pipe(
		v.optional(v.number(), -3),
		metadata({
			name: "editor.block-tall-block.shadow-offset",
			description: "editor.block-tall-block.shadow-offset-description",
		}),
	),
	layer: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.block-tall-block.layer",
			description: "editor.block-tall-block.layer-description",
		}),
	),
	shadowLayer: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.block-tall-block.shadow-layer",
			description: "editor.block-tall-block.shadow-layer-description",
		}),
	),
	rotationRand: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.block-tall-block.rotation-rand",
			description: "editor.block-tall-block.rotation-rand-description",
		}),
	),
	shadowAlpha: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.block-tall-block.shadow-alpha",
			description: "editor.block-tall-block.shadow-alpha-description",
		}),
	),
});

const cliffObjectSchema = v.object({
	cliffmaskTexture: ArrayTextureSchema("cliffmask#", 128),
	size: v.pipe(
		v.optional(v.number(), 11),
		metadata({
			name: "editor.block-cliff.size",
			description: "editor.block-cliff.size-description",
		}),
	),
});

// Campaign variant schemas
const launchPadObjectSchema = v.object({
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

const landingPadObjectSchema = v.object({
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

const acceleratorObjectSchema = v.object({
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

// Sandbox variant schemas
const itemSourceObjectSchema = v.object({
	itemsPerSecond: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-item-source.items-per-second",
			description: "editor.block-item-source.items-per-second-description",
		}),
	),
});

const overlayFloorObjectSchema = v.object({
	...floorObjectSchema.entries,
	color: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.block-overlay-floor.color",
			description: "editor.block-overlay-floor.color-description",
			category: "editor.block-overlay-floor.category.visual",
		}),
	),
});

const classSchemaMap = new ClassMap<BlockType>({
	// Power
	Block: () => v.object({}),
	PowerBlock: () => powerBlockObjectSchema,
	PowerDistributor: () => powerDistributorObjectSchema,
	PowerGenerator: () => powerGeneratorObjectSchema,
	ConsumeGenerator: () => consumeGeneratorObjectSchema,
	HeaterGenerator: () => heaterGeneratorObjectSchema,
	SolarGenerator: () => v.object({}),
	ThermalGenerator: () => thermalGeneratorObjectSchema,
	NuclearReactor: () => nuclearReactorObjectSchema,
	ImpactReactor: () => impactReactorObjectSchema,
	VariableReactor: () => variableReactorObjectSchema,
	Battery: () =>
		v.object({
			...powerDistributorObjectSchema.entries,
		}),
	PowerNode: () => powerNodeObjectSchema,
	LongPowerNode: () => longPowerNodeObjectSchema,
	BeamNode: () => beamNodeObjectSchema,
	PowerDiode: () =>
		v.object({
			arrowTexture: TextureFieldSchema("@-arrow"),
		}),
	LightBlock: () => lightBlockObjectSchema,
	PowerVoid: () => v.object({ ...powerBlockObjectSchema.entries }),
	PowerSource: () => powerSourceObjectSchema,
	// Storage
	StorageBlock: () => storageBlockObjectSchema,
	CoreBlock: () => coreBlockObjectSchema,
	Unloader: () => unloaderObjectSchema,
	// Liquid
	LiquidBlock: () => liquidBlockObjectSchema,
	LiquidRouter: () => liquidRouterObjectSchema,
	LiquidJunction: () => v.object({}),
	Conduit: () => conduitObjectSchema,
	ArmoredConduit: () =>
		v.object({
			...conduitObjectSchema.entries,
		}),
	LiquidBridge: () =>
		v.object({
			...itemBridgeObjectSchema.entries,
		}),
	Pump: () => pumpObjectSchema,
	SolidPump: () => solidPumpObjectSchema,
	Fracker: () => frackerObjectSchema,
	// Production
	GenericCrafter: () => genericCrafterObjectSchema,
	HeatCrafter: () => heatCrafterObjectSchema,
	AttributeCrafter: () => attributeCrafterObjectSchema,
	Separator: () => separatorObjectSchema,
	Drill: () => drillObjectSchema,
	BurstDrill: () => burstDrillObjectSchema,
	BeamDrill: () => beamDrillObjectSchema,
	WallCrafter: () => wallCrafterObjectSchema,
	ItemIncinerator: () => itemIncineratorObjectSchema,
	Incinerator: () => v.object({}),
	HeatProducer: () => heatProducerObjectSchema,
	// Defense
	Wall: () => wallObjectSchema,
	Thruster: () =>
		v.object({
			topTexture: TextureFieldSchema("@-top"),
			...wallObjectSchema.entries,
		}),
	ShieldWall: () => shieldWallObjectSchema,
	Door: () => doorObjectSchema,
	AutoDoor: () => autoDoorObjectSchema,
	ShockwaveTower: () => shockwaveTowerObjectSchema,
	ShockMine: () => shockMineObjectSchema,
	RegenProjector: () => regenProjectorObjectSchema,
	Radar: () => radarObjectSchema,
	OverdriveProjector: () => overdriveProjectorObjectSchema,
	MendProjector: () => mendProjectorObjectSchema,
	ForceProjector: () => forceProjectorObjectSchema,
	DirectionalForceProjector: () => directionalForceProjectorObjectSchema,
	BaseShield: () => baseShieldObjectSchema,
	ConstructBlock: () => v.object({}),
	// Turrets
	BaseTurret: () => baseTurretObjectSchema,
	ReloadTurret: () => reloadTurretObjectSchema,
	Turret: (context) => turretObjectSchema(context),
	PowerTurret: (context) => powerTurretObjectSchema(context),
	LaserTurret: (context) => laserTurretObjectSchema(context),
	ItemTurret: (context) =>
		v.object({ ammoTypes: v.record(ItemFieldSchema(context), BulletHjsonSchema(context)), ...turretObjectSchema(context).entries }),
	LiquidTurret: (context) =>
		v.object({
			ammoTypes: v.record(LiquidFieldSchema(context), BulletHjsonSchema(context)),
			extinguish: v.optional(v.boolean(), true),
			...turretObjectSchema(context).entries,
		}),
	ContinuousTurret: (context) => continuousTurretObjectSchema(context),
	ContinuousLiquidTurret: (context) => continuousLiquidTurretObjectSchema(context),
	PayloadAmmoTurret: (context) =>
		v.object({
			ammoTypes: v.record(ContentFieldSchema(context), BulletHjsonSchema(context)),
			...turretObjectSchema(context).entries,
		}),
	PointDefenseTurret: () => pointDefenseTurretObjectSchema,
	TractorBeamTurret: () => tractorBeamTurretObjectSchema,
	BuildTurret: () => buildTurretObjectSchema,
	// Distribution
	Conveyor: () => conveyorObjectSchema,
	ArmoredConveyor: () =>
		v.object({
			...conveyorObjectSchema.entries,
		}),
	StackConveyor: () => stackConveyorObjectSchema,
	Router: () => routerObjectSchema,
	Junction: () => junctionObjectSchema,
	Sorter: () => sorterObjectSchema,
	OverflowGate: () => overflowGateObjectSchema,
	ItemBridge: () => itemBridgeObjectSchema,
	BufferedItemBridge: () => bufferedItemBridgeObjectSchema,
	DirectionBridge: () => directionBridgeObjectSchema,
	DirectionLiquidBridge: () => directionLiquidBridgeObjectSchema,
	DuctBridge: () => ductBridgeObjectSchema,
	Duct: () => ductObjectSchema,
	DuctRouter: () => ductRouterObjectSchema,
	StackRouter: () => stackRouterObjectSchema,
	DuctJunction: () => ductJunctionObjectSchema,
	OverflowDuct: () => overflowDuctObjectSchema,
	MassDriver: () => massDriverObjectSchema,
	DirectionalUnloader: () => directionalUnloaderObjectSchema,
	// Payload
	PayloadBlock: () => payloadBlockObjectSchema,
	PayloadConveyor: () => payloadConveyorObjectSchema,
	PayloadRouter: () => payloadRouterObjectSchema,
	PayloadVoid: () => payloadVoidObjectSchema,
	PayloadSource: () =>
		v.object({
			...payloadBlockObjectSchema.entries,
		}),
	PayloadMassDriver: () => payloadMassDriverObjectSchema,
	PayloadLoader: () => payloadLoaderObjectSchema,
	PayloadUnloader: () => payloadUnloaderObjectSchema,
	PayloadDeconstructor: () => payloadDeconstructorObjectSchema,
	BlockProducer: () => blockProducerObjectSchema,
	Constructor: () => constructorObjectSchema,
	SingleBlockProducer: () => singleBlockProducerObjectSchema,
	// Unit
	UnitBlock: () => unitBlockObjectSchema,
	UnitFactory: () => unitFactoryObjectSchema,
	Reconstructor: () => reconstructorObjectSchema,
	UnitAssemblerModule: () => unitAssemblerModuleObjectSchema,
	UnitAssembler: () => unitAssemblerObjectSchema,
	UnitCargoUnloadPoint: () => unitCargoUnloadPointObjectSchema,
	UnitCargoLoader: () => unitCargoLoaderObjectSchema,
	RepairTurret: () => repairTurretObjectSchema,
	RepairTower: () => repairTowerObjectSchema,
	DroneCenter: () => droneCenterObjectSchema,
	// Logic
	LogicBlock: () => logicBlockObjectSchema,
	LogicDisplay: () => logicDisplayObjectSchema,
	TileableLogicDisplay: () => tileableLogicDisplayObjectSchema,
	SwitchBlock: () =>
		v.object({
			onTexture: TextureFieldSchema("@-on"),
		}),
	MessageBlock: () => messageBlockObjectSchema,
	MemoryBlock: () => memoryBlockObjectSchema,
	CanvasBlock: () => canvasBlockObjectSchema,
	// Heat
	HeatConductor: () => heatConductorObjectSchema,
	// Environment
	Floor: () => floorObjectSchema,
	OverlayFloor: () => overlayFloorObjectSchema,
	OreBlock: () =>
		v.object({
			...overlayFloorObjectSchema.entries,
		}),
	ColoredFloor: () => coloredFloorObjectSchema,
	CharacterOverlay: () =>
		v.object({
			...overlayFloorObjectSchema.entries,
			color: v.pipe(
				MindustryHexColorSchema,
				metadata({
					name: "editor.block-character-overlay.color",
					description: "editor.block-character-overlay.color-description",
					category: "editor.block-character-overlay.category.visual",
				}),
			),
		}),
	EmptyFloor: () => v.object({}),
	AirBlock: () => v.object({ ...floorObjectSchema.entries }),
	Prop: () => v.object({}),
	SeaBush: () =>
		v.object({
			botTexture: TextureFieldSchema("@-bot"),
			centerTexture: TextureFieldSchema("@-center"),
			lobesMin: v.optional(v.number(), 7),
			botAngle: v.optional(v.number(), 60),
			origin: v.optional(v.number(), 0.1),
			sclMin: v.optional(v.number(), 30),
			sclMax: v.optional(v.number(), 50),
			magMin: v.optional(v.number(), 5),
			magMax: v.optional(v.number(), 15),
			timeRange: v.optional(v.number(), 40),
			spread: v.optional(v.number(), 0),
		}),
	Seaweed: () => v.object({}),
	StaticWall: () => staticWallObjectSchema,
	TiledWall: () =>
		v.object({
			...staticWallObjectSchema.entries,
			maxSize: v.optional(v.pipe(v.number(), v.integer()), 3),
		}),
	StaticTree: () =>
		v.object({
			...staticWallObjectSchema.entries,
		}),
	ColoredWall: () => coloredWallObjectSchema,
	TreeBlock: () => treeBlockObjectSchema,
	TallBlock: () => tallBlockObjectSchema,
	RemoveWall: () => v.object({}),
	Cliff: () => cliffObjectSchema,
	// Campaign
	LaunchPad: () => launchPadObjectSchema,
	LandingPad: () => landingPadObjectSchema,
	Accelerator: () => acceleratorObjectSchema,
	// Sandbox
	ItemSource: () => itemSourceObjectSchema,
	ItemVoid: () => v.object({}),
	LiquidSource: () =>
		v.object({
			crossTexture: TextureFieldSchema("@-cross"),
		}),
	LiquidVoid: () => v.object({}),
	ShallowLiquid: (context) =>
		v.object({
			...floorObjectSchema.entries,
			liquidBase: v.nullish(BlockFieldSchema(context)),
			floorBase: v.nullish(BlockFieldSchema(context)),
			liquidOpacity: v.optional(v.number(), 0.35),
		}),
	SteamVent: (context) =>
		v.object({
			...floorObjectSchema.entries,
			parent: v.nullish(BlockFieldSchema(context)),
			effect: v.nullish(EffectFieldSchema(context)),
			effectSpacing: v.optional(v.number(), 15),
			effectColor: v.optional(MindustryHexColorSchema),
		}),
	TiledFloor: () =>
		v.object({
			...floorObjectSchema.entries,
			maxSize: v.optional(v.pipe(v.number(), v.integer()), 3),
		}),
});

export const BlockFieldSchema: SchemaFn = CachedSchema((context) => {
	return v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.blocks.map((block) => block.name.replaceAll(context.name + "-", ""))),
	);
});

export const BlockHjsonSchema: SchemaFn = CachedSchema((context) => {
	return v.lazy((input) => {
		const variant = classSchemaMap.get(input, context);

		return v.pipe(
			v.object({
				...blockObjectSchema,
				...variant,
				consumes: v.optional(ConsumesHjsonSchema(context)),
				requirements: v.optional(v.array(ItemStackSchema(context)), []),
				researchCost: v.optional(v.array(ItemStackSchema(context))),
				researchCostMultipliers: v.optional(v.record(v.string(), v.number())),
				itemDrop: v.optional(ItemFieldSchema(context)),
				lightLiquid: v.optional(LiquidFieldSchema(context)),
				destroyBullet: v.optional(BulletHjsonSchema(context)),
				placeEffect: v.optional(EffectFieldSchema(context)),
				breakEffect: v.optional(EffectFieldSchema(context)),
				destroyEffect: v.optional(EffectFieldSchema(context)),
				research: v.optional(ResearchSchema(context)),
			}),
			metadata({ type: "block" }),
		);
	});
});
