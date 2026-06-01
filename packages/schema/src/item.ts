import * as v from "valibot";
import { MindustryHexColorSchema, ResearchSchema } from "./base";

export const ItemHjsonSchema = v.object({
	hardness: v.nullish(v.pipe(v.number(), v.minValue(0), v.integer())),
	cost: v.nullish(v.pipe(v.number(), v.minValue(0))),
	charge: v.nullish(v.pipe(v.number(), v.minValue(0))),
	radioactivity: v.nullish(v.pipe(v.number(), v.minValue(0))),
	flammability: v.nullish(v.pipe(v.number(), v.minValue(0))),
	explosiveness: v.nullish(v.pipe(v.number(), v.minValue(0))),
	healthScaling: v.nullish(v.pipe(v.number(), v.minValue(0))),
	color: v.nullish(MindustryHexColorSchema),
	research: ResearchSchema,
	lowPriority: v.nullish(v.boolean()),
	buildable: v.nullish(v.boolean()),
	hidden: v.nullish(v.boolean(), false),
});

export type ItemHjsonData = v.InferOutput<typeof ItemHjsonSchema>;
