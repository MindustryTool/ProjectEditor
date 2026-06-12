import * as v from "valibot";
import type { ProjectContents } from "@project/types";
import { ContentNameSchema } from "./content";
import { cached, metadata } from "./utils";

export function ItemStackItemFieldSchema(context: ProjectContents) {
	return v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.items.map((item) => item.name.replaceAll(context.name + "-", ""))),
	);
}

export const ItemStackSchema = cached((context: ProjectContents) =>
	v.pipe(
		v.lazy((input) => {
			if (typeof input === "string") {
				return v.pipe(
					v.string(),
                    metadata({type: 'item-stack'}),
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
			}
			return v.pipe(
				v.object({
					item: ItemStackItemFieldSchema(context),
					amount: v.pipe(v.number(), v.integer(), v.minValue(0)),
				}),
			);
		}),
	),
);
