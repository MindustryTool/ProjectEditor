import * as v from "valibot";
import { metadata } from "./utils";
import type { SchemaFn } from "./utils";
import { ClassMap, classSchema } from "./class";
import { Order } from "./order";

export const shootPatternTypes = [
	"ShootPattern",
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
	name: v.pipe(v.optional(v.string()), metadata({ order: Order.NAME })),
	type: v.pipe(classSchema(shootPatternTypes, "ShootPattern"), metadata({ order: Order.TYPE })),
	shots: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "editor.shoot-pattern.shots", description: "editor.shoot-pattern.shots-description" }),
	),
	firstShotDelay: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.shoot-pattern.first-shot-delay", description: "editor.shoot-pattern.first-shot-delay-description" }),
	),
	shotDelay: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.shoot-pattern.shot-delay", description: "editor.shoot-pattern.shot-delay-description" }),
	),
});

export const shootAlternateObjectSchema = v.object({
	barrels: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.shoot-pattern.barrels", description: "editor.shoot-pattern.barrels-description" }),
	),
	spread: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "editor.shoot-pattern.spread", description: "editor.shoot-pattern.spread-description" }),
	),
	barrelOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.shoot-pattern.barrel-offset", description: "editor.shoot-pattern.barrel-offset-description" }),
	),
	mirror: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.shoot-pattern.mirror", description: "editor.shoot-pattern.mirror-description" }),
	),
});

export const shootBarrelObjectSchema = v.object({
	barrels: v.pipe(
		v.optional(v.array(v.number()), [0, 0, 0]),
		metadata({ name: "editor.shoot-pattern.barrels", description: "editor.shoot-pattern.barrels-description" }),
	),
	barrelOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.shoot-pattern.barrel-offset", description: "editor.shoot-pattern.barrel-offset-description" }),
	),
});

export const shootHelixObjectSchema = v.object({
	scl: v.pipe(v.optional(v.number(), 2), metadata({ name: "editor.shoot-pattern.scl" })),
	mag: v.pipe(v.optional(v.number(), 1.5), metadata({ name: "editor.shoot-pattern.mag" })),
	offset: v.pipe(v.optional(v.number(), Math.PI * 1.25), metadata({ name: "editor.shoot-pattern.offset" })),
});

export const shootSineObjectSchema = v.object({
	scl: v.pipe(
		v.optional(v.number(), 4),
		metadata({ name: "editor.shoot-pattern.scl", description: "editor.shoot-pattern.scl-description" }),
	),
	mag: v.pipe(
		v.optional(v.number(), 20),
		metadata({ name: "editor.shoot-pattern.mag", description: "editor.shoot-pattern.mag-description" }),
	),
});

export const shootSpreadObjectSchema = v.object({
	spread: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "editor.shoot-pattern.spread", description: "editor.shoot-pattern.spread-description" }),
	),
});

export const shootSummonObjectSchema = v.object({
	x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.shoot-pattern.x" })),
	y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.shoot-pattern.y" })),
	radius: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.shoot-pattern.radius" })),
	spread: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.shoot-pattern.spread" })),
});

export const ShootPatternHjsonSchema: SchemaFn = new ClassMap<ShootPatternType>({
	ShootAlternate: (_context) => shootAlternateObjectSchema.entries,
	ShootBarrel: (_context) => shootBarrelObjectSchema.entries,
	ShootHelix: (_context) => shootHelixObjectSchema.entries,
	ShootMulti: (context) => ({
		source: ShootPatternHjsonSchema(context),
		dest: v.array(ShootPatternHjsonSchema(context)),
	}),
	ShootSine: (_context) => shootSineObjectSchema.entries,
	ShootSpread: (_context) => shootSpreadObjectSchema.entries,
	ShootSummon: (_context) => shootSummonObjectSchema.entries,
	ShootPattern: (_context) => shootPatternBaseObjectSchema.entries,
}, {
	baseSchema: shootPatternBaseObjectSchema.entries,
}).schema;
