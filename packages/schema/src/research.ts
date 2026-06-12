import * as v from "valibot";
import { CachedSchema } from "./utils";
import { ContentFieldSchema } from "./content";
import { metadata } from "./utils";
import type { SchemaFn } from "./utils";
import { ItemStackSchema } from "./item-stack";
import type { ProjectContents } from "@project/types";

const simpleSchema = (context: ProjectContents) => v.pipe(v.optional(ContentFieldSchema(context), ""), metadata({ option: "simple" }));

const complexSchema = (context: ProjectContents) =>
	v.pipe(
		v.optional(
			v.lazy((input) => {
				if (input && typeof input === "object") {
					if ("root" in input && input.root === true) {
						return v.object({
							root: v.optional(v.boolean(), false),
							name: v.optional(v.string(), ""),
							planet: v.optional(v.string()),
							objectives: v.optional(v.object({})),
						});
					}

					return v.object({
						root: v.optional(v.boolean(), false),
						parent: v.optional(ContentFieldSchema(context)),
						planet: v.optional(v.string()),
						requirements: v.optional(v.array(ItemStackSchema(context)), []),
						objectives: v.optional(v.object({})),
					});
				}

				return v.never();
			}),
			{},
		),
		metadata({ option: "complex" }),
	);

export const ResearchSchema: SchemaFn = CachedSchema((context) => {
	return v.pipe(
		v.pipe(
			v.lazy((input) => {
				if (typeof input === "string") {
					return simpleSchema(context);
				}

				return complexSchema(context);
			}),
			metadata({
				type: "options",
				options: [simpleSchema(context), complexSchema(context)],
			}),
		),
	);
});

export type Research = v.InferOutput<ReturnType<typeof ResearchSchema>>;
