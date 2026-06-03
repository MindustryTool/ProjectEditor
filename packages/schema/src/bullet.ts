import * as v from "valibot";
import { Interps, MindustryHexColorSchema, SoundHjsonSchema, SpriteHjsonSchema, type SchemaFn } from "./base";
import { EffectHjsonSchema } from "./effect";
import { PartHjsonSchema } from "./part";
import { ShootPatternHjsonSchema } from "./shoot-pattern";
import { StatusFieldSchema } from "./status";
import { lazyArray } from "./lazy-array";

const metadata = { type: "bullet" };

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

type BulletObjectSchema = v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>;

function createBulletFieldSchema(
	value: Parameters<SchemaFn>[0],
	context: Parameters<SchemaFn>[1],
	key: "fragBullet" | "intervalBullet" | "lightningType",
) {
	return v.nullish(BulletHjsonSchema(value.get(key), context));
}

function createEffectFieldSchema(value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1], key: string) {
	return v.nullish(EffectHjsonSchema(value.get(key), context));
}

function createShootPatternFieldSchema(value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1]) {
	return v.nullish(ShootPatternHjsonSchema(value.get("shootPattern"), context));
}

function createBulletArraySchema(value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1], key: string) {
	return v.nullish(
		lazyArray((index) => BulletHjsonSchema(value.get(key).get(index), context)),
		[],
	);
}

function createPartArraySchema(value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1]) {
	return v.nullish(
		lazyArray((index) => PartHjsonSchema(value.get("parts").get(index), context)),
		[],
	);
}

function createUnitFieldSchema(_value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1]) {
	return v.nullish(v.pipe(v.picklist(context.units.map((unit) => unit.name)), v.metadata({ type: "units" })));
}

function createLiquidFieldSchema(_value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1]) {
	return v.nullish(v.pipe(v.picklist(context.liquids.map((liquid) => liquid.name)), v.metadata({ type: "liquids" })));
}

