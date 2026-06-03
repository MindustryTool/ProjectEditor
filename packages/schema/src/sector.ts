import * as v from "valibot";
import { ResearchSchema, type SchemaFn } from "./base";

export const sectorBaseObjectSchema = v.object({
	captureWave: v.optional(v.pipe(v.number(), v.integer()), 0),
	difficulty: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(10)), 0),
	startWaveTimeMultiplier: v.optional(v.number(), 2),
	addStartingItems: v.optional(v.boolean(), false),
	noLighting: v.optional(v.boolean(), false),
	isLastSector: v.optional(v.boolean(), false),
	requireUnlock: v.optional(v.boolean(), true),
	showHidden: v.optional(v.boolean(), false),
	showSectorLandInfo: v.optional(v.boolean(), true),
	overrideLaunchDefaults: v.optional(v.boolean(), false),
	allowLaunchSchematics: v.optional(v.boolean(), false),
	allowLaunchLoadout: v.optional(v.boolean(), false),
	attackAfterWaves: v.optional(v.boolean(), false),
	originalPosition: v.optional(v.number(), 0),
	planet: v.optional(v.picklist(["serpulo", "erekir"])),
	sector: v.optional(v.pipe(v.number(), v.minValue(0)), 0),
});

export const SectorHjsonSchema: SchemaFn = (context) =>
	v.object({
		...sectorBaseObjectSchema.entries,
		research: ResearchSchema(context),
	});
