import * as v from "valibot";
import { ContentNameSchema } from "./base";

export const ModHjsonSchema = v.object({
	name: v.pipe(
		ContentNameSchema,
		v.metadata({ name: "editor.mod-hjson.name", description: "editor.mod-hjson.name-description" }),
	),
	displayName: v.pipe(
		v.string(), v.minLength(2), v.maxLength(127),
		v.metadata({ name: "editor.mod-hjson.display-name", description: "editor.mod-hjson.display-name-description" }),
	),
	author: v.pipe(
		v.string(), v.minLength(2), v.maxLength(127),
		v.metadata({ name: "editor.mod-hjson.author", description: "editor.mod-hjson.author-description" }),
	),
	description: v.pipe(
		v.string(), v.maxLength(9999),
		v.metadata({ name: "editor.mod-hjson.description", description: "editor.mod-hjson.description-description", multiline: true }),
	),
	version: v.pipe(
		v.string(), v.maxLength(127),
		v.metadata({ name: "editor.mod-hjson.version", description: "editor.mod-hjson.version-description" }),
	),
	minGameVersion: v.pipe(
		v.string(),
		v.check((val) => {
			const num = Number(val);
			return !isNaN(num) && num > 157;
		}, "Must be a number greater than 157"),
		v.metadata({ name: "editor.mod-hjson.min-game-version", description: "editor.mod-hjson.min-game-version-description" }),
	),
	dependencies: v.pipe(
		v.optional(v.array(ContentNameSchema)),
		v.metadata({ name: "editor.mod-hjson.dependencies", description: "editor.mod-hjson.dependencies-description" }),
	),
	hidden: v.pipe(
		v.optional(v.boolean()),
		v.metadata({ name: "editor.mod-hjson.hidden", description: "editor.mod-hjson.hidden-description" }),
	),
});

export type ModHjsonData = v.InferOutput<typeof ModHjsonSchema>;
