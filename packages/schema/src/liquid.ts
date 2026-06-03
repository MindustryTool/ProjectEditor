import * as v from "valibot";
import { MindustryHexColorSchema, ResearchSchema, type SchemaFn } from "./base";
import { EffectHjsonSchema } from "./effect";

export const liquidBaseObjectSchema = v.object({
	color: v.nullish(MindustryHexColorSchema),
	gas: v.nullish(v.boolean(), false),
	gasColor: v.nullish(
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
	barColor: v.nullish(MindustryHexColorSchema),
	lightColor: v.nullish(MindustryHexColorSchema),
	flammability: v.nullish(v.pipe(v.number())),
	temperature: v.nullish(v.pipe(v.number())),
	heatCapacity: v.nullish(v.pipe(v.number())),
	viscosity: v.nullish(v.pipe(v.number())),
	explosiveness: v.nullish(v.pipe(v.number())),
	blockReactive: v.nullish(v.boolean(), true),
	coolant: v.nullish(v.boolean(), true),
	moveThroughBlocks: v.nullish(v.boolean(), false),
	incinerable: v.nullish(v.boolean(), true),
	particleSpacing: v.nullish(v.pipe(v.number())),
	boilPoint: v.nullish(v.pipe(v.number())),
	capPuddles: v.nullish(v.boolean(), true),
	hidden: v.nullish(v.boolean(), false),
});

export const LiquidFieldSchema: SchemaFn = (context) => v.picklist(context.liquids.map((liquid) => liquid.name));

export const LiquidHjsonSchema: SchemaFn = (context) =>
	v.object({
		...liquidBaseObjectSchema.entries,
		effect: v.nullish(EffectHjsonSchema(context)),
		particleEffect: v.nullish(EffectHjsonSchema(context)),
		vaporEffect: v.nullish(EffectHjsonSchema(context)),
		canStayOn: v.nullish(v.array(v.pipe(v.picklist(context.liquids.map((liquid) => liquid.name)), v.metadata({ type: "liquids" })))),
		research: ResearchSchema(context),
	});
