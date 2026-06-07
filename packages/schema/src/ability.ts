import * as v from "valibot";
import { CachedSchema } from "./utils";
import { Interps } from "./interps";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { SoundHjsonSchema } from "./sound";
import type { SchemaFn } from "./utils";
import { EffectFieldSchema } from "./effect";
import { StatusFieldSchema } from "./status";
import { LiquidFieldSchema } from "./liquid";
import { BulletHjsonSchema } from "./bullet";
import { metadata } from "./utils";

export const abilityClasses = [
	"ArmorPlateAbility",
	"EmptyDataAbility",
	"EnergyFieldAbility",
	"ForceFieldAbility",
	"LiquidExplodeAbility",
	"LiquidRegenAbility",
	"MoveEffectAbility",
	"MoveLightningAbility",
	"RegenAbility",
	"RepairFieldAbility",
	"ShieldArcAbility",
	"ShieldRegenFieldAbility",
	"SpawnDeathAbility",
	"StatusFieldAbility",
	"SuppressionFieldAbility",
	"UnitSpawnAbility",
	"Ability",
] as const;

export type AbilityClass = (typeof abilityClasses)[number];

const abilityBaseObjectSchema = v.object({
	type: v.optional(v.picklist(abilityClasses), "Ability"),
	display: v.optional(v.boolean(), true),
	data: v.optional(v.number(), 0),
});

const armorPlateAbilityObjectSchema = v.object({
	plateSuffix: v.pipe(
		v.optional(v.string(), "-armor"),
		metadata({ name: "editor.ability.plate-suffix", description: "editor.ability.plate-suffix-description" }),
	),
	shineSuffix: v.pipe(
		v.optional(v.string(), "-shine"),
		metadata({ name: "editor.ability.shine-suffix", description: "editor.ability.shine-suffix-description" }),
	),
	color: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.ability.color", description: "editor.ability.color-description" }),
	),
	shineSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "editor.ability.shine-speed", description: "editor.ability.shine-speed-description" }),
	),
	z: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.ability.z", description: "editor.ability.z-description" })),
	drawPlate: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.ability.draw-plate", description: "editor.ability.draw-plate-description" }),
	),
	drawShine: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.ability.draw-shine", description: "editor.ability.draw-shine-description" }),
	),
	healthMultiplier: v.pipe(
		v.optional(v.number(), 0.2),
		metadata({ name: "editor.ability.health-multiplier", description: "editor.ability.health-multiplier-description" }),
	),
});

const forceFieldAbilityObjectSchema = v.object({
	radius: v.pipe(
		v.optional(v.number(), 60),
		metadata({ name: "editor.ability.radius-force", description: "editor.ability.radius-force-description" }),
	),
	regen: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({ name: "editor.ability.regen-force", description: "editor.ability.regen-force-description" }),
	),
	max: v.pipe(
		v.optional(v.number(), 200),
		metadata({ name: "editor.ability.max-force", description: "editor.ability.max-force-description" }),
	),
	cooldown: v.pipe(
		v.optional(v.number(), 300),
		metadata({ name: "editor.ability.cooldown-force", description: "editor.ability.cooldown-force-description" }),
	),
	sides: v.pipe(
		v.optional(v.number(), 6),
		metadata({ name: "editor.ability.sides-force", description: "editor.ability.sides-force-description" }),
	),
	rotation: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.ability.rotation-force", description: "editor.ability.rotation-force-description" }),
	),
	breakSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({ name: "editor.ability.break-sound-force", description: "editor.ability.break-sound-force-description" }),
	),
	hitSound: v.pipe(
		v.optional(SoundHjsonSchema),
		metadata({ name: "editor.ability.hit-sound-force", description: "editor.ability.hit-sound-force-description" }),
	),
	hitSoundVolume: v.pipe(
		v.optional(v.number(), 0.12),
		metadata({ name: "editor.ability.hit-sound-volume-force", description: "editor.ability.hit-sound-volume-force-description" }),
	),
});

