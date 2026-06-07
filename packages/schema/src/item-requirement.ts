import * as v from "valibot";
import { ContentNameSchema } from "./content";
import { metadata } from "./utils";

export const ItemRequirementSchema = v.pipe(
	v.string(),
	metadata({ type: "item-requirement" }),
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
