import * as v from "valibot";
import { metadata } from "./utils";
import { ResearchSchema, type SchemaFn } from "./base";

export const sectorBaseObjectSchema = v.object({
	captureWave: v.pipe(
		v.optional(v.pipe(v.number(), v.integer()), 0),
		metadata({ name: "editor.sector.captureWave" }),
	),
	difficulty: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(10)), 0),
		metadata({
			name: "editor.sector.difficulty",
			description: "editor.sector.difficulty-description",
		}),
	),
	startWaveTimeMultiplier: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.sector.startWaveTimeMultiplier" }),
	),
	addStartingItems: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.sector.addStartingItems" }),
	),
	noLighting: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.sector.noLighting" }),
	),
	isLastSector: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.isLastSector",
			description: "editor.sector.isLastSector-description",
		}),
	),
	requireUnlock: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.sector.requireUnlock",
			description: "editor.sector.requireUnlock-description",
		}),
	),
	showHidden: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.showHidden",
			description: "editor.sector.showHidden-description",
		}),
	),
	showSectorLandInfo: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.sector.showSectorLandInfo" }),
	),
	overrideLaunchDefaults: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.overrideLaunchDefaults",
			description: "editor.sector.overrideLaunchDefaults-description",
		}),
	),
	allowLaunchSchematics: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.allowLaunchSchematics",
			description: "editor.sector.allowLaunchSchematics-description",
		}),
	),
	allowLaunchLoadout: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.allowLaunchLoadout",
			description: "editor.sector.allowLaunchLoadout-description",
		}),
	),
	attackAfterWaves: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.sector.attackAfterWaves",
			description: "editor.sector.attackAfterWaves-description",
		}),
	),
	originalPosition: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.sector.originalPosition",
			description: "editor.sector.originalPosition-description",
		}),
	),
	planet: v.pipe(
		v.optional(v.picklist(["serpulo", "erekir"])),
		metadata({ name: "editor.sector.planet" }),
	),
	sector: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0)), 0),
		metadata({ name: "editor.sector.sector" }),
	),
});

export const SectorHjsonSchema: SchemaFn = (context) =>
	v.object({
		...sectorBaseObjectSchema.entries,
		research: v.optional(ResearchSchema(context)),
	});
