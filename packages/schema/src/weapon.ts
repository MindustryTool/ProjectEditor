import * as v from "valibot";
import { MindustryHexColorSchema, SoundHjsonSchema, type SchemaFn } from "./base";
import { StatusStringSchema } from "./status";
import { EffectHjsonSchema } from "./effect";
import { PartHjsonSchema } from "./part";
import { ShootPatternHjsonSchema } from "./shoot-pattern";
import { BulletHjsonSchema } from "./bullet";
import { lazyArray } from "./lazy-array";

const weaponObjectSchema = {
	name: v.optional(v.string()),
	shots: v.optional(v.number(), 1),

	display: v.optional(v.boolean(), true),
	mirror: v.optional(v.boolean(), true),
	flipSprite: v.optional(v.boolean(), false),
	alternate: v.optional(v.boolean(), true),
	rotate: v.optional(v.boolean(), false),
	showStatSprite: v.optional(v.boolean(), true),

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
	reload: v.optional(v.number(), 1),
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

	activeSound: v.optional(SoundHjsonSchema),
	shootSound: v.optional(SoundHjsonSchema),
	initialShootSound: v.optional(SoundHjsonSchema),
	chargeSound: v.optional(SoundHjsonSchema),

	heatColor: v.optional(MindustryHexColorSchema),

	shootStatusDuration: v.optional(v.number(), 60 * 5),

	shootOnDeath: v.optional(v.boolean(), false),
};

export const WeaponHjsonSchema: SchemaFn = (value, context) =>
	v.object({
		...weaponObjectSchema,
		bullet: v.optional(BulletHjsonSchema(value.get("bullet"), context)),
		ejectEffect: v.optional(EffectHjsonSchema(value.get("ejectEffect"), context)),

		shoot: v.optional(ShootPatternHjsonSchema(value.get("shoot"), context)),

		shootStatus: v.optional(StatusStringSchema(value.get("shootStatus"), context)),

		shootOnDeathEffect: v.optional(EffectHjsonSchema(value.get("shootOnDeathEffect"), context)),

		parts: v.optional(
			lazyArray((index) => PartHjsonSchema(value.get("parts").get(index), context)),
			[],
		),
	});
