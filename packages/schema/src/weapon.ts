import * as v from "valibot";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { SoundHjsonSchema } from "./sound";
import { StatusStringSchema } from "./status";
import { EffectFieldSchema } from "./effect";
import { PartHjsonSchema } from "./part";
import { ShootPatternHjsonSchema } from "./shoot-pattern";
import { BulletHjsonSchema } from "./bullet";
import { cached, metadata } from "./utils";
import type { ProjectContents } from "@project/types";
import { ClassMap, classSchema } from "./class";
import { unlockableContentSchema } from "./content";
import { TextureFieldSchema } from "./texture";
import { Order } from "./order";

const weaponTypes = ["Weapon", "BuildWeapon", "MineWeapon", "PointDefenseBulletWeapon", "PointDefenseWeapon", "RepairBeamWeapon"] as const;

type WeaponType = (typeof weaponTypes)[number];

const weaponObjectSchema = v.object({
	...unlockableContentSchema,
	type: v.pipe(classSchema(weaponTypes, "Weapon"), metadata({ order: Order.TYPE })),
	baseTexture: TextureFieldSchema("@"),
	heatTexture: TextureFieldSchema("@-heat"),
	cellTexture: TextureFieldSchema("@-cell"),
	shots: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "editor.weapon.shots", description: "editor.weapon.shots-description" }),
	),
	display: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weapon.display",
			description: "editor.weapon.display-description",
		}),
	),
	mirror: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weapon.mirror",
			description: "editor.weapon.mirror-description",
		}),
	),
	alternate: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weapon.alternate",
			description: "editor.weapon.alternate-description",
		}),
	),
	rotate: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weapon.rotate",
			description: "editor.weapon.rotate-description",
		}),
	),
	showStatSprite: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weapon.show-stat-sprite",
			description: "editor.weapon.show-stat-sprite-description",
		}),
	),
	reload: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "editor.weapon.reload", description: "editor.weapon.reload-description" }),
	),

	baseRotation: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.weapon.base-rotation",
			description: "editor.weapon.base-rotation-description",
		}),
	),

	top: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.weapon.top", description: "editor.weapon.top-description" }),
	),

	continuous: v.pipe(
		v.optional(v.boolean()),
		metadata({
			name: "editor.weapon.continuous",
			description: "editor.weapon.continuous-description",
		}),
	),
	alwaysContinuous: v.pipe(
		v.optional(v.boolean()),
		metadata({
			name: "editor.weapon.always-continuous",
			description: "editor.weapon.always-continuous-description",
		}),
	),

	aimChangeSpeed: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.weapon.aim-change-speed",
			description: "editor.weapon.aim-change-speed-description",
		}),
	),

	controllable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weapon.controllable",
			description: "editor.weapon.controllable-description",
		}),
	),
	aiControllable: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weapon.ai-controllable",
			description: "editor.weapon.ai-controllable-description",
		}),
	),
	alwaysShooting: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weapon.always-shooting",
			description: "editor.weapon.always-shooting-description",
		}),
	),
	autoTarget: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weapon.auto-target",
			description: "editor.weapon.auto-target-description",
		}),
	),
	predictTarget: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weapon.predict-target",
			description: "editor.weapon.predict-target-description",
		}),
	),
	useAttackRange: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.weapon.use-attack-range",
			description: "editor.weapon.use-attack-range-description",
		}),
	),

	targetInterval: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.weapon.target-interval",
			description: "editor.weapon.target-interval-description",
		}),
	),
	targetSwitchInterval: v.pipe(
		v.optional(v.number(), 70),
		metadata({
			name: "editor.weapon.target-switch-interval",
			description: "editor.weapon.target-switch-interval-description",
		}),
	),

	rotateSpeed: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.weapon.rotate-speed",
			description: "editor.weapon.rotate-speed-description",
		}),
	),
	inaccuracy: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.weapon.inaccuracy",
			description: "editor.weapon.inaccuracy-description",
		}),
	),
	shake: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.weapon.shake", description: "editor.weapon.shake-description" }),
	),
	recoil: v.pipe(
		v.optional(v.number(), 1.5),
		metadata({ name: "editor.weapon.recoil", description: "editor.weapon.recoil-description" }),
	),

	recoils: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "editor.weapon.recoils", description: "editor.weapon.recoils-description" }),
	),

	recoilTime: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.weapon.recoil-time",
			description: "editor.weapon.recoil-time-description",
		}),
	),
	recoilPow: v.pipe(
		v.optional(v.number(), 1.8),
		metadata({
			name: "editor.weapon.recoil-pow",
			description: "editor.weapon.recoil-pow-description",
		}),
	),
	cooldownTime: v.pipe(
		v.optional(v.number(), 20),
		metadata({
			name: "editor.weapon.cooldown-time",
			description: "editor.weapon.cooldown-time-description",
		}),
	),

	shootX: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.weapon.shoot-x", description: "editor.weapon.shoot-x-description" }),
	),
	shootY: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "editor.weapon.shoot-y", description: "editor.weapon.shoot-y-description" }),
	),

	x: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "editor.weapon.x", description: "editor.weapon.x-description" }),
	),
	y: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.weapon.y", description: "editor.weapon.y-description" }),
	),

	xRand: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.weapon.x-rand", description: "editor.weapon.x-rand-description" }),
	),
	yRand: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.weapon.y-rand", description: "editor.weapon.y-rand-description" }),
	),

	shadow: v.pipe(
		v.optional(v.number(), -1),
		metadata({ name: "editor.weapon.shadow", description: "editor.weapon.shadow-description" }),
	),

	velocityRnd: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.weapon.velocity-rnd",
			description: "editor.weapon.velocity-rnd-description",
		}),
	),
	extraVelocity: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.weapon.extra-velocity",
			description: "editor.weapon.extra-velocity-description",
		}),
	),

	shootCone: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.weapon.shoot-cone",
			description: "editor.weapon.shoot-cone-description",
		}),
	),
	rotationLimit: v.pipe(
		v.optional(v.number(), 361),
		metadata({
			name: "editor.weapon.rotation-limit",
			description: "editor.weapon.rotation-limit-description",
		}),
	),

	minWarmup: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.weapon.min-warmup",
			description: "editor.weapon.min-warmup-description",
		}),
	),

	shootWarmupSpeed: v.pipe(
		v.optional(v.number(), 0.1),
		metadata({
			name: "editor.weapon.shoot-warmup-speed",
			description: "editor.weapon.shoot-warmup-speed-description",
		}),
	),
	smoothReloadSpeed: v.pipe(
		v.optional(v.number(), 0.15),
		metadata({
			name: "editor.weapon.smooth-reload-speed",
			description: "editor.weapon.smooth-reload-speed-description",
		}),
	),

	linearWarmup: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weapon.linear-warmup",
			description: "editor.weapon.linear-warmup-description",
		}),
	),

	soundPitchMin: v.pipe(
		v.optional(v.number(), 0.8),
		metadata({
			name: "editor.weapon.sound-pitch-min",
			description: "editor.weapon.sound-pitch-min-description",
		}),
	),
	soundPitchMax: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.weapon.sound-pitch-max",
			description: "editor.weapon.sound-pitch-max-description",
		}),
	),

	ignoreRotation: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weapon.ignore-rotation",
			description: "editor.weapon.ignore-rotation-description",
		}),
	),
	noAttack: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weapon.no-attack",
			description: "editor.weapon.no-attack-description",
		}),
	),

	minShootVelocity: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.weapon.min-shoot-velocity",
			description: "editor.weapon.min-shoot-velocity-description",
		}),
	),

	parentizeEffects: v.pipe(
		v.optional(v.boolean()),
		metadata({
			name: "editor.weapon.parentize-effects",
			description: "editor.weapon.parentize-effects-description",
		}),
	),

	otherSide: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.weapon.other-side",
			description: "editor.weapon.other-side-description",
		}),
	),

	layerOffset: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.weapon.layer-offset",
			description: "editor.weapon.layer-offset-description",
		}),
	),

	heatColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.weapon.heat-color",
			description: "editor.weapon.heat-color-description",
		}),
	),

	shootStatusDuration: v.pipe(
		v.optional(v.number(), 60 * 5),
		metadata({
			name: "editor.weapon.shoot-status-duration",
			description: "editor.weapon.shoot-status-duration-description",
		}),
	),

	shootOnDeath: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.weapon.shoot-on-death",
			description: "editor.weapon.shoot-on-death-description",
		}),
	),
});

