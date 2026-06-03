import * as v from "valibot";
import { MindustryHexColorSchema, type SchemaFn } from "./base";
import { EffectHjsonSchema } from "./effect";

export const statusBaseObjectSchema = v.object({
	damageMultiplier: v.nullish(v.number(), 1),
	healthMultiplier: v.nullish(v.number(), 1),
	speedMultiplier: v.nullish(v.number(), 1),
	reloadMultiplier: v.nullish(v.number(), 1),
	buildSpeedMultiplier: v.nullish(v.number(), 1),
	dragMultiplier: v.nullish(v.number(), 1),
	transitionDamage: v.nullish(v.number(), 0),
	disarm: v.nullish(v.boolean(), false),
	damage: v.nullish(v.number(), 0),
	intervalDamageTime: v.nullish(v.number(), 0),
	intervalDamage: v.nullish(v.number(), 0),
	intervalDamagePierce: v.nullish(v.boolean(), false),
	effectChance: v.nullish(v.number(), 0.15),
	parentizeEffect: v.nullish(v.boolean(), false),
	permanent: v.nullish(v.boolean(), false),
	reactive: v.nullish(v.boolean(), false),
	show: v.nullish(v.boolean(), true),
	color: v.nullish(MindustryHexColorSchema),
	applyExtend: v.nullish(v.boolean(), false),
	applyColor: v.nullish(MindustryHexColorSchema),
	parentizeApplyEffect: v.nullish(v.boolean(), false),
	outline: v.nullish(v.boolean(), true),
});

export const StatusHjsonSchema: SchemaFn = (value, context) =>
	v.union([
		v.pipe(
			v.object({
				...statusBaseObjectSchema.entries,
				effect: v.nullish(EffectHjsonSchema(value.get("effect"), context)),
				applyEffect: v.nullish(EffectHjsonSchema(value.get("applyEffect"), context)),
				affinities: v.nullish(
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
				opposites: v.nullish(v.array(v.pipe(v.picklist(context.getStatuses().map((status) => status.name)))), []),
			}),
			v.forward(
				v.partialCheck(
					[["affinities"], ["opposites"]],
					(input) => !input.affinities.some((a) => input.opposites.includes(a)),
					"Affinities and opposites cannot be the same",
				),
				["opposites"],
			),
		),
		v.picklist(context.getStatuses().map((status) => status.name)),
	]);
