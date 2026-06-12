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
		),
		metadata({ type: "content" }),
	),
);

export const unlockableContentSchema = {
	localizedName: v.optional(v.string()),
	description: v.nullish(v.string(), ""),
	details: v.nullish(v.string(), ""),
	credit: v.nullish(v.string(), ""),
	alwaysUnlocked: v.optional(v.boolean(), false),
	inlineDescription: v.optional(v.boolean(), true),
	/** Whether details are hidden in custom games if this hasn't been unlocked in campaign mode. */
	hideDetails: v.optional(v.boolean(), true),
	/** Whether this is hidden from the Core Database. */
	hideDatabase: v.optional(v.boolean(), false),
	/** If false, all icon generation is disabled for this content; createIcons is not called. */
	generateIcons: v.optional(v.boolean(), true),
	/** How big the content appears in certain selection menus */
	selectionSize: v.optional(v.number(), 24),
	/** If true, this content will appear in all database tabs. */
	allDatabaseTabs: v.optional(v.boolean(), false),
	/**
	 * Planets that this content is made for. If empty, a planet is decided based on item requirements.
	 * Currently, this is only meaningful for blocks.
	 * */
	// public ObjectSet<Planet> shownPlanets = new ObjectSet<>();
	/**
	 * Content - usually a planet - that dictates which database tab(s) this content will appear in.
	 * If nothing is defined, it will use the values in shownPlanets.
	 * If shownPlanets is also empty, it will use Serpulo as the "default" tab.
	 * */
	// public ObjectSet<UnlockableContent> databaseTabs = new ObjectSet<>();
	/**
	 * Content category. Defines the primary category of content classification in core database.
	 * For example, "block", "liquid", "unit".
	 * Uses getContentType().name() as a fallback when the value is null or empty.
	 * */
	/**
	 * Category tags. Secondary category of content classification in core database.
	 * For example, "turret", "wall" under databaseCategory "block", "core-unit", "ground-unit" under databaseCategory "units".
	 * Uses "default" as a fallback when the value is null or empty. When using "default", no extra tag label are displayed.
	 * */
	databaseTag: v.nullish(v.pipe(CategorySchema, metadata({}))),
};