const buildWeaponSchema = v.object({});

const mineWeaponSchema = v.object({});

const pointDefenseBulletWeaponSchema = v.object({});

const pointDefenseWeaponSchema = cached((context: ProjectContents) =>
	v.object({
		color: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({ name: "editor.weapon.color", description: "editor.weapon.color-description" }),
		),
		beamEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.weapon.beam-effect",
				description: "editor.weapon.beam-effect-description",
			}),
		),
	}),
);

const repairBeamWeaponSchema = cached((context: ProjectContents) =>
	v.object({
		targetBuildings: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.weapon.target-buildings",
				description: "editor.weapon.target-buildings-description",
			}),
		),
		targetUnits: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.weapon.target-units",
				description: "editor.weapon.target-units-description",
			}),
		),
		repairSpeed: v.pipe(
			v.optional(v.number(), 0.3),
			metadata({
				name: "editor.weapon.repair-speed",
				description: "editor.weapon.repair-speed-description",
			}),
		),
		fractionRepairSpeed: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.weapon.fraction-repair-speed",
				description: "editor.weapon.fraction-repair-speed-description",
			}),
		),
		beamWidth: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.weapon.beam-width",
				description: "editor.weapon.beam-width-description",
			}),
		),
		pulseRadius: v.pipe(
			v.optional(v.number(), 6),
			metadata({
				name: "editor.weapon.pulse-radius",
				description: "editor.weapon.pulse-radius-description",
			}),
		),
		pulseStroke: v.pipe(
			v.optional(v.number(), 2),
			metadata({
				name: "editor.weapon.pulse-stroke",
				description: "editor.weapon.pulse-stroke-description",
			}),
		),
		widthSinMag: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.weapon.width-sin-mag",
				description: "editor.weapon.width-sin-mag-description",
			}),
		),
		widthSinScl: v.pipe(
			v.optional(v.number(), 4),
			metadata({
				name: "editor.weapon.width-sin-scl",
				description: "editor.weapon.width-sin-scl-description",
			}),
		),
		recentDamageMultiplier: v.pipe(
			v.optional(v.number(), 0.1),
			metadata({
				name: "editor.weapon.recent-damage-multiplier",
				description: "editor.weapon.recent-damage-multiplier-description",
			}),
		),
		laserColor: v.pipe(
			v.optional(MindustryHexColorSchema, "98ffa9"),
			metadata({
				name: "editor.weapon.laser-color",
				description: "editor.weapon.laser-color-description",
			}),
		),
		laserTopColor: v.pipe(
			v.optional(MindustryHexColorSchema, "ffffff"),
			metadata({
				name: "editor.weapon.laser-top-color",
				description: "editor.weapon.laser-top-color-description",
			}),
		),
		healColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({
				name: "editor.weapon.heal-color",
				description: "editor.weapon.heal-color-description",
			}),
		),
		healEffect: v.pipe(
			v.optional(EffectFieldSchema(context)),
			metadata({
				name: "editor.weapon.heal-effect",
				description: "editor.weapon.heal-effect-description",
			}),
		),
	}),
);

