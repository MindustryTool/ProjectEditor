import * as v from "valibot";
import type { SchemaFn } from "./base";

const metadata = { type: "shoot-pattern" };

export const shootPatternTypes = [
	"ShootAlternate",
	"ShootBarrel",
	"ShootHelix",
	"ShootMulti",
	"ShootSine",
	"ShootSpread",
	"ShootSummon",
] as const;

export type ShootPatternType = (typeof shootPatternTypes)[number];

const shootPatternBaseObjectSchema = v.object({
	type: v.optional(v.picklist(shootPatternTypes), shootPatternTypes[0]),
	name: v.optional(v.string()),
	shots: v.optional(v.number(), 1),
	firstShotDelay: v.optional(v.number(), 0),
	shotDelay: v.optional(v.number(), 0),
});

export const shootAlternateObjectSchema = v.object({
	barrels: v.optional(v.number(), 2),
	spread: v.optional(v.number(), 5),
	barrelOffset: v.optional(v.number(), 0),
	mirror: v.optional(v.boolean(), false),
});

export const shootBarrelObjectSchema = v.object({
	barrels: v.optional(v.array(v.number()), [0, 0, 0]),
	barrelOffset: v.optional(v.number(), 0),
});

export const shootHelixObjectSchema = v.object({
	scl: v.optional(v.number(), 2),
	mag: v.optional(v.number(), 1.5),
	offset: v.optional(v.number(), Math.PI * 1.25),
});

export const shootSineObjectSchema = v.object({
	scl: v.optional(v.number(), 4),
	mag: v.optional(v.number(), 20),
});

export const shootSpreadObjectSchema = v.object({
	spread: v.optional(v.number(), 5),
});

export const shootSummonObjectSchema = v.object({
	x: v.optional(v.number(), 0),
	y: v.optional(v.number(), 0),
	radius: v.optional(v.number(), 0),
	spread: v.optional(v.number(), 0),
});

const classSchemaMap: Record<ShootPatternType, SchemaFn<v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>>> = {
	ShootAlternate: (_context) => shootAlternateObjectSchema,
	ShootBarrel: (_context) => shootBarrelObjectSchema,
	ShootHelix: (_context) => shootHelixObjectSchema,
	ShootMulti: (context) =>
		v.object({
			source: ShootPatternHjsonSchema(context),
			dest: v.array(ShootPatternHjsonSchema(context)),
		}),
	ShootSine: (_context) => shootSineObjectSchema,
	ShootSpread: (_context) => shootSpreadObjectSchema,
	ShootSummon: (_context) => shootSummonObjectSchema,
};

export const ShootPatternHjsonSchema: SchemaFn = (context) => {
	return v.lazy((input) => {
		if (input && typeof input === "object" && "type" in input) {
			const type = input.type;

			if (typeof type === "string" && classSchemaMap[type as ShootPatternType]) {
				const schema = classSchemaMap[type as ShootPatternType];
				return v.pipe(
					v.object({
						...shootPatternBaseObjectSchema.entries,
						...schema(context).entries,
					}),
					v.metadata(metadata),
				);
			}
		}

		return v.pipe(shootPatternBaseObjectSchema, v.metadata(metadata));
	});
};
