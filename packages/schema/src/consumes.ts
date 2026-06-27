import * as v from "valibot";
import { ItemFieldSchema } from "./item";
import { EffectFieldSchema } from "./effect";
import { ItemStackSchema } from "./item-stack";
import { LiquidStackSchema } from "./liquid-stack";
import { LiquidFieldSchema } from "./liquid";
import { cached, metadata } from "./utils";
import { classSchema } from "./class";
import type { ProjectContents } from "@project/types";

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
	type: classSchema(consumeTypes, "Consume"),
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

const consumeItemEfficiencySchema = cached((context: ProjectContents) =>
	v.object({
		/** This has no effect on the consumer itself, but is used for stat display. */
		itemDurationMultipliers: v.optional(v.record(ItemFieldSchema(context), v.number())),
	}),
);

const consumeItemChargedSchema = cached((context: ProjectContents) =>
	v.object({
		...consumeItemEfficiencySchema(context).entries,
		minCharge: v.number(),
	}),
);

const consumeItemFlammableSchema = cached((context: ProjectContents) =>
	v.object({
		...consumeItemEfficiencySchema(context).entries,
		minFlammability: v.number(),
	}),
);

const consumeItemRadioactiveSchema = cached((context: ProjectContents) =>
	v.object({
		...consumeItemEfficiencySchema(context).entries,
		minRadioactivity: v.number(),
	}),
);

const consumeItemExplosiveSchema = cached((context: ProjectContents) =>
	v.object({
		...consumeItemEfficiencySchema(context).entries,
		minExplosiveness: v.number(),
	}),
);

const consumeItemListSchema = cached((context: ProjectContents) =>
	v.object({
		...consumeItemFilterSchema.entries,
		itemMultipliers: v.record(ItemFieldSchema(context), v.number()),
	}),
);

const consumeItemExplodeSchema = cached((context: ProjectContents) =>
	v.object({
		...consumeItemFilterSchema.entries,
		damage: v.optional(v.number(), 4),
		threshold: v.optional(v.number(), 0),
		baseChance: v.optional(v.number(), 0.06),
		explodeEffect: EffectFieldSchema(context),
	}),
);

const consumeItemsSchema = cached((context: ProjectContents) =>
	v.pipe(
		v.lazy((input) => {
			if (Array.isArray(input)) {
				return v.optional(v.pipe(v.array(ItemStackSchema(context)), metadata({ option: "array" })), []);
			}
			if (typeof input === "string") {
				return v.optional(v.pipe(ItemStackSchema(context), metadata({ option: "single" })), "");
			}
			return v.optional(
				v.pipe(v.object({ items: v.array(ItemStackSchema(context)), ...consumeSchema.entries }), metadata({ option: "multiple" })),
				{ items: [], type: "ConsumeItems" },
			);
		}),
		metadata({
			type: "options",
			options: [
				v.optional(v.pipe(v.array(ItemStackSchema(context)), metadata({ option: "array" })), []),
				v.optional(v.pipe(ItemStackSchema(context), metadata({ option: "single" })), ""),
				v.optional(
					v.pipe(v.object({ items: v.array(ItemStackSchema(context)), ...consumeSchema.entries }), metadata({ option: "multiple" })),
					{ items: [], type: "ConsumeItems" },
				),
			],
		}),
	),
);

const consumeItemBoostSchema = cached((context: ProjectContents) =>
	v.pipe(
		v.lazy((input) => {
			if (Array.isArray(input)) {
				return v.optional(v.pipe(v.array(ItemStackSchema(context)), metadata({ option: "array" })), []);
			}
			return v.optional(v.pipe(v.object({ items: v.array(ItemStackSchema(context)) }), metadata({ option: "multiple" })), { items: [] });
		}),
		metadata({
			type: "options",
			options: [
				v.optional(v.pipe(v.array(ItemStackSchema(context)), metadata({ option: "array" })), []),
				v.optional(v.pipe(v.object({ items: v.array(ItemStackSchema(context)) }), metadata({ option: "multiple" })), { items: [] }),
			],
		}),
	),
);

const consumeLiquidBaseSchema = v.object({ ...consumeSchema.entries, amount: v.number() });

