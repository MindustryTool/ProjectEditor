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

export function mergeEntries(base: Record<string, AnySchema>, variant: Record<string, AnySchema>): Record<string, AnySchema> {
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

export class ClassMap<K extends string> {
	private _schema?: SchemaFn;

	constructor(
		private readonly map: Record<K, (context: ProjectContents) => Record<string, AnySchema>>,
		private readonly options: {
			baseSchema:
				| Record<string, AnySchema>
				| ((context: ProjectContents) => Record<string, AnySchema>)
				| ((context: ProjectContents) => v.LazySchema<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>);
			type?: string;
			extra?: (context: ProjectContents) => Record<string, AnySchema>;
		},
	) {}

	get schema(): SchemaFn {
		if (!this._schema) {
			this._schema = CachedSchema((context) =>
				v.lazy((input) => {
					const variant = this.collect(input, context);
					let base = typeof this.options.baseSchema === "function" ? this.options.baseSchema(context) : this.options.baseSchema;
					if ('getter' in base) {
						base = (base as v.LazySchema<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>).getter(input).entries;
					}
					const entries = mergeEntries(base, variant);
					const extraFields = this.options.extra?.(context) ?? {};
					const type = this.options.type;
					return v.pipe(v.object({ ...entries, ...extraFields }), metadata({ type }));
				}),
			);
		}
		return this._schema;
	}

	private collect(object: unknown, context: ProjectContents): Record<string, AnySchema> {
		const result: Record<string, AnySchema> = {};
		if (object && typeof object === "object" && "type" in object && typeof object.type === "string") {
			const key = (object.type.slice(0, 1).toUpperCase() + object.type.slice(1)) as K;
			const visit = new Set<K>();

			const resolveKey = (key: K) => {
				if (visit.has(key)) throw new Error(`Class ${key} circular reference`);
				visit.add(key);

				const entries = this.map[key]?.(context);
				if (!entries) return;

				for (const [entryKey, schema] of Object.entries(entries)) {
					if (entryKey === "className") continue;
					result[entryKey] = schema;
				}
			};

			try {
				resolveKey(key);
			} catch {
				console.error(this.map[key]);
			}
		}
		return result;
	}
}
