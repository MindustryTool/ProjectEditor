import * as v from "valibot";
import { TextureFieldSchema } from "./texture";
import { metadata } from "./utils";
import { ItemStackSchema } from "./item-stack";
import { UnitFieldSchema } from "./unit";
import type { ProjectContents } from "@project/types";
import { unitBlockObjectSchema, payloadBlockObjectSchema } from "./block-payload";

// Unit variant schemas
export const unitFactoryObjectSchema = (context: ProjectContents) =>
	v.object({
		...unitBlockObjectSchema.entries,
		plans: v.array(
			v.object({
				unit: UnitFieldSchema(context),
				time: v.pipe(v.number(), v.integer(), v.minValue(0)),
				requirements: v.array(ItemStackSchema(context)),
			}),
		),
		capacities: v.pipe(
			v.optional(v.array(v.number()), []),
			metadata({
				name: "editor.block-unit-factory.capacities",
				description: "editor.block-unit-factory.capacities-description",
			}),
		),
		createSoundVolume: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-unit-factory.create-sound-volume",
				description: "editor.block-unit-factory.create-sound-volume-description",
			}),
		),
	});

export const reconstructorObjectSchema = (context: ProjectContents) =>
	v.object({
		...unitBlockObjectSchema.entries,
		upgrades: v.array(v.array(UnitFieldSchema(context))),
		constructTime: v.pipe(
			v.optional(v.number(), 120),
			metadata({
				name: "editor.block-reconstructor.construct-time",
				description: "editor.block-reconstructor.construct-time-description",
			}),
		),
		capacities: v.pipe(
			v.optional(v.array(v.number()), []),
			metadata({
				name: "editor.block-reconstructor.capacities",
				description: "editor.block-reconstructor.capacities-description",
			}),
		),
		createSoundVolume: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-reconstructor.create-sound-volume",
				description: "editor.block-reconstructor.create-sound-volume-description",
			}),
		),
	});

export const unitAssemblerModuleObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
	sideTexture1: TextureFieldSchema("@-side1"),
	sideTexture2: TextureFieldSchema("@-side2"),
	tier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-unit-assembler-module.tier",
			description: "editor.block-unit-assembler-module.tier-description",
		}),
	),
});

export const unitAssemblerObjectSchema = v.object({
	...payloadBlockObjectSchema.entries,
	sideTexture1: TextureFieldSchema("@-side1"),
	sideTexture2: TextureFieldSchema("@-side2"),
	areaSize: v.pipe(
		v.optional(v.number(), 11),
		metadata({
			name: "editor.block-unit-assembler.area-size",
			description: "editor.block-unit-assembler.area-size-description",
		}),
	),
	dronesCreated: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-unit-assembler.drones-created",
			description: "editor.block-unit-assembler.drones-created-description",
		}),
	),
	droneConstructTime: v.pipe(
		v.optional(v.number(), 240),
		metadata({
			name: "editor.block-unit-assembler.drone-construct-time",
			description: "editor.block-unit-assembler.drone-construct-time-description",
		}),
	),
	capacities: v.pipe(
		v.optional(v.array(v.number()), []),
		metadata({
			name: "editor.block-unit-assembler.capacities",
			description: "editor.block-unit-assembler.capacities-description",
		}),
	),
	createSoundVolume: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-unit-assembler.create-sound-volume",
			description: "editor.block-unit-assembler.create-sound-volume-description",
		}),
	),
});

export const unitCargoUnloadPointObjectSchema = v.object({
	topTexture: TextureFieldSchema("@-top"),
	staleTimeDuration: v.pipe(
		v.optional(v.number(), 360),
		metadata({
			name: "editor.block-unit-cargo-unload-point.stale-time-duration",
			description: "editor.block-unit-cargo-unload-point.stale-time-duration-description",
		}),
	),
});

