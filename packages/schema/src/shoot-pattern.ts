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
	type: v.picklist(shootPatternTypes),
	name: v.nullish(v.string()),
	shots: v.nullish(v.number(), 1),
	firstShotDelay: v.nullish(v.number(), 0),
	shotDelay: v.nullish(v.number(), 0),
});

const classSchemaMap: Record<ShootPatternType, () => v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>> = {
	ShootAlternate: () =>
		v.object({
			barrels: v.nullish(v.number(), 2),
			spread: v.nullish(v.number(), 5),
			barrelOffset: v.nullish(v.number(), 0),
			mirror: v.nullish(v.boolean(), false),
		}),
	ShootBarrel: () =>
		v.object({
			barrels: v.nullish(v.array(v.number()), [0, 0, 0]),
			barrelOffset: v.nullish(v.number(), 0),
		}),
	ShootHelix: () =>
		v.object({
			scl: v.nullish(v.number(), 2),
			mag: v.nullish(v.number(), 1.5),
			offset: v.nullish(v.number(), Math.PI * 1.25),
		}),
	ShootMulti: () =>
		v.object({
			source: v.nullish(
				v.pipe(
					v.lazy(() => shootPatternItemUnionSchema),
					v.metadata(metadata),
				),
			),
			dest: v.nullish(
				v.array(
					v.pipe(
						v.lazy(() => shootPatternItemUnionSchema),
						v.metadata(metadata),
					),
				),
				[],
			),
		}),
	ShootSine: () =>
		v.object({
			scl: v.nullish(v.number(), 4),
			mag: v.nullish(v.number(), 20),
		}),
	ShootSpread: () =>
		v.object({
			spread: v.nullish(v.number(), 5),
		}),
	ShootSummon: () =>
		v.object({
			x: v.nullish(v.number(), 0),
			y: v.nullish(v.number(), 0),
			radius: v.nullish(v.number(), 0),
			spread: v.nullish(v.number(), 0),
		}),
};

export const shootPatternItemUnionSchema = v.pipe(
	v.lazy((input) => {
		if (typeof input === "object" && input !== null && "type" in input) {
			const type = input.type as ShootPatternType;
			const schemaFn = classSchemaMap[type];

			if (schemaFn) {
				return v.object({
					...shootPatternBaseObjectSchema.entries,
					...schemaFn().entries,
				});
			}
		}

		return shootPatternBaseObjectSchema;
	}),
	v.metadata(metadata),
);

export const ShootPatternHjsonSchema: SchemaFn = (value, context) => {
	return buildShootPatternHjsonSchema(value, context);
};

const buildShootPatternHjsonSchema: SchemaFn = (value) => {
	if (value.isObject()) {
		const type = value.get("type");

		if (type.isString() && classSchemaMap[type.valueOf() as ShootPatternType]) {
			const schema = classSchemaMap[type.valueOf() as ShootPatternType];
			return v.pipe(
				v.object({
					...shootPatternBaseObjectSchema.entries,
					...schema().entries,
				}),
				v.metadata(metadata),
			);
		}

		return v.pipe(shootPatternBaseObjectSchema, v.metadata(metadata));
	}

	return v.never("Shoot pattern must be an object");
};
