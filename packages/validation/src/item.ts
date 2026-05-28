import * as v from "valibot";
import { ContentNameSchema, MindustryHexColorSchema } from "./base";

export const ItemRequirementSchema = v.pipe(
	v.string(),
	v.check((value) => {
		if (!value.includes("/")) {
			console.log("Value must contain a '/' character");
			return false;
		}

		const parts = value.split("/");
		if (parts.length !== 2) {
			console.log("Value must contain exactly two '/' characters");
			return false;
		}

		const [itemName, number] = parts;

		if (!itemName || !number) {
			console.log("Value must contain both an item name and a number");
			return false;
		}

		if (!v.safeParse(ContentNameSchema, itemName).success) {
			console.log("Item name must be a valid content name");
			return false;
		}

		if (!v.safeParse(v.pipe(v.string(), v.toNumber(), v.minValue(0), v.integer()), number).success) {
			console.log("Number must be a non-negative integer");
			return false;
		}

		return true;
	}, "Invalid item requirement, must be in the format 'item/number'"),
);

export const ItemHjsonSchema = v.object({
	hardness: v.nullish(v.pipe(v.number(), v.minValue(0), v.integer())),
	cost: v.nullish(v.pipe(v.number(), v.minValue(0))),
	charge: v.nullish(v.pipe(v.number(), v.minValue(0))),
	radioactivity: v.nullish(v.pipe(v.number(), v.minValue(0))),
	flammability: v.nullish(v.pipe(v.number(), v.minValue(0))),
	explosiveness: v.nullish(v.pipe(v.number(), v.minValue(0))),
	healthScaling: v.nullish(v.pipe(v.number(), v.minValue(0))),
	color: v.nullish(MindustryHexColorSchema),
	research: v.nullish(
		v.union([
			ContentNameSchema,
			v.object({
				parent: v.nullish(ContentNameSchema),
				requirements: v.nullish(v.array(ItemRequirementSchema)),
			}),
		]),
	),
});

export type ItemHjsonData = v.InferOutput<typeof ItemHjsonSchema>;