export const unitCargoLoaderObjectSchema = v.object({
	unitBuildTime: v.pipe(
		v.optional(v.number(), 480),
		metadata({
			name: "editor.block-unit-cargo-loader.unit-build-time",
			description: "editor.block-unit-cargo-loader.unit-build-time-description",
		}),
	),
	polyStroke: v.pipe(
		v.optional(v.number(), 1.8),
		metadata({
			name: "editor.block-unit-cargo-loader.poly-stroke",
			description: "editor.block-unit-cargo-loader.poly-stroke-description",
		}),
	),
	polyRadius: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-unit-cargo-loader.poly-radius",
			description: "editor.block-unit-cargo-loader.poly-radius-description",
		}),
	),
	polySides: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-unit-cargo-loader.poly-sides",
			description: "editor.block-unit-cargo-loader.poly-sides-description",
		}),
	),
	polyRotateSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-unit-cargo-loader.poly-rotate-speed",
			description: "editor.block-unit-cargo-loader.poly-rotate-speed-description",
		}),
	),
});

export const repairTurretObjectSchema = v.object({
	baseTexture: TextureFieldSchema("@-base"),
	repairRadius: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.block-repair-turret.repair-radius",
			description: "editor.block-repair-turret.repair-radius-description",
		}),
	),
	repairSpeed: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "editor.block-repair-turret.repair-speed",
			description: "editor.block-repair-turret.repair-speed-description",
		}),
	),
	powerUse: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.block-repair-turret.power-use",
			description: "editor.block-repair-turret.power-use-description",
		}),
	),
	length: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-repair-turret.length",
			description: "editor.block-repair-turret.length-description",
		}),
	),
	beamWidth: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-repair-turret.beam-width",
			description: "editor.block-repair-turret.beam-width-description",
		}),
	),
	pulseRadius: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-repair-turret.pulse-radius",
			description: "editor.block-repair-turret.pulse-radius-description",
		}),
	),
	pulseStroke: v.pipe(
		v.optional(v.number(), 2),
		metadata({
			name: "editor.block-repair-turret.pulse-stroke",
			description: "editor.block-repair-turret.pulse-stroke-description",
		}),
	),
	acceptCoolant: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-repair-turret.accept-coolant",
			description: "editor.block-repair-turret.accept-coolant-description",
		}),
	),
	coolantUse: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.block-repair-turret.coolant-use",
			description: "editor.block-repair-turret.coolant-use-description",
		}),
	),
	coolantMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-repair-turret.coolant-multiplier",
			description: "editor.block-repair-turret.coolant-multiplier-description",
		}),
	),
});

export const repairTowerObjectSchema = v.object({
	glowTexture: TextureFieldSchema("@-glow"),
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-repair-tower.range",
			description: "editor.block-repair-tower.range-description",
		}),
	),
	circleSpeed: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-repair-tower.circle-speed",
			description: "editor.block-repair-tower.circle-speed-description",
		}),
	),
	circleStroke: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-repair-tower.circle-stroke",
			description: "editor.block-repair-tower.circle-stroke-description",
		}),
	),
	squareRad: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-repair-tower.square-rad",
			description: "editor.block-repair-tower.square-rad-description",
		}),
	),
	squareSpinScl: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "editor.block-repair-tower.square-spin-scl",
			description: "editor.block-repair-tower.square-spin-scl-description",
		}),
	),
	glowMag: v.pipe(
		v.optional(v.number(), 0.5),
		metadata({
			name: "editor.block-repair-tower.glow-mag",
			description: "editor.block-repair-tower.glow-mag-description",
		}),
	),
	glowScl: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-repair-tower.glow-scl",
			description: "editor.block-repair-tower.glow-scl-description",
		}),
	),
	healAmount: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-repair-tower.heal-amount",
			description: "editor.block-repair-tower.heal-amount-description",
		}),
	),
});

export const droneCenterObjectSchema = v.object({
	unitsSpawned: v.pipe(
		v.optional(v.number(), 4),
		metadata({
			name: "editor.block-drone-center.units-spawned",
			description: "editor.block-drone-center.units-spawned-description",
		}),
	),
	droneConstructTime: v.pipe(
		v.optional(v.number(), 180),
		metadata({
			name: "editor.block-drone-center.drone-construct-time",
			description: "editor.block-drone-center.drone-construct-time-description",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 120),
		metadata({
			name: "editor.block-drone-center.status-duration",
			description: "editor.block-drone-center.status-duration-description",
		}),
	),
	droneRange: v.pipe(
		v.optional(v.number(), 50),
		metadata({
			name: "editor.block-drone-center.drone-range",
			description: "editor.block-drone-center.drone-range-description",
		}),
	),
});
