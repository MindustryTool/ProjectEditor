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
import { unlockableContentSchema } from "./content";
import { Order } from "./order";

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

const createBulletBaseObjectSchema: SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>> = CachedSchema(
	(context) => {
		return v.object({
			...unlockableContentSchema,
			type: v.pipe(classSchema(bulletTypes, "BasicBulletType"), metadata({ order: Order.TYPE })),
			lifetime: v.pipe(
				v.optional(v.number(), 40),
				metadata({
					name: "editor.bullet.lifetime",
					description: "editor.bullet.lifetime-description",
				}),
			),
			lifeScaleRandMin: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.life-scale-rand-min",
					description: "editor.bullet.life-scale-rand-min-description",
				}),
			),
			lifeScaleRandMax: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.life-scale-rand-max",
					description: "editor.bullet.life-scale-rand-max-description",
				}),
			),
			speed: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.speed",
					description: "editor.bullet.speed-description",
				}),
			),
			velocityScaleRandMin: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.velocity-scale-rand-min",
					description: "editor.bullet.velocity-scale-rand-min-description",
				}),
			),
			velocityScaleRandMax: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.velocity-scale-rand-max",
					description: "editor.bullet.velocity-scale-rand-max-description",
				}),
			),
			damage: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.damage",
					description: "editor.bullet.damage-description",
				}),
			),
			hitSize: v.pipe(
				v.optional(v.number(), 4),
				metadata({
					name: "editor.bullet.hit-size",
					description: "editor.bullet.hit-size-description",
				}),
			),
			drawSize: v.pipe(
				v.optional(v.number(), 40),
				metadata({
					name: "editor.bullet.draw-size",
					description: "editor.bullet.draw-size-description",
				}),
			),
			angleOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.angle-offset",
					description: "editor.bullet.angle-offset-description",
				}),
			),
			randomAngleOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.random-angle-offset",
					description: "editor.bullet.random-angle-offset-description",
				}),
			),
			drag: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.drag",
					description: "editor.bullet.drag-description",
				}),
			),
			accel: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.accel",
					description: "editor.bullet.accel-description",
				}),
			),
			pierce: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.pierce",
					description: "editor.bullet.pierce-description",
				}),
			),
			pierceBuilding: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.pierce-building",
					description: "editor.bullet.pierce-building-description",
				}),
			),
			pierceCap: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.pierce-cap",
					description: "editor.bullet.pierce-cap-description",
					visibleWhen: { field: "pierce", value: true },
				}),
			),
			pierceDamageFactor: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.pierce-damage-factor",
					description: "editor.bullet.pierce-damage-factor-description",
					visibleWhen: { field: "pierce", value: true },
				}),
			),
			maxDamageFraction: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.max-damage-fraction",
					description: "editor.bullet.max-damage-fraction-description",
				}),
			),
			removeAfterPierce: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.remove-after-pierce",
					description: "editor.bullet.remove-after-pierce-description",
					visibleWhen: { field: "pierce", value: true },
				}),
			),
			laserAbsorb: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.laser-absorb",
					description: "editor.bullet.laser-absorb-description",
					visibleWhen: { field: "pierce", value: true },
				}),
			),
			optimalLifeFract: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.optimal-life-fract",
					description: "editor.bullet.optimal-life-fract-description",
				}),
			),
			layer: v.pipe(
				v.optional(v.number()),
				metadata({
					name: "editor.bullet.layer",
					description: "editor.bullet.layer-description",
				}),
			),
			hitEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.bullet.hit-effect",
					description: "editor.bullet.hit-effect-description",
				}),
			),
			despawnEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.bullet.despawn-effect",
					description: "editor.bullet.despawn-effect-description",
				}),
			),
			shootEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.bullet.shoot-effect",
					description: "editor.bullet.shoot-effect-description",
				}),
			),
			shootPattern: v.pipe(
				v.optional(ShootPatternHjsonSchema(context)),
				metadata({
					name: "editor.bullet.shoot-pattern",
					description: "editor.bullet.shoot-pattern-description",
				}),
			),
			chargeEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.bullet.charge-effect",
					description: "editor.bullet.charge-effect-description",
				}),
			),
			smokeEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.bullet.smoke-effect",
					description: "editor.bullet.smoke-effect-description",
				}),
			),
			shootSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({
					name: "editor.bullet.shoot-sound",
					description: "editor.bullet.shoot-sound-description",
				}),
			),
			hitSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({
					name: "editor.bullet.hit-sound",
					description: "editor.bullet.hit-sound-description",
				}),
			),
			despawnSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({
					name: "editor.bullet.despawn-sound",
					description: "editor.bullet.despawn-sound-description",
				}),
			),
			hitSoundPitch: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.hit-sound-pitch",
					description: "editor.bullet.hit-sound-pitch-description",
				}),
			),
			hitSoundPitchRange: v.pipe(
				v.optional(v.number(), 0.1),
				metadata({
					name: "editor.bullet.hit-sound-pitch-range",
					description: "editor.bullet.hit-sound-pitch-range-description",
				}),
			),
			hitSoundVolume: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.hit-sound-volume",
					description: "editor.bullet.hit-sound-volume-description",
				}),
			),
			inaccuracy: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.inaccuracy",
					description: "editor.bullet.inaccuracy-description",
				}),
			),
			ammoMultiplier: v.pipe(
				v.optional(v.number(), 2),
				metadata({
					name: "editor.bullet.ammo-multiplier",
					description: "editor.bullet.ammo-multiplier-description",
				}),
			),
			reloadMultiplier: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.reload-multiplier",
					description: "editor.bullet.reload-multiplier-description",
				}),
			),
			buildingDamageMultiplier: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.building-damage-multiplier",
					description: "editor.bullet.building-damage-multiplier-description",
				}),
			),
			shieldDamageMultiplier: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.shield-damage-multiplier",
					description: "editor.bullet.shield-damage-multiplier-description",
				}),
			),
			recoil: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.recoil",
					description: "editor.bullet.recoil-description",
				}),
			),
			killShooter: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.kill-shooter",
					description: "editor.bullet.kill-shooter-description",
				}),
			),
			instantDisappear: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.instant-disappear",
					description: "editor.bullet.instant-disappear-description",
				}),
			),
			splashDamage: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.splash-damage",
					description: "editor.bullet.splash-damage-description",
				}),
			),
			scaledSplashDamage: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.scaled-splash-damage",
					description: "editor.bullet.scaled-splash-damage-description",
				}),
			),
			knockback: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.knockback",
					description: "editor.bullet.knockback-description",
				}),
			),
			impact: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.impact",
					description: "editor.bullet.impact-description",
				}),
			),
			status: v.pipe(
				v.optional(StatusFieldSchema(context)),
				metadata({
					name: "editor.bullet.status",
					description: "editor.bullet.status-description",
				}),
			),
			statusDuration: v.pipe(
				v.optional(v.number(), 480),
				metadata({
					name: "editor.bullet.status-duration",
					description: "editor.bullet.status-duration-description",
				}),
			),
			targetBlocks: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.target-blocks",
					description: "editor.bullet.target-blocks-description",
				}),
			),
			targetMissiles: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.target-missiles",
					description: "editor.bullet.target-missiles-description",
				}),
			),
			collidesTiles: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.collides-tiles",
					description: "editor.bullet.collides-tiles-description",
					visibleWhen: { field: "collides", value: true },
				}),
			),
			collidesTeam: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.collides-team",
					description: "editor.bullet.collides-team-description",
					visibleWhen: { field: "collides", value: true },
				}),
			),
			collidesAir: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.collides-air",
					description: "editor.bullet.collides-air-description",
					visibleWhen: { field: "collides", value: true },
				}),
			),
			collidesGround: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.collides-ground",
					description: "editor.bullet.collides-ground-description",
					visibleWhen: { field: "collides", value: true },
				}),
			),
			collides: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.collides",
					description: "editor.bullet.collides-description",
				}),
			),
			collideFloor: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.collide-floor",
					description: "editor.bullet.collide-floor-description",
					visibleWhen: { field: "collides", value: true },
				}),
			),
			collideTerrain: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.collide-terrain",
					description: "editor.bullet.collide-terrain-description",
					visibleWhen: { field: "collides", value: true },
				}),
			),
			keepVelocity: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.keep-velocity",
					description: "editor.bullet.keep-velocity-description",
				}),
			),
			scaleKeepVelocity: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.scale-keep-velocity",
					description: "editor.bullet.scale-keep-velocity-description",
					visibleWhen: { field: "keepVelocity", value: true },
				}),
			),
			scaleLife: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.scale-life",
					description: "editor.bullet.scale-life-description",
				}),
			),
			hittable: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.hittable",
					description: "editor.bullet.hittable-description",
				}),
			),
			reflectable: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.reflectable",
					description: "editor.bullet.reflectable-description",
				}),
			),
			absorbable: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.absorbable",
					description: "editor.bullet.absorbable-description",
				}),
			),
			ignoreSpawnAngle: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.ignore-spawn-angle",
					description: "editor.bullet.ignore-spawn-angle-description",
				}),
			),
			createChance: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.create-chance",
					description: "editor.bullet.create-chance-description",
				}),
			),
			maxRange: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.max-range",
					description: "editor.bullet.max-range-description",
				}),
			),
			rangeOverride: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.range-override",
					description: "editor.bullet.range-override-description",
				}),
			),
			rangeChange: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.range-change",
					description: "editor.bullet.range-change-description",
				}),
			),
			extraRangeMargin: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.extra-range-margin",
					description: "editor.bullet.extra-range-margin-description",
				}),
			),
			range: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.range",
					description: "editor.bullet.range-description",
				}),
			),
			minRangeChange: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.min-range-change",
					description: "editor.bullet.min-range-change-description",
				}),
			),
			healPercent: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.heal-percent",
					description: "editor.bullet.heal-percent-description",
				}),
			),
			healAmount: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.heal-amount",
					description: "editor.bullet.heal-amount-description",
				}),
			),
			healSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({
					name: "editor.bullet.heal-sound",
					description: "editor.bullet.heal-sound-description",
				}),
			),
			healSoundVolume: v.pipe(
				v.optional(v.number(), 0.9),
				metadata({
					name: "editor.bullet.heal-sound-volume",
					description: "editor.bullet.heal-sound-volume-description",
				}),
			),
			lifesteal: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.lifesteal",
					description: "editor.bullet.lifesteal-description",
				}),
			),
			makeFire: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.make-fire",
					description: "editor.bullet.make-fire-description",
				}),
			),
			hitUnder: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.hit-under",
					description: "editor.bullet.hit-under-description",
				}),
			),
			despawnHit: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.despawn-hit",
					description: "editor.bullet.despawn-hit-description",
				}),
			),
			fragOnHit: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.frag-on-hit",
					description: "editor.bullet.frag-on-hit-description",
				}),
			),
			fragOnDespawn: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.frag-on-despawn",
					description: "editor.bullet.frag-on-despawn-description",
				}),
			),
			fragOnAbsorb: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.frag-on-absorb",
					description: "editor.bullet.frag-on-absorb-description",
					visibleWhen: { field: "absorbable", value: true },
				}),
			),
			pierceArmor: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.pierce-armor",
					description: "editor.bullet.pierce-armor-description",
				}),
			),
			armorMultiplier: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.armor-multiplier",
					description: "editor.bullet.armor-multiplier-description",
				}),
			),
			blockArmorMultiplier: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.block-armor-multiplier",
					description: "editor.bullet.block-armor-multiplier-description",
				}),
			),
			sticky: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.sticky",
					description: "editor.bullet.sticky-description",
				}),
			),
			stickyExtraLifetime: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.sticky-extra-lifetime",
					description: "editor.bullet.sticky-extra-lifetime-description",
					visibleWhen: { field: "sticky", value: true },
				}),
			),
			setDefaults: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.set-defaults",
					description: "editor.bullet.set-defaults-description",
				}),
			),
			hitShake: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.hit-shake",
					description: "editor.bullet.hit-shake-description",
				}),
			),
			despawnShake: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.despawn-shake",
					description: "editor.bullet.despawn-shake-description",
				}),
			),
			fragBullet: v.pipe(
				v.optional(BulletHjsonSchema(context)),
				metadata({
					name: "editor.bullet.frag-bullet",
					description: "editor.bullet.frag-bullet-description",
				}),
			),
			delayFrags: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.delay-frags",
					description: "editor.bullet.delay-frags-description",
				}),
			),
			fragRandomSpread: v.pipe(
				v.optional(v.number(), 360),
				metadata({
					name: "editor.bullet.frag-random-spread",
					description: "editor.bullet.frag-random-spread-description",
				}),
			),
			fragSpread: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.frag-spread",
					description: "editor.bullet.frag-spread-description",
				}),
			),
			fragAngle: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.frag-angle",
					description: "editor.bullet.frag-angle-description",
				}),
			),
			fragBullets: v.pipe(
				v.optional(v.number(), 9),
				metadata({
					name: "editor.bullet.frag-bullets",
					description: "editor.bullet.frag-bullets-description",
				}),
			),
			fragVelocityMin: v.pipe(
				v.optional(v.number(), 0.2),
				metadata({
					name: "editor.bullet.frag-velocity-min",
					description: "editor.bullet.frag-velocity-min-description",
				}),
			),
			fragVelocityMax: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.frag-velocity-max",
					description: "editor.bullet.frag-velocity-max-description",
				}),
			),
			fragLifeMin: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.frag-life-min",
					description: "editor.bullet.frag-life-min-description",
				}),
			),
			fragLifeMax: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.frag-life-max",
					description: "editor.bullet.frag-life-max-description",
				}),
			),
			fragOffsetMin: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.frag-offset-min",
					description: "editor.bullet.frag-offset-min-description",
				}),
			),
			fragOffsetMax: v.pipe(
				v.optional(v.number(), 7),
				metadata({
					name: "editor.bullet.frag-offset-max",
					description: "editor.bullet.frag-offset-max-description",
				}),
			),
			pierceFragCap: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.pierce-frag-cap",
					description: "editor.bullet.pierce-frag-cap-description",
					visibleWhen: { field: "pierce", value: true },
				}),
			),
			intervalBullet: v.pipe(
				v.optional(BulletHjsonSchema(context)),
				metadata({
					name: "editor.bullet.interval-bullet",
					description: "editor.bullet.interval-bullet-description",
				}),
			),
			bulletInterval: v.pipe(
				v.optional(v.number(), 20),
				metadata({
					name: "editor.bullet.bullet-interval",
					description: "editor.bullet.bullet-interval-description",
				}),
			),
			intervalBullets: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.interval-bullets",
					description: "editor.bullet.interval-bullets-description",
				}),
			),
			intervalRandomSpread: v.pipe(
				v.optional(v.number(), 360),
				metadata({
					name: "editor.bullet.interval-random-spread",
					description: "editor.bullet.interval-random-spread-description",
				}),
			),
			intervalSpread: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.interval-spread",
					description: "editor.bullet.interval-spread-description",
				}),
			),
			intervalAngle: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.interval-angle",
					description: "editor.bullet.interval-angle-description",
				}),
			),
			intervalDelay: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.interval-delay",
					description: "editor.bullet.interval-delay-description",
				}),
			),
			underwater: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.underwater",
					description: "editor.bullet.underwater-description",
				}),
			),
			hitColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({
					name: "editor.bullet.hit-color",
					description: "editor.bullet.hit-color-description",
				}),
			),
			healColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({
					name: "editor.bullet.heal-color",
					description: "editor.bullet.heal-color-description",
				}),
			),
			healEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.bullet.heal-effect",
					description: "editor.bullet.heal-effect-description",
				}),
			),
			spawnBullets: v.pipe(
				v.optional(v.array(BulletHjsonSchema(context)), []),
				metadata({
					name: "editor.bullet.spawn-bullets",
					description: "editor.bullet.spawn-bullets-description",
				}),
			),
			showStats: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.show-stats",
					description: "editor.bullet.show-stats-description",
				}),
			),
			spawnBulletRandomSpread: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.spawn-bullet-random-spread",
					description: "editor.bullet.spawn-bullet-random-spread-description",
				}),
			),
			spawnUnit: v.pipe(
				v.optional(BulletUnitFieldSchema(context)),
				metadata({
					name: "editor.bullet.spawn-unit",
					description: "editor.bullet.spawn-unit-description",
				}),
			),
			despawnUnit: v.pipe(
				v.optional(BulletUnitFieldSchema(context)),
				metadata({
					name: "editor.bullet.despawn-unit",
					description: "editor.bullet.despawn-unit-description",
				}),
			),
			despawnUnitChance: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.despawn-unit-chance",
					description: "editor.bullet.despawn-unit-chance-description",
				}),
			),
			despawnUnitCount: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.despawn-unit-count",
					description: "editor.bullet.despawn-unit-count-description",
				}),
			),
			despawnUnitRadius: v.pipe(
				v.optional(v.number(), 0.1),
				metadata({
					name: "editor.bullet.despawn-unit-radius",
					description: "editor.bullet.despawn-unit-radius-description",
				}),
			),
			faceOutwards: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.face-outwards",
					description: "editor.bullet.face-outwards-description",
				}),
			),
			parts: v.pipe(
				v.optional(v.array(PartHjsonSchema(context)), []),
				metadata({
					name: "editor.bullet.parts",
					description: "editor.bullet.parts-description",
				}),
			),
			trailColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({
					name: "editor.bullet.trail-color",
					description: "editor.bullet.trail-color-description",
				}),
			),
			trailChance: v.pipe(
				v.optional(v.number(), -0.0001),
				metadata({
					name: "editor.bullet.trail-chance",
					description: "editor.bullet.trail-chance-description",
				}),
			),
			trailInterval: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.trail-interval",
					description: "editor.bullet.trail-interval-description",
				}),
			),
			trailMinVelocity: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.trail-min-velocity",
					description: "editor.bullet.trail-min-velocity-description",
				}),
			),
			trailEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.bullet.trail-effect",
					description: "editor.bullet.trail-effect-description",
				}),
			),
			trailSpread: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.trail-spread",
					description: "editor.bullet.trail-spread-description",
				}),
			),
			trailParam: v.pipe(
				v.optional(v.number(), 2),
				metadata({
					name: "editor.bullet.trail-param",
					description: "editor.bullet.trail-param-description",
				}),
			),
			trailRotation: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.trail-rotation",
					description: "editor.bullet.trail-rotation-description",
				}),
			),
			trailInterp: v.pipe(
				v.optional(v.picklist(Interps), "one"),
				metadata({
					name: "editor.bullet.trail-interp",
					description: "editor.bullet.trail-interp-description",
				}),
			),
			trailLength: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.trail-length",
					description: "editor.bullet.trail-length-description",
				}),
			),
			trailWidth: v.pipe(
				v.optional(v.number(), 2),
				metadata({
					name: "editor.bullet.trail-width",
					description: "editor.bullet.trail-width-description",
				}),
			),
			circleShooter: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.circle-shooter",
					description: "editor.bullet.circle-shooter-description",
				}),
			),
			circleShooterRadius: v.pipe(
				v.optional(v.number(), 13),
				metadata({
					name: "editor.bullet.circle-shooter-radius",
					description: "editor.bullet.circle-shooter-radius-description",
					visibleWhen: { field: "circleShooter", value: true },
				}),
			),
			circleShooterRadiusSmooth: v.pipe(
				v.optional(v.number(), 10),
				metadata({
					name: "editor.bullet.circle-shooter-radius-smooth",
					description: "editor.bullet.circle-shooter-radius-smooth-description",
					visibleWhen: { field: "circleShooter", value: true },
				}),
			),
			circleShooterRotateSpeed: v.pipe(
				v.optional(v.number(), 0.3),
				metadata({
					name: "editor.bullet.circle-shooter-rotate-speed",
					description: "editor.bullet.circle-shooter-rotate-speed-description",
					visibleWhen: { field: "circleShooter", value: true },
				}),
			),
			splashDamageRadius: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.splash-damage-radius",
					description: "editor.bullet.splash-damage-radius-description",
				}),
			),
			splashDamagePierce: v.pipe(
				v.optional(v.boolean(), false),
				metadata({
					name: "editor.bullet.splash-damage-pierce",
					description: "editor.bullet.splash-damage-pierce-description",
				}),
			),
			incendAmount: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.incend-amount",
					description: "editor.bullet.incend-amount-description",
				}),
			),
			incendSpread: v.pipe(
				v.optional(v.number(), 8),
				metadata({
					name: "editor.bullet.incend-spread",
					description: "editor.bullet.incend-spread-description",
				}),
			),
			incendChance: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.incend-chance",
					description: "editor.bullet.incend-chance-description",
				}),
			),
			homingPower: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.homing-power",
					description: "editor.bullet.homing-power-description",
				}),
			),
			homingRange: v.pipe(
				v.optional(v.number(), 50),
				metadata({
					name: "editor.bullet.homing-range",
					description: "editor.bullet.homing-range-description",
				}),
			),
			homingDelay: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.homing-delay",
					description: "editor.bullet.homing-delay-description",
				}),
			),
			followAimSpeed: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.follow-aim-speed",
					description: "editor.bullet.follow-aim-speed-description",
				}),
			),
			suppressionRange: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.suppression-range",
					description: "editor.bullet.suppression-range-description",
				}),
			),
			suppressionDuration: v.pipe(
				v.optional(v.number(), 480),
				metadata({
					name: "editor.bullet.suppression-duration",
					description: "editor.bullet.suppression-duration-description",
				}),
			),
			suppressionEffectChance: v.pipe(
				v.optional(v.number(), 50),
				metadata({
					name: "editor.bullet.suppression-effect-chance",
					description: "editor.bullet.suppression-effect-chance-description",
				}),
			),
			suppressColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({
					name: "editor.bullet.suppress-color",
					description: "editor.bullet.suppress-color-description",
				}),
			),
			lightningColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({
					name: "editor.bullet.lightning-color",
					description: "editor.bullet.lightning-color-description",
				}),
			),
			puddles: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.puddles",
					description: "editor.bullet.puddles-description",
				}),
			),
			puddleRange: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.puddle-range",
					description: "editor.bullet.puddle-range-description",
				}),
			),
			puddleAmount: v.pipe(
				v.optional(v.number(), 5),
				metadata({
					name: "editor.bullet.puddle-amount",
					description: "editor.bullet.puddle-amount-description",
				}),
			),
			puddleLiquid: v.pipe(
				v.optional(LiquidFieldSchema(context)),
				metadata({
					name: "editor.bullet.puddle-liquid",
					description: "editor.bullet.puddle-liquid-description",
				}),
			),
			lightning: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.lightning",
					description: "editor.bullet.lightning-description",
				}),
			),
			lightningLength: v.pipe(
				v.optional(v.number(), 5),
				metadata({
					name: "editor.bullet.lightning-length",
					description: "editor.bullet.lightning-length-description",
				}),
			),
			lightningLengthRand: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.lightning-length-rand",
					description: "editor.bullet.lightning-length-rand-description",
				}),
			),
			lightningDamage: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.lightning-damage",
					description: "editor.bullet.lightning-damage-description",
				}),
			),
			lightningCone: v.pipe(
				v.optional(v.number(), 360),
				metadata({
					name: "editor.bullet.lightning-cone",
					description: "editor.bullet.lightning-cone-description",
				}),
			),
			lightningAngle: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.lightning-angle",
					description: "editor.bullet.lightning-angle-description",
				}),
			),
			lightningType: v.pipe(
				v.optional(BulletHjsonSchema(context)),
				metadata({
					name: "editor.bullet.lightning-type",
					description: "editor.bullet.lightning-type-description",
				}),
			),
			weaveScale: v.pipe(
				v.optional(v.number(), 1),
				metadata({
					name: "editor.bullet.weave-scale",
					description: "editor.bullet.weave-scale-description",
				}),
			),
			weaveMag: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.weave-mag",
					description: "editor.bullet.weave-mag-description",
				}),
			),
			weaveRandom: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.weave-random",
					description: "editor.bullet.weave-random-description",
				}),
			),
			rotateSpeed: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.rotate-speed",
					description: "editor.bullet.rotate-speed-description",
				}),
			),
			displayAmmoMultiplier: v.pipe(
				v.optional(v.boolean(), true),
				metadata({
					name: "editor.bullet.display-ammo-multiplier",
					description: "editor.bullet.display-ammo-multiplier-description",
				}),
			),
			statLiquidConsumed: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.stat-liquid-consumed",
					description: "editor.bullet.stat-liquid-consumed-description",
				}),
			),
			lightRadius: v.pipe(
				v.optional(v.number(), -1),
				metadata({
					name: "editor.bullet.light-radius",
					description: "editor.bullet.light-radius-description",
				}),
			),
			lightOpacity: v.pipe(
				v.optional(v.number(), 0.3),
				metadata({
					name: "editor.bullet.light-opacity",
					description: "editor.bullet.light-opacity-description",
				}),
			),
			lightColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({
					name: "editor.bullet.light-color",
					description: "editor.bullet.light-color-description",
				}),
			),
			backColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({
					name: "editor.bullet.back-color",
					description: "editor.bullet.back-color-description",
				}),
			),
			frontColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({
					name: "editor.bullet.front-color",
					description: "editor.bullet.front-color-description",
				}),
			),
			width: v.pipe(
				v.optional(v.number(), 5),
				metadata({
					name: "editor.bullet.width",
					description: "editor.bullet.width-description",
				}),
			),
			height: v.pipe(
				v.optional(v.number(), 7),
				metadata({
					name: "editor.bullet.height",
					description: "editor.bullet.height-description",
				}),
			),
			shrinkX: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.shrink-x",
					description: "editor.bullet.shrink-x-description",
				}),
			),
			shrinkY: v.pipe(
				v.optional(v.number(), 0.5),
				metadata({
					name: "editor.bullet.shrink-y",
					description: "editor.bullet.shrink-y-description",
				}),
			),
			spin: v.pipe(
				v.optional(v.number(), 0),
				metadata({
					name: "editor.bullet.spin",
					description: "editor.bullet.spin-description",
				}),
			),
			shrinkInterp: v.pipe(
				v.optional(v.picklist(Interps), "linear"),
				metadata({
					name: "editor.bullet.shrink-interp",
					description: "editor.bullet.shrink-interp-description",
				}),
			),
		});
	},
);

