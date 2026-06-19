import * as v from "valibot";
import { Envs, EnvSchema } from "./envs";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { ResearchSchema } from "./research";
import { SoundHjsonSchema } from "./sound";
import type { SchemaFn } from "./utils";
import { AbilityFieldSchema } from "./ability";
import { WeaponHjsonSchema } from "./weapon";
import { StatusStringSchema } from "./status";
import { EffectFieldSchema } from "./effect";
import { PartHjsonSchema } from "./part";
import { EngineHjsonSchema } from "./engine";

import { cached, metadata } from "./utils";
import { classSchema } from "./class";
import { unlockableContentSchema } from "./content";
import { TextureFieldSchema } from "./texture";
import { ArrayTextureSchema } from "./textures";
import { blockFlags } from "./block-flag";
import { aiControllers } from "./ai-controller";
import { unitCommands } from "./unit-command";
import { unitStances } from "./unit-stance";
import { ItemStackSchema } from "./item-stack";
import { rectSchema } from "./rect";
import { Order } from "./order";

const unitTypes = ["flying", "mech", "legs", "naval", "payload", "missile", "tank", "hover", "tether", "crawl"] as const;
const unitTemplates = ["ErekirUnitType", "MissileUnitType", "NeoplasmUnitType", "TankUnitType", "UnitType"] as const;

