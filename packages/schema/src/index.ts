import * as v from "valibot";

export const SettingsSchema = v.object({
	theme: v.picklist(["light", "dark", "system"]),
	fontSize: v.pipe(v.number(), v.minValue(8), v.maxValue(32)),
	tabSize: v.pipe(v.number(), v.minValue(1), v.maxValue(8)),
	autoSave: v.boolean(),
	autoSaveDelay: v.pipe(v.number(), v.minValue(500), v.maxValue(10000)),
});

export { ModHjsonSchema } from "./mod-hjson";
export type { ModHjsonData } from "./mod-hjson";

export { ItemHjsonSchema } from "./item";

export { ContentNameSchema, MindustryHexColorSchema, ResearchSchema } from "./base";
export type { Research, SchemaFn } from "./base";

export { SectorHjsonSchema } from "./sector";

export { StatusHjsonSchema } from "./status";

export { LiquidHjsonSchema } from "./liquid";

export { resolveSchema, unwrapSchema, hasNullishWrapper, detectSchemaType, getSchemaEntries, getArrayItemSchema, getSchemaMetadata } from "./schema-utils";
export type { AnySchema, SchemaMetadata } from "./schema-utils";
