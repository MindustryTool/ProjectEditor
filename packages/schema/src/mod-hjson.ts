import * as v from "valibot";
import { ContentNameSchema } from "./base";

export const ModHjsonSchema = v.object({
	name: ContentNameSchema,
	displayName: v.pipe(v.string(), v.minLength(2), v.maxLength(127)),
	author: v.pipe(v.string(), v.minLength(2), v.maxLength(127)),
	description: v.pipe(v.string(), v.maxLength(9999)),
	version: v.pipe(v.string(), v.maxLength(127)),
	minGameVersion: v.pipe(
		v.string(),
		v.check((val) => {
			const num = Number(val);
			return !isNaN(num) && num > 157;
		}, "Must be a number greater than 157"),
	),
	dependencies: v.optional(v.array(ContentNameSchema)),
	hidden: v.optional(v.boolean()),
});

export type ModHjsonData = v.InferOutput<typeof ModHjsonSchema>;
