import * as v from "valibot";
import { MindustryHexColorSchema } from "./base";

export const LiquidHjsonSchema = v.object({
	color: v.nullish(MindustryHexColorSchema),
	gas: v.nullish(v.boolean(), false),
	gasColor: v.nullish(MindustryHexColorSchema),
	barColor: v.nullish(MindustryHexColorSchema),
	lightColor: v.nullish(MindustryHexColorSchema),
	flammability: v.nullish(v.pipe(v.number(), v.minValue(0), v.maxValue(1))),
	temperature: v.nullish(v.pipe(v.number(), v.minValue(0), v.maxValue(1))),
	heatCapacity: v.nullish(v.pipe(v.number(), v.minValue(0), v.maxValue(1))),
	viscosity: v.nullish(v.pipe(v.number(), v.minValue(0))),
	explosiveness: v.nullish(v.pipe(v.number(), v.minValue(0))),
	blockReactive: v.nullish(v.boolean(), true),
	coolant: v.nullish(v.boolean(), true),
	moveThroughBlocks: v.nullish(v.boolean(), false),
	incinerable: v.nullish(v.boolean(), true),
	effect: v.nullish(v.string()),
	particleEffect: v.nullish(v.string()),
	particleSpacing: v.nullish(v.pipe(v.number(), v.minValue(0))),
	boilPoint: v.nullish(v.pipe(v.number(), v.minValue(0))),
	capPuddles: v.nullish(v.boolean(), true),
	vaporEffect: v.nullish(v.string()),
	hidden: v.nullish(v.boolean(), false),
	canStayOn: v.nullish(v.array(v.string())),
});

export type LiquidHjsonData = v.InferOutput<typeof LiquidHjsonSchema>;
