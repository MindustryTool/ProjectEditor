import * as v from "valibot";
import { Interps, MindustryHexColorSchema, SoundHjsonSchema, type SchemaFn } from "./base";
import type { AnySchema } from "./schema-utils";
import { EffectHjsonSchema, effectItemUnionSchema } from "./effect";
import { ShootPatternHjsonSchema, shootPatternItemUnionSchema } from "./shoot-pattern";
import { lazyArray } from "./lazy-array";

const metadata = { type: "bullet" };

const bulletEffectSchema = v.nullish(
	v.pipe(
		v.lazy(() => effectItemUnionSchema),
		v.metadata({ type: "effect" }),
	),
);

const bulletShootPatternSchema = v.nullish(
	v.pipe(
		v.lazy(() => shootPatternItemUnionSchema),
		v.metadata({ type: "shoot-pattern" }),
	),
);

export const bulletTypes = [
	"ArtilleryBulletType",
	"BasicBulletType",
	"BombBulletType",
	"BulletType",
	"ContinuousBulletType",
	"ContinuousFlameBulletType",
	"ContinuousLaserBulletType",
	"EmpBulletType",
	"EmptyBulletType",
	"ExplosionBulletType",
	"FireBulletType",
	"FlakBulletType",
	"InterceptorBulletType",
	"LaserBoltBulletType",
	"LaserBulletType",
	"LightningBulletType",
	"LiquidBulletType",
	"MassDriverBolt",
	"MissileBulletType",
	"MultiBulletType",
	"PointBulletType",
	"PointLaserBulletType",
	"RailBulletType",
	"SapBulletType",
	"ShrapnelBulletType",
	"SpaceLiquidBulletType",
] as const;

export type BulletClass = (typeof bulletTypes)[number];

const commonBulletFields = {
	lifetime: v.nullish(v.number(), 40),
	speed: v.nullish(v.number(), 1),
	damage: v.nullish(v.number(), 1),
	hitSize: v.nullish(v.number(), 4),
	drawSize: v.nullish(v.number(), 40),
	drag: v.nullish(v.number(), 0),
	accel: v.nullish(v.number(), 0),
	pierce: v.nullish(v.boolean(), false),
	pierceBuilding: v.nullish(v.boolean(), false),
	pierceCap: v.nullish(v.number(), -1),
	knockback: v.nullish(v.number(), 0),
	ammoMultiplier: v.nullish(v.number(), 2),
	reloadMultiplier: v.nullish(v.number(), 1),
	homingPower: v.nullish(v.number(), 0),
	homingRange: v.nullish(v.number(), 50),
	splashDamage: v.nullish(v.number(), 0),
	splashDamageRadius: v.nullish(v.number(), -1),
	status: v.nullish(v.string()),
	statusDuration: v.nullish(v.number(), 480),
	collidesTiles: v.nullish(v.boolean(), true),
	collidesAir: v.nullish(v.boolean(), true),
	collidesGround: v.nullish(v.boolean(), true),
	collides: v.nullish(v.boolean(), true),
	keepVelocity: v.nullish(v.boolean(), true),
	hittable: v.nullish(v.boolean(), true),
	reflectable: v.nullish(v.boolean(), true),
	absorbable: v.nullish(v.boolean(), true),
	fragBullets: v.nullish(v.number(), 9),
	fragVelocityMin: v.nullish(v.number(), 0.2),
	fragVelocityMax: v.nullish(v.number(), 1.0),
	fragLifeMin: v.nullish(v.number(), 1),
	fragLifeMax: v.nullish(v.number(), 1),
	fragRandomSpread: v.nullish(v.number(), 360),
	fragSpread: v.nullish(v.number(), 0),
	fragAngle: v.nullish(v.number(), 0),
	fragOffsetMin: v.nullish(v.number(), 1),
	fragOffsetMax: v.nullish(v.number(), 7),
	bulletInterval: v.nullish(v.number(), 20),
	intervalBullets: v.nullish(v.number(), 1),
	intervalRandomSpread: v.nullish(v.number(), 360),
	intervalSpread: v.nullish(v.number(), 0),
	intervalAngle: v.nullish(v.number(), 0),
	intervalDelay: v.nullish(v.number(), -1),
	recoil: v.nullish(v.number(), 0),
	healPercent: v.nullish(v.number(), 0),
	healAmount: v.nullish(v.number(), 0),
	lifesteal: v.nullish(v.number(), 0),
	incendAmount: v.nullish(v.number(), 0),
	incendSpread: v.nullish(v.number(), 8),
	incendChance: v.nullish(v.number(), 1),
	puddles: v.nullish(v.number(), 0),
	puddleRange: v.nullish(v.number(), 0),
	puddleAmount: v.nullish(v.number(), 5),
	lightning: v.nullish(v.number(), 0),
	lightningLength: v.nullish(v.number(), 5),
	lightningLengthRand: v.nullish(v.number(), 0),
	lightningDamage: v.nullish(v.number(), -1),
	lightningCone: v.nullish(v.number(), 360),
	lightningAngle: v.nullish(v.number(), 0),
	lightningColor: v.nullish(MindustryHexColorSchema),
	trailColor: v.nullish(MindustryHexColorSchema),
	trailWidth: v.nullish(v.number(), 2),
	trailLength: v.nullish(v.number(), -1),
	trailChance: v.nullish(v.number(), -0.0001),
	trailInterval: v.nullish(v.number(), 0),
	trailParam: v.nullish(v.number(), 2),
	trailRotation: v.nullish(v.boolean(), false),
	weaveScale: v.nullish(v.number(), 1),
	weaveMag: v.nullish(v.number(), 0),
	lightRadius: v.nullish(v.number(), -1),
	lightOpacity: v.nullish(v.number(), 0.3),
	lightColor: v.nullish(MindustryHexColorSchema),
	hitColor: v.nullish(MindustryHexColorSchema),
	backColor: v.nullish(MindustryHexColorSchema),
	frontColor: v.nullish(MindustryHexColorSchema),
	width: v.nullish(v.number(), 5),
	height: v.nullish(v.number(), 7),
	shrinkX: v.nullish(v.number(), 0),
	shrinkY: v.nullish(v.number(), 0.5),
	spin: v.nullish(v.number(), 0),
	sprite: v.nullish(v.string()),
	backSprite: v.nullish(v.string()),
	shrinkInterp: v.nullish(v.picklist(Interps), "linear"),
	hitSound: v.nullish(SoundHjsonSchema),
	despawnSound: v.nullish(SoundHjsonSchema),
	shootSound: v.nullish(SoundHjsonSchema),
	healSound: v.nullish(SoundHjsonSchema),
};

