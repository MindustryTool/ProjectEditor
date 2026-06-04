import * as v from "valibot";
import { Interps, MindustryHexColorSchema, SoundHjsonSchema, type SchemaFn } from "./base";
import { EffectFieldSchema } from "./effect";
import { StatusFieldSchema } from "./status";
import { LiquidFieldSchema } from "./liquid";
import { BulletHjsonSchema } from "./bullet";

const metadata = { type: "ability" };

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
] as const;

export type AbilityClass = (typeof abilityClasses)[number];

const abilityBaseEntries = {
	display: v.optional(v.boolean(), true),
	data: v.optional(v.number(), 0),
} as const satisfies v.ObjectEntries;


const armorPlateAbilityObjectSchema = v.object({
	plateSuffix: v.optional(v.string(), "-armor"),
	shineSuffix: v.optional(v.string(), "-shine"),
	color: v.optional(MindustryHexColorSchema),
	shineSpeed: v.optional(v.number(), 1),
	z: v.optional(v.number(), -1),
	drawPlate: v.optional(v.boolean(), true),
	drawShine: v.optional(v.boolean(), true),
	healthMultiplier: v.optional(v.number(), 0.2),
});

const forceFieldAbilityObjectSchema = v.object({
	radius: v.optional(v.number(), 60),
	regen: v.optional(v.number(), 0.1),
	max: v.optional(v.number(), 200),
	cooldown: v.optional(v.number(), 300),
	sides: v.optional(v.number(), 6),
	rotation: v.optional(v.number(), 0),
	breakSound: v.optional(SoundHjsonSchema),
	hitSound: v.optional(SoundHjsonSchema),
	hitSoundVolume: v.optional(v.number(), 0.12),
});

const regenAbilityObjectSchema = v.object({
	percentAmount: v.optional(v.number(), 0),
	amount: v.optional(v.number(), 0),
});

type AbilityObjectSchema = v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>;

