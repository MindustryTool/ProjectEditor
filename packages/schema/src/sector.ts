import * as v from "valibot";
import { ResearchSchema } from "./base";

export const SectorHjsonSchema = v.object({
	captureWave: v.nullish(v.pipe(v.number(), v.integer()), 0),
	difficulty: v.nullish(v.pipe(v.number(), v.minValue(0), v.maxValue(10)), 0),
	startWaveTimeMultiplier: v.nullish(v.number(), 2),
	addStartingItems: v.nullish(v.boolean(), false),
	noLighting: v.nullish(v.boolean(), false),
	isLastSector: v.nullish(v.boolean(), false),
	requireUnlock: v.nullish(v.boolean(), true),
	showHidden: v.nullish(v.boolean(), false),
	showSectorLandInfo: v.nullish(v.boolean(), true),
	overrideLaunchDefaults: v.nullish(v.boolean(), false),
	allowLaunchSchematics: v.nullish(v.boolean(), false),
	allowLaunchLoadout: v.nullish(v.boolean(), false),
	attackAfterWaves: v.nullish(v.boolean(), false),
	originalPosition: v.nullish(v.number(), 0),
	planet: v.nullish(v.string(), ""),
	sector: v.nullish(v.pipe(v.number(), v.minValue(0)), 0),
	research: ResearchSchema,
});
