import * as v from "valibot";
import { MindustryHexColorSchema, ResearchSchema } from "./base";

export const LiquidHjsonSchema = v.object({
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
	effect: v.nullish(v.string()),
	particleEffect: v.nullish(v.string()),
	particleSpacing: v.nullish(v.pipe(v.number())),
	boilPoint: v.nullish(v.pipe(v.number())),
	capPuddles: v.nullish(v.boolean(), true),
	vaporEffect: v.nullish(v.string()),
	hidden: v.nullish(v.boolean(), false),
	canStayOn: v.nullish(v.array(v.string())),
    research: ResearchSchema,
});

export type LiquidHjsonData = v.InferOutput<typeof LiquidHjsonSchema>;
