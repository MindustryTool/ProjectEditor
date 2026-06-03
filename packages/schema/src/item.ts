import * as v from "valibot";
import { MindustryHexColorSchema, ResearchSchema, type SchemaFn } from "./base";

export const itemBaseObjectSchema = v.object({
	hardness: v.optional(v.pipe(v.number(), v.minValue(0), v.integer())),
	cost: v.optional(v.pipe(v.number(), v.minValue(0))),
	charge: v.optional(v.pipe(v.number(), v.minValue(0))),
	radioactivity: v.optional(v.pipe(v.number(), v.minValue(0))),
	flammability: v.optional(v.pipe(v.number(), v.minValue(0))),
	explosiveness: v.optional(v.pipe(v.number(), v.minValue(0))),
	healthScaling: v.optional(v.pipe(v.number(), v.minValue(0))),
	color: v.optional(MindustryHexColorSchema),
	lowPriority: v.optional(v.boolean()),
	buildable: v.optional(v.boolean()),
	hidden: v.optional(v.boolean(), false),
});

export const ItemHjsonSchema: SchemaFn = (context) =>
	v.object({
		...itemBaseObjectSchema.entries,
		research: ResearchSchema(context),
	});