function createBulletBaseObjectSchema(value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1]) {
	return v.object({
		type: v.picklist(bulletTypes),
		lifetime: v.nullish(v.number(), 40),
		lifeScaleRandMin: v.nullish(v.number(), 1),
		lifeScaleRandMax: v.nullish(v.number(), 1),
		speed: v.nullish(v.number(), 1),
		velocityScaleRandMin: v.nullish(v.number(), 1),
		velocityScaleRandMax: v.nullish(v.number(), 1),
		damage: v.nullish(v.number(), 1),
		hitSize: v.nullish(v.number(), 4),
		drawSize: v.nullish(v.number(), 40),
		angleOffset: v.nullish(v.number(), 0),
		randomAngleOffset: v.nullish(v.number(), 0),
		drag: v.nullish(v.number(), 0),
		accel: v.nullish(v.number(), 0),
		pierce: v.nullish(v.boolean(), false),
		pierceBuilding: v.nullish(v.boolean(), false),
		pierceCap: v.nullish(v.number(), -1),
		pierceDamageFactor: v.nullish(v.number(), 0),
		maxDamageFraction: v.nullish(v.number(), -1),
		removeAfterPierce: v.nullish(v.boolean(), true),
		laserAbsorb: v.nullish(v.boolean(), true),
		optimalLifeFract: v.nullish(v.number(), 0),
		layer: v.nullish(v.number()),
		hitEffect: createEffectFieldSchema(value, context, "hitEffect"),
		despawnEffect: createEffectFieldSchema(value, context, "despawnEffect"),
		shootEffect: createEffectFieldSchema(value, context, "shootEffect"),
		shootPattern: createShootPatternFieldSchema(value, context),
		chargeEffect: createEffectFieldSchema(value, context, "chargeEffect"),
		smokeEffect: createEffectFieldSchema(value, context, "smokeEffect"),
		shootSound: v.nullish(SoundHjsonSchema),
		hitSound: v.nullish(SoundHjsonSchema),
		despawnSound: v.nullish(SoundHjsonSchema),
		hitSoundPitch: v.nullish(v.number(), 1),
		hitSoundPitchRange: v.nullish(v.number(), 0.1),
		hitSoundVolume: v.nullish(v.number(), 1),
		inaccuracy: v.nullish(v.number(), 0),
		ammoMultiplier: v.nullish(v.number(), 2),
		reloadMultiplier: v.nullish(v.number(), 1),
		buildingDamageMultiplier: v.nullish(v.number(), 1),
		shieldDamageMultiplier: v.nullish(v.number(), 1),
		recoil: v.nullish(v.number(), 0),
		killShooter: v.nullish(v.boolean(), false),
		instantDisappear: v.nullish(v.boolean(), false),
		splashDamage: v.nullish(v.number(), 0),
		scaledSplashDamage: v.nullish(v.boolean(), false),
		knockback: v.nullish(v.number(), 0),
		impact: v.nullish(v.boolean(), false),
		status: StatusFieldSchema(value, context),
		statusDuration: v.nullish(v.number(), 480),
		targetBlocks: v.nullish(v.boolean(), true),
		targetMissiles: v.nullish(v.boolean(), true),
		collidesTiles: v.nullish(v.boolean(), true),
		collidesTeam: v.nullish(v.boolean(), false),
		collidesAir: v.nullish(v.boolean(), true),
		collidesGround: v.nullish(v.boolean(), true),
		collides: v.nullish(v.boolean(), true),
		collideFloor: v.nullish(v.boolean(), false),
		collideTerrain: v.nullish(v.boolean(), false),
		keepVelocity: v.nullish(v.boolean(), true),
		scaleKeepVelocity: v.nullish(v.boolean(), false),
		scaleLife: v.nullish(v.boolean(), false),
		hittable: v.nullish(v.boolean(), true),
		reflectable: v.nullish(v.boolean(), true),
		absorbable: v.nullish(v.boolean(), true),
		ignoreSpawnAngle: v.nullish(v.boolean(), false),
		createChance: v.nullish(v.number(), 1),
		maxRange: v.nullish(v.number(), -1),
		rangeOverride: v.nullish(v.number(), -1),
		rangeChange: v.nullish(v.number(), 0),
		extraRangeMargin: v.nullish(v.number(), 0),
		range: v.nullish(v.number(), 0),
		minRangeChange: v.nullish(v.number(), 0),
		healPercent: v.nullish(v.number(), 0),
		healAmount: v.nullish(v.number(), 0),
		healSound: v.nullish(SoundHjsonSchema),
		healSoundVolume: v.nullish(v.number(), 0.9),
		lifesteal: v.nullish(v.number(), 0),
		makeFire: v.nullish(v.boolean(), false),
		hitUnder: v.nullish(v.boolean(), false),
		despawnHit: v.nullish(v.boolean(), false),
		fragOnHit: v.nullish(v.boolean(), true),
		fragOnDespawn: v.nullish(v.boolean(), true),
		fragOnAbsorb: v.nullish(v.boolean(), true),
		pierceArmor: v.nullish(v.boolean(), false),
		armorMultiplier: v.nullish(v.number(), 1),
		blockArmorMultiplier: v.nullish(v.number(), 1),
		sticky: v.nullish(v.boolean(), false),
		stickyExtraLifetime: v.nullish(v.number(), 0),
		setDefaults: v.nullish(v.boolean(), true),
		hitShake: v.nullish(v.number(), 0),
		despawnShake: v.nullish(v.number(), 0),
		fragBullet: createBulletFieldSchema(value, context, "fragBullet"),
		delayFrags: v.nullish(v.boolean(), false),
		fragRandomSpread: v.nullish(v.number(), 360),
		fragSpread: v.nullish(v.number(), 0),
		fragAngle: v.nullish(v.number(), 0),
		fragBullets: v.nullish(v.number(), 9),
		fragVelocityMin: v.nullish(v.number(), 0.2),
		fragVelocityMax: v.nullish(v.number(), 1),
		fragLifeMin: v.nullish(v.number(), 1),
		fragLifeMax: v.nullish(v.number(), 1),
		fragOffsetMin: v.nullish(v.number(), 1),
		fragOffsetMax: v.nullish(v.number(), 7),
		pierceFragCap: v.nullish(v.number(), -1),
		intervalBullet: createBulletFieldSchema(value, context, "intervalBullet"),
		bulletInterval: v.nullish(v.number(), 20),
		intervalBullets: v.nullish(v.number(), 1),
		intervalRandomSpread: v.nullish(v.number(), 360),
		intervalSpread: v.nullish(v.number(), 0),
		intervalAngle: v.nullish(v.number(), 0),
		intervalDelay: v.nullish(v.number(), -1),
		underwater: v.nullish(v.boolean(), false),
		hitColor: v.nullish(MindustryHexColorSchema),
		healColor: v.nullish(MindustryHexColorSchema),
		healEffect: createEffectFieldSchema(value, context, "healEffect"),
		spawnBullets: createBulletArraySchema(value, context, "spawnBullets"),
		showStats: v.nullish(v.boolean(), false),
		spawnBulletRandomSpread: v.nullish(v.number(), 0),
		spawnUnit: createUnitFieldSchema(value, context),
		despawnUnit: createUnitFieldSchema(value, context),
		despawnUnitChance: v.nullish(v.number(), 1),
		despawnUnitCount: v.nullish(v.number(), 1),
		despawnUnitRadius: v.nullish(v.number(), 0.1),
		faceOutwards: v.nullish(v.boolean(), false),
		parts: createPartArraySchema(value, context),
		trailColor: v.nullish(MindustryHexColorSchema),
		trailChance: v.nullish(v.number(), -0.0001),
		trailInterval: v.nullish(v.number(), 0),
		trailMinVelocity: v.nullish(v.number(), 0),
		trailEffect: createEffectFieldSchema(value, context, "trailEffect"),
		trailSpread: v.nullish(v.number(), 0),
		trailParam: v.nullish(v.number(), 2),
		trailRotation: v.nullish(v.boolean(), false),
		trailInterp: v.nullish(v.picklist(Interps), "one"),
		trailLength: v.nullish(v.number(), -1),
		trailWidth: v.nullish(v.number(), 2),
		circleShooter: v.nullish(v.boolean(), false),
		circleShooterRadius: v.nullish(v.number(), 13),
		circleShooterRadiusSmooth: v.nullish(v.number(), 10),
		circleShooterRotateSpeed: v.nullish(v.number(), 0.3),
		splashDamageRadius: v.nullish(v.number(), -1),
		splashDamagePierce: v.nullish(v.boolean(), false),
		incendAmount: v.nullish(v.number(), 0),
		incendSpread: v.nullish(v.number(), 8),
		incendChance: v.nullish(v.number(), 1),
		homingPower: v.nullish(v.number(), 0),
		homingRange: v.nullish(v.number(), 50),
		homingDelay: v.nullish(v.number(), -1),
		followAimSpeed: v.nullish(v.number(), 0),
		suppressionRange: v.nullish(v.number(), -1),
		suppressionDuration: v.nullish(v.number(), 480),
		suppressionEffectChance: v.nullish(v.number(), 50),
		suppressColor: v.nullish(MindustryHexColorSchema),
		lightningColor: v.nullish(MindustryHexColorSchema),
		puddles: v.nullish(v.number(), 0),
		puddleRange: v.nullish(v.number(), 0),
		puddleAmount: v.nullish(v.number(), 5),
		puddleLiquid: createLiquidFieldSchema(value, context),
		lightning: v.nullish(v.number(), 0),
		lightningLength: v.nullish(v.number(), 5),
		lightningLengthRand: v.nullish(v.number(), 0),
		lightningDamage: v.nullish(v.number(), -1),
		lightningCone: v.nullish(v.number(), 360),
		lightningAngle: v.nullish(v.number(), 0),
		lightningType: createBulletFieldSchema(value, context, "lightningType"),
		weaveScale: v.nullish(v.number(), 1),
		weaveMag: v.nullish(v.number(), 0),
		weaveRandom: v.nullish(v.boolean(), true),
		rotateSpeed: v.nullish(v.number(), 0),
		displayAmmoMultiplier: v.nullish(v.boolean(), true),
		statLiquidConsumed: v.nullish(v.number(), 0),
		lightRadius: v.nullish(v.number(), -1),
		lightOpacity: v.nullish(v.number(), 0.3),
		lightColor: v.nullish(MindustryHexColorSchema),

		backColor: v.nullish(MindustryHexColorSchema),
		frontColor: v.nullish(MindustryHexColorSchema),
		width: v.nullish(v.number(), 5),
		height: v.nullish(v.number(), 7),
		shrinkX: v.nullish(v.number(), 0),
		shrinkY: v.nullish(v.number(), 0.5),
		spin: v.nullish(v.number(), 0),
		sprite: v.nullish(SpriteHjsonSchema(value.get("sprite"), context)),
		backSprite: v.nullish(v.string()),
		shrinkInterp: v.nullish(v.picklist(Interps), "linear"),
	});
}

