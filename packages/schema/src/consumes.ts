import * as v from "valibot";
import { ItemFieldSchema } from "./item";
import type { ProjectContents } from "@project/types";
import { EffectFieldSchema } from "./effect";
import { ItemStackSchema } from "./item-stack";
import { LiquidStackSchema } from "./liquid-stack";
import { LiquidFieldSchema } from "./liquid";

export const consumeTypes = [
    "Consume",
	"ConsumeCoolant",
	"ConsumeItemCharged",
	"ConsumeItemDynamic",
	"ConsumeItemEfficiency",
	"ConsumeItemExplode",
	"ConsumeItemExplosive",
	"ConsumeItemFilter",
	"ConsumeItemFlammable",
	"ConsumeItemList",
	"ConsumeItemRadioactive",
	"ConsumeItems",
	"ConsumeLiquid",
	"ConsumeLiquidBase",
	"ConsumeLiquidFilter",
	"ConsumeLiquidFlammable",
	"ConsumeLiquids",
	"ConsumeLiquidsDynamic",
	"ConsumePayloadDynamic",
	"ConsumePayloadFilter",
	"ConsumePayloads",
	"ConsumePower",
	"ConsumePowerCondition",
	"ConsumePowerDynamic",
] as const;

const consumeSchema = v.object({
    type: v.optional( v.picklist(consumeTypes), 'Consume'),
	/** If true, this consumer will not influence consumer validity. */
	optional: v.optional(v.boolean(), false),
	/** If true, this consumer will be displayed as a boost input. */
	booster: v.optional(v.boolean(), false),
	/** If false, this consumer will still be checked, but it will need to updated manually. */
	update: v.optional(v.boolean(), true),
	/** Multiplier for costs. Does not work for power consumers. */
	// public Floatf<Building> multiplier = b -> 1f;
});

const consumeItemFilterSchema = v.object({
	...consumeSchema.entries,
});

const consumeItemEfficiencySchema = (context: ProjectContents) =>
	v.object({
		/** This has no effect on the consumer itself, but is used for stat display. */
		itemDurationMultipliers: v.optional(v.record(ItemFieldSchema(context), v.number())),
	});

const consumeItemChargedSchema = (context: ProjectContents) =>
	v.object({
		...consumeItemEfficiencySchema(context).entries,
		minCharge: v.number(),
	});

const consumeItemFlammableSchema = (context: ProjectContents) =>
	v.object({
		...consumeItemEfficiencySchema(context).entries,
		minFlammability: v.number(),
	});

const consumeItemRadioactiveSchema = (context: ProjectContents) =>
	v.object({
		...consumeItemEfficiencySchema(context).entries,
		minRadioactivity: v.number(),
	});

const consumeItemExplosiveSchema = (context: ProjectContents) =>
	v.object({
		...consumeItemEfficiencySchema(context).entries,
		minExplosiveness: v.number(),
	});

const consumeItemListSchema = (context: ProjectContents) =>
	v.object({
		...consumeItemFilterSchema.entries,
		itemMultipliers: v.record(ItemFieldSchema(context), v.number()),
	});

const consumeItemExplodeSchema = (context: ProjectContents) =>
	v.object({
		...consumeItemFilterSchema.entries,
		damage: v.optional(v.number(), 4),
		threshold: v.optional(v.number(), 0),
		baseChance: v.optional(v.number(), 0.06),
		explodeEffect: EffectFieldSchema(context),
	});

const consumeItemsSchema = (context: ProjectContents) =>
	v.union([v.array(ItemStackSchema(context)), ItemStackSchema(context), v.object({ items: v.array(ItemStackSchema(context)) })]);

const consumeItemBoostSchema = (context: ProjectContents) =>
	v.union([v.array(ItemStackSchema(context)), v.object({ items: v.array(ItemStackSchema(context)) })]);

const consumeLiquidBaseSchema = v.object({ ...consumeSchema.entries, amount: v.number() });

const consumeLiquidFilterSchema = v.object({
    ...consumeLiquidBaseSchema.entries,
});

const consumeLiquidFlammableSchema = v.object({ ...consumeLiquidFilterSchema.entries, minFlammability: v.number() });

const comsumeLiquidSchema = (context: ProjectContents) =>
	v.object({ ...consumeLiquidBaseSchema.entries, liquid: LiquidFieldSchema(context) });

const consumeLiquidsSchema = (context: ProjectContents) =>
	v.union([v.array(LiquidStackSchema(context)), v.object({ liquids: v.array(LiquidStackSchema(context)) })]);

const consumeCoolantSchema = v.object({
	...consumeLiquidFilterSchema.entries,
	maxTemp: v.optional(v.number(), 0.5),
	maxFlammability: v.optional(v.number(), 0.1),
	allowLiquid: v.optional(v.boolean(), true),
	allowGas: v.optional(v.boolean(), false),
});

const consumeLiquidsBoostSchema = (context: ProjectContents) =>
	v.union([v.array(LiquidStackSchema(context)), v.object({ liquids: v.array(LiquidStackSchema(context)) })]);

const consumePowerSchema = v.union([
	v.number(),
	v.object({
		...consumeSchema.entries,
		usage: v.optional(v.number(), 0),
		capacity: v.optional(v.number(), 0),
		buffered: v.optional(v.boolean(), false),
	}),
]);

export const ConsumesHjsonSchema = (context: ProjectContents) =>
	v.pipe(
		v.partial(
			v.object({
				remove: v.optional(v.union([v.picklist([...consumeTypes, "all"]), v.array(v.picklist([...consumeTypes, "all"]))])),
				item: ItemFieldSchema(context),
				itemCharged: consumeItemChargedSchema(context),
				itemFlammable: consumeItemFlammableSchema(context),
				itemRadioactive: consumeItemRadioactiveSchema(context),
				itemExplosive: consumeItemExplosiveSchema(context),
				itemList: consumeItemListSchema(context),
				itemExplode: consumeItemExplodeSchema(context),
				items: consumeItemsSchema(context),
				itemsBoost: consumeItemBoostSchema(context),
				liquidFlammable: consumeLiquidFlammableSchema,
				liquid: comsumeLiquidSchema(context),
				liquids: consumeLiquidsSchema(context),
				coolant: consumeCoolantSchema,
				liquidsBoost: consumeLiquidsBoostSchema(context),
				power: consumePowerSchema,
				powerBuffered: v.number(),
			}),
		),
	);