const unitObjectSchema = {
	...unlockableContentSchema,
	type: v.pipe(v.optional(v.picklist(unitTypes)), metadata({ order: Order.TYPE })),
	template: classSchema(unitTemplates, "UnitType"),
	texture: TextureFieldSchema("@"),
	envRequired: v.pipe(
		v.optional(EnvSchema, 0),
		metadata({
			name: "editor.unit.env-required",
			description: "editor.unit.env-required-description",
		}),
	),
	envEnabled: v.pipe(
		v.optional(EnvSchema, Envs.terrestrial),
		metadata({
			name: "editor.unit.env-enabled",
			description: "editor.unit.env-enabled-description",
		}),
	),
	envDisabled: v.pipe(
		v.optional(EnvSchema, Envs.scorching),
		metadata({
			name: "editor.unit.env-disabled",
			description: "editor.unit.env-disabled-description",
		}),
	),
	speed: v.pipe(
		v.optional(v.number(), 1.1),
		metadata({
			name: "editor.unit.speed",
			description: "editor.unit.speed-description",
		}),
	),
	boostMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.boost-multiplier",
			description: "editor.unit.boost-multiplier-description",
		}),
	),
	floorMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.floor-multiplier",
			description: "editor.unit.floor-multiplier-description",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.rotate-speed",
			description: "editor.unit.rotate-speed-description",
		}),
	),
	baseRotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.base-rotate-speed",
			description: "editor.unit.base-rotate-speed-description",
		}),
	),
	drag: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "editor.unit.drag",
			description: "editor.unit.drag-description",
		}),
	),
	accel: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.accel",
			description: "editor.unit.accel-description",
		}),
	),
	hitSize: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.unit.hit-size",
			description: "editor.unit.hit-size-description",
		}),
	),
	deathShake: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.death-shake",
			description: "editor.unit.death-shake-description",
		}),
	),
	stepShake: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.step-shake",
			description: "editor.unit.step-shake-description",
		}),
	),
	rippleScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.ripple-scale",
			description: "editor.unit.ripple-scale-description",
		}),
	),
	riseSpeed: v.pipe(
		v.optional(v.number(), 0.08),
		metadata({
			name: "editor.unit.rise-speed",
			description: "editor.unit.rise-speed-description",
		}),
	),
	descentSpeed: v.pipe(
		v.optional(v.number(), 0.08),
		metadata({
			name: "editor.unit.descent-speed",
			description: "editor.unit.descent-speed-description",
		}),
	),
	fallSpeed: v.pipe(
		v.optional(v.number(), 0.018),
		metadata({
			name: "editor.unit.fall-speed",
			description: "editor.unit.fall-speed-description",
		}),
	),
	missileAccelTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.missile-accel-time",
			description: "editor.unit.missile-accel-time-description",
			visibleWhen: { field: "type", value: "missile" },
		}),
	),
	health: v.pipe(
		v.optional(v.number(), 200),
		metadata({
			name: "editor.unit.health",
			description: "editor.unit.health-description",
		}),
	),
	armor: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.armor",
			description: "editor.unit.armor-description",
		}),
	),
	range: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.range",
			description: "editor.unit.range-description",
		}),
	),
	maxRange: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.max-range",
			description: "editor.unit.max-range-description",
		}),
	),
	mineRange: v.pipe(
		v.optional(v.number(), 70),
		metadata({
			name: "editor.unit.mine-range",
			description: "editor.unit.mine-range-description",
		}),
	),
	buildRange: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.unit.build-range",
			description: "editor.unit.build-range-description",
		}),
	),
	circleTargetRadius: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.unit.circle-target-radius",
			description: "editor.unit.circle-target-radius-description",
			visibleWhen: { field: "circleTarget", value: true },
		}),
	),
	crashDamageMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.crash-damage-multiplier",
			description: "editor.unit.crash-damage-multiplier-description",
			visibleWhen: { field: "flying", value: true },
		}),
	),
	wreckHealthMultiplier: v.pipe(
		v.optional(v.number(), 0.25),
		metadata({
			name: "editor.unit.wreck-health-multiplier",
			description: "editor.unit.wreck-health-multiplier-description",
			visibleWhen: { field: "flying", value: true },
		}),
	),
	dpsEstimate: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.dps-estimate",
			description: "editor.unit.dps-estimate-description",
		}),
	),
	clipSize: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.clip-size",
			description: "editor.unit.clip-size-description",
		}),
	),
	drownTimeMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.drown-time-multiplier",
			description: "editor.unit.drown-time-multiplier-description",
			visibleWhen: { field: "canDrown", value: true },
		}),
	),
	strafePenalty: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.strafe-penalty",
			description: "editor.unit.strafe-penalty-description",
		}),
	),
	researchCostMultiplier: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.unit.research-cost-multiplier",
			description: "editor.unit.research-cost-multiplier-description",
		}),
	),

	groundLayer: v.pipe(
		v.optional(v.number(), 60),
		metadata({
			name: "editor.unit.ground-layer",
			description: "editor.unit.ground-layer-description",
			visibleWhen: { field: "flying", value: false },
		}),
	),
	flyingLayer: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.flying-layer",
			description: "editor.unit.flying-layer-description",
			visibleWhen: { field: "flying", value: true },
		}),
	),
	payloadCapacity: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.unit.payload-capacity",
			description: "editor.unit.payload-capacity-description",
		}),
	),
	buildSpeed: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.build-speed",
			description: "editor.unit.build-speed-description",
		}),
	),
	aimDst: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.aim-dst",
			description: "editor.unit.aim-dst-description",
		}),
	),
	buildBeamOffset: v.pipe(
		v.optional(v.number(), 3.8),
		metadata({
			name: "editor.unit.build-beam-offset",
			description: "editor.unit.build-beam-offset-description",
		}),
	),
	mineBeamOffset: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.unit.mine-beam-offset",
			description: "editor.unit.mine-beam-offset-description",
		}),
	),
	targetPriority: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.target-priority",
			description: "editor.unit.target-priority-description",
		}),
	),
	shadowElevation: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.shadow-elevation",
			description: "editor.unit.shadow-elevation-description",
			visibleWhen: { field: "flying", value: false },
		}),
	),
	shadowElevationScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.shadow-elevation-scl",
			description: "editor.unit.shadow-elevation-scl-description",
		}),
	),
	engineOffset: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.engine-offset",
			description: "editor.unit.engine-offset-description",
		}),
	),
	engineSize: v.pipe(
		v.optional(v.number(), 2.5),
		metadata({
			name: "editor.unit.engine-size",
			description: "editor.unit.engine-size-description",
		}),
	),
	engineLayer: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.engine-layer",
			description: "editor.unit.engine-layer-description",
		}),
	),
	itemOffsetY: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.unit.item-offset-y",
			description: "editor.unit.item-offset-y-description",
		}),
	),
	lightRadius: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.light-radius",
			description: "editor.unit.light-radius-description",
		}),
	),
	lightOpacity: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.unit.light-opacity",
			description: "editor.unit.light-opacity-description",
		}),
	),
	softShadowScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.soft-shadow-scl",
			description: "editor.unit.soft-shadow-scl-description",
		}),
	),
	fogRadius: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.fog-radius",
			description: "editor.unit.fog-radius-description",
		}),
	),

	waveTrailX: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.unit.wave-trail-x",
			description: "editor.unit.wave-trail-x-description",
			visibleWhen: { field: "naval", value: true },
		}),
	),
	waveTrailY: v.pipe(
		v.optional(v.number(), -3),
		metadata({
			name: "editor.unit.wave-trail-y",
			description: "editor.unit.wave-trail-y-description",
			visibleWhen: { field: "naval", value: true },
		}),
	),
	trailScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.trail-scl",
			description: "editor.unit.trail-scl-description",
		}),
	),

	isEnemy: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.is-enemy",
			description: "editor.unit.is-enemy-description",
		}),
	),
	flying: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.flying",
			description: "editor.unit.flying-description",
		}),
	),
	wobble: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.wobble",
			description: "editor.unit.wobble-description",
			visibleWhen: { field: "flying", value: true },
		}),
	),
	targetAir: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.target-air",
			description: "editor.unit.target-air-description",
		}),
	),
	targetGround: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.target-ground",
			description: "editor.unit.target-ground-description",
		}),
	),
	faceTarget: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.face-target",
			description: "editor.unit.face-target-description",
		}),
	),
	circleTarget: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.circle-target",
			description: "editor.unit.circle-target-description",
		}),
	),
	autoDropBombs: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.auto-drop-bombs",
			description: "editor.unit.auto-drop-bombs-description",
		}),
	),
	targetBuildingsMobile: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.target-buildings-mobile",
			description: "editor.unit.target-buildings-mobile-description",
		}),
	),
	canBoost: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.can-boost",
			description: "editor.unit.can-boost-description",
		}),
	),
	boostWhenBuilding: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.boost-when-building",
			description: "editor.unit.boost-when-building-description",
		}),
	),
	boostWhenMining: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.boost-when-mining",
			description: "editor.unit.boost-when-mining-description",
		}),
	),
	logicControllable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.logic-controllable",
			description: "editor.unit.logic-controllable-description",
		}),
	),
	playerControllable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.player-controllable",
			description: "editor.unit.player-controllable-description",
		}),
	),
	controlSelectGlobal: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.control-select-global",
			description: "editor.unit.control-select-global-description",
		}),
	),
	allowedInPayloads: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.allowed-in-payloads",
			description: "editor.unit.allowed-in-payloads-description",
		}),
	),
	hittable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.hittable",
			description: "editor.unit.hittable-description",
		}),
	),
	killable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.killable",
			description: "editor.unit.killable-description",
		}),
	),
	targetable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.targetable",
			description: "editor.unit.targetable-description",
		}),
	),
	vulnerableWithPayloads: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.vulnerable-with-payloads",
			description: "editor.unit.vulnerable-with-payloads-description",
		}),
	),
	pickupUnits: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.pickup-units",
			description: "editor.unit.pickup-units-description",
		}),
	),
	physics: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.physics",
			description: "editor.unit.physics-description",
		}),
	),
	canDrown: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.can-drown",
			description: "editor.unit.can-drown-description",
			visibleWhen: { field: "flying", value: false },
		}),
	),
	useUnitCap: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.use-unit-cap",
			description: "editor.unit.use-unit-cap-description",
		}),
	),
	coreUnitDock: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.core-unit-dock",
			description: "editor.unit.core-unit-dock-description",
		}),
	),
	createWreck: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.create-wreck",
			description: "editor.unit.create-wreck-description",
		}),
	),
	createScorch: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.create-scorch",
			description: "editor.unit.create-scorch-description",
		}),
	),
	lowAltitude: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.low-altitude",
			description: "editor.unit.low-altitude-description",
		}),
	),
	rotateToBuilding: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.rotate-to-building",
			description: "editor.unit.rotate-to-building-description",
		}),
	),
	allowLegStep: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.allow-leg-step",
			description: "editor.unit.allow-leg-step-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legPhysicsLayer: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.leg-physics-layer",
			description: "editor.unit.leg-physics-layer-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	hovering: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.hovering",
			description: "editor.unit.hovering-description",
		}),
	),
	omniMovement: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.omni-movement",
			description: "editor.unit.omni-movement-description",
		}),
	),
	rotateMoveFirst: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.rotate-move-first",
			description: "editor.unit.rotate-move-first-description",
		}),
	),
	healFlash: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.heal-flash",
			description: "editor.unit.heal-flash-description",
		}),
	),
	canHeal: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.can-heal",
			description: "editor.unit.can-heal-description",
		}),
	),
	singleTarget: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.single-target",
			description: "editor.unit.single-target-description",
		}),
	),
	forceMultiTarget: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.force-multi-target",
			description: "editor.unit.force-multi-target-description",
		}),
	),
	canAttack: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.can-attack",
			description: "editor.unit.can-attack-description",
		}),
	),
	hidden: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.hidden",
			description: "editor.unit.hidden-description",
		}),
	),
	internal: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.internal",
			description: "editor.unit.internal-description",
		}),
	),
	internalGenerateSprites: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.internal-generate-sprites",
			description: "editor.unit.internal-generate-sprites-description",
			visibleWhen: { field: "internal", value: true },
		}),
	),
	bounded: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.bounded",
			description: "editor.unit.bounded-description",
		}),
	),
	naval: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.unit.naval", description: "editor.unit.naval-description" })),
	autoFindTarget: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.auto-find-target",
			description: "editor.unit.auto-find-target-description",
		}),
	),
	targetUnderBlocks: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.target-under-blocks",
			description: "editor.unit.target-under-blocks-description",
		}),
	),
	alwaysShootWhenMoving: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.always-shoot-when-moving",
			description: "editor.unit.always-shoot-when-moving-description",
		}),
	),

	hoverable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.hoverable",
			description: "editor.unit.hoverable-description",
		}),
	),
	alwaysCreateOutline: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.always-create-outline",
			description: "editor.unit.always-create-outline-description",
		}),
	),
	generateFullIcon: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.generate-full-icon",
			description: "editor.unit.generate-full-icon-description",
		}),
	),
	squareShape: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.square-shape",
			description: "editor.unit.square-shape-description",
		}),
	),
	drawBuildBeam: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-build-beam",
			description: "editor.unit.draw-build-beam-description",
		}),
	),
	drawMineBeam: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-mine-beam",
			description: "editor.unit.draw-mine-beam-description",
		}),
	),
	drawCell: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-cell",
			description: "editor.unit.draw-cell-description",
		}),
	),
	drawItems: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-items",
			description: "editor.unit.draw-items-description",
		}),
	),
	drawShields: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-shields",
			description: "editor.unit.draw-shields-description",
		}),
	),
	drawBody: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-body",
			description: "editor.unit.draw-body-description",
		}),
	),
	drawSoftShadow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-soft-shadow",
			description: "editor.unit.draw-soft-shadow-description",
		}),
	),
	drawMinimap: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-minimap",
			description: "editor.unit.draw-minimap-description",
		}),
	),

	deathSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.death-sound-volume",
			description: "editor.unit.death-sound-volume-description",
		}),
	),
	wreckSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.wreck-sound-volume",
			description: "editor.unit.wreck-sound-volume-description",
			visibleWhen: { field: "createWreck", value: true },
		}),
	),
	loopSoundVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.loop-sound-volume",
			description: "editor.unit.loop-sound-volume-description",
		}),
	),
	stepSoundVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.step-sound-volume",
			description: "editor.unit.step-sound-volume-description",
		}),
	),
	stepSoundPitch: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.step-sound-pitch",
			description: "editor.unit.step-sound-pitch-description",
		}),
	),
	stepSoundPitchRange: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.unit.step-sound-pitch-range",
			description: "editor.unit.step-sound-pitch-range-description",
		}),
	),
	moveSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.move-sound-volume",
			description: "editor.unit.move-sound-volume-description",
		}),
	),
	moveSoundPitchMin: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.move-sound-pitch-min",
			description: "editor.unit.move-sound-pitch-min-description",
		}),
	),
	moveSoundPitchMax: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.move-sound-pitch-max",
			description: "editor.unit.move-sound-pitch-max-description",
		}),
	),
	tankMoveVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.tank-move-volume",
			description: "editor.unit.tank-move-volume-description",
		}),
	),

	useEngineElevation: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.use-engine-elevation",
			description: "editor.unit.use-engine-elevation-description",
		}),
	),

	trailLength: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.trail-length",
			description: "editor.unit.trail-length-description",
		}),
	),

	flowfieldPathType: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.flowfield-path-type",
			description: "editor.unit.flowfield-path-type-description",
		}),
	),
	pathCostId: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.unit.path-cost-id",
			description: "editor.unit.path-cost-id-description",
		}),
	),

	allowChangeCommands: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.allow-change-commands",
			description: "editor.unit.allow-change-commands-description",
		}),
	),

	outlineRadius: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.unit.outline-radius",
			description: "editor.unit.outline-radius-description",
			visibleWhen: { field: "outlines", value: true },
		}),
	),
	outlines: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.outlines",
			description: "editor.unit.outlines-description",
		}),
	),

	itemCapacity: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.item-capacity",
			description: "editor.unit.item-capacity-description",
		}),
	),
	ammoCapacity: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.ammo-capacity",
			description: "editor.unit.ammo-capacity-description",
		}),
	),

	mineTier: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.mine-tier",
			description: "editor.unit.mine-tier-description",
		}),
	),
	mineSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.mine-speed",
			description: "editor.unit.mine-speed-description",
		}),
	),
	mineWalls: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.mine-walls",
			description: "editor.unit.mine-walls-description",
		}),
	),
	mineFloor: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.mine-floor",
			description: "editor.unit.mine-floor-description",
		}),
	),
	mineHardnessScaling: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.mine-hardness-scaling",
			description: "editor.unit.mine-hardness-scaling-description",
		}),
	),
	mineSoundVolume: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.unit.mine-sound-volume",
			description: "editor.unit.mine-sound-volume-description",
		}),
	),

	legCount: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.unit.leg-count",
			description: "editor.unit.leg-count-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legGroupSize: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.unit.leg-group-size",
			description: "editor.unit.leg-group-size-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),

	legLength: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.unit.leg-length",
			description: "editor.unit.leg-length-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legSpeed: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.unit.leg-speed",
			description: "editor.unit.leg-speed-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legForwardScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.leg-forward-scl",
			description: "editor.unit.leg-forward-scl-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legBaseOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-base-offset",
			description: "editor.unit.leg-base-offset-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legMoveSpace: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.leg-move-space",
			description: "editor.unit.leg-move-space-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legExtension: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-extension",
			description: "editor.unit.leg-extension-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legPairOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-pair-offset",
			description: "editor.unit.leg-pair-offset-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legLengthScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.leg-length-scl",
			description: "editor.unit.leg-length-scl-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legStraightLength: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.leg-straight-length",
			description: "editor.unit.leg-straight-length-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legMaxLength: v.pipe(
		v.optional(v.number(), 1.75),
		metadata({
			name: "editor.unit.leg-max-length",
			description: "editor.unit.leg-max-length-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legMinLength: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-min-length",
			description: "editor.unit.leg-min-length-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legSplashDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-splash-damage",
			description: "editor.unit.leg-splash-damage-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legSplashRange: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.leg-splash-range",
			description: "editor.unit.leg-splash-range-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	baseLegStraightness: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.base-leg-straightness",
			description: "editor.unit.base-leg-straightness-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legStraightness: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-straightness",
			description: "editor.unit.leg-straightness-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),

	legBaseUnder: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.leg-base-under",
			description: "editor.unit.leg-base-under-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	lockLegBase: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.lock-leg-base",
			description: "editor.unit.lock-leg-base-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	legContinuousMove: v.pipe(
		v.optional(v.boolean()),
		metadata({
			name: "editor.unit.leg-continuous-move",
			description: "editor.unit.leg-continuous-move-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	flipBackLegs: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.flip-back-legs",
			description: "editor.unit.flip-back-legs-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	flipLegSide: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.flip-leg-side",
			description: "editor.unit.flip-leg-side-description",
			visibleWhen: { field: "type", value: "legs" },
		}),
	),
	emitWalkSound: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.emit-walk-sound",
			description: "editor.unit.emit-walk-sound-description",
		}),
	),
	emitWalkEffect: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.emit-walk-effect",
			description: "editor.unit.emit-walk-effect-description",
		}),
	),

	mechLandShake: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.mech-land-shake",
			description: "editor.unit.mech-land-shake-description",
			visibleWhen: { field: "type", value: "mech" },
		}),
	),
	mechSideSway: v.pipe(
		v.optional(v.number(), 0.54),
		metadata({
			name: "editor.unit.mech-side-sway",
			description: "editor.unit.mech-side-sway-description",
			visibleWhen: { field: "type", value: "mech" },
		}),
	),
	mechFrontSway: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.unit.mech-front-sway",
			description: "editor.unit.mech-front-sway-description",
			visibleWhen: { field: "type", value: "mech" },
		}),
	),
	mechStride: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.mech-stride",
			description: "editor.unit.mech-stride-description",
			visibleWhen: { field: "type", value: "mech" },
		}),
	),
	mechStepParticles: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.mech-step-particles",
			description: "editor.unit.mech-step-particles-description",
			visibleWhen: { field: "type", value: "mech" },
		}),
	),

	treadFrames: v.pipe(
		v.optional(v.number(), 18),
		metadata({
			name: "editor.unit.tread-frames",
			description: "editor.unit.tread-frames-description",
			visibleWhen: { field: "type", value: "tank" },
		}),
	),
	treadPullOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.tread-pull-offset",
			description: "editor.unit.tread-pull-offset-description",
			visibleWhen: { field: "type", value: "tank" },
		}),
	),
	crushFragile: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.crush-fragile",
			description: "editor.unit.crush-fragile-description",
			visibleWhen: { field: "type", value: "tank" },
		}),
	),

	segments: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.segments",
			description: "editor.unit.segments-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	segmentUnits: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.segment-units",
			description: "editor.unit.segment-units-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	segmentLayerOrder: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.segment-layer-order",
			description: "editor.unit.segment-layer-order-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),

	segmentMag: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.unit.segment-mag",
			description: "editor.unit.segment-mag-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	segmentScl: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.unit.segment-scl",
			description: "editor.unit.segment-scl-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	segmentPhase: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.segment-phase",
			description: "editor.unit.segment-phase-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	segmentRotSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.segment-rot-speed",
			description: "editor.unit.segment-rot-speed-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	segmentMaxRot: v.pipe(
		v.optional(v.number(), 30),
		metadata({
			name: "editor.unit.segment-max-rot",
			description: "editor.unit.segment-max-rot-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	segmentSpacing: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.segment-spacing",
			description: "editor.unit.segment-spacing-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	segmentRotationRange: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.unit.segment-rotation-range",
			description: "editor.unit.segment-rotation-range-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	crawlSlowdown: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.crawl-slowdown",
			description: "editor.unit.crawl-slowdown-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	crushDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.crush-damage",
			description: "editor.unit.crush-damage-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),
	crawlSlowdownFrac: v.pipe(
		v.optional(v.number(), 0.55),
		metadata({
			name: "editor.unit.crawl-slowdown-frac",
			description: "editor.unit.crawl-slowdown-frac-description",
			visibleWhen: { field: "type", value: "crawl" },
		}),
	),

	lifetime: v.pipe(
		v.optional(v.number(), 60 * 5),
		metadata({
			name: "editor.unit.lifetime",
			description: "editor.unit.lifetime-description",
			visibleWhen: { field: "type", value: "missile" },
		}),
	),
	homingDelay: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.unit.homing-delay",
			description: "editor.unit.homing-delay-description",
			visibleWhen: { field: "type", value: "missile" },
		}),
	),

	healColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.heal-color",
			description: "editor.unit.heal-color-description",
			visibleWhen: { field: "healFlash", value: true },
		}),
	),
	lightColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.light-color",
			description: "editor.unit.light-color-description",
		}),
	),
	shieldColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.shield-color",
			description: "editor.unit.shield-color-description",
		}),
	),
	engineColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.engine-color",
			description: "editor.unit.engine-color-description",
		}),
	),
	engineColorInner: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.engine-color-inner",
			description: "editor.unit.engine-color-inner-description",
		}),
	),
	trailColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.trail-color",
			description: "editor.unit.trail-color-description",
		}),
	),
	outlineColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.outline-color",
			description: "editor.unit.outline-color-description",
			visibleWhen: { field: "outlines", value: true },
		}),
	),
	mechLegColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.mech-leg-color",
			description: "editor.unit.mech-leg-color-description",
			visibleWhen: { field: "type", value: "mech" },
		}),
	),

	aiController: v.pipe(
		v.optional(v.picklist(aiControllers)),
		metadata({
			name: "editor.unit.ai-controller",
			description: "editor.unit.ai-controller-description",
		}),
	),
	controller: v.pipe(
		v.optional(v.picklist(aiControllers)),
		metadata({
			name: "editor.unit.controller",
			description: "editor.unit.controller-description",
		}),
	),
	targetFlags: v.pipe(
		v.optional(v.array(v.picklist(blockFlags))),
		metadata({
			name: "editor.unit.target-flags",
			description: "editor.unit.target-flags-description",
		}),
	),
	commands: v.pipe(
		v.optional(v.array(v.picklist(unitCommands))),
		metadata({
			name: "editor.unit.commands",
			description: "editor.unit.commands-description",
		}),
	),
	defaultCommand: v.pipe(
		v.optional(v.picklist(unitCommands)),
		metadata({
			name: "editor.unit.default-command",
			description: "editor.unit.default-command-description",
		}),
	),
	stances: v.pipe(
		v.optional(v.array(v.picklist(unitStances))),
		metadata({
			name: "editor.unit.stances",
			description: "editor.unit.stances-description",
		}),
	),
	treadRects: v.pipe(
		v.optional(v.array(rectSchema)),
		metadata({
			name: "editor.unit.tread-rects",
			description: "editor.unit.tread-rects-description",
			visibleWhen: { field: "type", value: "tank" },
		}),
	),
};

