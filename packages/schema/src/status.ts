import * as v from "valibot";
import { MindustryHexColorSchema } from "./base";
import { EffectSchema } from "./effect";
import type { HjsonNode } from "@project/hjson";

export const StatusHjsonSchema = (value: HjsonNode) => v.object({
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
	effect: v.nullish(EffectSchema(value.get("effect"))),
	applyEffect: v.nullish(EffectSchema(value.get("applyEffect"))),
	applyExtend: v.nullish(v.boolean(), false),
	applyColor: v.nullish(MindustryHexColorSchema),
	parentizeApplyEffect: v.nullish(v.boolean(), false),
	outline: v.nullish(v.boolean(), true),
});