export const BulletHjsonSchema: SchemaFn = new ClassMap<BulletClass>(
	{
		ArtilleryBulletType: (_context) => ({
			trailMult: v.optional(v.number(), 1),
			trailSize: v.optional(v.number(), 4),
		}),
		BasicBulletType: (context) => ({
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
				}),
			),
			backSprite: v.pipe(
				v.nullish(
					v.pipe(
						v.string(),
						v.transform((v) => v.replaceAll(context.name + "-", "")),
						v.picklist(context.sprites.map((sprite) => sprite.name.replaceAll(context.name + "-", ""))),
					),
				),
				metadata({
					name: "editor.bullet.back-sprite",
					description: "editor.bullet.back-sprite-description",
				}),
			),
		}),
		BombBulletType: (_context) => ({}),
		BulletType: (_context) => ({}),
		ContinuousBulletType: (_context) => ({
			length: v.optional(v.number(), 220),
			damageInterval: v.optional(v.number(), 5),
			continuous: v.optional(v.boolean(), true),
		}),
		ContinuousFlameBulletType: (_context) => ({}),
		ContinuousLaserBulletType: (_context) => ({}),
		EmpBulletType: (context) => ({
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
		EmptyBulletType: (_context) => ({}),
		ExplosionBulletType: (_context) => ({}),
		FireBulletType: (_context) => ({}),
		FlakBulletType: (_context) => ({}),
		InterceptorBulletType: (_context) => ({}),
		LaserBoltBulletType: (_context) => ({}),
		LaserBulletType: (_context) => ({
			length: v.optional(v.number(), 160),
			width: v.optional(v.number(), 15),
			lengthFalloff: v.optional(v.number(), 0.5),
			sideLength: v.optional(v.number(), 29),
			sideWidth: v.optional(v.number(), 0.7),
			lightningSpacing: v.optional(v.number(), -1),
			colors: v.optional(v.array(MindustryHexColorSchema)),
		}),
		LightningBulletType: (_context) => ({}),
		LiquidBulletType: (_context) => ({
			puddleSize: v.optional(v.number(), 6),
			orbSize: v.optional(v.number(), 3),
			boilTime: v.optional(v.number(), 5),
		}),
		MassDriverBolt: (_context) => ({}),
		MissileBulletType: (_context) => ({}),
		MultiBulletType: (context) => ({
			bullets: v.array(BulletHjsonSchema(context)),
			repeat: v.optional(v.number(), 1),
		}),
		PointBulletType: (_context) => ({}),
		PointLaserBulletType: (_context) => ({
			oscScl: v.optional(v.number(), 2),
			oscMag: v.optional(v.number(), 0.3),
			damageInterval: v.optional(v.number(), 5),
		}),
		RailBulletType: (_context) => ({
			length: v.optional(v.number(), 100),
			pointEffectSpace: v.optional(v.number(), 20),
		}),
		SapBulletType: (_context) => ({
			length: v.optional(v.number(), 100),
			sapStrength: v.optional(v.number(), 0.5),
			color: v.optional(MindustryHexColorSchema),
		}),
		ShrapnelBulletType: (_context) => ({
			length: v.optional(v.number(), 100),
			width: v.optional(v.number(), 20),
			serrations: v.optional(v.number(), 7),
			serrationSpacing: v.optional(v.number(), 8),
		}),
		SpaceLiquidBulletType: (_context) => ({}),
	},
	{
		baseSchema: (ctx) => createBulletBaseObjectSchema(ctx).entries,
	},
).schema;
