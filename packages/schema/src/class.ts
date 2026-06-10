import * as v from "valibot";
import type { SchemaFn } from "./utils";
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

type ClassExtends<T extends string> = v.ObjectSchema<
	{
		className: v.LiteralSchema<T, v.ErrorMessage<v.LiteralIssue> | undefined>;
	},
	v.ErrorMessage<v.ObjectIssue> | undefined
>;

export function extend<T extends string>(clazz: T): ClassExtends<T> {
	return v.object({ className: v.literal(clazz) });
}

export class ClassMap<K extends string> {
	constructor(
		private readonly map: Record<
			K,
			SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>> | ClassExtends<K>
		>,
	) {}

	get(object: unknown, context: ProjectContents) {
		const result: v.ObjectEntries = {};
		if (object && typeof object === "object" && "type" in object && typeof object.type === "string") {
			const key = (object.type.slice(0, 1).toUpperCase() + object.type.slice(1)) as K;
			try {
				const resoleKey = (key: K) => {
					if (this.map[key]) {
						const value = this.map[key];
						if (typeof value === "function") {
							Object.assign(result, value(context).entries);
						} else {
							resoleKey(value.entries.className.literal);
						}
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
