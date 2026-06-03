import * as v from "valibot";
import { MindustryHexColorSchema, type SchemaFn } from "./base";
import { EffectHjsonSchema } from "./effect";

export const statusBaseObjectSchema = v.object({
	damageMultiplier: v.optional(v.number(), 1),
	healthMultiplier: v.optional(v.number(), 1),
	speedMultiplier: v.optional(v.number(), 1),
	reloadMultiplier: v.optional(v.number(), 1),
	buildSpeedMultiplier: v.optional(v.number(), 1),
	dragMultiplier: v.optional(v.number(), 1),
	transitionDamage: v.optional(v.number(), 0),
	disarm: v.optional(v.boolean(), false),
	damage: v.optional(v.number(), 0),
	intervalDamageTime: v.optional(v.number(), 0),
	intervalDamage: v.optional(v.number(), 0),
	intervalDamagePierce: v.optional(v.boolean(), false),
	effectChance: v.optional(v.number(), 0.15),
	parentizeEffect: v.optional(v.boolean(), false),
	permanent: v.optional(v.boolean(), false),
	reactive: v.optional(v.boolean(), false),
	show: v.optional(v.boolean(), true),
	color: v.optional(MindustryHexColorSchema),
	applyExtend: v.optional(v.boolean(), false),
	applyColor: v.optional(MindustryHexColorSchema),
	parentizeApplyEffect: v.optional(v.boolean(), false),
	outline: v.optional(v.boolean(), true),
});

export const StatusStringSchema: SchemaFn = (_value, context) => v.picklist(context.getStatuses().map((status) => status.name));

export const StatusFieldSchema: SchemaFn = (value, context) =>
	v.union([StatusStringSchema(value, context), StatusHjsonSchema(value, context)]);

export const StatusHjsonSchema: SchemaFn = (value, context) =>
	v.pipe(
		v.object({
			...statusBaseObjectSchema.entries,
			effect: v.optional(EffectHjsonSchema(value.get("effect"), context)),
			applyEffect: v.optional(EffectHjsonSchema(value.get("applyEffect"), context)),
			affinities: v.optional(
				v.array(
					v.pipe(
						v.picklist(
							context.getStatuses().map((status) => status.name),
							"Not a vailid status name",
						),
					),
				),
				[],
			),
			opposites: v.optional(v.array(v.pipe(v.picklist(context.getStatuses().map((status) => status.name)))), []),
		}),
		v.forward(
			v.partialCheck(
				[["affinities"], ["opposites"]],
				(input) => !input.affinities.some((a) => input.opposites.includes(a)),
				"Affinities and opposites cannot be the same",
			),
			["opposites"],
		),
	);