const bulletBaseObjectSchema = v.object({
	type: v.picklist(bulletTypes),
	...commonBulletFields,
	fragBullet: v.nullish(v.lazy(() => bulletItemUnionSchema)),
	intervalBullet: v.nullish(v.lazy(() => bulletItemUnionSchema)),
	lightningType: v.nullish(v.lazy(() => bulletItemUnionSchema)),
});

const classSchemaMap: Record<BulletClass, SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>> = {
	ArtilleryBulletType: () =>
		v.object({
			trailMult: v.nullish(v.number(), 1),
			trailSize: v.nullish(v.number(), 4),
		}),
	BasicBulletType: () => v.object({}),
	BombBulletType: () => v.object({}),
	BulletType: () => v.object({}),
	ContinuousBulletType: () =>
		v.object({
			length: v.nullish(v.number(), 220),
			damageInterval: v.nullish(v.number(), 5),
			continuous: v.nullish(v.boolean(), true),
		}),
	ContinuousFlameBulletType: () => v.object({}),
	ContinuousLaserBulletType: () => v.object({}),
	EmpBulletType: (value, context) =>
		v.object({
			radius: v.nullish(v.number(), 100),
			timeIncrease: v.nullish(v.number(), 2.5),
			timeDuration: v.nullish(v.number(), 600),
			unitDamageScl: v.nullish(v.number(), 0.7),
			hitPowerEffect: v.nullish(EffectHjsonSchema(value.get("hitPowerEffect"), context)),
		}),
	EmptyBulletType: () => v.object({}),
	ExplosionBulletType: () => v.object({}),
	FireBulletType: () => v.object({}),
	FlakBulletType: () => v.object({}),
	InterceptorBulletType: () => v.object({}),
	LaserBoltBulletType: () => v.object({}),
	LaserBulletType: () =>
		v.object({
			length: v.nullish(v.number(), 160),
			width: v.nullish(v.number(), 15),
			lengthFalloff: v.nullish(v.number(), 0.5),
			sideLength: v.nullish(v.number(), 29),
			sideWidth: v.nullish(v.number(), 0.7),
			lightningSpacing: v.nullish(v.number(), -1),
		}),
	LightningBulletType: () => v.object({}),
	LiquidBulletType: () =>
		v.object({
			puddleSize: v.nullish(v.number(), 6),
			orbSize: v.nullish(v.number(), 3),
			boilTime: v.nullish(v.number(), 5),
		}),
	MassDriverBolt: () => v.object({}),
	MissileBulletType: () => v.object({}),
	MultiBulletType: () =>
		v.object({
			bullets: v.nullish(
				lazyArray(() => bulletItemUnionSchema),
				[],
			),
			repeat: v.nullish(v.number(), 1),
		}),
	PointBulletType: () => v.object({}),
	PointLaserBulletType: () =>
		v.object({
			oscScl: v.nullish(v.number(), 2),
			oscMag: v.nullish(v.number(), 0.3),
			damageInterval: v.nullish(v.number(), 5),
		}),
	RailBulletType: () =>
		v.object({
			length: v.nullish(v.number(), 100),
			pointEffectSpace: v.nullish(v.number(), 20),
		}),
	SapBulletType: () =>
		v.object({
			length: v.nullish(v.number(), 100),
			sapStrength: v.nullish(v.number(), 0.5),
			color: v.nullish(MindustryHexColorSchema),
		}),
	ShrapnelBulletType: () =>
		v.object({
			length: v.nullish(v.number(), 100),
			width: v.nullish(v.number(), 20),
			serrations: v.nullish(v.number(), 7),
			serrationSpacing: v.nullish(v.number(), 8),
		}),
	SpaceLiquidBulletType: () => v.object({}),
};

