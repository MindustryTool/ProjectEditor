import type { ProjectContents } from "@project/types";
import * as v from "valibot";
import { metadata } from "./utils";

export const ContentNameSchema = v.pipe(
	v.string(),
	v.regex(/^[a-z][a-zA-Z0-9-]*$/, "Must be lowercase letters, digits, hyphens"),
	v.minLength(2),
	v.maxLength(127),
);

export const MindustryHexColorSchema = v.pipe(
	v.string(),
	v.regex(/^[#]{0,1}(?:[0-9a-fA-F]{1,8})$/, "Must be a valid hex color"),
	metadata({
		type: "color",
	}),
);

export const Envs = {
	terrestrial: 1,
	space: 1 << 1,
	underwater: 1 << 2,
	spores: 1 << 3,
	scorching: 1 << 4,
	groundOil: 1 << 5,
	groundWater: 1 << 6,
	oxygen: 1 << 7,
	any: 0xffffffff,
	none: 0,
} as const satisfies Record<string, number>;

export const EnvValues = Object.values(Envs);

export const EnvSchema = v.pipe(v.number(), v.picklist(EnvValues), metadata({ type: "env" }));

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

export const ResearchSchema: SchemaFn = CachedSchema((context) => {
	return v.pipe(
		v.lazy((input) => {
			if (typeof input === "string") {
				return ContentNameSchema;
			}

			return v.object({
				parent: v.optional(ContentNameSchema),
				requirements: v.optional(v.array(ItemRequirementSchema)),
				objectives: v.optional(v.object({})),
				planet: v.optional(v.string()),
				robot: v.optional(v.boolean()),
			});
		}),
		metadata({
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
						const items = context.items;
						for (let i = 0; i < requirement.length; i++) {
							const req = requirement[i]!;
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
		}),
	);
});

export type Research = v.InferOutput<ReturnType<typeof ResearchSchema>>;

export const SoundHjsonSchema = v.pipe(
	v.string(),
	v.minLength(1),
	v.maxLength(127),
	metadata({
		type: "sound",
	}),
);

export const SpriteHjsonSchema: SchemaFn = CachedSchema((context) =>
	v.pipe(
		v.picklist([...new Set(context.sprites.map((sprite) => sprite.name))]),
		v.minLength(1),
		v.maxLength(127),
		metadata({
			type: "sprite",
		}),
	),
);

export type SchemaFn<
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>> = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
> = (context: ProjectContents) => T;

export function CachedSchema<T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(schemaFn: SchemaFn<T>): SchemaFn<T> {
	let cacheValue: T | null = null;
	let cacheKey: ProjectContents | null = null;

	return (context) => {
		if (cacheKey === context && cacheValue) {
			return cacheValue;
		}

		const result = schemaFn(context);
		cacheValue = result;
		cacheKey = context;
		return result;
	};
}

export const Interps = [
	"linear",
	"reverse",
	"smooth",
	"smooth2",
	"one",
	"zero",
	"slope",
	"smoother",
	"fade",
	"pow2",
	"pow2In",
	"slowFast",
	"pow2Out",
	"fastSlow",
	"pow2InInverse",
	"pow2OutInverse",
	"pow3",
	"pow3In",
	"pow3Out",
	"pow3InInverse",
	"pow3OutInverse",
	"pow4",
	"pow4In",
	"pow4Out",
	"pow5",
	"pow5In",
	"pow10In",
	"pow10Out",
	"pow5Out",
	"sine",
	"sineIn",
	"sineOut",
	"exp10",
	"exp10In",
	"exp10Out",
	"exp5",
	"exp5In",
	"exp5Out",
	"circle",
	"circleIn",
	"circleOut",
	"elastic",
	"elasticIn",
	"elasticOut",
	"swing",
	"swingIn",
	"swingOut",
	"bounce",
	"bounceIn",
	"bounceOut",
] as const;

export function findContent(name: string, context: ProjectContents) {
	name = name.replace(context.name + "-", "");

	const find = (name: string, items: readonly { name: string }[]) => {
		return items.find((entry) => entry.name.replaceAll(context.name + "-", "") === name);
	};

	const item = find(name, context.items);

	if (item) {
		return item;
	}

	const block = find(name, context.blocks);
	if (block) {
		return block;
	}

	const liquid = find(name, context.liquids);
	if (liquid) {
		return liquid;
	}

	const sector = find(name, context.sectors);
	if (sector) {
		return sector;
	}

	const status = find(name, context.statuses);
	if (status) {
		return status;
	}

	const unit = find(name, context.units);
	if (unit) {
		return unit;
	}

	return null;
}