const classSchemaMap: Record<AbilityClass, SchemaFn<AbilityObjectSchema>> = {
	ArmorPlateAbility: (_context) => armorPlateAbilityObjectSchema as AbilityObjectSchema,
	EmptyDataAbility: (_context) => v.object({}) as AbilityObjectSchema,
	EnergyFieldAbility: (context) =>
		v.object({
			damage: v.optional(v.number(), 1),
			reload: v.optional(v.number(), 100),
			range: v.optional(v.number(), 60),
			healEffect: v.optional(EffectFieldSchema(context)),
			hitEffect: v.optional(EffectFieldSchema(context)),
			damageEffect: v.optional(EffectFieldSchema(context)),
			status: v.optional(StatusFieldSchema(context)),
			shootSound: v.optional(SoundHjsonSchema),
			statusDuration: v.optional(v.number(), 360),
			x: v.optional(v.number(), 0),
			y: v.optional(v.number(), 0),
			targetGround: v.optional(v.boolean(), true),
			targetAir: v.optional(v.boolean(), true),
			hitBuildings: v.optional(v.boolean(), true),
			hitUnits: v.optional(v.boolean(), true),
			maxTargets: v.optional(v.number(), 25),
			healPercent: v.optional(v.number(), 3),
			sameTypeHealMult: v.optional(v.number(), 1),
			displayHeal: v.optional(v.boolean(), true),
			layer: v.optional(v.number()),
			blinkScl: v.optional(v.number(), 20),
			blinkSize: v.optional(v.number(), 0.1),
			effectRadius: v.optional(v.number(), 5),
			sectorRad: v.optional(v.number(), 0.14),
			rotateSpeed: v.optional(v.number(), 0.5),
			sectors: v.optional(v.number(), 5),
			color: v.optional(MindustryHexColorSchema),
			useAmmo: v.optional(v.boolean(), true),
		}),
	ForceFieldAbility: (_context) => forceFieldAbilityObjectSchema as AbilityObjectSchema,
	LiquidExplodeAbility: (context) =>
		v.object({
			liquid: v.optional(LiquidFieldSchema(context)),
			amount: v.optional(v.number(), 120),
			radAmountScale: v.optional(v.number(), 5),
			radScale: v.optional(v.number(), 1),
			noiseMag: v.optional(v.number(), 6.5),
			noiseScl: v.optional(v.number(), 5),
		}),
	LiquidRegenAbility: (context) =>
		v.object({
			liquid: v.optional(LiquidFieldSchema(context)),
			slurpSpeed: v.optional(v.number(), 5),
			regenPerSlurp: v.optional(v.number(), 6),
			slurpEffectChance: v.optional(v.number(), 0.4),
			slurpEffect: v.optional(EffectFieldSchema(context)),
		}),
	MoveEffectAbility: (context) =>
		v.object({
			minVelocity: v.optional(v.number(), 0.08),
			interval: v.optional(v.number(), 3),
			chance: v.optional(v.number(), 0),
			amount: v.optional(v.number(), 1),
			x: v.optional(v.number(), 0),
			y: v.optional(v.number(), 0),
			rotation: v.optional(v.number(), 0),
			rangeX: v.optional(v.number(), 0),
			rangeY: v.optional(v.number(), 0),
			rangeLengthMin: v.optional(v.number(), 0),
			rangeLengthMax: v.optional(v.number(), 0),
			rotateEffect: v.optional(v.boolean(), false),
			effectParam: v.optional(v.number(), 3),
			teamColor: v.optional(v.boolean(), false),
			parentizeEffects: v.optional(v.boolean(), false),
			color: v.optional(MindustryHexColorSchema),
			effect: v.optional(EffectFieldSchema(context)),
		}),
	MoveLightningAbility: (context) =>
		v.object({
			damage: v.optional(v.number(), 35),
			chance: v.optional(v.number(), 0.15),
			length: v.optional(v.number(), 12),
			minSpeed: v.optional(v.number(), 0.8),
			maxSpeed: v.optional(v.number(), 1.2),
			color: v.optional(MindustryHexColorSchema, "a9d8ff"),
			y: v.optional(v.number(), 0),
			x: v.optional(v.number(), 0),
			alternate: v.optional(v.boolean(), true),
			heatRegion: v.optional(v.string(), "error"),
			bullet: v.optional(BulletHjsonSchema(context)),
			bulletAngle: v.optional(v.number(), 0),
			bulletSpread: v.optional(v.number(), 0),
			shootEffect: v.optional(EffectFieldSchema(context)),
			parentizeEffects: v.optional(v.boolean(), false),
			shootSound: v.optional(SoundHjsonSchema),
		}),
	RegenAbility: (_context) => regenAbilityObjectSchema as AbilityObjectSchema,
	RepairFieldAbility: (context) =>
		v.object({
			amount: v.optional(v.number(), 1),
			reload: v.optional(v.number(), 100),
			range: v.optional(v.number(), 60),
			healPercent: v.optional(v.number(), 0),
			healEffect: v.optional(EffectFieldSchema(context)),
			activeEffect: v.optional(EffectFieldSchema(context)),
			sound: v.optional(SoundHjsonSchema),
			soundVolume: v.optional(v.number(), 0.5),
			parentizeEffects: v.optional(v.boolean(), false),
			sameTypeHealMult: v.optional(v.number(), 1),
		}),
	ShieldArcAbility: (context) =>
		v.object({
			radius: v.optional(v.number(), 60),
			regen: v.optional(v.number(), 0.1),
			max: v.optional(v.number(), 200),
			cooldown: v.optional(v.number(), 300),
			angle: v.optional(v.number(), 80),
			angleOffset: v.optional(v.number(), 0),
			x: v.optional(v.number(), 0),
			y: v.optional(v.number(), 0),
			whenShooting: v.optional(v.boolean(), true),
			width: v.optional(v.number(), 6),
			chanceDeflect: v.optional(v.number(), -1),
			reflectBuildingDamage: v.optional(v.number(), 1),
			reflectVel: v.optional(v.number(), 1),
			reflectTime: v.optional(v.number(), 0.5),
			deflectSound: v.optional(SoundHjsonSchema),
			breakSound: v.optional(SoundHjsonSchema),
			hitSound: v.optional(SoundHjsonSchema),
			hitSoundVolume: v.optional(v.number(), 0.12),
			missileUnitMultiplier: v.optional(v.number(), 2),
			drawArc: v.optional(v.boolean(), true),
			region: v.optional(v.string()),
			color: v.optional(MindustryHexColorSchema),
			offsetRegion: v.optional(v.boolean(), false),
			pushUnits: v.optional(v.boolean(), true),
			pushEffect: v.optional(EffectFieldSchema(context)),
		}),
	ShieldRegenFieldAbility: (context) =>
		v.object({
			amount: v.optional(v.number(), 1),
			max: v.optional(v.number(), 100),
			reload: v.optional(v.number(), 100),
			range: v.optional(v.number(), 60),
			applyEffect: v.optional(EffectFieldSchema(context)),
			activeEffect: v.optional(EffectFieldSchema(context)),
			sound: v.optional(SoundHjsonSchema),
			soundVolume: v.optional(v.number(), 0.7),
			parentizeEffects: v.optional(v.boolean(), false),
		}),
	SpawnDeathAbility: (context) =>
		v.object({
			unit: v.picklist(context.units.map((unit) => unit.name)),
			amount: v.optional(v.number(), 1),
			randAmount: v.optional(v.number(), 0),
			spread: v.optional(v.number(), 8),
			faceOutwards: v.optional(v.boolean(), true),
		}),
	StatusFieldAbility: (context) =>
		v.object({
			effect: v.optional(StatusFieldSchema(context)),
			duration: v.optional(v.number(), 60),
			reload: v.optional(v.number(), 100),
			range: v.optional(v.number(), 20),
			onShoot: v.optional(v.boolean(), false),
			applyEffect: v.optional(EffectFieldSchema(context)),
			activeEffect: v.optional(EffectFieldSchema(context)),
			effectX: v.optional(v.number(), 0),
			effectY: v.optional(v.number(), 0),
			parentizeEffects: v.optional(v.boolean(), false),
			effectSizeParam: v.optional(v.boolean(), true),
			color: v.optional(MindustryHexColorSchema),
		}),
	SuppressionFieldAbility: (_context) =>
		v.object({
			reload: v.optional(v.number(), 90),
			maxDelay: v.optional(v.number(), 90),
			range: v.optional(v.number(), 200),
			orbRadius: v.optional(v.number(), 4.1),
			orbMidScl: v.optional(v.number(), 0.33),
			orbSinScl: v.optional(v.number(), 8),
			orbSinMag: v.optional(v.number(), 1),
			color: v.optional(MindustryHexColorSchema),
			layer: v.optional(v.number()),
			x: v.optional(v.number(), 0),
			y: v.optional(v.number(), 0),
			particles: v.optional(v.number(), 15),
			particleSize: v.optional(v.number(), 4),
			particleLen: v.optional(v.number(), 7),
			rotateScl: v.optional(v.number(), 3),
			particleLife: v.optional(v.number(), 110),
			active: v.optional(v.boolean(), true),
			particleInterp: v.optional(v.picklist(Interps)),
			particleColor: v.optional(MindustryHexColorSchema),
			effectColor: v.optional(MindustryHexColorSchema),
			applyParticleChance: v.optional(v.number(), 13),
		}),
	UnitSpawnAbility: (context) =>
		v.object({
			unit: v.picklist(context.units.map((unit) => unit.name)),
			spawnTime: v.optional(v.number(), 60),
			spawnX: v.optional(v.number(), 0),
			spawnY: v.optional(v.number(), 0),
			spawnEffect: v.optional(EffectFieldSchema(context)),
			parentizeEffects: v.optional(v.boolean(), false),
		}),
};

export const AbilityHjsonSchema: SchemaFn = (context) => {
	return v.pipe(
		v.variant(
			"type",
			abilityClasses.map((className) =>
				v.object({
					type: v.literal(className),
					...abilityBaseEntries,
					...classSchemaMap[className](context).entries,
				}),
			),
		),
		v.metadata(metadata),
	);
};

export const AbilityFieldSchema: SchemaFn = (context) => v.union([AbilityHjsonSchema(context), v.string()]);
