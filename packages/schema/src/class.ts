import * as v from "valibot";
import type { AnySchema, SchemaFn } from "./utils";
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

function extend<T extends string>(clazz: NoInfer<T>, schema: Record<string, AnySchema>): ClassExtends<T> {
	return { className: v.literal(clazz), ...schema };
}

export class ClassMap<K extends string> {
	constructor(
		private readonly map: Record<
			K,
			SchemaFn<v.ObjectSchema<v.ObjectEntries & ClassExtends<K>, v.ErrorMessage<v.ObjectIssue> | undefined>>
		>,
	) {}

	register(
		clazz: K,
		provider: (props: {
			extend: (clazz: K, schema: Record<string, AnySchema>) => ClassExtends<K>;
		}) => SchemaFn<v.ObjectSchema<v.ObjectEntries & ClassExtends<K>, v.ErrorMessage<v.ObjectIssue> | undefined>>,
	) {
		this.map[clazz] = provider({ extend });
	}

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