export const WeaponHjsonSchema = new ClassMap<WeaponType>(
	{
		Weapon: () => ({}),
		BuildWeapon: () => buildWeaponSchema.entries,
		MineWeapon: () => mineWeaponSchema.entries,
		PointDefenseBulletWeapon: () => pointDefenseBulletWeaponSchema.entries,
		PointDefenseWeapon: (context) => pointDefenseWeaponSchema(context).entries,
		RepairBeamWeapon: (context) => repairBeamWeaponSchema(context).entries,
	},
	{
		baseSchema: () => weaponObjectSchema.entries,
		extra: (context) => ({
			bullet: v.pipe(
				v.optional(BulletHjsonSchema(context)),
				metadata({ name: "editor.weapon.bullet", description: "editor.weapon.bullet-description" }),
			),
			ejectEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.weapon.eject-effect",
					description: "editor.weapon.eject-effect-description",
				}),
			),
			shoot: v.pipe(
				v.optional(ShootPatternHjsonSchema(context)),
				metadata({ name: "editor.weapon.shoot", description: "editor.weapon.shoot-description" }),
			),
			shootStatus: v.pipe(
				v.optional(StatusStringSchema(context)),
				metadata({
					name: "editor.weapon.shoot-status",
					description: "editor.weapon.shoot-status-description",
				}),
			),
			shootOnDeathEffect: v.pipe(
				v.optional(EffectFieldSchema(context)),
				metadata({
					name: "editor.weapon.shoot-on-death-effect",
					description: "editor.weapon.shoot-on-death-effect-description",
				}),
			),
			parts: v.optional(v.array(PartHjsonSchema(context)), []),
			activeSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({
					name: "editor.weapon.active-sound",
					description: "editor.weapon.active-sound-description",
				}),
			),
			shootSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({
					name: "editor.weapon.shoot-sound",
					description: "editor.weapon.shoot-sound-description",
				}),
			),
			initialShootSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({
					name: "editor.weapon.initial-shoot-sound",
					description: "editor.weapon.initial-shoot-sound-description",
				}),
			),
			chargeSound: v.pipe(
				v.optional(SoundHjsonSchema),
				metadata({
					name: "editor.weapon.charge-sound",
					description: "editor.weapon.charge-sound-description",
				}),
			),
		}),
	},
).schema;
