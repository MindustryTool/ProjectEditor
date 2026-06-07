import * as v from "valibot";
import type { ProjectContents } from "@project/types";
import { ItemFieldSchema } from "./item";

export const ItemStackSchema = (context: ProjectContents) =>
	v.object({
		item: ItemFieldSchema(context),
		amount: v.pipe(v.number(), v.integer(), v.minValue(0)),
	});
