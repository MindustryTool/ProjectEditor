import * as v from "valibot";

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