const regenAbilityObjectSchema = v.object({
	percentAmount: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.ability.percent-amount", description: "editor.ability.percent-amount-description" }),
	),
	amount: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.ability.amount-regen", description: "editor.ability.amount-regen-description" }),
	),
});

type AbilityObjectSchema = v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>;

const classSchemaMap: Record<AbilityClass, SchemaFn<AbilityObjectSchema>> = {
	Ability: () => v.object({}),
	ArmorPlateAbility: (_context) => armorPlateAbilityObjectSchema as AbilityObjectSchema,
	EmptyDataAbility: (_context) => v.object({}) as AbilityObjectSchema,
	EnergyFieldAbility: (context) =>
		v.object({
			damage: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.damage", description: "editor.ability.damage-description" }),
			),
			reload: v.pipe(
				v.optional(v.number(), 100),
				metadata({ name: "editor.ability.reload", description: "editor.ability.reload-description" }),
			),
			range: v.pipe(
				v.optional(v.number(), 60),
				metadata({ name: "editor.ability.range", description: "editor.ability.range-description" }),
			),
			healEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.heal-effect", description: "editor.ability.heal-effect-description" }),
			),
			hitEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.hit-effect", description: "editor.ability.hit-effect-description" }),
			),
			damageEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.damage-effect", description: "editor.ability.damage-effect-description" }),
			),
			status: v.pipe(
				v.optional(StatusFieldSchema(context)),
				metadata({ name: "editor.ability.status", description: "editor.ability.status-description" }),
			),
			shootSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({ name: "editor.ability.shoot-sound", description: "editor.ability.shoot-sound-description" }),
			),
			statusDuration: v.pipe(
				v.optional(v.number(), 360),
				metadata({ name: "editor.ability.status-duration", description: "editor.ability.status-duration-description" }),
			),
			x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.ability.x", description: "editor.ability.x-description" })),
			y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.ability.y", description: "editor.ability.y-description" })),
			targetGround: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.target-ground", description: "editor.ability.target-ground-description" }),
			),
			targetAir: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.target-air", description: "editor.ability.target-air-description" }),
			),
			hitBuildings: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.hit-buildings", description: "editor.ability.hit-buildings-description" }),
			),
			hitUnits: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.hit-units", description: "editor.ability.hit-units-description" }),
			),
			maxTargets: v.pipe(
				v.optional(v.number(), 25),
				metadata({ name: "editor.ability.max-targets", description: "editor.ability.max-targets-description" }),
			),
			healPercent: v.pipe(
				v.optional(v.number(), 3),
				metadata({ name: "editor.ability.heal-percent", description: "editor.ability.heal-percent-description" }),
			),
			sameTypeHealMult: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.same-type-heal-mult", description: "editor.ability.same-type-heal-mult-description" }),
			),
			displayHeal: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.display-heal", description: "editor.ability.display-heal-description" }),
			),
			layer: v.pipe(v.optional(v.number()), metadata({ name: "editor.ability.layer", description: "editor.ability.layer-description" })),
			blinkScl: v.pipe(
				v.optional(v.number(), 20),
				metadata({ name: "editor.ability.blink-scl", description: "editor.ability.blink-scl-description" }),
			),
			blinkSize: v.pipe(
				v.optional(v.number(), 0.1),
				metadata({ name: "editor.ability.blink-size", description: "editor.ability.blink-size-description" }),
			),
			effectRadius: v.pipe(
				v.optional(v.number(), 5),
				metadata({ name: "editor.ability.effect-radius", description: "editor.ability.effect-radius-description" }),
			),
			sectorRad: v.pipe(
				v.optional(v.number(), 0.14),
				metadata({ name: "editor.ability.sector-rad", description: "editor.ability.sector-rad-description" }),
			),
			rotateSpeed: v.pipe(
				v.optional(v.number(), 0.5),
				metadata({ name: "editor.ability.rotate-speed", description: "editor.ability.rotate-speed-description" }),
			),
			sectors: v.pipe(
				v.optional(v.number(), 5),
				metadata({ name: "editor.ability.sectors", description: "editor.ability.sectors-description" }),
			),
			color: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.ability.color-energy", description: "editor.ability.color-energy-description" }),
			),
			useAmmo: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.use-ammo", description: "editor.ability.use-ammo-description" }),
			),
		}),
	ForceFieldAbility: (_context) => forceFieldAbilityObjectSchema as AbilityObjectSchema,
	LiquidExplodeAbility: (context) =>
		v.object({
			liquid: v.pipe(
				v.optional(LiquidFieldSchema(context)),
				metadata({ name: "editor.ability.liquid", description: "editor.ability.liquid-description" }),
			),
			amount: v.pipe(
				v.optional(v.number(), 120),
				metadata({ name: "editor.ability.amount-liquid-explode", description: "editor.ability.amount-liquid-explode-description" }),
			),
			radAmountScale: v.pipe(
				v.optional(v.number(), 5),
				metadata({ name: "editor.ability.rad-amount-scale", description: "editor.ability.rad-amount-scale-description" }),
			),
			radScale: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.rad-scale", description: "editor.ability.rad-scale-description" }),
			),
			noiseMag: v.pipe(
				v.optional(v.number(), 6.5),
				metadata({ name: "editor.ability.noise-mag", description: "editor.ability.noise-mag-description" }),
			),
			noiseScl: v.pipe(
				v.optional(v.number(), 5),
				metadata({ name: "editor.ability.noise-scl", description: "editor.ability.noise-scl-description" }),
			),
		}),
	LiquidRegenAbility: (context) =>
		v.object({
			liquid: v.pipe(
				v.optional(LiquidFieldSchema(context)),
				metadata({ name: "editor.ability.liquid", description: "editor.ability.liquid-description" }),
			),
			slurpSpeed: v.pipe(
				v.optional(v.number(), 5),
				metadata({ name: "editor.ability.slurp-speed", description: "editor.ability.slurp-speed-description" }),
			),
			regenPerSlurp: v.pipe(
				v.optional(v.number(), 6),
				metadata({ name: "editor.ability.regen-per-slurp", description: "editor.ability.regen-per-slurp-description" }),
			),
			slurpEffectChance: v.pipe(
				v.optional(v.number(), 0.4),
				metadata({ name: "editor.ability.slurp-effect-chance", description: "editor.ability.slurp-effect-chance-description" }),
			),
			slurpEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.slurp-effect", description: "editor.ability.slurp-effect-description" }),
			),
		}),
	MoveEffectAbility: (context) =>
		v.object({
			minVelocity: v.pipe(
				v.optional(v.number(), 0.08),
				metadata({ name: "editor.ability.min-velocity", description: "editor.ability.min-velocity-description" }),
			),
			interval: v.pipe(
				v.optional(v.number(), 3),
				metadata({ name: "editor.ability.interval", description: "editor.ability.interval-description" }),
			),
			chance: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.chance-move-effect", description: "editor.ability.chance-move-effect-description" }),
			),
			amount: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.amount-move-effect", description: "editor.ability.amount-move-effect-description" }),
			),
			x: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.x-move-effect", description: "editor.ability.x-move-effect-description" }),
			),
			y: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.y-move-effect", description: "editor.ability.y-move-effect-description" }),
			),
			rotation: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.rotation-move-effect", description: "editor.ability.rotation-move-effect-description" }),
			),
			rangeX: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.range-x", description: "editor.ability.range-x-description" }),
			),
			rangeY: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.range-y", description: "editor.ability.range-y-description" }),
			),
			rangeLengthMin: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.range-length-min", description: "editor.ability.range-length-min-description" }),
			),
			rangeLengthMax: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.range-length-max", description: "editor.ability.range-length-max-description" }),
			),
			rotateEffect: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.rotate-effect", description: "editor.ability.rotate-effect-description" }),
			),
			effectParam: v.pipe(
				v.optional(v.number(), 3),
				metadata({ name: "editor.ability.effect-param", description: "editor.ability.effect-param-description" }),
			),
			teamColor: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.team-color", description: "editor.ability.team-color-description" }),
			),
			parentizeEffects: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.parentize-effects", description: "editor.ability.parentize-effects-description" }),
			),
			color: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.ability.color-move-effect", description: "editor.ability.color-move-effect-description" }),
			),
			effect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.effect-move", description: "editor.ability.effect-move-description" }),
			),
		}),
	MoveLightningAbility: (context) =>
		v.object({
			damage: v.pipe(
				v.optional(v.number(), 35),
				metadata({ name: "editor.ability.damage-lightning", description: "editor.ability.damage-lightning-description" }),
			),
			chance: v.pipe(
				v.optional(v.number(), 0.15),
				metadata({ name: "editor.ability.chance-lightning", description: "editor.ability.chance-lightning-description" }),
			),
			length: v.pipe(
				v.optional(v.number(), 12),
				metadata({ name: "editor.ability.length", description: "editor.ability.length-description" }),
			),
			minSpeed: v.pipe(
				v.optional(v.number(), 0.8),
				metadata({ name: "editor.ability.min-speed", description: "editor.ability.min-speed-description" }),
			),
			maxSpeed: v.pipe(
				v.optional(v.number(), 1.2),
				metadata({ name: "editor.ability.max-speed", description: "editor.ability.max-speed-description" }),
			),
			color: v.pipe(
				v.optional(MindustryHexColorSchema, "a9d8ff"),
				metadata({ name: "editor.ability.color-lightning", description: "editor.ability.color-lightning-description" }),
			),
			y: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.y-lightning", description: "editor.ability.y-lightning-description" }),
			),
			x: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.x-lightning", description: "editor.ability.x-lightning-description" }),
			),
			alternate: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.alternate", description: "editor.ability.alternate-description" }),
			),
			heatRegion: v.pipe(
				v.optional(v.string(), "error"),
				metadata({ name: "editor.ability.heat-region", description: "editor.ability.heat-region-description" }),
			),
			bullet: v.pipe(
				v.optional(BulletHjsonSchema(context)),
				metadata({ name: "editor.ability.bullet", description: "editor.ability.bullet-description" }),
			),
			bulletAngle: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.bullet-angle", description: "editor.ability.bullet-angle-description" }),
			),
			bulletSpread: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.bullet-spread", description: "editor.ability.bullet-spread-description" }),
			),
			shootEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.shoot-effect-lightning", description: "editor.ability.shoot-effect-lightning-description" }),
			),
			parentizeEffects: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.parentize-effects", description: "editor.ability.parentize-effects-description" }),
			),
			shootSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({ name: "editor.ability.shoot-sound-lightning", description: "editor.ability.shoot-sound-lightning-description" }),
			),
		}),
	RegenAbility: (_context) => regenAbilityObjectSchema as AbilityObjectSchema,
	RepairFieldAbility: (context) =>
		v.object({
			amount: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.amount-repair", description: "editor.ability.amount-repair-description" }),
			),
			reload: v.pipe(
				v.optional(v.number(), 100),
				metadata({ name: "editor.ability.reload-repair", description: "editor.ability.reload-repair-description" }),
			),
			range: v.pipe(
				v.optional(v.number(), 60),
				metadata({ name: "editor.ability.range-repair", description: "editor.ability.range-repair-description" }),
			),
			healPercent: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.heal-percent-repair", description: "editor.ability.heal-percent-repair-description" }),
			),
			healEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.heal-effect-repair", description: "editor.ability.heal-effect-repair-description" }),
			),
			activeEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.active-effect", description: "editor.ability.active-effect-description" }),
			),
			sound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({ name: "editor.ability.sound", description: "editor.ability.sound-description" }),
			),
			soundVolume: v.pipe(
				v.optional(v.number(), 0.5),
				metadata({ name: "editor.ability.sound-volume", description: "editor.ability.sound-volume-description" }),
			),
			parentizeEffects: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.parentize-effects", description: "editor.ability.parentize-effects-description" }),
			),
			sameTypeHealMult: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.same-type-heal-mult", description: "editor.ability.same-type-heal-mult-description" }),
			),
		}),
	ShieldArcAbility: (context) =>
		v.object({
			radius: v.pipe(
				v.optional(v.number(), 60),
				metadata({ name: "editor.ability.radius-arc", description: "editor.ability.radius-arc-description" }),
			),
			regen: v.pipe(
				v.optional(v.number(), 0.1),
				metadata({ name: "editor.ability.regen-arc", description: "editor.ability.regen-arc-description" }),
			),
			max: v.pipe(
				v.optional(v.number(), 200),
				metadata({ name: "editor.ability.max-arc", description: "editor.ability.max-arc-description" }),
			),
			cooldown: v.pipe(
				v.optional(v.number(), 300),
				metadata({ name: "editor.ability.cooldown-arc", description: "editor.ability.cooldown-arc-description" }),
			),
			angle: v.pipe(
				v.optional(v.number(), 80),
				metadata({ name: "editor.ability.angle", description: "editor.ability.angle-description" }),
			),
			angleOffset: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.angle-offset", description: "editor.ability.angle-offset-description" }),
			),
			x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.ability.x-arc", description: "editor.ability.x-arc-description" })),
			y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.ability.y-arc", description: "editor.ability.y-arc-description" })),
			whenShooting: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.when-shooting", description: "editor.ability.when-shooting-description" }),
			),
			width: v.pipe(
				v.optional(v.number(), 6),
				metadata({ name: "editor.ability.width", description: "editor.ability.width-description" }),
			),
			chanceDeflect: v.pipe(
				v.optional(v.number(), -1),
				metadata({ name: "editor.ability.chance-deflect", description: "editor.ability.chance-deflect-description" }),
			),
			reflectBuildingDamage: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.reflect-building-damage", description: "editor.ability.reflect-building-damage-description" }),
			),
			reflectVel: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.reflect-vel", description: "editor.ability.reflect-vel-description" }),
			),
			reflectTime: v.pipe(
				v.optional(v.number(), 0.5),
				metadata({ name: "editor.ability.reflect-time", description: "editor.ability.reflect-time-description" }),
			),
			deflectSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({ name: "editor.ability.deflect-sound", description: "editor.ability.deflect-sound-description" }),
			),
			breakSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({ name: "editor.ability.break-sound-arc", description: "editor.ability.break-sound-arc-description" }),
			),
			hitSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({ name: "editor.ability.hit-sound-arc", description: "editor.ability.hit-sound-arc-description" }),
			),
			hitSoundVolume: v.pipe(
				v.optional(v.number(), 0.12),
				metadata({ name: "editor.ability.hit-sound-volume-arc", description: "editor.ability.hit-sound-volume-arc-description" }),
			),
			missileUnitMultiplier: v.pipe(
				v.optional(v.number(), 2),
				metadata({ name: "editor.ability.missile-unit-multiplier", description: "editor.ability.missile-unit-multiplier-description" }),
			),
			drawArc: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.draw-arc", description: "editor.ability.draw-arc-description" }),
			),
			region: v.pipe(
				v.optional(v.string()),
				metadata({ name: "editor.ability.region", description: "editor.ability.region-description" }),
			),
			color: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.ability.color-arc", description: "editor.ability.color-arc-description" }),
			),
			offsetRegion: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.offset-region", description: "editor.ability.offset-region-description" }),
			),
			pushUnits: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.push-units", description: "editor.ability.push-units-description" }),
			),
			pushEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.push-effect", description: "editor.ability.push-effect-description" }),
			),
		}),
	ShieldRegenFieldAbility: (context) =>
		v.object({
			amount: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.amount-shield-regen", description: "editor.ability.amount-shield-regen-description" }),
			),
			max: v.pipe(
				v.optional(v.number(), 100),
				metadata({ name: "editor.ability.max-shield-regen", description: "editor.ability.max-shield-regen-description" }),
			),
			reload: v.pipe(
				v.optional(v.number(), 100),
				metadata({ name: "editor.ability.reload-shield-regen", description: "editor.ability.reload-shield-regen-description" }),
			),
			range: v.pipe(
				v.optional(v.number(), 60),
				metadata({ name: "editor.ability.range-shield-regen", description: "editor.ability.range-shield-regen-description" }),
			),
			applyEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.apply-effect", description: "editor.ability.apply-effect-description" }),
			),
			activeEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.active-effect", description: "editor.ability.active-effect-description" }),
			),
			sound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({ name: "editor.ability.sound", description: "editor.ability.sound-description" }),
			),
			soundVolume: v.pipe(
				v.optional(v.number(), 0.7),
				metadata({ name: "editor.ability.sound-volume", description: "editor.ability.sound-volume-description" }),
			),
			parentizeEffects: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.parentize-effects", description: "editor.ability.parentize-effects-description" }),
			),
		}),
	SpawnDeathAbility: (context) =>
		v.object({
			unit: v.pipe(
				v.string(),
				v.transform((v) => v.replaceAll(context.name + "-", "")),
				v.picklist(context.units.map((unit) => unit.name.replaceAll(context.name + "-", ""))),
				metadata({ name: "editor.ability.unit-spawn-death", description: "editor.ability.unit-spawn-death-description" }),
			),
			amount: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.amount-spawn-death", description: "editor.ability.amount-spawn-death-description" }),
			),
			randAmount: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.rand-amount", description: "editor.ability.rand-amount-description" }),
			),
			spread: v.pipe(
				v.optional(v.number(), 8),
				metadata({ name: "editor.ability.spread", description: "editor.ability.spread-description" }),
			),
			faceOutwards: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.face-outwards", description: "editor.ability.face-outwards-description" }),
			),
		}),
	StatusFieldAbility: (context) =>
		v.object({
			effect: v.pipe(
				v.optional(StatusFieldSchema(context)),
				metadata({ name: "editor.ability.effect-status", description: "editor.ability.effect-status-description" }),
			),
			duration: v.pipe(
				v.optional(v.number(), 60),
				metadata({ name: "editor.ability.duration", description: "editor.ability.duration-description" }),
			),
			reload: v.pipe(
				v.optional(v.number(), 100),
				metadata({ name: "editor.ability.reload-status", description: "editor.ability.reload-status-description" }),
			),
			range: v.pipe(
				v.optional(v.number(), 20),
				metadata({ name: "editor.ability.range-status", description: "editor.ability.range-status-description" }),
			),
			onShoot: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.on-shoot", description: "editor.ability.on-shoot-description" }),
			),
			applyEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.apply-effect", description: "editor.ability.apply-effect-description" }),
			),
			activeEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.active-effect", description: "editor.ability.active-effect-description" }),
			),
			effectX: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.effect-x", description: "editor.ability.effect-x-description" }),
			),
			effectY: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.effect-y", description: "editor.ability.effect-y-description" }),
			),
			parentizeEffects: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.parentize-effects", description: "editor.ability.parentize-effects-description" }),
			),
			effectSizeParam: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.effect-size-param", description: "editor.ability.effect-size-param-description" }),
			),
			color: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.ability.color-status", description: "editor.ability.color-status-description" }),
			),
		}),
	SuppressionFieldAbility: (_context) =>
		v.object({
			reload: v.pipe(
				v.optional(v.number(), 90),
				metadata({ name: "editor.ability.reload-suppression", description: "editor.ability.reload-suppression-description" }),
			),
			maxDelay: v.pipe(
				v.optional(v.number(), 90),
				metadata({ name: "editor.ability.max-delay", description: "editor.ability.max-delay-description" }),
			),
			range: v.pipe(
				v.optional(v.number(), 200),
				metadata({ name: "editor.ability.range-suppression", description: "editor.ability.range-suppression-description" }),
			),
			orbRadius: v.pipe(
				v.optional(v.number(), 4.1),
				metadata({ name: "editor.ability.orb-radius", description: "editor.ability.orb-radius-description" }),
			),
			orbMidScl: v.pipe(
				v.optional(v.number(), 0.33),
				metadata({ name: "editor.ability.orb-mid-scl", description: "editor.ability.orb-mid-scl-description" }),
			),
			orbSinScl: v.pipe(
				v.optional(v.number(), 8),
				metadata({ name: "editor.ability.orb-sin-scl", description: "editor.ability.orb-sin-scl-description" }),
			),
			orbSinMag: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.ability.orb-sin-mag", description: "editor.ability.orb-sin-mag-description" }),
			),
			color: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.ability.color-suppression", description: "editor.ability.color-suppression-description" }),
			),
			layer: v.pipe(v.optional(v.number()), metadata({ name: "editor.ability.layer", description: "editor.ability.layer-description" })),
			x: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.x-suppression", description: "editor.ability.x-suppression-description" }),
			),
			y: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.y-suppression", description: "editor.ability.y-suppression-description" }),
			),
			particles: v.pipe(
				v.optional(v.number(), 15),
				metadata({ name: "editor.ability.particles", description: "editor.ability.particles-description" }),
			),
			particleSize: v.pipe(
				v.optional(v.number(), 4),
				metadata({ name: "editor.ability.particle-size", description: "editor.ability.particle-size-description" }),
			),
			particleLen: v.pipe(
				v.optional(v.number(), 7),
				metadata({ name: "editor.ability.particle-len", description: "editor.ability.particle-len-description" }),
			),
			rotateScl: v.pipe(
				v.optional(v.number(), 3),
				metadata({ name: "editor.ability.rotate-scl", description: "editor.ability.rotate-scl-description" }),
			),
			particleLife: v.pipe(
				v.optional(v.number(), 110),
				metadata({ name: "editor.ability.particle-life", description: "editor.ability.particle-life-description" }),
			),
			active: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.ability.active", description: "editor.ability.active-description" }),
			),
			particleInterp: v.pipe(
				v.optional(v.picklist(Interps)),
				metadata({ name: "editor.ability.particle-interp", description: "editor.ability.particle-interp-description" }),
			),
			particleColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.ability.particle-color", description: "editor.ability.particle-color-description" }),
			),
			effectColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.ability.effect-color", description: "editor.ability.effect-color-description" }),
			),
			applyParticleChance: v.pipe(
				v.optional(v.number(), 13),
				metadata({ name: "editor.ability.apply-particle-chance", description: "editor.ability.apply-particle-chance-description" }),
			),
		}),
	UnitSpawnAbility: (context) =>
		v.object({
			unit: v.pipe(
				v.string(),
				v.transform((v) => v.replaceAll(context.name + "-", "")),
				v.picklist(context.units.map((unit) => unit.name.replaceAll(context.name + "-", ""))),
				metadata({ name: "editor.ability.unit-spawn", description: "editor.ability.unit-spawn-description" }),
			),
			spawnTime: v.pipe(
				v.optional(v.number(), 60),
				metadata({ name: "editor.ability.spawn-time", description: "editor.ability.spawn-time-description" }),
			),
			spawnX: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.spawn-x", description: "editor.ability.spawn-x-description" }),
			),
			spawnY: v.pipe(
				v.optional(v.number(), 0),
				metadata({ name: "editor.ability.spawn-y", description: "editor.ability.spawn-y-description" }),
			),
			spawnEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({ name: "editor.ability.spawn-effect", description: "editor.ability.spawn-effect-description" }),
			),
			parentizeEffects: v.pipe(
				v.optional(v.boolean(), false),
				metadata({ name: "editor.ability.parentize-effects", description: "editor.ability.parentize-effects-description" }),
			),
		}),
};

export const AbilityHjsonSchema: SchemaFn = CachedSchema((context) => {
	return v.lazy((input) => {
		if (input && typeof input === "object" && "type" in input) {
			const type = input.type;

			if (type && classSchemaMap[type as AbilityClass]) {
				const schemaFn = classSchemaMap[type as AbilityClass];
				return v.pipe(v.object({ ...abilityBaseObjectSchema.entries, ...schemaFn(context).entries }), metadata({ type: "ability" }));
			}
		}

		return v.pipe(abilityBaseObjectSchema, metadata({ type: "ability" }));
	});
});

export const AbilityFieldSchema: SchemaFn = (context) =>
	v.lazy((input) => {
		if (typeof input === "string") {
			return v.string();
		}

		return AbilityHjsonSchema(context);
	});
