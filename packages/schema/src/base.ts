import * as v from "valibot";

export const ContentNameSchema = v.pipe(
	v.string(),
	v.regex(/^[a-z][a-z0-9-]*$/, "Must be lowercase letters, digits, hyphens"),
	v.minLength(2),
	v.maxLength(127),
);

export const MindustryHexColorSchema = v.pipe(
	v.string(),
	v.regex(/^[#]{0,1}(?:[0-9a-fA-F]{1,6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"),
);

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
