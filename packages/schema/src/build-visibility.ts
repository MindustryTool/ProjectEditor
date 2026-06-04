import * as v from "valibot"

// TODO: Add BuildVisibility schema
// Java: mindustry.world.meta.BuildVisibility
export const buildVisibilities = [
	"hidden",
	"shown",
	"debugOnly",
	"editorOnly",
	"coreZoneOnly",
	"worldProcessorOnly",
	"sandboxOnly",
	"campaignOnly",
	"legacyLaunchPadOnly",
	"notLegacyLaunchPadOnly",
	"lightingOnly",
	"fogOnly",
] as const;

export const BuildVisibilitySchema = v.picklist(buildVisibilities);
