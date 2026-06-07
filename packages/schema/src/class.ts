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

export class ClassMap<K extends string> {
	constructor(private readonly map: Record<K, SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>>) {}

	get(object: unknown, context: ProjectContents) {
        const result: v.ObjectEntries = {};
		if (object && typeof object === "object" && "type" in object && typeof object.type === "string") {
			const key = (object.type.slice(0, 1).toUpperCase() + object.type.slice(1)) as K;

            Object.assign(result, this.map[key](context).entries);
		}

		return result;
	}
}
