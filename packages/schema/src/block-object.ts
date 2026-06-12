import * as v from "valibot";
import { TextureFieldSchema } from "./texture";
import { metadata } from "./utils";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { AttributesSchema } from "./attributes";
import { CacheLayerSchema } from "./cache-layer";
import { BlockGroupSchema } from "./block-group";
import { BlockFlagSchema } from "./block-flag";
import { CategorySchema } from "./category";
import { BuildVisibilitySchema } from "./build-visibility";
import { TeamSchema } from "./team";
import { TargetPriority } from "./target-priority";
import { Envs, EnvSchema } from "./envs";
import { classSchema } from "./class";
import { unlockableContentSchema } from "./content";

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
	name: v.optional(v.string()),
	type: classSchema(blockTypes, "Block"),
    ...unlockableContentSchema,
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
	regionRotated1: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.block.region-rotated1" })),
	regionRotated2: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.block.region-rotated2" })),
};
