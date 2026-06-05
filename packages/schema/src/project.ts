import * as v from "valibot";

export const AppSettingsSchema = v.object({
	firstTime: v.fallback(v.boolean(), true),
	theme: v.fallback(v.picklist(["light", "dark", "system"]), "light"),
	fontSize: v.fallback(v.number(), 14),
	tabSize: v.fallback(v.number(), 4),
	validation: v.object({
		validationDelayMs: v.fallback(v.number(), 1000),
	}),
});

export type AppSettings = v.InferInput<typeof AppSettingsSchema>;

export const ProjectRecordSchema = v.object({
	id: v.string(),
	name: v.fallback(v.string(), "unknown"),
	language: v.fallback(v.string(), "json"),
	createdAt: v.fallback(v.union([v.pipe(v.string(), v.toDate()), v.date()]), new Date()),
	updatedAt: v.fallback(v.union([v.pipe(v.string(), v.toDate()), v.date()]), new Date()),
});

export type ProjectRecord = v.InferInput<typeof ProjectRecordSchema>;
