import * as v from "valibot";
import type { SchemaFn } from "./utils";
import { CachedSchema, metadata } from "./utils";
import { TextureFieldSchema } from "./texture";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { EffectFieldSchema } from "./effect";
import { ItemFieldSchema } from "./item";
import { LiquidFieldSchema } from "./liquid";
import { BulletHjsonSchema } from "./bullet";
import { ContentFieldSchema } from "./content";
import { ConsumesHjsonSchema } from "./consumes";
import { ResearchSchema } from "./research";
import { SoundHjsonSchema } from "./sound";

import { ClassMap } from "./class";
import { ItemStackSchema } from "./item-stack";

import { blockTypes, blockObjectSchema } from "./block-object";
export { blockTypes };
export type BlockType = (typeof blockTypes)[number];

import {
	powerBlockObjectSchema,
	powerDistributorObjectSchema,
	powerGeneratorObjectSchema,
	consumeGeneratorObjectSchema,
	heaterGeneratorObjectSchema,
	thermalGeneratorObjectSchema,
	nuclearReactorObjectSchema,
	impactReactorObjectSchema,
	variableReactorObjectSchema,
	lightBlockObjectSchema,
	powerNodeObjectSchema,
	longPowerNodeObjectSchema,
	beamNodeObjectSchema,
	powerSourceObjectSchema,
} from "./block-power";

import { storageBlockObjectSchema, coreBlockObjectSchema, unloaderObjectSchema } from "./block-storage";

import {
	liquidBlockObjectSchema,
	liquidRouterObjectSchema,
	conduitObjectSchema,
	pumpObjectSchema,
	solidPumpObjectSchema,
	frackerObjectSchema,
} from "./block-liquid";

import {
	genericCrafterObjectSchema,
	heatCrafterObjectSchema,
	attributeCrafterObjectSchema,
	separatorObjectSchema,
	drillObjectSchema,
	burstDrillObjectSchema,
	beamDrillObjectSchema,
	wallCrafterObjectSchema,
	itemIncineratorObjectSchema,
	heatProducerObjectSchema,
} from "./block-production";

import {
	wallObjectSchema,
	staticWallObjectSchema,
	coloredWallObjectSchema,
	shieldWallObjectSchema,
	doorObjectSchema,
	autoDoorObjectSchema,
	shockwaveTowerObjectSchema,
	shockMineObjectSchema,
	regenProjectorObjectSchema,
	radarObjectSchema,
	overdriveProjectorObjectSchema,
	mendProjectorObjectSchema,
	forceProjectorObjectSchema,
	directionalForceProjectorObjectSchema,
	baseShieldObjectSchema,
} from "./block-defense";

import {
	baseTurretObjectSchema,
	reloadTurretObjectSchema,
	turretObjectSchema,
	powerTurretObjectSchema,
	laserTurretObjectSchema,
	continuousTurretObjectSchema,
	continuousLiquidTurretObjectSchema,
	pointDefenseTurretObjectSchema,
	tractorBeamTurretObjectSchema,
	buildTurretObjectSchema,
} from "./block-turret";

import {
	conveyorObjectSchema,
	stackConveyorObjectSchema,
	routerObjectSchema,
	junctionObjectSchema,
	sorterObjectSchema,
	overflowGateObjectSchema,
	itemBridgeObjectSchema,
	bufferedItemBridgeObjectSchema,
	directionBridgeObjectSchema,
	directionLiquidBridgeObjectSchema,
	ductObjectSchema,
	ductRouterObjectSchema,
	stackRouterObjectSchema,
	ductJunctionObjectSchema,
	overflowDuctObjectSchema,
	ductBridgeObjectSchema,
	massDriverObjectSchema,
	directionalUnloaderObjectSchema,
} from "./block-distribution";

import {
	payloadBlockObjectSchema,
	payloadConveyorObjectSchema,
	payloadRouterObjectSchema,
	payloadVoidObjectSchema,
	payloadMassDriverObjectSchema,
	payloadLoaderObjectSchema,
	payloadUnloaderObjectSchema,
	payloadDeconstructorObjectSchema,
	blockProducerObjectSchema,
	unitBlockObjectSchema,
	constructorObjectSchema,
	singleBlockProducerObjectSchema,
} from "./block-payload";

import {
	unitFactoryObjectSchema,
	reconstructorObjectSchema,
	unitAssemblerModuleObjectSchema,
	unitAssemblerObjectSchema,
	unitCargoUnloadPointObjectSchema,
	unitCargoLoaderObjectSchema,
	repairTurretObjectSchema,
	repairTowerObjectSchema,
	droneCenterObjectSchema,
} from "./block-unit";

import {
	logicBlockObjectSchema,
	logicDisplayObjectSchema,
	tileableLogicDisplayObjectSchema,
	messageBlockObjectSchema,
	memoryBlockObjectSchema,
	canvasBlockObjectSchema,
} from "./block-logic";

import { heatConductorObjectSchema } from "./block-heat";

import {
	floorObjectSchema,
	coloredFloorObjectSchema,
	treeBlockObjectSchema,
	tallBlockObjectSchema,
	cliffObjectSchema,
} from "./block-environment";

import { launchPadObjectSchema, landingPadObjectSchema, acceleratorObjectSchema } from "./block-campaign";

import { itemSourceObjectSchema, overlayFloorObjectSchema } from "./block-sandbox";

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
	GenericCrafter: (context) => genericCrafterObjectSchema(context),
	HeatCrafter: (context) => heatCrafterObjectSchema(context),
	AttributeCrafter: (context) => attributeCrafterObjectSchema(context),
	Separator: (context) => separatorObjectSchema(context),
	Drill: () => drillObjectSchema,
	BurstDrill: () => burstDrillObjectSchema,
	BeamDrill: () => beamDrillObjectSchema,
	WallCrafter: () => wallCrafterObjectSchema,
	ItemIncinerator: () => itemIncineratorObjectSchema,
	Incinerator: () => v.object({}),
	HeatProducer: (context) => heatProducerObjectSchema(context),
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
	UnitFactory: (context) => unitFactoryObjectSchema(context),
	Reconstructor: (context) => reconstructorObjectSchema(context),
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
				configureSound: v.pipe(
					v.optional(SoundHjsonSchema(context)),
					metadata({
						name: "editor.block.configure-sound",
						description: "editor.block.configure-sound-description",
						visibleWhen: { field: "configurable", value: true },
					}),
				),
				placeSound: v.pipe(
					v.optional(SoundHjsonSchema(context)),
					metadata({
						name: "editor.block.place-sound",
						description: "editor.block.place-sound-description",
					}),
				),
				breakSound: v.pipe(
					v.optional(SoundHjsonSchema(context)),
					metadata({
						name: "editor.block.break-sound",
						description: "editor.block.break-sound-description",
					}),
				),
				destroySound: v.pipe(
					v.optional(SoundHjsonSchema(context)),
					metadata({
						name: "editor.block.destroy-sound",
						description: "editor.block.destroy-sound-description",
					}),
				),
				ambientSound: v.pipe(
					v.optional(SoundHjsonSchema(context)),
					metadata({
						name: "editor.block.ambient-sound",
						description: "editor.block.ambient-sound-description",
					}),
				),
			}),
			metadata({ type: "block" }),
		);
	});
});
