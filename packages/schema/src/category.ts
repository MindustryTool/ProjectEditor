import * as v from "valibot";

// TODO: Add Category schema
// Java: mindustry.world.meta.Category
export const categories = [
	/** Offensive turrets. */
	"turret",
	/** Blocks that produce raw resources, such as drills. */
	"production",
	/** Blocks that move items around. */
	"distribution",
	/** Blocks that move liquids around. */
	"liquid",
	/** Blocks that generate or transport power. */
	"power",
	/** Walls and other defensive structures. */
	"defense",
	/** Blocks that craft things. */
	"crafting",
	/** Blocks that create units. */
	"units",
	/** Things for storage or passive effects. */
	"effect",
	/** Blocks related to logic. */
	"logic",
] as const;

export const CategorySchema = v.picklist(categories);
