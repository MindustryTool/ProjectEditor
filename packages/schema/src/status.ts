import * as v from "valibot";
import { CachedSchema } from "./utils";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import type { SchemaFn } from "./utils";
import { EffectFieldSchema } from "./effect";
import { metadata } from "./utils";
import { TextureFieldSchema } from "./texture";

export const statusBaseObjectSchema = v.object({
    texture: TextureFieldSchema("@"),
	damageMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.damage-multiplier",
			description: "editor.status.damage-multiplier-description",
		}),
	),
	healthMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.health-multiplier",
			description: "editor.status.health-multiplier-description",
		}),
	),
	speedMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.speed-multiplier",
			description: "editor.status.speed-multiplier-description",
		}),
	),
	reloadMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.reload-multiplier",
			description: "editor.status.reload-multiplier-description",
		}),
	),
	buildSpeedMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.build-speed-multiplier",
			description: "editor.status.build-speed-multiplier-description",
		}),
	),
	dragMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.status.drag-multiplier",
			description: "editor.status.drag-multiplier-description",
		}),
	),
	transitionDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.status.transition-damage",
			description: "editor.status.transition-damage-description",
		}),
	),
	disarm: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.disarm",
			description: "editor.status.disarm-description",
		}),
	),
	damage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.status.damage",
			description: "editor.status.damage-description",
		}),
	),
	intervalDamageTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.status.interval-damage-time",
			description: "editor.status.interval-damage-time-description",
		}),
	),
	intervalDamage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.status.interval-damage",
			description: "editor.status.interval-damage-description",
		}),
	),
	intervalDamagePierce: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.interval-damage-pierce",
			description: "editor.status.interval-damage-pierce-description",
		}),
	),
	effectChance: v.pipe(
		v.optional(v.number(), 0.15),
		metadata({
			name: "editor.status.effect-chance",
			description: "editor.status.effect-chance-description",
		}),
	),
	parentizeEffect: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.parentize-effect",
			description: "editor.status.parentize-effect-description",
		}),
	),
	permanent: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.permanent",
			description: "editor.status.permanent-description",
		}),
	),
	reactive: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.reactive",
			description: "editor.status.reactive-description",
		}),
	),
	show: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.status.show", description: "editor.status.show-description" }),
	),
	color: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.status.color", description: "editor.status.color-description" }),
	),
	applyExtend: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.apply-extend",
			description: "editor.status.apply-extend-description",
		}),
	),
	applyColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.status.apply-color",
			description: "editor.status.apply-color-description",
		}),
	),
	parentizeApplyEffect: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.status.parentize-apply-effect",
			description: "editor.status.parentize-apply-effect-description",
		}),
	),
	outline: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.status.outline",
			description: "editor.status.outline-description",
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
				}),
			),
			applyEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.status.apply-effect",
					description: "editor.status.apply-effect-description",
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
				}),
			),
			opposites: v.pipe(
				v.optional(v.array(StatusStringSchema(context)), []),
				metadata({
					name: "editor.status.opposites",
					description: "editor.status.opposites-description",
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