const classSchemaMap: Record<BulletClass, SchemaFn<BulletObjectSchema>> = {
	ArtilleryBulletType: (_value, _context) =>
		v.object({
			trailMult: v.nullish(v.number(), 1),
			trailSize: v.nullish(v.number(), 4),
		}),
	BasicBulletType: (_value, _context) => v.object({}),
	BombBulletType: (_value, _context) => v.object({}),
	BulletType: (_value, _context) => v.object({}),
	ContinuousBulletType: (_value, _context) =>
		v.object({
			length: v.nullish(v.number(), 220),
			damageInterval: v.nullish(v.number(), 5),
			continuous: v.nullish(v.boolean(), true),
		}),
	ContinuousFlameBulletType: (_value, _context) => v.object({}),
	ContinuousLaserBulletType: (_value, _context) => v.object({}),
	EmpBulletType: (value, context) =>
		v.object({
			radius: v.nullish(v.number(), 100),
			timeIncrease: v.nullish(v.number(), 2.5),
			timeDuration: v.nullish(v.number(), 600),
			unitDamageScl: v.nullish(v.number(), 0.7),
			hitPowerEffect: createEffectFieldSchema(value, context, "hitPowerEffect"),
			hitUnits: v.nullish(v.boolean(), true),
			powerDamageScl: v.nullish(v.number(), 2),
			powerSclDecrease: v.nullish(v.number(), 0.2),
			chainEffect: createEffectFieldSchema(value, context, "chainEffect"),
			applyEffect: createEffectFieldSchema(value, context, "applyEffect"),
		}),
	EmptyBulletType: (_value, _context) => v.object({}),
	ExplosionBulletType: (_value, _context) => v.object({}),
	FireBulletType: (_value, _context) => v.object({}),
	FlakBulletType: (_value, _context) => v.object({}),
	InterceptorBulletType: (_value, _context) => v.object({}),
	LaserBoltBulletType: (_value, _context) => v.object({}),
	LaserBulletType: (_value, _context) =>
		v.object({
			length: v.nullish(v.number(), 160),
			width: v.nullish(v.number(), 15),
			lengthFalloff: v.nullish(v.number(), 0.5),
			sideLength: v.nullish(v.number(), 29),
			sideWidth: v.nullish(v.number(), 0.7),
			lightningSpacing: v.nullish(v.number(), -1),
		}),
	LightningBulletType: (_value, _context) => v.object({}),
	LiquidBulletType: (_value, _context) =>
		v.object({
			puddleSize: v.nullish(v.number(), 6),
			orbSize: v.nullish(v.number(), 3),
			boilTime: v.nullish(v.number(), 5),
		}),
	MassDriverBolt: (_value, _context) => v.object({}),
	MissileBulletType: (_value, _context) => v.object({}),
	MultiBulletType: (value, context) =>
		v.object({
			bullets: createBulletArraySchema(value, context, "bullets"),
			repeat: v.nullish(v.number(), 1),
		}),
	PointBulletType: (_value, _context) => v.object({}),
	PointLaserBulletType: (_value, _context) =>
		v.object({
			oscScl: v.nullish(v.number(), 2),
			oscMag: v.nullish(v.number(), 0.3),
			damageInterval: v.nullish(v.number(), 5),
		}),
	RailBulletType: (_value, _context) =>
		v.object({
			length: v.nullish(v.number(), 100),
			pointEffectSpace: v.nullish(v.number(), 20),
		}),
	SapBulletType: (_value, _context) =>
		v.object({
			length: v.nullish(v.number(), 100),
			sapStrength: v.nullish(v.number(), 0.5),
			color: v.nullish(MindustryHexColorSchema),
		}),
	ShrapnelBulletType: (_value, _context) =>
		v.object({
			length: v.nullish(v.number(), 100),
			width: v.nullish(v.number(), 20),
			serrations: v.nullish(v.number(), 7),
			serrationSpacing: v.nullish(v.number(), 8),
		}),
	SpaceLiquidBulletType: (_value, _context) => v.object({}),
};

function createBulletObjectSchema(value: Parameters<SchemaFn>[0], context: Parameters<SchemaFn>[1]) {
	return createBulletBaseObjectSchema(value, context);
}

export const BulletHjsonSchema: SchemaFn = (value, context) => {
	if (value.isObject()) {
		const type = value.get("type");

		if (type.isString() && classSchemaMap[type.valueOf() as BulletClass]) {
			const schema = classSchemaMap[type.valueOf() as BulletClass];
			return v.pipe(
				v.object({ ...createBulletObjectSchema(value, context).entries, ...schema(value, context).entries }),
				v.metadata(metadata),
			);
		}
	}

	return v.never("Bullet value must be an object: " + value.valueOf());
};
