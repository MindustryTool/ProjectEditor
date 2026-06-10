import * as v from "valibot";
import type { AnySchema, SchemaFn } from "./utils";
import { CachedSchema, getSchemaMetadata, metadata } from "./utils";
import type { ProjectContents } from "@project/types";

export const classSchema = <T extends string>(classTypes: readonly T[], defaultValue?: NoInfer<T>) =>
	defaultValue
		? v.optional(
				v.pipe(
					v.string(),
					v.transform((input) => input.slice(0, 1).toUpperCase() + input.slice(1)),
					v.picklist(classTypes),
				),
				defaultValue,
			)
		: v.pipe(
				v.string(),
				v.transform((input) => input.slice(0, 1).toUpperCase() + input.slice(1)),
				v.picklist(classTypes),
			);

type ClassExtends<T extends string> = {
	className?: v.LiteralSchema<T, v.ErrorMessage<v.LiteralIssue> | undefined>;
};

export class ClassMap<K extends string> {
	constructor(
		private readonly map: Record<
			K,
			SchemaFn<v.ObjectSchema<v.ObjectEntries & ClassExtends<K>, v.ErrorMessage<v.ObjectIssue> | undefined>>
		>,
	) {}

	get(object: unknown, context: ProjectContents) {
		const result: v.ObjectEntries = {};
		if (object && typeof object === "object" && "type" in object && typeof object.type === "string") {
			const key = (object.type.slice(0, 1).toUpperCase() + object.type.slice(1)) as K;
			const visit = new Set<K>();

			try {
				const resoleKey = (key: K) => {
					if (visit.has(key)) {
						throw new Error(`Class ${key} circular reference`);
					}

					visit.add(key);

					if (this.map[key]) {
						const value = this.map[key](context);
						if (value.entries.className) {
							resoleKey(value.entries.className.literal);
							delete value.entries.className;
						}
						Object.assign(result, value.entries);
					} else {
						throw new Error(`Class ${key} not found`);
					}
				};

				resoleKey(key);
			} catch {
				console.error(this.map[key]);
			}
		}

		return result;
	}
}

export function mergeEntries(
	base: Record<string, AnySchema>,
	variant: Record<string, AnySchema>,
): Record<string, AnySchema> {
	const result = { ...base };
	for (const [key, variantField] of Object.entries(variant)) {
		if (variantField === undefined) continue;
		if (key in result) {
			const baseMeta = getSchemaMetadata(result[key]!);
			const variantMeta = getSchemaMetadata(variantField);
			const mergedMeta: Record<string, unknown> = { ...(baseMeta ?? {}), ...(variantMeta ?? {}) };
			result[key] = v.pipe(variantField, metadata(mergedMeta));
		} else {
			result[key] = variantField;
		}
	}
	return result;
}

export function createClassHjsonSchema<K extends string>(config: {
	classMap: ClassMap<K>;
	baseSchema: Record<string, AnySchema> | ((context: ProjectContents) => Record<string, AnySchema>);
	type: string;
	extra?: (context: ProjectContents) => Record<string, AnySchema>;
}): SchemaFn {
	return CachedSchema((context) =>
		v.lazy((input) => {
			const variant = config.classMap.get(input, context);
			const base = typeof config.baseSchema === "function" ? config.baseSchema(context) : config.baseSchema;
			const entries = mergeEntries(base, variant);
			const extraFields = config.extra?.(context) ?? {};
			return v.pipe(v.object({ ...entries, ...extraFields }), metadata({ type: config.type }));
		}),
	);
}
