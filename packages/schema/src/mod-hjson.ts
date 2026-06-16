import * as v from "valibot";
import { metadata } from "./utils";
import { ContentNameSchema } from "./content";

export const ModHjsonSchema = v.object({
	name: v.pipe(ContentNameSchema, metadata({ name: "editor.mod-hjson.name", description: "editor.mod-hjson.name-description" })),
	displayName: v.pipe(
		v.string(),
		v.minLength(2),
		v.maxLength(127),
		metadata({ name: "editor.mod-hjson.display-name", description: "editor.mod-hjson.display-name-description" }),
	),
	author: v.pipe(
		v.string(),
		v.minLength(2),
		v.maxLength(127),
		metadata({ name: "editor.mod-hjson.author", description: "editor.mod-hjson.author-description" }),
	),
	description: v.optional(
		v.pipe(
			v.string(),
			v.maxLength(9999),
			metadata({ name: "editor.mod-hjson.description", description: "editor.mod-hjson.description-description", multiline: true }),
		),
	),
	subtitle: v.optional(
		v.pipe(
			v.string(),
			v.maxLength(127),
			metadata({ name: "editor.mod-hjson.subtitle", description: "editor.mod-hjson.subtitle-description" }),
		),
	),
	version: v.pipe(
		v.string(),
		v.maxLength(127),
		metadata({ name: "editor.mod-hjson.version", description: "editor.mod-hjson.version-description" }),
	),
	minGameVersion: v.pipe(
		v.string(),
		v.check((val) => {
			const num = Number(val);
			return !isNaN(num) && num > 157;
		}, "Must be a number greater than 157"),
		metadata({ name: "editor.mod-hjson.min-game-version", description: "editor.mod-hjson.min-game-version-description" }),
	),
	dependencies: v.pipe(
		v.optional(v.array(ContentNameSchema)),
		metadata({ name: "editor.mod-hjson.dependencies", description: "editor.mod-hjson.dependencies-description" }),
	),
	hidden: v.pipe(
		v.optional(v.boolean()),
		metadata({ name: "editor.mod-hjson.hidden", description: "editor.mod-hjson.hidden-description" }),
	),
});

export type ModHjsonData = v.InferOutput<typeof ModHjsonSchema>;
