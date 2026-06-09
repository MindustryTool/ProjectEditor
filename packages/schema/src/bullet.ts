import * as v from "valibot";
import { CachedSchema } from "./utils";
import { Interps } from "./interps";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { SoundHjsonSchema } from "./sound";
import type { SchemaFn } from "./utils";
import { EffectFieldSchema } from "./effect";
import { PartHjsonSchema } from "./part";
import { ShootPatternHjsonSchema } from "./shoot-pattern";
import { StatusFieldSchema } from "./status";
import { LiquidFieldSchema } from "./liquid";
import { metadata } from "./utils";
import { ClassMap, classSchema } from "./class";

const BulletUnitFieldSchema: SchemaFn = (context) =>
	v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.units.map((unit) => unit.name.replaceAll(context.name + "-", ""))),
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

const createBulletBaseObjectSchema: SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>> = (context) => {
	return v.object({
		type: classSchema(bulletTypes, "BasicBulletType"),
		lifetime: v.pipe(
			v.optional(v.number(), 40),
			metadata({
				name: "editor.bullet.lifetime",
				description: "editor.bullet.lifetime-description",
				category: "editor.bullet.category.core-stats",
			}),
		),
		lifeScaleRandMin: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.life-scale-rand-min",
				description: "editor.bullet.life-scale-rand-min-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		lifeScaleRandMax: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.life-scale-rand-max",
				description: "editor.bullet.life-scale-rand-max-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		speed: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.speed",
				description: "editor.bullet.speed-description",
				category: "editor.bullet.category.core-stats",
			}),
		),
		velocityScaleRandMin: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.velocity-scale-rand-min",
				description: "editor.bullet.velocity-scale-rand-min-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		velocityScaleRandMax: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.velocity-scale-rand-max",
				description: "editor.bullet.velocity-scale-rand-max-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		damage: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.damage",
				description: "editor.bullet.damage-description",
				category: "editor.bullet.category.core-stats",
			}),
		),
		sprite: v.pipe(
			v.optional(
				v.pipe(
					v.string(),
					v.transform((v) => v.replaceAll(context.name + "-", "")),
					v.picklist(context.sprites.map((sprite) => sprite.name.replaceAll(context.name + "-", ""))),
				),
			),
			metadata({
				name: "editor.bullet.sprite",
				description: "editor.bullet.sprite-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		hitSize: v.pipe(
			v.optional(v.number(), 4),
			metadata({
				name: "editor.bullet.hit-size",
				description: "editor.bullet.hit-size-description",
				category: "editor.bullet.category.core-stats",
			}),
		),
		drawSize: v.pipe(
			v.optional(v.number(), 40),
			metadata({
				name: "editor.bullet.draw-size",
				description: "editor.bullet.draw-size-description",
				category: "editor.bullet.category.core-stats",
			}),
		),
		angleOffset: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.angle-offset",
				description: "editor.bullet.angle-offset-description",
				category: "editor.bullet.category.physics",
			}),
		),
		randomAngleOffset: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.random-angle-offset",
				description: "editor.bullet.random-angle-offset-description",
				category: "editor.bullet.category.physics",
			}),
		),
		drag: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.drag",
				description: "editor.bullet.drag-description",
				category: "editor.bullet.category.physics",
			}),
		),
		accel: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.accel",
				description: "editor.bullet.accel-description",
				category: "editor.bullet.category.physics",
			}),
		),
		pierce: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.pierce",
				description: "editor.bullet.pierce-description",
				category: "editor.bullet.category.collision-piercing",
			}),
		),
		pierceBuilding: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.pierce-building",
				description: "editor.bullet.pierce-building-description",
				category: "editor.bullet.category.collision-piercing",
			}),
		),
		pierceCap: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.pierce-cap",
				description: "editor.bullet.pierce-cap-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "pierce", value: true },
			}),
		),
		pierceDamageFactor: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.pierce-damage-factor",
				description: "editor.bullet.pierce-damage-factor-description",
				category: "editor.bullet.category.damage",
				visibleWhen: { field: "pierce", value: true },
			}),
		),
		maxDamageFraction: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.max-damage-fraction",
				description: "editor.bullet.max-damage-fraction-description",
				category: "editor.bullet.category.core-stats",
			}),
		),
		removeAfterPierce: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.remove-after-pierce",
				description: "editor.bullet.remove-after-pierce-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "pierce", value: true },
			}),
		),
		laserAbsorb: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.laser-absorb",
				description: "editor.bullet.laser-absorb-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "pierce", value: true },
			}),
		),
		optimalLifeFract: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.optimal-life-fract",
				description: "editor.bullet.optimal-life-fract-description",
				category: "editor.bullet.category.core-stats",
			}),
		),
		layer: v.pipe(
			v.optional(v.number()),
			metadata({
				name: "editor.bullet.layer",
				description: "editor.bullet.layer-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		hitEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.bullet.hit-effect",
				description: "editor.bullet.hit-effect-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		despawnEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.bullet.despawn-effect",
				description: "editor.bullet.despawn-effect-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		shootEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.bullet.shoot-effect",
				description: "editor.bullet.shoot-effect-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		shootPattern: v.pipe(
			v.optional(ShootPatternHjsonSchema(context)),
			metadata({
				name: "editor.bullet.shoot-pattern",
				description: "editor.bullet.shoot-pattern-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		chargeEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.bullet.charge-effect",
				description: "editor.bullet.charge-effect-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		smokeEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.bullet.smoke-effect",
				description: "editor.bullet.smoke-effect-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		shootSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.bullet.shoot-sound",
				description: "editor.bullet.shoot-sound-description",
				category: "editor.bullet.category.audio",
			}),
		),
		hitSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.bullet.hit-sound",
				description: "editor.bullet.hit-sound-description",
				category: "editor.bullet.category.audio",
			}),
		),
		despawnSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.bullet.despawn-sound",
				description: "editor.bullet.despawn-sound-description",
				category: "editor.bullet.category.audio",
			}),
		),
		hitSoundPitch: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.hit-sound-pitch",
				description: "editor.bullet.hit-sound-pitch-description",
				category: "editor.bullet.category.audio",
			}),
		),
		hitSoundPitchRange: v.pipe(
			v.optional(v.number(), 0.1),
			metadata({
				name: "editor.bullet.hit-sound-pitch-range",
				description: "editor.bullet.hit-sound-pitch-range-description",
				category: "editor.bullet.category.audio",
			}),
		),
		hitSoundVolume: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.hit-sound-volume",
				description: "editor.bullet.hit-sound-volume-description",
				category: "editor.bullet.category.audio",
			}),
		),
		inaccuracy: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.inaccuracy",
				description: "editor.bullet.inaccuracy-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		ammoMultiplier: v.pipe(
			v.optional(v.number(), 2),
			metadata({
				name: "editor.bullet.ammo-multiplier",
				description: "editor.bullet.ammo-multiplier-description",
				category: "editor.bullet.category.turret",
			}),
		),
		reloadMultiplier: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.reload-multiplier",
				description: "editor.bullet.reload-multiplier-description",
				category: "editor.bullet.category.turret",
			}),
		),
		buildingDamageMultiplier: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.building-damage-multiplier",
				description: "editor.bullet.building-damage-multiplier-description",
				category: "editor.bullet.category.damage",
			}),
		),
		shieldDamageMultiplier: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.shield-damage-multiplier",
				description: "editor.bullet.shield-damage-multiplier-description",
				category: "editor.bullet.category.damage",
			}),
		),
		recoil: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.recoil",
				description: "editor.bullet.recoil-description",
				category: "editor.bullet.category.turret",
			}),
		),
		killShooter: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.kill-shooter",
				description: "editor.bullet.kill-shooter-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		instantDisappear: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.instant-disappear",
				description: "editor.bullet.instant-disappear-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		splashDamage: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.splash-damage",
				description: "editor.bullet.splash-damage-description",
				category: "editor.bullet.category.damage",
			}),
		),
		scaledSplashDamage: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.scaled-splash-damage",
				description: "editor.bullet.scaled-splash-damage-description",
				category: "editor.bullet.category.damage",
			}),
		),
		knockback: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.knockback",
				description: "editor.bullet.knockback-description",
				category: "editor.bullet.category.physics",
			}),
		),
		impact: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.impact",
				description: "editor.bullet.impact-description",
				category: "editor.bullet.category.physics",
			}),
		),
		status: v.pipe(
			v.optional(StatusFieldSchema(context)),
			metadata({
				name: "editor.bullet.status",
				description: "editor.bullet.status-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		statusDuration: v.pipe(
			v.optional(v.number(), 480),
			metadata({
				name: "editor.bullet.status-duration",
				description: "editor.bullet.status-duration-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		targetBlocks: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.target-blocks",
				description: "editor.bullet.target-blocks-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		targetMissiles: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.target-missiles",
				description: "editor.bullet.target-missiles-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		collidesTiles: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.collides-tiles",
				description: "editor.bullet.collides-tiles-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "collides", value: true },
			}),
		),
		collidesTeam: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.collides-team",
				description: "editor.bullet.collides-team-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "collides", value: true },
			}),
		),
		collidesAir: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.collides-air",
				description: "editor.bullet.collides-air-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "collides", value: true },
			}),
		),
		collidesGround: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.collides-ground",
				description: "editor.bullet.collides-ground-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "collides", value: true },
			}),
		),
		collides: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.collides",
				description: "editor.bullet.collides-description",
				category: "editor.bullet.category.collision-piercing",
			}),
		),
		collideFloor: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.collide-floor",
				description: "editor.bullet.collide-floor-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "collides", value: true },
			}),
		),
		collideTerrain: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.collide-terrain",
				description: "editor.bullet.collide-terrain-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "collides", value: true },
			}),
		),
		keepVelocity: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.keep-velocity",
				description: "editor.bullet.keep-velocity-description",
				category: "editor.bullet.category.physics",
			}),
		),
		scaleKeepVelocity: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.scale-keep-velocity",
				description: "editor.bullet.scale-keep-velocity-description",
				category: "editor.bullet.category.physics",
				visibleWhen: { field: "keepVelocity", value: true },
			}),
		),
		scaleLife: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.scale-life",
				description: "editor.bullet.scale-life-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		hittable: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.hittable",
				description: "editor.bullet.hittable-description",
				category: "editor.bullet.category.collision-piercing",
			}),
		),
		reflectable: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.reflectable",
				description: "editor.bullet.reflectable-description",
				category: "editor.bullet.category.collision-piercing",
			}),
		),
		absorbable: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.absorbable",
				description: "editor.bullet.absorbable-description",
				category: "editor.bullet.category.collision-piercing",
			}),
		),
		ignoreSpawnAngle: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.ignore-spawn-angle",
				description: "editor.bullet.ignore-spawn-angle-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		createChance: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.create-chance",
				description: "editor.bullet.create-chance-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		maxRange: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.max-range",
				description: "editor.bullet.max-range-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		rangeOverride: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.range-override",
				description: "editor.bullet.range-override-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		rangeChange: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.range-change",
				description: "editor.bullet.range-change-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		extraRangeMargin: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.extra-range-margin",
				description: "editor.bullet.extra-range-margin-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		range: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.range",
				description: "editor.bullet.range-description",
				category: "editor.bullet.category.core-stats",
			}),
		),
		minRangeChange: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.min-range-change",
				description: "editor.bullet.min-range-change-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		healPercent: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.heal-percent",
				description: "editor.bullet.heal-percent-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		healAmount: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.heal-amount",
				description: "editor.bullet.heal-amount-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		healSound: v.pipe(
			v.optional(SoundHjsonSchema),
			metadata({
				name: "editor.bullet.heal-sound",
				description: "editor.bullet.heal-sound-description",
				category: "editor.bullet.category.audio",
			}),
		),
		healSoundVolume: v.pipe(
			v.optional(v.number(), 0.9),
			metadata({
				name: "editor.bullet.heal-sound-volume",
				description: "editor.bullet.heal-sound-volume-description",
				category: "editor.bullet.category.audio",
			}),
		),
		lifesteal: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.lifesteal",
				description: "editor.bullet.lifesteal-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		makeFire: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.make-fire",
				description: "editor.bullet.make-fire-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		hitUnder: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.hit-under",
				description: "editor.bullet.hit-under-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		despawnHit: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.despawn-hit",
				description: "editor.bullet.despawn-hit-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		fragOnHit: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.frag-on-hit",
				description: "editor.bullet.frag-on-hit-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragOnDespawn: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.frag-on-despawn",
				description: "editor.bullet.frag-on-despawn-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragOnAbsorb: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.frag-on-absorb",
				description: "editor.bullet.frag-on-absorb-description",
				category: "editor.bullet.category.fragmentation",
				visibleWhen: { field: "absorbable", value: true },
			}),
		),
		pierceArmor: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.pierce-armor",
				description: "editor.bullet.pierce-armor-description",
				category: "editor.bullet.category.collision-piercing",
			}),
		),
		armorMultiplier: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.armor-multiplier",
				description: "editor.bullet.armor-multiplier-description",
				category: "editor.bullet.category.collision-piercing",
			}),
		),
		blockArmorMultiplier: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.block-armor-multiplier",
				description: "editor.bullet.block-armor-multiplier-description",
				category: "editor.bullet.category.collision-piercing",
			}),
		),
		sticky: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.sticky",
				description: "editor.bullet.sticky-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		stickyExtraLifetime: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.sticky-extra-lifetime",
				description: "editor.bullet.sticky-extra-lifetime-description",
				category: "editor.bullet.category.healing-status",
				visibleWhen: { field: "sticky", value: true },
			}),
		),
		setDefaults: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.set-defaults",
				description: "editor.bullet.set-defaults-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		hitShake: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.hit-shake",
				description: "editor.bullet.hit-shake-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		despawnShake: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.despawn-shake",
				description: "editor.bullet.despawn-shake-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		fragBullet: v.pipe(
			v.optional(BulletHjsonSchema(context)),
			metadata({
				name: "editor.bullet.frag-bullet",
				description: "editor.bullet.frag-bullet-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		delayFrags: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.delay-frags",
				description: "editor.bullet.delay-frags-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragRandomSpread: v.pipe(
			v.optional(v.number(), 360),
			metadata({
				name: "editor.bullet.frag-random-spread",
				description: "editor.bullet.frag-random-spread-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragSpread: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.frag-spread",
				description: "editor.bullet.frag-spread-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragAngle: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.frag-angle",
				description: "editor.bullet.frag-angle-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragBullets: v.pipe(
			v.optional(v.number(), 9),
			metadata({
				name: "editor.bullet.frag-bullets",
				description: "editor.bullet.frag-bullets-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragVelocityMin: v.pipe(
			v.optional(v.number(), 0.2),
			metadata({
				name: "editor.bullet.frag-velocity-min",
				description: "editor.bullet.frag-velocity-min-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragVelocityMax: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.frag-velocity-max",
				description: "editor.bullet.frag-velocity-max-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragLifeMin: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.frag-life-min",
				description: "editor.bullet.frag-life-min-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragLifeMax: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.frag-life-max",
				description: "editor.bullet.frag-life-max-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragOffsetMin: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.frag-offset-min",
				description: "editor.bullet.frag-offset-min-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		fragOffsetMax: v.pipe(
			v.optional(v.number(), 7),
			metadata({
				name: "editor.bullet.frag-offset-max",
				description: "editor.bullet.frag-offset-max-description",
				category: "editor.bullet.category.fragmentation",
			}),
		),
		pierceFragCap: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.pierce-frag-cap",
				description: "editor.bullet.pierce-frag-cap-description",
				category: "editor.bullet.category.collision-piercing",
				visibleWhen: { field: "pierce", value: true },
			}),
		),
		intervalBullet: v.pipe(
			v.optional(BulletHjsonSchema(context)),
			metadata({
				name: "editor.bullet.interval-bullet",
				description: "editor.bullet.interval-bullet-description",
				category: "editor.bullet.category.interval",
			}),
		),
		bulletInterval: v.pipe(
			v.optional(v.number(), 20),
			metadata({
				name: "editor.bullet.bullet-interval",
				description: "editor.bullet.bullet-interval-description",
				category: "editor.bullet.category.interval",
			}),
		),
		intervalBullets: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.interval-bullets",
				description: "editor.bullet.interval-bullets-description",
				category: "editor.bullet.category.interval",
			}),
		),
		intervalRandomSpread: v.pipe(
			v.optional(v.number(), 360),
			metadata({
				name: "editor.bullet.interval-random-spread",
				description: "editor.bullet.interval-random-spread-description",
				category: "editor.bullet.category.interval",
			}),
		),
		intervalSpread: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.interval-spread",
				description: "editor.bullet.interval-spread-description",
				category: "editor.bullet.category.interval",
			}),
		),
		intervalAngle: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.interval-angle",
				description: "editor.bullet.interval-angle-description",
				category: "editor.bullet.category.interval",
			}),
		),
		intervalDelay: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.interval-delay",
				description: "editor.bullet.interval-delay-description",
				category: "editor.bullet.category.interval",
			}),
		),
		underwater: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.underwater",
				description: "editor.bullet.underwater-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		hitColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({
				name: "editor.bullet.hit-color",
				description: "editor.bullet.hit-color-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		healColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({
				name: "editor.bullet.heal-color",
				description: "editor.bullet.heal-color-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		healEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.bullet.heal-effect",
				description: "editor.bullet.heal-effect-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		spawnBullets: v.pipe(
			v.optional(v.array(BulletHjsonSchema(context)), []),
			metadata({
				name: "editor.bullet.spawn-bullets",
				description: "editor.bullet.spawn-bullets-description",
				category: "editor.bullet.category.spawn-parts",
			}),
		),
		showStats: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.show-stats",
				description: "editor.bullet.show-stats-description",
				category: "editor.bullet.category.spawn-parts",
			}),
		),
		spawnBulletRandomSpread: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.spawn-bullet-random-spread",
				description: "editor.bullet.spawn-bullet-random-spread-description",
				category: "editor.bullet.category.spawn-parts",
			}),
		),
		spawnUnit: v.pipe(
			v.optional(BulletUnitFieldSchema(context)),
			metadata({
				name: "editor.bullet.spawn-unit",
				description: "editor.bullet.spawn-unit-description",
				category: "editor.bullet.category.spawn-parts",
			}),
		),
		despawnUnit: v.pipe(
			v.optional(BulletUnitFieldSchema(context)),
			metadata({
				name: "editor.bullet.despawn-unit",
				description: "editor.bullet.despawn-unit-description",
				category: "editor.bullet.category.spawn-parts",
			}),
		),
		despawnUnitChance: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.despawn-unit-chance",
				description: "editor.bullet.despawn-unit-chance-description",
				category: "editor.bullet.category.spawn-parts",
			}),
		),
		despawnUnitCount: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.despawn-unit-count",
				description: "editor.bullet.despawn-unit-count-description",
				category: "editor.bullet.category.spawn-parts",
			}),
		),
		despawnUnitRadius: v.pipe(
			v.optional(v.number(), 0.1),
			metadata({
				name: "editor.bullet.despawn-unit-radius",
				description: "editor.bullet.despawn-unit-radius-description",
				category: "editor.bullet.category.spawn-parts",
			}),
		),
		faceOutwards: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.face-outwards",
				description: "editor.bullet.face-outwards-description",
				category: "editor.bullet.category.spawn-parts",
			}),
		),
		parts: v.pipe(
			v.optional(v.array(PartHjsonSchema(context)), []),
			metadata({
				name: "editor.bullet.parts",
				description: "editor.bullet.parts-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({
				name: "editor.bullet.trail-color",
				description: "editor.bullet.trail-color-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailChance: v.pipe(
			v.optional(v.number(), -0.0001),
			metadata({
				name: "editor.bullet.trail-chance",
				description: "editor.bullet.trail-chance-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailInterval: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.trail-interval",
				description: "editor.bullet.trail-interval-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailMinVelocity: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.trail-min-velocity",
				description: "editor.bullet.trail-min-velocity-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.bullet.trail-effect",
				description: "editor.bullet.trail-effect-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailSpread: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.trail-spread",
				description: "editor.bullet.trail-spread-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailParam: v.pipe(
			v.optional(v.number(), 2),
			metadata({
				name: "editor.bullet.trail-param",
				description: "editor.bullet.trail-param-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailRotation: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.trail-rotation",
				description: "editor.bullet.trail-rotation-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailInterp: v.pipe(
			v.optional(v.picklist(Interps), "one"),
			metadata({
				name: "editor.bullet.trail-interp",
				description: "editor.bullet.trail-interp-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailLength: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.trail-length",
				description: "editor.bullet.trail-length-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		trailWidth: v.pipe(
			v.optional(v.number(), 2),
			metadata({
				name: "editor.bullet.trail-width",
				description: "editor.bullet.trail-width-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		circleShooter: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.circle-shooter",
				description: "editor.bullet.circle-shooter-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		circleShooterRadius: v.pipe(
			v.optional(v.number(), 13),
			metadata({
				name: "editor.bullet.circle-shooter-radius",
				description: "editor.bullet.circle-shooter-radius-description",
				category: "editor.bullet.category.targeting",
				visibleWhen: { field: "circleShooter", value: true },
			}),
		),
		circleShooterRadiusSmooth: v.pipe(
			v.optional(v.number(), 10),
			metadata({
				name: "editor.bullet.circle-shooter-radius-smooth",
				description: "editor.bullet.circle-shooter-radius-smooth-description",
				category: "editor.bullet.category.targeting",
				visibleWhen: { field: "circleShooter", value: true },
			}),
		),
		circleShooterRotateSpeed: v.pipe(
			v.optional(v.number(), 0.3),
			metadata({
				name: "editor.bullet.circle-shooter-rotate-speed",
				description: "editor.bullet.circle-shooter-rotate-speed-description",
				category: "editor.bullet.category.targeting",
				visibleWhen: { field: "circleShooter", value: true },
			}),
		),
		splashDamageRadius: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.splash-damage-radius",
				description: "editor.bullet.splash-damage-radius-description",
				category: "editor.bullet.category.damage",
			}),
		),
		splashDamagePierce: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.bullet.splash-damage-pierce",
				description: "editor.bullet.splash-damage-pierce-description",
				category: "editor.bullet.category.damage",
			}),
		),
		incendAmount: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.incend-amount",
				description: "editor.bullet.incend-amount-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		incendSpread: v.pipe(
			v.optional(v.number(), 8),
			metadata({
				name: "editor.bullet.incend-spread",
				description: "editor.bullet.incend-spread-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		incendChance: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.incend-chance",
				description: "editor.bullet.incend-chance-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		homingPower: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.homing-power",
				description: "editor.bullet.homing-power-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		homingRange: v.pipe(
			v.optional(v.number(), 50),
			metadata({
				name: "editor.bullet.homing-range",
				description: "editor.bullet.homing-range-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		homingDelay: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.homing-delay",
				description: "editor.bullet.homing-delay-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		followAimSpeed: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.follow-aim-speed",
				description: "editor.bullet.follow-aim-speed-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		suppressionRange: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.suppression-range",
				description: "editor.bullet.suppression-range-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		suppressionDuration: v.pipe(
			v.optional(v.number(), 480),
			metadata({
				name: "editor.bullet.suppression-duration",
				description: "editor.bullet.suppression-duration-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		suppressionEffectChance: v.pipe(
			v.optional(v.number(), 50),
			metadata({
				name: "editor.bullet.suppression-effect-chance",
				description: "editor.bullet.suppression-effect-chance-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		suppressColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({
				name: "editor.bullet.suppress-color",
				description: "editor.bullet.suppress-color-description",
				category: "editor.bullet.category.healing-status",
			}),
		),
		lightningColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({
				name: "editor.bullet.lightning-color",
				description: "editor.bullet.lightning-color-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		puddles: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.puddles",
				description: "editor.bullet.puddles-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		puddleRange: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.puddle-range",
				description: "editor.bullet.puddle-range-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		puddleAmount: v.pipe(
			v.optional(v.number(), 5),
			metadata({
				name: "editor.bullet.puddle-amount",
				description: "editor.bullet.puddle-amount-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		puddleLiquid: v.pipe(
			v.optional(LiquidFieldSchema(context)),
			metadata({
				name: "editor.bullet.puddle-liquid",
				description: "editor.bullet.puddle-liquid-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		lightning: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.lightning",
				description: "editor.bullet.lightning-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		lightningLength: v.pipe(
			v.optional(v.number(), 5),
			metadata({
				name: "editor.bullet.lightning-length",
				description: "editor.bullet.lightning-length-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		lightningLengthRand: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.lightning-length-rand",
				description: "editor.bullet.lightning-length-rand-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		lightningDamage: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.lightning-damage",
				description: "editor.bullet.lightning-damage-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		lightningCone: v.pipe(
			v.optional(v.number(), 360),
			metadata({
				name: "editor.bullet.lightning-cone",
				description: "editor.bullet.lightning-cone-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		lightningAngle: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.lightning-angle",
				description: "editor.bullet.lightning-angle-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		lightningType: v.pipe(
			v.optional(BulletHjsonSchema(context)),
			metadata({
				name: "editor.bullet.lightning-type",
				description: "editor.bullet.lightning-type-description",
				category: "editor.bullet.category.lightning-fire-puddles",
			}),
		),
		weaveScale: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.bullet.weave-scale",
				description: "editor.bullet.weave-scale-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		weaveMag: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.weave-mag",
				description: "editor.bullet.weave-mag-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		weaveRandom: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.weave-random",
				description: "editor.bullet.weave-random-description",
				category: "editor.bullet.category.targeting",
			}),
		),
		rotateSpeed: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.rotate-speed",
				description: "editor.bullet.rotate-speed-description",
				category: "editor.bullet.category.physics",
			}),
		),
		displayAmmoMultiplier: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.bullet.display-ammo-multiplier",
				description: "editor.bullet.display-ammo-multiplier-description",
				category: "editor.bullet.category.turret",
			}),
		),
		statLiquidConsumed: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.stat-liquid-consumed",
				description: "editor.bullet.stat-liquid-consumed-description",
				category: "editor.bullet.category.behavior",
			}),
		),
		lightRadius: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.bullet.light-radius",
				description: "editor.bullet.light-radius-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		lightOpacity: v.pipe(
			v.optional(v.number(), 0.3),
			metadata({
				name: "editor.bullet.light-opacity",
				description: "editor.bullet.light-opacity-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		lightColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({
				name: "editor.bullet.light-color",
				description: "editor.bullet.light-color-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		backColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({
				name: "editor.bullet.back-color",
				description: "editor.bullet.back-color-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		frontColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({
				name: "editor.bullet.front-color",
				description: "editor.bullet.front-color-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		width: v.pipe(
			v.optional(v.number(), 5),
			metadata({
				name: "editor.bullet.width",
				description: "editor.bullet.width-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		height: v.pipe(
			v.optional(v.number(), 7),
			metadata({
				name: "editor.bullet.height",
				description: "editor.bullet.height-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		shrinkX: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.shrink-x",
				description: "editor.bullet.shrink-x-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		shrinkY: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({
				name: "editor.bullet.shrink-y",
				description: "editor.bullet.shrink-y-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		spin: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.bullet.spin",
				description: "editor.bullet.spin-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		backSprite: v.pipe(
			v.optional(v.string()),
			metadata({
				name: "editor.bullet.back-sprite",
				description: "editor.bullet.back-sprite-description",
				category: "editor.bullet.category.visuals",
			}),
		),
		shrinkInterp: v.pipe(
			v.optional(v.picklist(Interps), "linear"),
			metadata({
				name: "editor.bullet.shrink-interp",
				description: "editor.bullet.shrink-interp-description",
				category: "editor.bullet.category.visuals",
			}),
		),
	});
};

const classSchemaMap = new ClassMap<BulletClass>({
	ArtilleryBulletType: (_context) =>
		v.object({
			trailMult: v.optional(v.number(), 1),
			trailSize: v.optional(v.number(), 4),
		}),
	BasicBulletType: (_context) => v.object({}),
	BombBulletType: (_context) => v.object({}),
	BulletType: (_context) => v.object({}),
	ContinuousBulletType: (_context) =>
		v.object({
			length: v.optional(v.number(), 220),
			damageInterval: v.optional(v.number(), 5),
			continuous: v.optional(v.boolean(), true),
		}),
	ContinuousFlameBulletType: (_context) => v.object({}),
	ContinuousLaserBulletType: (_context) => v.object({}),
	EmpBulletType: (context) =>
		v.object({
			radius: v.optional(v.number(), 100),
			timeIncrease: v.optional(v.number(), 2.5),
			timeDuration: v.optional(v.number(), 600),
			unitDamageScl: v.optional(v.number(), 0.7),
			hitPowerEffect: v.optional(EffectFieldSchema(context)),
			hitUnits: v.optional(v.boolean(), true),
			powerDamageScl: v.optional(v.number(), 2),
			powerSclDecrease: v.optional(v.number(), 0.2),
			chainEffect: v.optional(EffectFieldSchema(context)),
			applyEffect: v.optional(EffectFieldSchema(context)),
		}),
	EmptyBulletType: (_context) => v.object({}),
	ExplosionBulletType: (_context) => v.object({}),
	FireBulletType: (_context) => v.object({}),
	FlakBulletType: (_context) => v.object({}),
	InterceptorBulletType: (_context) => v.object({}),
	LaserBoltBulletType: (_context) => v.object({}),
	LaserBulletType: (_context) =>
		v.object({
			length: v.optional(v.number(), 160),
			width: v.optional(v.number(), 15),
			lengthFalloff: v.optional(v.number(), 0.5),
			sideLength: v.optional(v.number(), 29),
			sideWidth: v.optional(v.number(), 0.7),
			lightningSpacing: v.optional(v.number(), -1),
			colors: v.optional(v.array(MindustryHexColorSchema)),
		}),
	LightningBulletType: (_context) => v.object({}),
	LiquidBulletType: (_context) =>
		v.object({
			puddleSize: v.optional(v.number(), 6),
			orbSize: v.optional(v.number(), 3),
			boilTime: v.optional(v.number(), 5),
		}),
	MassDriverBolt: (_context) => v.object({}),
	MissileBulletType: (_context) => v.object({}),
	MultiBulletType: (context) =>
		v.object({
			bullets: v.array(BulletHjsonSchema(context)),
			repeat: v.optional(v.number(), 1),
		}),
	PointBulletType: (_context) => v.object({}),
	PointLaserBulletType: (_context) =>
		v.object({
			oscScl: v.optional(v.number(), 2),
			oscMag: v.optional(v.number(), 0.3),
			damageInterval: v.optional(v.number(), 5),
		}),
	RailBulletType: (_context) =>
		v.object({
			length: v.optional(v.number(), 100),
			pointEffectSpace: v.optional(v.number(), 20),
		}),
	SapBulletType: (_context) =>
		v.object({
			length: v.optional(v.number(), 100),
			sapStrength: v.optional(v.number(), 0.5),
			color: v.optional(MindustryHexColorSchema),
		}),
	ShrapnelBulletType: (_context) =>
		v.object({
			length: v.optional(v.number(), 100),
			width: v.optional(v.number(), 20),
			serrations: v.optional(v.number(), 7),
			serrationSpacing: v.optional(v.number(), 8),
		}),
	SpaceLiquidBulletType: (_context) => v.object({}),
});

export const BulletHjsonSchema: SchemaFn = CachedSchema((context) => {
	return v.lazy((input) => {
		const variant = classSchemaMap.get(input, context);

		return v.pipe(v.object({ ...createBulletBaseObjectSchema(context).entries, ...variant }), metadata({ type: "bullet" }));
	});
});
