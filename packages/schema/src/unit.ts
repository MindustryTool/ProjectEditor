import * as v from "valibot";
import { Envs, EnvSchema } from "./envs";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { ResearchSchema } from "./research";
import { SoundHjsonSchema } from "./sound";
import type { SchemaFn } from "./utils";
import { AbilityFieldSchema } from "./ability";
import { WeaponHjsonSchema } from "./weapon";
import { StatusStringSchema } from "./status";
import { EffectHjsonSchema } from "./effect";
import { PartHjsonSchema } from "./part";
import { EngineHjsonSchema } from "./engine";

import { metadata } from "./utils";
import { classSchema } from "./class";
const unitTypes = ["flying", "mech", "legs", "naval", "payload", "missile", "tank", "hover", "tether", "crawl"] as const;
const unitTemplates = ["ErekirUnitType", "MissileUnitType", "NeoplasmUnitType", "TankUnitType", "UnitType"] as const;

const unitObjectSchema = {
	type: v.optional(v.picklist(unitTypes)),
	template: classSchema(unitTemplates, "UnitType"),
	envRequired: v.pipe(
		v.optional(EnvSchema, 0),
		metadata({
			name: "editor.unit.env-required",
			description: "editor.unit.env-required-description",
			category: "editor.unit.category.environment",
		}),
	),
	envEnabled: v.pipe(
		v.optional(EnvSchema, Envs.terrestrial),
		metadata({
			name: "editor.unit.env-enabled",
			description: "editor.unit.env-enabled-description",
			category: "editor.unit.category.environment",
		}),
	),
	envDisabled: v.pipe(
		v.optional(EnvSchema, Envs.scorching),
		metadata({
			name: "editor.unit.env-disabled",
			description: "editor.unit.env-disabled-description",
			category: "editor.unit.category.environment",
		}),
	),
	speed: v.pipe(
		v.optional(v.number(), 1.1),
		metadata({
			name: "editor.unit.speed",
			description: "editor.unit.speed-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	boostMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.boost-multiplier",
			description: "editor.unit.boost-multiplier-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	floorMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.floor-multiplier",
			description: "editor.unit.floor-multiplier-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.rotate-speed",
			description: "editor.unit.rotate-speed-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	baseRotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.base-rotate-speed",
			description: "editor.unit.base-rotate-speed-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	drag: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "editor.unit.drag",
			description: "editor.unit.drag-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	accel: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.accel",
			description: "editor.unit.accel-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	hitSize: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.unit.hit-size",
			description: "editor.unit.hit-size-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	deathShake: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.death-shake",
			description: "editor.unit.death-shake-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	stepShake: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.step-shake",
			description: "editor.unit.step-shake-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	rippleScale: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.ripple-scale",
			description: "editor.unit.ripple-scale-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	riseSpeed: v.pipe(
		v.optional(v.number(), 0.08),
		metadata({
			name: "editor.unit.rise-speed",
			description: "editor.unit.rise-speed-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	descentSpeed: v.pipe(
		v.optional(v.number(), 0.08),
		metadata({
			name: "editor.unit.descent-speed",
			description: "editor.unit.descent-speed-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	fallSpeed: v.pipe(
		v.optional(v.number(), 0.018),
		metadata({
			name: "editor.unit.fall-speed",
			description: "editor.unit.fall-speed-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	missileAccelTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.missile-accel-time",
			description: "editor.unit.missile-accel-time-description",
			category: "editor.unit.category.missile-units",
		}),
	),
	health: v.pipe(
		v.optional(v.number(), 200),
		metadata({
			name: "editor.unit.health",
			description: "editor.unit.health-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	armor: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.armor",
			description: "editor.unit.armor-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	range: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.range",
			description: "editor.unit.range-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	maxRange: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.max-range",
			description: "editor.unit.max-range-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	mineRange: v.pipe(
		v.optional(v.number(), 70),
		metadata({
			name: "editor.unit.mine-range",
			description: "editor.unit.mine-range-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	buildRange: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.unit.build-range",
			description: "editor.unit.build-range-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	circleTargetRadius: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.unit.circle-target-radius",
			description: "editor.unit.circle-target-radius-description",
			category: "editor.unit.category.combat-targeting",
			visibleWhen: { field: "circleTarget", value: true },
		}),
	),
	crashDamageMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.crash-damage-multiplier",
			description: "editor.unit.crash-damage-multiplier-description",
			category: "editor.unit.category.combat-targeting",
			visibleWhen: { field: "flying", value: true },
		}),
	),
	wreckHealthMultiplier: v.pipe(
		v.optional(v.number(), 0.25),
		metadata({
			name: "editor.unit.wreck-health-multiplier",
			description: "editor.unit.wreck-health-multiplier-description",
			category: "editor.unit.category.stats-attributes",
			visibleWhen: { field: "flying", value: true },
		}),
	),
	dpsEstimate: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.dps-estimate",
			description: "editor.unit.dps-estimate-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	clipSize: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.clip-size",
			description: "editor.unit.clip-size-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	drownTimeMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.drown-time-multiplier",
			description: "editor.unit.drown-time-multiplier-description",
			category: "editor.unit.category.movement-physics",
			visibleWhen: { field: "canDrown", value: true },
		}),
	),
	strafePenalty: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.strafe-penalty",
			description: "editor.unit.strafe-penalty-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	researchCostMultiplier: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.unit.research-cost-multiplier",
			description: "editor.unit.research-cost-multiplier-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),

	groundLayer: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.unit.ground-layer",
			description: "editor.unit.ground-layer-description",
			category: "editor.unit.category.visuals-effects",
			visibleWhen: { field: "flying", value: false },
		}),
	),
	flyingLayer: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.flying-layer",
			description: "editor.unit.flying-layer-description",
			category: "editor.unit.category.visuals-effects",
			visibleWhen: { field: "flying", value: true },
		}),
	),
	payloadCapacity: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.unit.payload-capacity",
			description: "editor.unit.payload-capacity-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	buildSpeed: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.build-speed",
			description: "editor.unit.build-speed-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	aimDst: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.aim-dst",
			description: "editor.unit.aim-dst-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	buildBeamOffset: v.pipe(
		v.optional(v.number(), 3.8),
		metadata({
			name: "editor.unit.build-beam-offset",
			description: "editor.unit.build-beam-offset-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	mineBeamOffset: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.unit.mine-beam-offset",
			description: "editor.unit.mine-beam-offset-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	targetPriority: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.target-priority",
			description: "editor.unit.target-priority-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	shadowElevation: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.shadow-elevation",
			description: "editor.unit.shadow-elevation-description",
			category: "editor.unit.category.visuals-effects",
			visibleWhen: { field: "flying", value: false },
		}),
	),
	shadowElevationScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.shadow-elevation-scl",
			description: "editor.unit.shadow-elevation-scl-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	engineOffset: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.engine-offset",
			description: "editor.unit.engine-offset-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	engineSize: v.pipe(
		v.optional(v.number(), 2.5),
		metadata({
			name: "editor.unit.engine-size",
			description: "editor.unit.engine-size-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	engineLayer: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.engine-layer",
			description: "editor.unit.engine-layer-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	itemOffsetY: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.unit.item-offset-y",
			description: "editor.unit.item-offset-y-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	lightRadius: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.light-radius",
			description: "editor.unit.light-radius-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	lightOpacity: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.unit.light-opacity",
			description: "editor.unit.light-opacity-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	softShadowScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.soft-shadow-scl",
			description: "editor.unit.soft-shadow-scl-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	fogRadius: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.fog-radius",
			description: "editor.unit.fog-radius-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),

	waveTrailX: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.unit.wave-trail-x",
			description: "editor.unit.wave-trail-x-description",
			category: "editor.unit.category.naval-units",
			visibleWhen: { field: "naval", value: true },
		}),
	),
	waveTrailY: v.pipe(
		v.optional(v.number(), -3),
		metadata({
			name: "editor.unit.wave-trail-y",
			description: "editor.unit.wave-trail-y-description",
			category: "editor.unit.category.naval-units",
			visibleWhen: { field: "naval", value: true },
		}),
	),
	trailScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.trail-scl",
			description: "editor.unit.trail-scl-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),

	isEnemy: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.is-enemy",
			description: "editor.unit.is-enemy-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	flying: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.flying",
			description: "editor.unit.flying-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	wobble: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.wobble",
			description: "editor.unit.wobble-description",
			category: "editor.unit.category.visuals-effects",
			visibleWhen: { field: "flying", value: true },
		}),
	),
	targetAir: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.target-air",
			description: "editor.unit.target-air-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	targetGround: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.target-ground",
			description: "editor.unit.target-ground-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	faceTarget: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.face-target",
			description: "editor.unit.face-target-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	circleTarget: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.circle-target",
			description: "editor.unit.circle-target-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	autoDropBombs: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.auto-drop-bombs",
			description: "editor.unit.auto-drop-bombs-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	targetBuildingsMobile: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.target-buildings-mobile",
			description: "editor.unit.target-buildings-mobile-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	canBoost: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.can-boost",
			description: "editor.unit.can-boost-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	boostWhenBuilding: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.boost-when-building",
			description: "editor.unit.boost-when-building-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	boostWhenMining: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.boost-when-mining",
			description: "editor.unit.boost-when-mining-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	logicControllable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.logic-controllable",
			description: "editor.unit.logic-controllable-description",
			category: "editor.unit.category.system-control",
		}),
	),
	playerControllable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.player-controllable",
			description: "editor.unit.player-controllable-description",
			category: "editor.unit.category.system-control",
		}),
	),
	controlSelectGlobal: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.control-select-global",
			description: "editor.unit.control-select-global-description",
			category: "editor.unit.category.system-control",
		}),
	),
	allowedInPayloads: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.allowed-in-payloads",
			description: "editor.unit.allowed-in-payloads-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	hittable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.hittable",
			description: "editor.unit.hittable-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	killable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.killable",
			description: "editor.unit.killable-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	targetable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.targetable",
			description: "editor.unit.targetable-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	vulnerableWithPayloads: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.vulnerable-with-payloads",
			description: "editor.unit.vulnerable-with-payloads-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	pickupUnits: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.pickup-units",
			description: "editor.unit.pickup-units-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	physics: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.physics",
			description: "editor.unit.physics-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	canDrown: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.can-drown",
			description: "editor.unit.can-drown-description",
			category: "editor.unit.category.movement-physics",
			visibleWhen: { field: "flying", value: false },
		}),
	),
	useUnitCap: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.use-unit-cap",
			description: "editor.unit.use-unit-cap-description",
			category: "editor.unit.category.system-control",
		}),
	),
	coreUnitDock: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.core-unit-dock",
			description: "editor.unit.core-unit-dock-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	createWreck: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.create-wreck",
			description: "editor.unit.create-wreck-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	createScorch: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.create-scorch",
			description: "editor.unit.create-scorch-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	lowAltitude: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.low-altitude",
			description: "editor.unit.low-altitude-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	rotateToBuilding: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.rotate-to-building",
			description: "editor.unit.rotate-to-building-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	allowLegStep: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.allow-leg-step",
			description: "editor.unit.allow-leg-step-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legPhysicsLayer: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.leg-physics-layer",
			description: "editor.unit.leg-physics-layer-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	hovering: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.hovering",
			description: "editor.unit.hovering-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	omniMovement: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.omni-movement",
			description: "editor.unit.omni-movement-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	rotateMoveFirst: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.rotate-move-first",
			description: "editor.unit.rotate-move-first-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	healFlash: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.heal-flash",
			description: "editor.unit.heal-flash-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	canHeal: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.can-heal",
			description: "editor.unit.can-heal-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	singleTarget: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.single-target",
			description: "editor.unit.single-target-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	forceMultiTarget: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.force-multi-target",
			description: "editor.unit.force-multi-target-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	canAttack: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.can-attack",
			description: "editor.unit.can-attack-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	hidden: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.hidden",
			description: "editor.unit.hidden-description",
			category: "editor.unit.category.system-control",
		}),
	),
	internal: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.internal",
			description: "editor.unit.internal-description",
			category: "editor.unit.category.system-control",
		}),
	),
	internalGenerateSprites: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.internal-generate-sprites",
			description: "editor.unit.internal-generate-sprites-description",
			category: "editor.unit.category.system-control",
			visibleWhen: { field: "internal", value: true },
		}),
	),
	bounded: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.bounded",
			description: "editor.unit.bounded-description",
			category: "editor.unit.category.movement-physics",
		}),
	),
	naval: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.unit.naval", description: "editor.unit.naval-description", category: "editor.unit.category.naval-units" }),
	),
	autoFindTarget: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.auto-find-target",
			description: "editor.unit.auto-find-target-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	targetUnderBlocks: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.target-under-blocks",
			description: "editor.unit.target-under-blocks-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	alwaysShootWhenMoving: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.always-shoot-when-moving",
			description: "editor.unit.always-shoot-when-moving-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),

	hoverable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.hoverable",
			description: "editor.unit.hoverable-description",
			category: "editor.unit.category.system-control",
		}),
	),
	alwaysCreateOutline: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.always-create-outline",
			description: "editor.unit.always-create-outline-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	generateFullIcon: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.generate-full-icon",
			description: "editor.unit.generate-full-icon-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	squareShape: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.square-shape",
			description: "editor.unit.square-shape-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	drawBuildBeam: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-build-beam",
			description: "editor.unit.draw-build-beam-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	drawMineBeam: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-mine-beam",
			description: "editor.unit.draw-mine-beam-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	drawCell: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-cell",
			description: "editor.unit.draw-cell-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	drawItems: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-items",
			description: "editor.unit.draw-items-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	drawShields: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-shields",
			description: "editor.unit.draw-shields-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	drawBody: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-body",
			description: "editor.unit.draw-body-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	drawSoftShadow: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-soft-shadow",
			description: "editor.unit.draw-soft-shadow-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	drawMinimap: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.draw-minimap",
			description: "editor.unit.draw-minimap-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),

	deathSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.death-sound-volume",
			description: "editor.unit.death-sound-volume-description",
			category: "editor.unit.category.audio",
		}),
	),
	wreckSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.wreck-sound-volume",
			description: "editor.unit.wreck-sound-volume-description",
			category: "editor.unit.category.audio",
			visibleWhen: { field: "createWreck", value: true },
		}),
	),
	loopSoundVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.loop-sound-volume",
			description: "editor.unit.loop-sound-volume-description",
			category: "editor.unit.category.audio",
		}),
	),
	stepSoundVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.step-sound-volume",
			description: "editor.unit.step-sound-volume-description",
			category: "editor.unit.category.audio",
		}),
	),
	stepSoundPitch: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.step-sound-pitch",
			description: "editor.unit.step-sound-pitch-description",
			category: "editor.unit.category.audio",
		}),
	),
	stepSoundPitchRange: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.unit.step-sound-pitch-range",
			description: "editor.unit.step-sound-pitch-range-description",
			category: "editor.unit.category.audio",
		}),
	),
	moveSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.move-sound-volume",
			description: "editor.unit.move-sound-volume-description",
			category: "editor.unit.category.audio",
		}),
	),
	moveSoundPitchMin: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.move-sound-pitch-min",
			description: "editor.unit.move-sound-pitch-min-description",
			category: "editor.unit.category.audio",
		}),
	),
	moveSoundPitchMax: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.move-sound-pitch-max",
			description: "editor.unit.move-sound-pitch-max-description",
			category: "editor.unit.category.audio",
		}),
	),
	tankMoveVolume: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.tank-move-volume",
			description: "editor.unit.tank-move-volume-description",
			category: "editor.unit.category.audio",
		}),
	),

	useEngineElevation: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.use-engine-elevation",
			description: "editor.unit.use-engine-elevation-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),

	trailLength: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.trail-length",
			description: "editor.unit.trail-length-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),

	flowfieldPathType: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.flowfield-path-type",
			description: "editor.unit.flowfield-path-type-description",
			category: "editor.unit.category.system-control",
		}),
	),
	pathCostId: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.unit.path-cost-id",
			description: "editor.unit.path-cost-id-description",
			category: "editor.unit.category.system-control",
		}),
	),

	allowChangeCommands: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.allow-change-commands",
			description: "editor.unit.allow-change-commands-description",
			category: "editor.unit.category.system-control",
		}),
	),

	outlineRadius: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.unit.outline-radius",
			description: "editor.unit.outline-radius-description",
			category: "editor.unit.category.visuals-effects",
			visibleWhen: { field: "outlines", value: true },
		}),
	),
	outlines: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.outlines",
			description: "editor.unit.outlines-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),

	itemCapacity: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.item-capacity",
			description: "editor.unit.item-capacity-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),
	ammoCapacity: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.ammo-capacity",
			description: "editor.unit.ammo-capacity-description",
			category: "editor.unit.category.stats-attributes",
		}),
	),

	mineTier: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.mine-tier",
			description: "editor.unit.mine-tier-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	mineSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.mine-speed",
			description: "editor.unit.mine-speed-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	mineWalls: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.mine-walls",
			description: "editor.unit.mine-walls-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	mineFloor: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.mine-floor",
			description: "editor.unit.mine-floor-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	mineHardnessScaling: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.mine-hardness-scaling",
			description: "editor.unit.mine-hardness-scaling-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	mineSoundVolume: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.unit.mine-sound-volume",
			description: "editor.unit.mine-sound-volume-description",
			category: "editor.unit.category.audio",
		}),
	),

	legCount: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.unit.leg-count",
			description: "editor.unit.leg-count-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legGroupSize: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.unit.leg-group-size",
			description: "editor.unit.leg-group-size-description",
			category: "editor.unit.category.leg-units",
		}),
	),

	legLength: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.unit.leg-length",
			description: "editor.unit.leg-length-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legSpeed: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.unit.leg-speed",
			description: "editor.unit.leg-speed-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legForwardScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.leg-forward-scl",
			description: "editor.unit.leg-forward-scl-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legBaseOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-base-offset",
			description: "editor.unit.leg-base-offset-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legMoveSpace: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.leg-move-space",
			description: "editor.unit.leg-move-space-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legExtension: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-extension",
			description: "editor.unit.leg-extension-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legPairOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-pair-offset",
			description: "editor.unit.leg-pair-offset-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legLengthScl: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.leg-length-scl",
			description: "editor.unit.leg-length-scl-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legStraightLength: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.leg-straight-length",
			description: "editor.unit.leg-straight-length-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legMaxLength: v.pipe(
		v.optional(v.number(), 1.75),
		metadata({
			name: "editor.unit.leg-max-length",
			description: "editor.unit.leg-max-length-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legMinLength: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-min-length",
			description: "editor.unit.leg-min-length-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legSplashDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-splash-damage",
			description: "editor.unit.leg-splash-damage-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legSplashRange: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.leg-splash-range",
			description: "editor.unit.leg-splash-range-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	baseLegStraightness: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.base-leg-straightness",
			description: "editor.unit.base-leg-straightness-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legStraightness: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.leg-straightness",
			description: "editor.unit.leg-straightness-description",
			category: "editor.unit.category.leg-units",
		}),
	),

	legBaseUnder: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.leg-base-under",
			description: "editor.unit.leg-base-under-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	lockLegBase: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.lock-leg-base",
			description: "editor.unit.lock-leg-base-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	legContinuousMove: v.pipe(
		v.optional(v.boolean()),
		metadata({
			name: "editor.unit.leg-continuous-move",
			description: "editor.unit.leg-continuous-move-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	flipBackLegs: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.flip-back-legs",
			description: "editor.unit.flip-back-legs-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	flipLegSide: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.flip-leg-side",
			description: "editor.unit.flip-leg-side-description",
			category: "editor.unit.category.leg-units",
		}),
	),
	emitWalkSound: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.emit-walk-sound",
			description: "editor.unit.emit-walk-sound-description",
			category: "editor.unit.category.audio",
		}),
	),
	emitWalkEffect: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.emit-walk-effect",
			description: "editor.unit.emit-walk-effect-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),

	mechLandShake: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.mech-land-shake",
			description: "editor.unit.mech-land-shake-description",
			category: "editor.unit.category.mech-units",
		}),
	),
	mechSideSway: v.pipe(
		v.optional(v.number(), 0.54),
		metadata({
			name: "editor.unit.mech-side-sway",
			description: "editor.unit.mech-side-sway-description",
			category: "editor.unit.category.mech-units",
		}),
	),
	mechFrontSway: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.unit.mech-front-sway",
			description: "editor.unit.mech-front-sway-description",
			category: "editor.unit.category.mech-units",
		}),
	),
	mechStride: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.mech-stride",
			description: "editor.unit.mech-stride-description",
			category: "editor.unit.category.mech-units",
		}),
	),
	mechStepParticles: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.mech-step-particles",
			description: "editor.unit.mech-step-particles-description",
			category: "editor.unit.category.mech-units",
		}),
	),

	treadFrames: v.pipe(
		v.optional(v.number(), 18),
		metadata({
			name: "editor.unit.tread-frames",
			description: "editor.unit.tread-frames-description",
			category: "editor.unit.category.tank-units",
		}),
	),
	treadPullOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.tread-pull-offset",
			description: "editor.unit.tread-pull-offset-description",
			category: "editor.unit.category.tank-units",
		}),
	),
	crushFragile: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.unit.crush-fragile",
			description: "editor.unit.crush-fragile-description",
			category: "editor.unit.category.tank-units",
		}),
	),

	segments: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.segments",
			description: "editor.unit.segments-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	segmentUnits: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.segment-units",
			description: "editor.unit.segment-units-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	segmentLayerOrder: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.unit.segment-layer-order",
			description: "editor.unit.segment-layer-order-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),

	segmentMag: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.unit.segment-mag",
			description: "editor.unit.segment-mag-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	segmentScl: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.unit.segment-scl",
			description: "editor.unit.segment-scl-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	segmentPhase: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.unit.segment-phase",
			description: "editor.unit.segment-phase-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	segmentRotSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.unit.segment-rot-speed",
			description: "editor.unit.segment-rot-speed-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	segmentMaxRot: v.pipe(
		v.optional(v.number(), 30),
		metadata({
			name: "editor.unit.segment-max-rot",
			description: "editor.unit.segment-max-rot-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	segmentSpacing: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.unit.segment-spacing",
			description: "editor.unit.segment-spacing-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	segmentRotationRange: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.unit.segment-rotation-range",
			description: "editor.unit.segment-rotation-range-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	crawlSlowdown: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.unit.crawl-slowdown",
			description: "editor.unit.crawl-slowdown-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	crushDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.unit.crush-damage",
			description: "editor.unit.crush-damage-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	crawlSlowdownFrac: v.pipe(
		v.optional(v.number(), 0.55),
		metadata({
			name: "editor.unit.crawl-slowdown-frac",
			description: "editor.unit.crawl-slowdown-frac-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),

	lifetime: v.pipe(
		v.optional(v.number(), 60 * 5),
		metadata({
			name: "editor.unit.lifetime",
			description: "editor.unit.lifetime-description",
			category: "editor.unit.category.missile-units",
		}),
	),
	homingDelay: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.unit.homing-delay",
			description: "editor.unit.homing-delay-description",
			category: "editor.unit.category.missile-units",
		}),
	),

	healColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.heal-color",
			description: "editor.unit.heal-color-description",
			category: "editor.unit.category.visuals-effects",
			visibleWhen: { field: "healFlash", value: true },
		}),
	),
	lightColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.light-color",
			description: "editor.unit.light-color-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	shieldColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.shield-color",
			description: "editor.unit.shield-color-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),

	deathSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.unit.death-sound",
			description: "editor.unit.death-sound-description",
			category: "editor.unit.category.audio",
		}),
	),
	wreckSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.unit.wreck-sound",
			description: "editor.unit.wreck-sound-description",
			category: "editor.unit.category.audio",
			visibleWhen: { field: "createWreck", value: true },
		}),
	),
	loopSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.unit.loop-sound",
			description: "editor.unit.loop-sound-description",
			category: "editor.unit.category.audio",
		}),
	),
	stepSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.unit.step-sound",
			description: "editor.unit.step-sound-description",
			category: "editor.unit.category.audio",
		}),
	),
	tankMoveSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.unit.tank-move-sound",
			description: "editor.unit.tank-move-sound-description",
			category: "editor.unit.category.audio",
		}),
	),
	moveSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.unit.move-sound",
			description: "editor.unit.move-sound-description",
			category: "editor.unit.category.audio",
		}),
	),

	engineColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.engine-color",
			description: "editor.unit.engine-color-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	engineColorInner: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.engine-color-inner",
			description: "editor.unit.engine-color-inner-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	trailColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.trail-color",
			description: "editor.unit.trail-color-description",
			category: "editor.unit.category.visuals-effects",
		}),
	),
	outlineColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.outline-color",
			description: "editor.unit.outline-color-description",
			category: "editor.unit.category.visuals-effects",
			visibleWhen: { field: "outlines", value: true },
		}),
	),
	mineSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({
			name: "editor.unit.mine-sound",
			description: "editor.unit.mine-sound-description",
			category: "editor.unit.category.audio",
		}),
	),
	mechLegColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.unit.mech-leg-color",
			description: "editor.unit.mech-leg-color-description",
			category: "editor.unit.category.mech-units",
		}),
	),

	aiController: v.pipe(
		v.optional(v.unknown()),
		metadata({
			name: "editor.unit.ai-controller",
			description: "editor.unit.ai-controller-description",
			category: "editor.unit.category.system-control",
		}),
	),
	controller: v.pipe(
		v.optional(v.unknown()),
		metadata({
			name: "editor.unit.controller",
			description: "editor.unit.controller-description",
			category: "editor.unit.category.system-control",
		}),
	),
	constructor: v.pipe(
		v.optional(v.unknown()),
		metadata({
			name: "editor.unit.constructor",
			description: "editor.unit.constructor-description",
			category: "editor.unit.category.system-control",
		}),
	),
	pathCost: v.pipe(
		v.optional(v.unknown()),
		metadata({
			name: "editor.unit.path-cost",
			description: "editor.unit.path-cost-description",
			category: "editor.unit.category.system-control",
		}),
	),
	sample: v.pipe(
		v.optional(v.unknown()),
		metadata({
			name: "editor.unit.sample",
			description: "editor.unit.sample-description",
			category: "editor.unit.category.system-control",
		}),
	),
	targetFlags: v.pipe(
		v.optional(v.array(v.unknown())),
		metadata({
			name: "editor.unit.target-flags",
			description: "editor.unit.target-flags-description",
			category: "editor.unit.category.combat-targeting",
		}),
	),
	commands: v.pipe(
		v.optional(v.array(v.unknown())),
		metadata({
			name: "editor.unit.commands",
			description: "editor.unit.commands-description",
			category: "editor.unit.category.system-control",
		}),
	),
	defaultCommand: v.pipe(
		v.optional(v.unknown()),
		metadata({
			name: "editor.unit.default-command",
			description: "editor.unit.default-command-description",
			category: "editor.unit.category.system-control",
		}),
	),
	stances: v.pipe(
		v.optional(v.array(v.unknown())),
		metadata({
			name: "editor.unit.stances",
			description: "editor.unit.stances-description",
			category: "editor.unit.category.system-control",
		}),
	),
	mineItems: v.pipe(
		v.optional(v.array(v.unknown())),
		metadata({
			name: "editor.unit.mine-items",
			description: "editor.unit.mine-items-description",
			category: "editor.unit.category.mining-building",
		}),
	),
	treadRects: v.pipe(
		v.optional(v.array(v.unknown())),
		metadata({
			name: "editor.unit.tread-rects",
			description: "editor.unit.tread-rects-description",
			category: "editor.unit.category.tank-units",
		}),
	),
	segmentUnit: v.pipe(
		v.optional(v.unknown()),
		metadata({
			name: "editor.unit.segment-unit",
			description: "editor.unit.segment-unit-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
	segmentEndUnit: v.pipe(
		v.optional(v.unknown()),
		metadata({
			name: "editor.unit.segment-end-unit",
			description: "editor.unit.segment-end-unit-description",
			category: "editor.unit.category.segmented-crawl-units",
		}),
	),
};

export const UnitHjsonSchema: SchemaFn = (context) =>
	v.object({
		...unitObjectSchema,
		abilities: v.pipe(
			v.optional(v.array(AbilityFieldSchema(context)), []),
			metadata({
				name: "editor.unit.abilities",
				description: "editor.unit.abilities-description",
				category: "editor.unit.category.stats-attributes",
			}),
		),
		weapons: v.pipe(
			v.optional(v.array(WeaponHjsonSchema(context)), []),
			metadata({
				name: "editor.unit.weapons",
				description: "editor.unit.weapons-description",
				category: "editor.unit.category.combat-targeting",
			}),
		),
		immunities: v.pipe(
			v.optional(v.array(StatusStringSchema(context)), []),
			metadata({
				name: "editor.unit.immunities",
				description: "editor.unit.immunities-description",
				category: "editor.unit.category.stats-attributes",
			}),
		),
		fallEffect: v.pipe(
			v.optional(EffectHjsonSchema(context)),
			metadata({
				name: "editor.unit.fall-effect",
				description: "editor.unit.fall-effect-description",
				category: "editor.unit.category.visuals-effects",
				visibleWhen: { field: "flying", value: true },
			}),
		),
		fallEngineEffect: v.pipe(
			v.optional(EffectHjsonSchema(context)),
			metadata({
				name: "editor.unit.fall-engine-effect",
				description: "editor.unit.fall-engine-effect-description",
				category: "editor.unit.category.visuals-effects",
				visibleWhen: { field: "flying", value: true },
			}),
		),
		deathExplosionEffect: v.pipe(
			v.optional(EffectHjsonSchema(context)),
			metadata({
				name: "editor.unit.death-explosion-effect",
				description: "editor.unit.death-explosion-effect-description",
				category: "editor.unit.category.visuals-effects",
			}),
		),
		treadEffect: v.pipe(
			v.optional(EffectHjsonSchema(context)),
			metadata({
				name: "editor.unit.tread-effect",
				description: "editor.unit.tread-effect-description",
				category: "editor.unit.category.visuals-effects",
			}),
		),
		parts: v.pipe(
			v.optional(v.array(PartHjsonSchema(context)), []),
			metadata({
				name: "editor.unit.parts",
				description: "editor.unit.parts-description",
				category: "editor.unit.category.visuals-effects",
			}),
		),
		engines: v.pipe(
			v.optional(v.array(EngineHjsonSchema(context)), []),
			metadata({
				name: "editor.unit.engines",
				description: "editor.unit.engines-description",
				category: "editor.unit.category.visuals-effects",
			}),
		),
		research: v.optional(ResearchSchema(context)),
	});

export const UnitFieldSchema: SchemaFn = (context) =>
	v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.units.map((unit) => unit.name.replaceAll(context.name + "-", ""))),
	);
