import { findContent, type ProjectContents } from "@project/core";
import type { HjsonNode } from "@project/hjson";
import * as v from "valibot";

export const ContentNameSchema = v.pipe(
	v.string(),
	v.regex(/^[a-z][a-zA-Z0-9-]*$/, "Must be lowercase letters, digits, hyphens"),
	v.minLength(2),
	v.maxLength(127),
);

export const MindustryHexColorSchema = v.pipe(
	v.string(),
	v.regex(/^[#]{0,1}(?:[0-9a-fA-F]{1,6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"),
    v.metadata({
        type: "color",
    })
);

export const ItemRequirementSchema = v.pipe(
	v.string(),
	v.check((value) => {
		if (!value.includes("/")) {
			return false;
		}

		const parts = value.split("/");
		if (parts.length !== 2) {
			return false;
		}

		const [itemName, number] = parts;

		if (!itemName || !number) {
			return false;
		}

		if (!v.safeParse(ContentNameSchema, itemName).success) {
			return false;
		}

		if (!v.safeParse(v.pipe(v.string(), v.toNumber(), v.minValue(0), v.integer()), number).success) {
			return false;
		}

		return true;
	}, "Invalid item requirement, must be in the format 'item/number'"),
);

export const ResearchSchema: SchemaFn = (_value, context) =>
	v.nullish(
		v.pipe(
			v.union([
				ContentNameSchema,
				v.object({
					parent: v.nullish(ContentNameSchema),
					requirements: v.nullish(v.array(ItemRequirementSchema)),
					objectives: v.nullish(v.any()),
					planet: v.nullish(v.string()),
					robot: v.nullish(v.boolean()),
				}),
			]),
            v.metadata({
                type: "research",
            }),
			v.rawCheck(({ dataset, addIssue }) => {
				if (dataset.typed) {
					const value = dataset.value;

					if (typeof value === "string") {
						const content = findContent(value, context);

						if (!content) {
							addIssue({
								message: `Content ${value} not found`,
							});
						}
					} else if (typeof value === "object") {
						const parent = value.parent;

						if (parent) {
							const content = findContent(parent, context);

							if (!content) {
								addIssue({
									message: `Content ${parent} not found`,
									path: [
										{
											type: "object",
											key: "parent",
											origin: "value",
											input: value,
											value: parent,
										},
									],
								});
							}
						}
						const requirement = value.requirements;

						if (requirement) {
							const items = context.getItems();
							for (let i = 0; i < requirement.length; i++) {
								const req = requirement[i]!;
								const parts = req.split("/");
								const itemName = parts[0];
								const item = items.find((i) => i.name === itemName);

								if (!item) {
									addIssue({
										message: `Item ${itemName} not found`,
										path: [
											{
												type: "object",
												key: "requirements",
												input: value,
												origin: "value",
												value: req,
											},
											{
												type: "array",
												key: i,
												input: requirement,
												origin: "value",
												value: req,
											},
										],
									});
								}
							}
						}
					}
				}
			}),
		),
	);

export type Research = v.InferOutput<ReturnType<typeof ResearchSchema>>;

export const SoundSchema = v.pipe(v.string(), v.minLength(1), v.maxLength(127));

export type SchemaFn<
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>> = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
> = (value: HjsonNode, context: ProjectContents) => T;