function createEffectFieldSchema(
	key: "hitEffect" | "despawnEffect" | "shootEffect" | "smokeEffect" | "trailEffect" | "chargeEffect" | "healEffect",
	value?: Parameters<SchemaFn>[0],
	context?: Parameters<SchemaFn>[1],
) {
	if (value && context) {
		return v.nullish(EffectHjsonSchema(value.get(key), context));
	}

	return bulletEffectSchema;
}

function createShootPatternFieldSchema(value?: Parameters<SchemaFn>[0], context?: Parameters<SchemaFn>[1]) {
	if (value && context) {
		return v.nullish(ShootPatternHjsonSchema(value.get("shootPattern"), context));
	}

	return bulletShootPatternSchema;
}

function buildBulletObjectSchema(value?: Parameters<SchemaFn>[0], context?: Parameters<SchemaFn>[1]) {
	return v.object({
		...bulletBaseObjectSchema.entries,
		hitEffect: createEffectFieldSchema("hitEffect", value, context),
		despawnEffect: createEffectFieldSchema("despawnEffect", value, context),
		shootEffect: createEffectFieldSchema("shootEffect", value, context),
		smokeEffect: createEffectFieldSchema("smokeEffect", value, context),
		trailEffect: createEffectFieldSchema("trailEffect", value, context),
		chargeEffect: createEffectFieldSchema("chargeEffect", value, context),
		healEffect: createEffectFieldSchema("healEffect", value, context),
		shootPattern: createShootPatternFieldSchema(value, context),
	});
}

const bulletItemUnionSchema: AnySchema = v.pipe(
	v.lazy((input) => {
		if (typeof input === "object" && input !== null && "type" in input) {
			const type = input.type as BulletClass;
			const schemaFn = classSchemaMap[type];

			if (schemaFn) {
				return v.object({ ...buildBulletObjectSchema().entries, ...schemaFn().entries });
			}
			return buildBulletObjectSchema();
		}

		return v.pipe(v.string(), v.minLength(1), v.maxLength(127));
	}),
	v.metadata(metadata),
);

export const BulletHjsonSchema: SchemaFn = (value, context) => {
	return buildBulletHjsonSchema(value, context);
};

const buildBulletHjsonSchema: SchemaFn = (value, context) => {
	if (value.isObject()) {
		const type = value.get("type");

		if (type.isString() && classSchemaMap[type.valueOf() as BulletClass]) {
			const schema = classSchemaMap[type.valueOf() as BulletClass];
			return v.pipe(
				v.object({ ...buildBulletObjectSchema(value, context).entries, ...schema(value, context).entries }),
				v.metadata(metadata),
			);
		}
	}

	return v.never("Bullet value must be an object: " + value.valueOf());
};
