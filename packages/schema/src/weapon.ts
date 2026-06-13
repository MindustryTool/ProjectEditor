import * as v from "valibot";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { SoundHjsonSchema } from "./sound";
import { StatusStringSchema } from "./status";
import { EffectFieldSchema } from "./effect";
import { PartHjsonSchema } from "./part";
import { ShootPatternHjsonSchema } from "./shoot-pattern";
import { BulletHjsonSchema } from "./bullet";
import { cached, fixed, metadata } from "./utils";
import type { ProjectContents } from "@project/types";
import { ClassMap, classSchema } from "./class";
import { unlockableContentSchema } from "./content";

const weaponTypes = ["Weapon", "BuildWeapon", "MineWeapon", "PointDefenseBulletWeapon", "PointDefenseWeapon", "RepairBeamWeapon"] as const;

type WeaponType = (typeof weaponTypes)[number];

const weaponObjectSchema = {
	name: v.optional(v.string()),
	type: v.pipe(classSchema(weaponTypes, "Weapon"), metadata({ name: "editor.weapon.type" })),
	...unlockableContentSchema,
	shots: v.optional(v.number(), 1),
	display: v.optional(v.boolean(), true),
	mirror: v.optional(v.boolean(), true),
	flipSprite: v.optional(v.boolean(), false),
	alternate: v.optional(v.boolean(), true),
	rotate: v.optional(v.boolean(), false),
	showStatSprite: v.optional(v.boolean(), true),
	reload: v.optional(v.number(), 1),

	baseRotation: v.optional(v.number(), 0),

	top: v.optional(v.boolean(), true),

	continuous: v.optional(v.boolean()),
	alwaysContinuous: v.optional(v.boolean()),

	aimChangeSpeed: v.optional(v.number()),

	controllable: v.optional(v.boolean(), true),
	aiControllable: v.optional(v.boolean(), true),
	alwaysShooting: v.optional(v.boolean(), false),
	autoTarget: v.optional(v.boolean(), false),
	predictTarget: v.optional(v.boolean(), true),
	useAttackRange: v.optional(v.boolean(), true),

	targetInterval: v.optional(v.number(), 40),
	targetSwitchInterval: v.optional(v.number(), 70),

	rotateSpeed: v.optional(v.number(), 20),
	inaccuracy: v.optional(v.number(), 0),
	shake: v.optional(v.number(), 0),
	recoil: v.optional(v.number(), 1.5),

	recoils: v.optional(v.number(), -1),

	recoilTime: v.optional(v.number(), -1),
	recoilPow: v.optional(v.number(), 1.8),
	cooldownTime: v.optional(v.number(), 20),

	shootX: v.optional(v.number(), 0),
	shootY: v.optional(v.number(), 3),

	x: v.optional(v.number(), 5),
	y: v.optional(v.number(), 0),

	xRand: v.optional(v.number(), 0),
	yRand: v.optional(v.number(), 0),

	shadow: v.optional(v.number(), -1),

	velocityRnd: v.optional(v.number(), 0),
	extraVelocity: v.optional(v.number(), 0),

	shootCone: v.optional(v.number(), 5),
	rotationLimit: v.optional(v.number(), 361),

	minWarmup: v.optional(v.number(), 0),

	shootWarmupSpeed: v.optional(v.number(), 0.1),
	smoothReloadSpeed: v.optional(v.number(), 0.15),

	linearWarmup: v.optional(v.boolean(), false),

	soundPitchMin: v.optional(v.number(), 0.8),
	soundPitchMax: v.optional(v.number(), 1),

	ignoreRotation: v.optional(v.boolean(), false),
	noAttack: v.optional(v.boolean(), false),

	minShootVelocity: v.optional(v.number(), -1),

	parentizeEffects: v.optional(v.boolean()),

	otherSide: v.optional(v.number(), -1),

	layerOffset: v.optional(v.number(), 0),

	heatColor: v.optional(MindustryHexColorSchema),

	shootStatusDuration: v.optional(v.number(), 60 * 5),

	shootOnDeath: v.optional(v.boolean(), false),
};

const buildWeaponSchema = v.object({
	rotate: fixed(weaponObjectSchema, "rotate", true),
	noAttack: fixed(weaponObjectSchema, "noAttack", true),
	predictTarget: fixed(weaponObjectSchema, "predictTarget", false),
	display: fixed(weaponObjectSchema, "display", false),
	useAttackRange: fixed(weaponObjectSchema, "useAttackRange", false),
});

