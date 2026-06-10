import * as v from "valibot";
import { CachedSchema, findContent } from "./utils";
import { ContentNameSchema } from "./content";
import { metadata } from "./utils";
import type { SchemaFn } from "./utils";
import { ItemStackSchema } from "./item-stack";

export const ResearchSchema: SchemaFn = CachedSchema((context) => {
	return v.pipe(
		v.pipe(
			v.lazy((input) => {
				if (typeof input === "string") {
					return v.pipe(v.optional(ContentNameSchema, ""), metadata({ name: "simple" }));
				}
				return v.pipe(
					v.optional(
						v.object({
							parent: v.optional(ContentNameSchema),
							requirements: v.optional(v.array(ItemStackSchema(context)), []),
							objectives: v.optional(v.object({})),
							planet: v.optional(v.string()),
							robot: v.optional(v.boolean()),
						}),
						{},
					),
					metadata({ name: "complex" }),
				);
			}),
			metadata({
				type: "variant",
				options: [
					v.pipe(v.optional(ContentNameSchema, ""), metadata({ name: "simple" })),
					v.pipe(
						v.optional(
							v.object({
								parent: v.optional(ContentNameSchema),
								requirements: v.optional(v.array(ItemStackSchema(context)), []),
								objectives: v.optional(v.object({})),
								planet: v.optional(v.string()),
								robot: v.optional(v.boolean()),
							}),
							{},
						),
						metadata({ name: "complex" }),
					),
				],
			}),
		),
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
						const items = context.items;
						for (let i = 0; i < requirement.length; i++) {
							const req = requirement[i]!;
							if (typeof req === "string") {
								const parts = req.split("/");
								const itemName = parts[0]!.replace(context.name + "-", "");
								const item = items.find((i) => i.name.replaceAll(context.name + "-", "") === itemName);

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
			}
		}),
	);
});

export type Research = v.InferOutput<ReturnType<typeof ResearchSchema>>;
