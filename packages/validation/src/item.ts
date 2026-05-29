import * as v from "valibot";
import { ContentNameSchema, MindustryHexColorSchema } from "./base";

export const ItemRequirementSchema = v.pipe(
	v.string(),
	v.check((value) => {
		if (!value.includes("/")) {
			return false;
		}

		const parts = value.split("/");
		if (parts.length !== 2) {
			return false;
		}

		const [itemName, number] = parts;

		if (!itemName || !number) {
			return false;
		}

		if (!v.safeParse(ContentNameSchema, itemName).success) {
			return false;
		}

		if (!v.safeParse(v.pipe(v.string(), v.toNumber(), v.minValue(0), v.integer()), number).success) {
			return false;
		}

		return true;
	}, "Invalid item requirement, must be in the format 'item/number'"),
);

export const ResearchSchema = v.nullish(
	v.union([
		ContentNameSchema,
		v.object({
			parent: v.nullish(ContentNameSchema),
			requirements: v.nullish(v.array(ItemRequirementSchema)),
            objectives: v.nullish(v.any()),
            planet: v.nullish(v.string()),
            robot: v.nullish(v.boolean()),
		}),
	]),
);

export type Research = v.InferOutput<typeof ResearchSchema>;

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
});

export type ItemHjsonData = v.InferOutput<typeof ItemHjsonSchema>;
