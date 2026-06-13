import * as v from "valibot";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { ResearchSchema } from "./research";
import type { SchemaFn } from "./utils";
import { metadata } from "./utils";
import type { ProjectContents } from "@project/types";
import { unlockableContentSchema } from "./content";
import { Order } from "./order";

export const itemBaseObjectSchema = v.object({
	name: v.pipe(v.optional(v.string()), metadata({ order: Order.NAME })),
    ...unlockableContentSchema,
	hardness: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0), v.integer())),
		metadata({ name: "editor.item.hardness", description: "editor.item.hardness-description" }),
	),
	cost: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0))),
		metadata({ name: "editor.item.cost", description: "editor.item.cost-description" }),
	),
	charge: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0))),
		metadata({ name: "editor.item.charge", description: "editor.item.charge-description" }),
	),
	radioactivity: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0))),
		metadata({ name: "editor.item.radioactivity", description: "editor.item.radioactivity-description" }),
	),
	flammability: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0))),
		metadata({ name: "editor.item.flammability", description: "editor.item.flammability-description" }),
	),
	explosiveness: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0))),
		metadata({ name: "editor.item.explosiveness", description: "editor.item.explosiveness-description" }),
	),
	healthScaling: v.pipe(
		v.optional(v.pipe(v.number(), v.minValue(0))),
		metadata({ name: "editor.item.health-scaling", description: "editor.item.health-scaling-description" }),
	),
	color: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.item.color", description: "editor.item.color-description" }),
	),
	lowPriority: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.item.low-priority", description: "editor.item.low-priority-description" }),
	),
	buildable: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.item.buildable", description: "editor.item.buildable-description" }),
	),
	hidden: v.pipe(v.optional(v.boolean(), false), metadata({ name: "editor.item.hidden", description: "editor.item.hidden-description" })),
});

export const ItemHjsonSchema: SchemaFn = (context) =>
	v.object({
		...itemBaseObjectSchema.entries,
		research: v.optional(ResearchSchema(context)),
	});

export function ItemFieldSchema(context: ProjectContents) {
	return v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.items.map((item) => item.name.replaceAll(context.name + "-", ""))),
	);
}
