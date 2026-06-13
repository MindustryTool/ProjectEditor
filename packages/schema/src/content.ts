import * as v from "valibot";
import { CachedSchema, metadata } from "./utils";
import type { ProjectContents } from "@project/types";
import { CategorySchema } from "./category";

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
		v.picklist(
			[
				...context.items,
				...context.blocks,
				...context.liquids,
				...context.sectors,
				...context.statuses,
				...context.units,
				...context.sprites,
				...context.effects,
				...context.sounds,
			].map((item) => item.name.replaceAll(context.name + "-", "")),
			"Invalid content name",
		),
		metadata({ type: "content" }),
	),
);

export const unlockableContentSchema = {
	localizedName: v.pipe(
		v.optional(v.string()),
		metadata({ name: "editor.content.localized-name", description: "editor.content.localized-name-description" }),
	),
	description: v.pipe(
		v.nullish(v.string(), ""),
		metadata({ name: "editor.content.description", description: "editor.content.description-description" }),
	),
	details: v.pipe(
		v.nullish(v.string(), ""),
		metadata({ multiline: true, name: "editor.content.details", description: "editor.content.details-description" }),
	),
	credit: v.pipe(v.nullish(v.string(), ""), metadata({ name: "editor.content.credit", description: "editor.content.credit-description" })),
	alwaysUnlocked: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.content.always-unlocked", description: "editor.content.always-unlocked-description" }),
	),
	inlineDescription: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.content.inline-description", description: "editor.content.inline-description-description" }),
	),
	hideDetails: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.content.hide-details", description: "editor.content.hide-details-description" }),
	),
	hideDatabase: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.content.hide-database", description: "editor.content.hide-database-description" }),
	),
	generateIcons: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.content.generate-icons", description: "editor.content.generate-icons-description" }),
	),
	selectionSize: v.pipe(
		v.optional(v.number(), 24),
		metadata({ name: "editor.content.selection-size", description: "editor.content.selection-size-description" }),
	),
	allDatabaseTabs: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.content.all-database-tabs", description: "editor.content.all-database-tabs-description" }),
	),
	databaseTag: v.pipe(
		v.nullish(v.pipe(CategorySchema, metadata({}))),
		metadata({ name: "editor.content.database-tag", description: "editor.content.database-tag-description" }),
	),
};
