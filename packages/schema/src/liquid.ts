import * as v from "valibot";
import { MindustryHexColorSchema, ResearchSchema, type SchemaFn } from "./base";
import { EffectFieldSchema } from "./effect";

export const liquidBaseObjectSchema = v.object({
	color: v.optional(MindustryHexColorSchema),
	gas: v.optional(v.boolean(), false),
	gasColor: v.optional(
		v.pipe(
			MindustryHexColorSchema,
			v.metadata({
				visibleWhen: {
					field: "gas",
					value: true,
				},
			}),
		),
	),
	barColor: v.optional(MindustryHexColorSchema),
	lightColor: v.optional(MindustryHexColorSchema),
	flammability: v.optional(v.pipe(v.number())),
	temperature: v.optional(v.pipe(v.number())),
	heatCapacity: v.optional(v.pipe(v.number())),
	viscosity: v.optional(v.pipe(v.number())),
	explosiveness: v.optional(v.pipe(v.number())),
	blockReactive: v.optional(v.boolean(), true),
	coolant: v.optional(v.boolean(), true),
	moveThroughBlocks: v.optional(v.boolean(), false),
	incinerable: v.optional(v.boolean(), true),
	particleSpacing: v.optional(v.pipe(v.number())),
	boilPoint: v.optional(v.pipe(v.number())),
	capPuddles: v.optional(v.boolean(), true),
	hidden: v.optional(v.boolean(), false),
});

export const LiquidFieldSchema: SchemaFn = (context) => v.picklist(context.liquids.map((liquid) => liquid.name));

export const LiquidHjsonSchema: SchemaFn = (context) =>
	v.object({
		...liquidBaseObjectSchema.entries,
		effect: v.optional(EffectFieldSchema(context)),
		particleEffect: v.optional(EffectFieldSchema(context)),
		vaporEffect: v.optional(EffectFieldSchema(context)),
		canStayOn: v.optional(v.array(v.pipe(v.picklist(context.liquids.map((liquid) => liquid.name)), v.metadata({ type: "liquids" })))),
		research: ResearchSchema(context),
	});
