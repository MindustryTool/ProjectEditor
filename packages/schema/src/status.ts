import * as v from "valibot";
import { CachedSchema } from "./utils";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import type { SchemaFn } from "./utils";
import { EffectFieldSchema } from "./effect";
import { metadata } from "./utils";

export const statusBaseObjectSchema = v.object({
	damageMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.damage-multiplier",
			description: "editor.status.damage-multiplier-description",
			category: "editor.status.category.multipliers",
		}),
	),
	healthMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.health-multiplier",
			description: "editor.status.health-multiplier-description",
			category: "editor.status.category.multipliers",
		}),
	),
	speedMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.speed-multiplier",
			description: "editor.status.speed-multiplier-description",
			category: "editor.status.category.multipliers",
		}),
	),
	reloadMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.reload-multiplier",
			description: "editor.status.reload-multiplier-description",
			category: "editor.status.category.multipliers",
		}),
	),
	buildSpeedMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.build-speed-multiplier",
			description: "editor.status.build-speed-multiplier-description",
			category: "editor.status.category.multipliers",
		}),
	),
	dragMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.drag-multiplier",
			description: "editor.status.drag-multiplier-description",
			category: "editor.status.category.multipliers",
		}),
	),
	transitionDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.status.transition-damage",
			description: "editor.status.transition-damage-description",
			category: "editor.status.category.damage",
		}),
	),
	disarm: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.disarm",
			description: "editor.status.disarm-description",
			category: "editor.status.category.behavior",
		}),
	),
	damage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.status.damage",
			description: "editor.status.damage-description",
			category: "editor.status.category.damage",
		}),
	),
	intervalDamageTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.status.interval-damage-time",
			description: "editor.status.interval-damage-time-description",
			category: "editor.status.category.damage",
		}),
	),
	intervalDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.status.interval-damage",
			description: "editor.status.interval-damage-description",
			category: "editor.status.category.damage",
		}),
	),
	intervalDamagePierce: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.interval-damage-pierce",
			description: "editor.status.interval-damage-pierce-description",
			category: "editor.status.category.damage",
		}),
	),
	effectChance: v.pipe(
		v.optional(v.number(), 0.15),
		metadata({
			name: "editor.status.effect-chance",
			description: "editor.status.effect-chance-description",
			category: "editor.status.category.visual",
		}),
	),
	parentizeEffect: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.parentize-effect",
			description: "editor.status.parentize-effect-description",
			category: "editor.status.category.visual",
		}),
	),
	permanent: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.permanent",
			description: "editor.status.permanent-description",
			category: "editor.status.category.behavior",
		}),
	),
	reactive: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.reactive",
			description: "editor.status.reactive-description",
			category: "editor.status.category.behavior",
		}),
	),
	show: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.status.show", description: "editor.status.show-description", category: "editor.status.category.behavior" }),
	),
	color: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.status.color", description: "editor.status.color-description", category: "editor.status.category.visual" }),
	),
	applyExtend: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.apply-extend",
			description: "editor.status.apply-extend-description",
			category: "editor.status.category.visual",
		}),
	),
	applyColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.status.apply-color",
			description: "editor.status.apply-color-description",
			category: "editor.status.category.visual",
		}),
	),
	parentizeApplyEffect: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.parentize-apply-effect",
			description: "editor.status.parentize-apply-effect-description",
			category: "editor.status.category.visual",
		}),
	),
	outline: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.status.outline",
			description: "editor.status.outline-description",
			category: "editor.status.category.visual",
		}),
	),
});

export const StatusStringSchema: SchemaFn = CachedSchema((context) =>
	v.pipe(
		v.string(),
		v.transform((v) => v.replaceAll(context.name + "-", "")),
		v.picklist(context.statuses.map((status) => status.name.replaceAll(context.name + "-", ""))),
	),
);

export const StatusFieldSchema: SchemaFn = (context) =>
	v.lazy((input) => {
		if (typeof input === "string") {
			return StatusStringSchema(context);
		}

		return StatusHjsonSchema(context);
	});

export const StatusHjsonSchema: SchemaFn = CachedSchema((context) =>
	v.pipe(
		v.object({
			...statusBaseObjectSchema.entries,
			effect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.status.effect",
					description: "editor.status.effect-description",
					category: "editor.status.category.visual",
				}),
			),
			applyEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.status.apply-effect",
					description: "editor.status.apply-effect-description",
					category: "editor.status.category.visual",
				}),
			),
			affinities: v.pipe(
				v.optional(
					v.array(
						v.pipe(
							v.picklist(
								context.statuses.map((status) => status.name),
								"Not a vailid status name",
							),
						),
					),
					[],
				),
				metadata({
					name: "editor.status.affinities",
					description: "editor.status.affinities-description",
					category: "editor.status.category.affinity",
				}),
			),
			opposites: v.pipe(
				v.optional(v.array(StatusStringSchema(context)), []),
				metadata({
					name: "editor.status.opposites",
					description: "editor.status.opposites-description",
					category: "editor.status.category.affinity",
				}),
			),
		}),
		v.forward(
			v.partialCheck(
				[["affinities"], ["opposites"]],
				(input) => !input.affinities.some((a) => input.opposites.includes(a)),
				"Affinities and opposites cannot be the same",
			),
			["opposites"],
		),
	),
);
