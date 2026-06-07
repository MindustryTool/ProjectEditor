import * as v from "valibot";
import { CachedSchema } from "./utils";
import type { ProjectContents } from "@project/types";

export const ContentNameSchema = v.pipe(
	v.string(),
	v.regex(/^[a-zA-Z0-9-]*$/, "Must be lowercase letters, digits, hyphens"),
	v.minLength(2),
	v.maxLength(127),
);

export const ContentFieldSchema = CachedSchema((context: ProjectContents) =>
	v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.items.map((item) => item.name.replaceAll(context.name + "-", ""))),
	),
);