const mineWeaponSchema = v.object({
	rotate: fixed(weaponObjectSchema, "rotate", true),
	noAttack: fixed(weaponObjectSchema, "noAttack", true),
	predictTarget: fixed(weaponObjectSchema, "predictTarget", false),
	display: fixed(weaponObjectSchema, "display", false),
	useAttackRange: fixed(weaponObjectSchema, "useAttackRange", false),
});

const pointDefenseBulletWeaponSchema = v.object({
	autoTarget: fixed(weaponObjectSchema, "autoTarget", true),
	controllable: fixed(weaponObjectSchema, "controllable", false),
	rotate: fixed(weaponObjectSchema, "rotate", true),
	useAttackRange: fixed(weaponObjectSchema, "useAttackRange", false),
	targetInterval: fixed(weaponObjectSchema, "targetInterval", 5),
});

const pointDefenseWeaponSchema = cached((context: ProjectContents) =>
	v.object({
		color: v.optional(MindustryHexColorSchema),
		beamEffect: v.optional(EffectFieldSchema(context)),
		predictTarget: fixed(weaponObjectSchema, "predictTarget", true),
		autoTarget: fixed(weaponObjectSchema, "autoTarget", true),
		controllable: fixed(weaponObjectSchema, "controllable", false),
		rotate: fixed(weaponObjectSchema, "rotate", true),
		useAttackRange: fixed(weaponObjectSchema, "useAttackRange", false),
		targetInterval: fixed(weaponObjectSchema, "targetInterval", 10),
	}),
);

const repairBeamWeaponSchema = cached((context: ProjectContents) =>
	v.object({
		targetBuildings: v.optional(v.boolean(), false),
		targetUnits: v.optional(v.boolean(), true),
		repairSpeed: v.optional(v.number(), 0.3),
		fractionRepairSpeed: v.optional(v.number(), 0),
		beamWidth: v.optional(v.number(), 1),
		pulseRadius: v.optional(v.number(), 6),
		pulseStroke: v.optional(v.number(), 2),
		widthSinMag: v.optional(v.number(), 0),
		widthSinScl: v.optional(v.number(), 4),
		recentDamageMultiplier: v.optional(v.number(), 0.1),
		laserColor: v.optional(MindustryHexColorSchema, "98ffa9"),
		laserTopColor: v.optional(MindustryHexColorSchema, "ffffff"),
		healColor: v.optional(MindustryHexColorSchema),
		healEffect: v.optional(EffectFieldSchema(context)),

		reload: fixed(weaponObjectSchema, "reload", 1),
		predictTarget: fixed(weaponObjectSchema, "predictTarget", false),
		autoTarget: fixed(weaponObjectSchema, "autoTarget", true),
		controllable: fixed(weaponObjectSchema, "controllable", false),
		rotate: fixed(weaponObjectSchema, "rotate", true),
		recoil: fixed(weaponObjectSchema, "recoil", 0),
		noAttack: fixed(weaponObjectSchema, "noAttack", true),
		useAttackRange: fixed(weaponObjectSchema, "useAttackRange", false),
	}),
);

export const WeaponHjsonSchema = new ClassMap<WeaponType>(
	{
		Weapon: () => ({}),
		BuildWeapon: () => buildWeaponSchema.entries,
		MineWeapon: () => mineWeaponSchema.entries,
		PointDefenseBulletWeapon: () => pointDefenseBulletWeaponSchema.entries,
		PointDefenseWeapon: (context) => pointDefenseWeaponSchema(context).entries,
		RepairBeamWeapon: (context) => repairBeamWeaponSchema(context).entries,
	},
	{
		baseSchema: weaponObjectSchema,
		extra: (context) => ({
			bullet: v.optional(BulletHjsonSchema(context)),
			ejectEffect: v.optional(EffectFieldSchema(context)),
			shoot: v.optional(ShootPatternHjsonSchema(context)),
			shootStatus: v.optional(StatusStringSchema(context)),
			shootOnDeathEffect: v.optional(EffectFieldSchema(context)),
			parts: v.optional(v.array(PartHjsonSchema(context)), []),
			activeSound: v.optional(SoundHjsonSchema),
			shootSound: v.optional(SoundHjsonSchema),
			initialShootSound: v.optional(SoundHjsonSchema),
			chargeSound: v.optional(SoundHjsonSchema),
		}),
	},
).schema;
