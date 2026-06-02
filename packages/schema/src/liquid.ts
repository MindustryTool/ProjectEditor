import * as v from "valibot";
import { MindustryHexColorSchema, ResearchSchema, type SchemaFn } from "./base";
import { EffectSchema } from "./effect";
export const LiquidHjsonSchema: SchemaFn = (value, context) =>
	v.object({
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
		effect: v.nullish(EffectSchema(value.get("effect"), context)),
		particleEffect: v.nullish(EffectSchema(value.get("particleEffect"), context)),
		particleSpacing: v.nullish(v.pipe(v.number())),
		boilPoint: v.nullish(v.pipe(v.number())),
		capPuddles: v.nullish(v.boolean(), true),
		vaporEffect: v.nullish(EffectSchema(value.get("vaporEffect"), context)),
		hidden: v.nullish(v.boolean(), false),
		canStayOn: v.nullish(v.array(v.pipe(v.picklist(context.getLiquids().map((liquid) => liquid.name)), v.metadata({ type: "liquids" })))),
		research: ResearchSchema(value.get("research"), context),
	});