const consumeLiquidFilterSchema = v.object({
	...consumeLiquidBaseSchema.entries,
});

const consumeLiquidFlammableSchema = v.object({ ...consumeLiquidFilterSchema.entries, minFlammability: v.number() });

const comsumeLiquidSchema = cached((context: ProjectContents) =>
	v.object({ ...consumeLiquidBaseSchema.entries, liquid: LiquidFieldSchema(context) }),
);

const consumeLiquidsSchema = cached((context: ProjectContents) =>
	v.pipe(
		v.lazy((input) => {
			if (Array.isArray(input)) {
				return v.optional(v.pipe(v.array(LiquidStackSchema(context)), metadata({ option: "array" })), []);
			}

			return v.optional(
				v.pipe(v.object({ liquids: v.array(LiquidStackSchema(context)), ...consumeSchema.entries }), metadata({ option: "multiple" })),
				{
					liquids: [],
					type: "ConsumeLiquids",
				},
			);
		}),
		metadata({
			type: "options",
			options: [
				v.optional(v.pipe(v.array(LiquidStackSchema(context)), metadata({ option: "array" })), []),
				v.optional(
					v.pipe(
						v.object({ liquids: v.array(LiquidStackSchema(context)), ...consumeSchema.entries }),
						metadata({ option: "multiple" }),
					),
					{
						liquids: [],
						type: "ConsumeLiquids",
					},
				),
			],
		}),
	),
);

const consumeCoolantSchema = v.object({
	...consumeLiquidFilterSchema.entries,
	maxTemp: v.optional(v.number(), 0.5),
	maxFlammability: v.optional(v.number(), 0.1),
	allowLiquid: v.optional(v.boolean(), true),
	allowGas: v.optional(v.boolean(), false),
});

const consumeLiquidsBoostSchema = cached((context: ProjectContents) =>
	v.pipe(
		v.lazy((input) => {
			if (Array.isArray(input)) {
				return v.optional(v.pipe(v.array(LiquidStackSchema(context)), metadata({ option: "array" })), []);
			}
			return v.optional(v.pipe(v.object({ liquids: v.array(LiquidStackSchema(context)) }), metadata({ option: "multiple" })), {
				liquids: [],
			});
		}),
		metadata({
			type: "options",
			options: [
				v.optional(v.pipe(v.array(LiquidStackSchema(context)), metadata({ option: "array" })), []),
				v.optional(v.pipe(v.object({ liquids: v.array(LiquidStackSchema(context)) }), metadata({ option: "multiple" })), {
					liquids: [],
				}),
			],
		}),
	),
);

const consumePowerSchema = v.pipe(
	v.lazy((input) => {
		if (typeof input === "number") {
			return v.pipe(v.number(), metadata({ option: "single" }));
		}
		return v.pipe(
			v.object({
				...consumeSchema.entries,
				usage: v.optional(v.number(), 0),
				capacity: v.optional(v.number(), 0),
				buffered: v.optional(v.boolean(), false),
			}),
			metadata({ option: "buffered" }),
		);
	}),
	metadata({
		type: "options",
		options: [
			v.pipe(v.number(), metadata({ option: "single" })),
			v.pipe(
				v.object({
					...consumeSchema.entries,
					usage: v.optional(v.number(), 0),
					capacity: v.optional(v.number(), 0),
					buffered: v.optional(v.boolean(), false),
				}),
				metadata({ option: "buffered" }),
			),
		],
	}),
);

const removeSingleSchema = v.pipe(v.picklist([...consumeTypes, "all"]), metadata({ option: "single" }));
const removeMultipleSchema = v.pipe(v.array(v.picklist([...consumeTypes, "all"])), metadata({ option: "multiple" }));

export const ConsumesHjsonSchema = cached((context: ProjectContents) =>
	v.pipe(
		v.partial(
			v.object({
				remove: v.optional(
					v.pipe(
						v.lazy((input) => {
							if (typeof input === "string") {
								return removeSingleSchema;
							}

							return removeMultipleSchema;
						}),
						metadata({
							type: "options",
							options: [removeSingleSchema, removeMultipleSchema],
						}),
					),
				),
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
		metadata({ type: "consumes" }),
	),
);
