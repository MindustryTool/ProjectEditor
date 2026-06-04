import * as v from "valibot";

// TODO: Add BlockGroup schema
// Java: mindustry.world.meta.BlockGroup
export const blockGroups = [
	"none",
	"walls",
	"projectors",
	"turrets",
	"transportation",
	"power",
	"liquids",
	"drills",
	"units",
	"logic",
	"payloads",
    "heat",
] as const;

export const BlockGroupSchema = v.picklist(blockGroups);
