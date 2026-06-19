import * as v from "valibot";
import { cached, metadata } from "./utils";
import { ResearchSchema } from "./research";
import type { SchemaFn } from "./utils";
import { unlockableContentSchema } from "./content";
import type { ProjectContents } from "@project/types";

export const sectorBaseObjectSchema = v.object({
	...unlockableContentSchema,
	captureWave: v.pipe(v.optional(v.pipe(v.number(), v.integer()), 0), metadata({ name: "editor.sector.capture-wave" })),
	difficulty: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(10)), 0),
		metadata({
			name: "editor.sector.difficulty",
			description: "editor.sector.difficulty-description",
		}),
	),
	startWaveTimeMultiplier: v.pipe(v.optional(v.number(), 2), metadata({ name: "editor.sector.start-wave-time-multiplier" })),
	addStartingItems: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.sector.add-starting-items" })),
	noLighting: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.sector.no-lighting" })),
	isLastSector: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.is-last-sector",
			description: "editor.sector.is-last-sector-description",
		}),
	),
	requireUnlock: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.sector.require-unlock",
			description: "editor.sector.require-unlock-description",
		}),
	),
	showHidden: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.show-hidden",
			description: "editor.sector.show-hidden-description",
		}),
	),
	showSectorLandInfo: v.pipe(v.optional(v.boolean(), true), metadata({ name: "editor.sector.show-sector-land-info" })),
	overrideLaunchDefaults: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.override-launch-defaults",
			description: "editor.sector.override-launch-defaults-description",
		}),
	),
	allowLaunchSchematics: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.allow-launch-schematics",
			description: "editor.sector.allow-launch-schematics-description",
		}),
	),
	allowLaunchLoadout: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.allow-launch-loadout",
			description: "editor.sector.allow-launch-loadout-description",
		}),
	),
	attackAfterWaves: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.attack-after-waves",
			description: "editor.sector.attack-after-waves-description",
		}),
	),
	originalPosition: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.sector.original-position",
			description: "editor.sector.original-position-description",
		}),
	),
	planet: v.pipe(v.optional(v.picklist(["serpulo", "erekir"])), metadata({ name: "editor.sector.planet" })),
	sector: v.pipe(v.optional(v.pipe(v.number(), v.minValue(0)), 0), metadata({ name: "editor.sector.sector" })),
});

export const SectorHjsonSchema: SchemaFn = (context) =>
	v.object({
		...sectorBaseObjectSchema.entries,
		research: v.optional(ResearchSchema(context)),
	});

export const SectorFieldSchema = cached((context: ProjectContents) =>
	v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.sectors.map((sector) => sector.name.replaceAll(context.name + "-", ""))),
	),
);
