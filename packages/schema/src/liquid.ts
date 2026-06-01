import * as v from "valibot";
import { MindustryHexColorSchema, ResearchSchema } from "./base";
import { EffectSchema } from "./effect";
import type { HjsonNode } from "@project/hjson";

export const LiquidHjsonSchema = (value: HjsonNode) => v.object({
	color: v.nullish(MindustryHexColorSchema),
	gas: v.nullish(v.boolean(), false),
	gasColor: v.nullish(
		v.pipe(
			MindustryHexColorSchema,
			v.metadata({
				visibleWhen: {
					field: "gas",
					value: true,
				},
			}),
		),
	),
	barColor: v.nullish(MindustryHexColorSchema),
	lightColor: v.nullish(MindustryHexColorSchema),
	flammability: v.nullish(v.pipe(v.number())),
	temperature: v.nullish(v.pipe(v.number())),
	heatCapacity: v.nullish(v.pipe(v.number())),
	viscosity: v.nullish(v.pipe(v.number())),
	explosiveness: v.nullish(v.pipe(v.number())),
	blockReactive: v.nullish(v.boolean(), true),
	coolant: v.nullish(v.boolean(), true),
	moveThroughBlocks: v.nullish(v.boolean(), false),
	incinerable: v.nullish(v.boolean(), true),
	effect: v.nullish(EffectSchema(value.get("effect"))),
	particleEffect: v.nullish(EffectSchema(value.get("particleEffect"))),
	particleSpacing: v.nullish(v.pipe(v.number())),
	boilPoint: v.nullish(v.pipe(v.number())),
	capPuddles: v.nullish(v.boolean(), true),
	vaporEffect: v.nullish(EffectSchema(value.get("vaporEffect"))),
	hidden: v.nullish(v.boolean(), false),
	canStayOn: v.nullish(v.array(v.string())),
	research: ResearchSchema,
});