export const UnitHjsonSchema: SchemaFn = cached((context) =>
	v.object({
		...unitObjectSchema,
		baseRegion: TextureFieldSchema("@-base"),
		legRegion: v.pipe(TextureFieldSchema("@-leg"), metadata({ visibleWhen: { field: "type", value: "legs" } })),
		previewRegion: TextureFieldSchema("@-preview"),
		cellRegion: TextureFieldSchema("@-cell"),
		jointRegion: v.pipe(TextureFieldSchema("@-joint"), metadata({ visibleWhen: { field: "type", value: "legs" } })),
		footRegion: TextureFieldSchema("@-foot"),
		legBaseRegion: v.pipe(TextureFieldSchema("@-leg-base", "@-leg"), metadata({ visibleWhen: { field: "type", value: "legs" } })),
		baseJointRegion: v.pipe(TextureFieldSchema("@-joint-base"), metadata({ visibleWhen: { field: "type", value: "legs" } })),
		outlineRegion: TextureFieldSchema("@-outline"),
		treadRegion: v.pipe(TextureFieldSchema("@-treads"), metadata({ visibleWhen: { field: "type", value: "tank" } })),
		wreckRegions: ArrayTextureSchema("@-wreck#", 3),
		segmentRegions: v.pipe(ArrayTextureSchema("@-segment#", 20), metadata({ visibleWhen: { field: "type", value: "crawl" } })),
		segmentCellRegions: v.pipe(ArrayTextureSchema("@-segment-cell#", 20), metadata({ visibleWhen: { field: "type", value: "crawl" } })),
		segmentOutlineRegions: v.pipe(
			ArrayTextureSchema("@-segment-outline#", 20),
			metadata({ visibleWhen: { field: "type", value: "crawl" } }),
		),
		abilities: v.pipe(
			v.optional(v.array(AbilityFieldSchema(context)), []),
			metadata({
				name: "editor.unit.abilities",
				description: "editor.unit.abilities-description",
			}),
		),
		weapons: v.pipe(
			v.optional(v.array(WeaponHjsonSchema(context)), []),
			metadata({
				name: "editor.unit.weapons",
				description: "editor.unit.weapons-description",
			}),
		),
		immunities: v.pipe(
			v.optional(v.array(StatusStringSchema(context)), []),
			metadata({
				name: "editor.unit.immunities",
				description: "editor.unit.immunities-description",
			}),
		),
		fallEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.unit.fall-effect",
				description: "editor.unit.fall-effect-description",
				visibleWhen: { field: "flying", value: true },
			}),
		),
		fallEngineEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.unit.fall-engine-effect",
				description: "editor.unit.fall-engine-effect-description",
				visibleWhen: { field: "flying", value: true },
			}),
		),
		deathExplosionEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.unit.death-explosion-effect",
				description: "editor.unit.death-explosion-effect-description",
			}),
		),
		treadEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.unit.tread-effect",
				description: "editor.unit.tread-effect-description",
			}),
		),
		mineItems: v.pipe(
			v.optional(v.array(ItemStackSchema(context))),
			metadata({
				name: "editor.unit.mine-items",
				description: "editor.unit.mine-items-description",
			}),
		),
		parts: v.pipe(
			v.optional(v.array(PartHjsonSchema(context)), []),
			metadata({
				name: "editor.unit.parts",
				description: "editor.unit.parts-description",
			}),
		),
		engines: v.pipe(
			v.optional(v.array(EngineHjsonSchema(context)), []),
			metadata({
				name: "editor.unit.engines",
				description: "editor.unit.engines-description",
			}),
		),
		deathSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.unit.death-sound",
				description: "editor.unit.death-sound-description",
			}),
		),
		wreckSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.unit.wreck-sound",
				description: "editor.unit.wreck-sound-description",
				visibleWhen: { field: "createWreck", value: true },
			}),
		),
		loopSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.unit.loop-sound",
				description: "editor.unit.loop-sound-description",
			}),
		),
		stepSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.unit.step-sound",
				description: "editor.unit.step-sound-description",
			}),
		),
		tankMoveSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.unit.tank-move-sound",
				description: "editor.unit.tank-move-sound-description",
			}),
		),
		moveSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.unit.move-sound",
				description: "editor.unit.move-sound-description",
			}),
		),
		mineSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.unit.mine-sound",
				description: "editor.unit.mine-sound-description",
			}),
		),
		research: v.optional(ResearchSchema(context)),
		segmentUnit: v.pipe(
			v.optional(UnitFieldSchema(context)),
			metadata({
				name: "editor.unit.segment-unit",
				description: "editor.unit.segment-unit-description",
				visibleWhen: { field: "type", value: "crawl" },
			}),
		),
		segmentEndUnit: v.pipe(
			v.optional(UnitFieldSchema(context)),
			metadata({
				name: "editor.unit.segment-end-unit",
				description: "editor.unit.segment-end-unit-description",
				visibleWhen: { field: "type", value: "crawl" },
			}),
		),
	}),
);

export const UnitFieldSchema: SchemaFn = (context) =>
	v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.units.map((unit) => unit.name.replaceAll(context.name + "-", ""))),
	);
