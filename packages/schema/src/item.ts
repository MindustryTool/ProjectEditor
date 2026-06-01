import * as v from "valibot";
import { MindustryHexColorSchema, ResearchSchema, type SchemaFn } from "./base";

export const ItemHjsonSchema: SchemaFn = (value, context) => v.object({
	hardness: v.nullish(v.pipe(v.number(), v.minValue(0), v.integer())),
	cost: v.nullish(v.pipe(v.number(), v.minValue(0))),
	charge: v.nullish(v.pipe(v.number(), v.minValue(0))),
	radioactivity: v.nullish(v.pipe(v.number(), v.minValue(0))),
	flammability: v.nullish(v.pipe(v.number(), v.minValue(0))),
	explosiveness: v.nullish(v.pipe(v.number(), v.minValue(0))),
	healthScaling: v.nullish(v.pipe(v.number(), v.minValue(0))),
	color: v.nullish(MindustryHexColorSchema),
	research: ResearchSchema(value.get("research"), context),
	lowPriority: v.nullish(v.boolean()),
	buildable: v.nullish(v.boolean()),
	hidden: v.nullish(v.boolean(), false),
});
