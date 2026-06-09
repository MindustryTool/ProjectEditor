import * as v from "valibot";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { ResearchSchema } from "./research";
import type { SchemaFn } from "./utils";
import { EffectFieldSchema } from "./effect";
import { metadata } from "./utils";
import type { ProjectContents } from "@project/types";
import { ContentNameSchema } from "./content";

export const liquidBaseObjectSchema = v.object({
    name: ContentNameSchema,
	gas: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.liquid.gas",
			description: "editor.liquid.gas-description",
			category: "editor.liquid.category.physics",
		}),
	),
	color: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.liquid.color",
			description: "editor.liquid.color-description",
			category: "editor.liquid.category.visual",
		}),
	),
	gasColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.liquid.gas-color",
			description: "editor.liquid.gas-color-description",
			category: "editor.liquid.category.visual",
			visibleWhen: {
				field: "gas",
				value: true,
			},
		}),
	),
	barColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.liquid.bar-color",
			description: "editor.liquid.bar-color-description",
			category: "editor.liquid.category.visual",
		}),
	),
	lightColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.liquid.light-color",
			description: "editor.liquid.light-color-description",
			category: "editor.liquid.category.visual",
		}),
	),
	flammability: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.liquid.flammability",
			description: "editor.liquid.flammability-description",
			category: "editor.liquid.category.physics",
		}),
	),
	temperature: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.liquid.temperature",
			description: "editor.liquid.temperature-description",
			category: "editor.liquid.category.physics",
		}),
	),
	heatCapacity: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.liquid.heat-capacity",
			description: "editor.liquid.heat-capacity-description",
			category: "editor.liquid.category.physics",
		}),
	),
	viscosity: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.liquid.viscosity",
			description: "editor.liquid.viscosity-description",
			category: "editor.liquid.category.physics",
		}),
	),
	explosiveness: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.liquid.explosiveness",
			description: "editor.liquid.explosiveness-description",
			category: "editor.liquid.category.physics",
		}),
	),
	blockReactive: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.liquid.block-reactive",
			description: "editor.liquid.block-reactive-description",
			category: "editor.liquid.category.behavior",
		}),
	),
	coolant: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.liquid.coolant",
			description: "editor.liquid.coolant-description",
			category: "editor.liquid.category.behavior",
		}),
	),
	moveThroughBlocks: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.liquid.move-through-blocks",
			description: "editor.liquid.move-through-blocks-description",
			category: "editor.liquid.category.behavior",
		}),
	),
	incinerable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.liquid.incinerable",
			description: "editor.liquid.incinerable-description",
			category: "editor.liquid.category.behavior",
		}),
	),
	particleSpacing: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.liquid.particle-spacing",
			description: "editor.liquid.particle-spacing-description",
			category: "editor.liquid.category.physics",
		}),
	),
	boilPoint: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.liquid.boil-point",
			description: "editor.liquid.boil-point-description",
			category: "editor.liquid.category.physics",
		}),
	),
	capPuddles: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.liquid.cap-puddles",
			description: "editor.liquid.cap-puddles-description",
			category: "editor.liquid.category.behavior",
		}),
	),
	hidden: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.liquid.hidden",
			description: "editor.liquid.hidden-description",
			category: "editor.liquid.category.behavior",
		}),
	),
});

export const LiquidFieldSchema = (context: ProjectContents) =>
	v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.liquids.map((liquid) => liquid.name.replaceAll(context.name + "-", ""))),
	);

export const LiquidHjsonSchema: SchemaFn = (context) =>
	v.object({
		...liquidBaseObjectSchema.entries,
		effect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.liquid.effect",
				description: "editor.liquid.effect-description",
				category: "editor.liquid.category.behavior",
			}),
		),
		particleEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.liquid.particle-effect",
				description: "editor.liquid.particle-effect-description",
				category: "editor.liquid.category.behavior",
			}),
		),
		vaporEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.liquid.vapor-effect",
				description: "editor.liquid.vapor-effect-description",
				category: "editor.liquid.category.behavior",
			}),
		),
		canStayOn: v.pipe(
			v.optional(v.array(LiquidFieldSchema(context))),
			metadata({
				name: "editor.liquid.can-stay-on",
				description: "editor.liquid.can-stay-on-description",
				category: "editor.liquid.category.behavior",
			}),
		),
		research: v.optional(ResearchSchema(context)),
	});
