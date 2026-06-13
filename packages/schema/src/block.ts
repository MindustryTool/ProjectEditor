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

export const BlockHjsonSchema = new ClassMap<BlockType>(
	{
		// Power
		Block: () => ({}),
		PowerBlock: () => powerBlockObjectSchema.entries,
		PowerDistributor: () => powerDistributorObjectSchema.entries,
		PowerGenerator: () => powerGeneratorObjectSchema.entries,
		ConsumeGenerator: () => consumeGeneratorObjectSchema.entries,
		HeaterGenerator: () => heaterGeneratorObjectSchema.entries,
		SolarGenerator: () => ({}),
		ThermalGenerator: () => thermalGeneratorObjectSchema.entries,
		NuclearReactor: () => nuclearReactorObjectSchema.entries,
		ImpactReactor: () => impactReactorObjectSchema.entries,
		VariableReactor: () => variableReactorObjectSchema.entries,
		Battery: () => ({
			...powerDistributorObjectSchema.entries,
		}),
		PowerNode: () => powerNodeObjectSchema.entries,
		LongPowerNode: () => longPowerNodeObjectSchema.entries,
		BeamNode: () => beamNodeObjectSchema.entries,
		PowerDiode: () => ({
			arrowTexture: TextureFieldSchema("@-arrow"),
		}),
		LightBlock: () => lightBlockObjectSchema.entries,
		PowerVoid: () => ({ ...powerBlockObjectSchema.entries }),
		PowerSource: () => powerSourceObjectSchema.entries,
		// Storage
		StorageBlock: () => storageBlockObjectSchema.entries,
		CoreBlock: (context) => coreBlockObjectSchema(context).entries,
		Unloader: () => unloaderObjectSchema.entries,
		// Liquid
		LiquidBlock: () => liquidBlockObjectSchema.entries,
		LiquidRouter: () => liquidRouterObjectSchema.entries,
		LiquidJunction: () => ({}),
		Conduit: () => conduitObjectSchema.entries,
		ArmoredConduit: () => ({
			...conduitObjectSchema.entries,
		}),
		LiquidBridge: () => ({
			...itemBridgeObjectSchema.entries,
		}),
		Pump: () => pumpObjectSchema.entries,
		SolidPump: () => solidPumpObjectSchema.entries,
		Fracker: () => frackerObjectSchema.entries,
		// Production
		GenericCrafter: (context) => genericCrafterObjectSchema(context).entries,
		HeatCrafter: (context) => heatCrafterObjectSchema(context).entries,
		AttributeCrafter: (context) => attributeCrafterObjectSchema(context).entries,
		Separator: (context) => separatorObjectSchema(context).entries,
		Drill: () => drillObjectSchema.entries,
		BurstDrill: () => burstDrillObjectSchema.entries,
		BeamDrill: () => beamDrillObjectSchema.entries,
		WallCrafter: () => wallCrafterObjectSchema.entries,
		ItemIncinerator: () => itemIncineratorObjectSchema.entries,
		Incinerator: () => ({}),
		HeatProducer: (context) => heatProducerObjectSchema(context).entries,
		// Defense
		Wall: () => wallObjectSchema.entries,
		Thruster: () => ({
			topTexture: TextureFieldSchema("@-top"),
			...wallObjectSchema.entries,
		}),
		ShieldWall: () => shieldWallObjectSchema.entries,
		Door: () => doorObjectSchema.entries,
		AutoDoor: () => autoDoorObjectSchema.entries,
		ShockwaveTower: () => shockwaveTowerObjectSchema.entries,
		ShockMine: () => shockMineObjectSchema.entries,
		RegenProjector: () => regenProjectorObjectSchema.entries,
		Radar: () => radarObjectSchema.entries,
		OverdriveProjector: () => overdriveProjectorObjectSchema.entries,
		MendProjector: () => mendProjectorObjectSchema.entries,
		ForceProjector: () => forceProjectorObjectSchema.entries,
		DirectionalForceProjector: () => directionalForceProjectorObjectSchema.entries,
		BaseShield: () => baseShieldObjectSchema.entries,
		ConstructBlock: () => ({}),
		// Turrets
		BaseTurret: () => baseTurretObjectSchema.entries,
		ReloadTurret: () => reloadTurretObjectSchema.entries,
		Turret: (context) => turretObjectSchema(context).entries,
		PowerTurret: (context) => powerTurretObjectSchema(context).entries,
		LaserTurret: (context) => laserTurretObjectSchema(context).entries,
		ItemTurret: (context) => ({
			ammoTypes: v.record(ItemFieldSchema(context), BulletHjsonSchema(context)),
			...turretObjectSchema(context).entries,
		}),
		LiquidTurret: (context) => ({
			ammoTypes: v.record(LiquidFieldSchema(context), BulletHjsonSchema(context)),
			extinguish: v.optional(v.boolean(), true),
			...turretObjectSchema(context).entries,
		}),
		ContinuousTurret: (context) => continuousTurretObjectSchema(context).entries,
		ContinuousLiquidTurret: (context) => continuousLiquidTurretObjectSchema(context).entries,
		PayloadAmmoTurret: (context) => ({
			ammoTypes: v.record(ContentFieldSchema(context), BulletHjsonSchema(context)),
			...turretObjectSchema(context).entries,
		}),
		PointDefenseTurret: () => pointDefenseTurretObjectSchema.entries,
		TractorBeamTurret: () => tractorBeamTurretObjectSchema.entries,
		BuildTurret: () => buildTurretObjectSchema.entries,
		// Distribution
		Conveyor: () => conveyorObjectSchema.entries,
		ArmoredConveyor: () => ({
			...conveyorObjectSchema.entries,
		}),
		StackConveyor: () => stackConveyorObjectSchema.entries,
		Router: () => routerObjectSchema.entries,
		Junction: () => junctionObjectSchema.entries,
		Sorter: () => sorterObjectSchema.entries,
		OverflowGate: () => overflowGateObjectSchema.entries,
		ItemBridge: () => itemBridgeObjectSchema.entries,
		BufferedItemBridge: () => bufferedItemBridgeObjectSchema.entries,
		DirectionBridge: () => directionBridgeObjectSchema.entries,
		DirectionLiquidBridge: () => directionLiquidBridgeObjectSchema.entries,
		DuctBridge: () => ductBridgeObjectSchema.entries,
		Duct: () => ductObjectSchema.entries,
		DuctRouter: () => ductRouterObjectSchema.entries,
		StackRouter: () => stackRouterObjectSchema.entries,
		DuctJunction: () => ductJunctionObjectSchema.entries,
		OverflowDuct: () => overflowDuctObjectSchema.entries,
		MassDriver: () => massDriverObjectSchema.entries,
		DirectionalUnloader: () => directionalUnloaderObjectSchema.entries,
		// Payload
		PayloadBlock: () => payloadBlockObjectSchema.entries,
		PayloadConveyor: () => payloadConveyorObjectSchema.entries,
		PayloadRouter: () => payloadRouterObjectSchema.entries,
		PayloadVoid: () => payloadVoidObjectSchema.entries,
		PayloadSource: () => ({
			...payloadBlockObjectSchema.entries,
		}),
		PayloadMassDriver: () => payloadMassDriverObjectSchema.entries,
		PayloadLoader: () => payloadLoaderObjectSchema.entries,
		PayloadUnloader: () => payloadUnloaderObjectSchema.entries,
		PayloadDeconstructor: () => payloadDeconstructorObjectSchema.entries,
		BlockProducer: () => blockProducerObjectSchema.entries,
		Constructor: () => constructorObjectSchema.entries,
		SingleBlockProducer: () => singleBlockProducerObjectSchema.entries,
		// Unit
		UnitBlock: () => unitBlockObjectSchema.entries,
		UnitFactory: (context) => unitFactoryObjectSchema(context).entries,
		Reconstructor: (context) => reconstructorObjectSchema(context).entries,
		UnitAssemblerModule: () => unitAssemblerModuleObjectSchema.entries,
		UnitAssembler: () => unitAssemblerObjectSchema.entries,
		UnitCargoUnloadPoint: () => unitCargoUnloadPointObjectSchema.entries,
		UnitCargoLoader: () => unitCargoLoaderObjectSchema.entries,
		RepairTurret: () => repairTurretObjectSchema.entries,
		RepairTower: () => repairTowerObjectSchema.entries,
		DroneCenter: () => droneCenterObjectSchema.entries,
		// Logic
		LogicBlock: () => logicBlockObjectSchema.entries,
		LogicDisplay: () => logicDisplayObjectSchema.entries,
		TileableLogicDisplay: () => tileableLogicDisplayObjectSchema.entries,
		SwitchBlock: () => ({
			onTexture: TextureFieldSchema("@-on"),
		}),
		MessageBlock: () => messageBlockObjectSchema.entries,
		MemoryBlock: () => memoryBlockObjectSchema.entries,
		CanvasBlock: () => canvasBlockObjectSchema.entries,
		// Heat
		HeatConductor: () => heatConductorObjectSchema.entries,
		// Environment
		Floor: () => floorObjectSchema.entries,
		OverlayFloor: () => overlayFloorObjectSchema.entries,
		OreBlock: () => ({
			...overlayFloorObjectSchema.entries,
		}),
		ColoredFloor: () => coloredFloorObjectSchema.entries,
		CharacterOverlay: () => ({
			...overlayFloorObjectSchema.entries,
			color: v.pipe(
				MindustryHexColorSchema,
				metadata({
					name: "editor.block-character-overlay.color",
					description: "editor.block-character-overlay.color-description",
				}),
			),
		}),
		EmptyFloor: () => ({}),
		AirBlock: () => ({ ...floorObjectSchema.entries }),
		Prop: () => ({}),
		SeaBush: () => ({
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
		Seaweed: () => ({}),
		StaticWall: () => staticWallObjectSchema.entries,
		TiledWall: () => ({
			...staticWallObjectSchema.entries,
			maxSize: v.optional(v.pipe(v.number(), v.integer()), 3),
		}),
		StaticTree: () => ({
			...staticWallObjectSchema.entries,
		}),
		ColoredWall: () => coloredWallObjectSchema.entries,
		TreeBlock: () => treeBlockObjectSchema.entries,
		TallBlock: () => tallBlockObjectSchema.entries,
		RemoveWall: () => ({}),
		Cliff: () => cliffObjectSchema.entries,
		// Campaign
		LaunchPad: () => launchPadObjectSchema.entries,
		LandingPad: () => landingPadObjectSchema.entries,
		Accelerator: () => acceleratorObjectSchema.entries,
		// Sandbox
		ItemSource: () => itemSourceObjectSchema.entries,
		ItemVoid: () => ({}),
		LiquidSource: () => ({
			crossTexture: TextureFieldSchema("@-cross"),
		}),
		LiquidVoid: () => ({}),
		ShallowLiquid: (context) => ({
			...floorObjectSchema.entries,
			liquidBase: v.nullish(BlockFieldSchema(context)),
			floorBase: v.nullish(BlockFieldSchema(context)),
			liquidOpacity: v.optional(v.number(), 0.35),
		}),
		SteamVent: (context) => ({
			...floorObjectSchema.entries,
			parent: v.nullish(BlockFieldSchema(context)),
			effect: v.nullish(EffectFieldSchema(context)),
			effectSpacing: v.optional(v.number(), 15),
			effectColor: v.optional(MindustryHexColorSchema),
		}),
		TiledFloor: () => ({
			...floorObjectSchema.entries,
			maxSize: v.optional(v.pipe(v.number(), v.integer()), 3),
		}),
	},
	{
		baseSchema: blockObjectSchema,
		extra: (context) => ({
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
				v.optional(SoundHjsonSchema),
				metadata({
					name: "editor.block.configure-sound",
					description: "editor.block.configure-sound-description",
					visibleWhen: { field: "configurable", value: true },
				}),
			),
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
		}),
	},
).schema;

export const BlockFieldSchema: SchemaFn = CachedSchema((context) => {
	return v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.blocks.map((block) => block.name.replaceAll(context.name + "-", ""))),
	);
});
