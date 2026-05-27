import * as v from "valibot";

const LANGUAGE_VALUES = ["json", "java", "javascript"] as const;

export const ProjectInfoSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	name: v.pipe(v.string(), v.minLength(1), v.maxLength(100), v.regex(/^[a-zA-Z0-9._-]+$/)),
	language: v.optional(v.picklist(LANGUAGE_VALUES), "json"),
	createdAt: v.pipe(v.unknown(), v.toDate()),
	updatedAt: v.pipe(v.unknown(), v.toDate()),
});

export const SettingsSchema = v.object({
	theme: v.picklist(["light", "dark", "system"]),
	fontSize: v.pipe(v.number(), v.minValue(8), v.maxValue(32)),
	tabSize: v.pipe(v.number(), v.minValue(1), v.maxValue(8)),
	autoSave: v.boolean(),
	autoSaveDelay: v.pipe(v.number(), v.minValue(500), v.maxValue(10000)),
});

export { ModNameSchema, ModHjsonSchema } from "./mod-hjson";
export type { ModHjsonData } from "./mod-hjson";
