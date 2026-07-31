import * as v from "valibot";
import { TextureFieldSchema } from "./texture";
import {  metadata } from "./utils";
import { ShootPatternHjsonSchema } from "./shoot-pattern";
import { EffectFieldSchema } from "./effect";
import { BulletHjsonSchema } from "./bullet";
import type { ProjectContents } from "@project/types";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { SoundHjsonSchema } from "./sound";

// Turret variant schemas
export const baseTurretObjectSchema = v.object({
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-base-turret.range",
			description: "editor.block-base-turret.range-description",
		}),
	),
	placeOverlapMargin: v.pipe(
		v.optional(v.number(), 56),
		metadata({
			name: "editor.block-base-turret.place-overlap-margin",
			description: "editor.block-base-turret.place-overlap-margin-description",
		}),
	),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-base-turret.rotate-speed",
			description: "editor.block-base-turret.rotate-speed-description",
		}),
	),
	fogRadiusMultiplier: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-base-turret.fog-radius-multiplier",
			description: "editor.block-base-turret.fog-radius-multiplier-description",
		}),
	),
	disableOverlapCheck: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-base-turret.disable-overlap-check",
			description: "editor.block-base-turret.disable-overlap-check-description",
		}),
	),
	activationTime: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-base-turret.activation-time",
			description: "editor.block-base-turret.activation-time-description",
		}),
	),
	coolantMultiplier: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-base-turret.coolant-multiplier",
			description: "editor.block-base-turret.coolant-multiplier-description",
		}),
	),
});

export const reloadTurretObjectSchema = v.object({
	...baseTurretObjectSchema.entries,
	reload: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block-reload-turret.reload",
			description: "editor.block-reload-turret.reload-description",
		}),
	),
});

export const turretObjectSchema = (context: ProjectContents) =>
	v.object({
		...reloadTurretObjectSchema.entries,
		shoot: v.optional(ShootPatternHjsonSchema(context)),
		ammoUseEffect: v.optional(EffectFieldSchema(context)),
		targetInterval: v.pipe(
			v.optional(v.number(), 20),
			metadata({
				name: "editor.block-turret.target-interval",
				description: "editor.block-turret.target-interval-description",
			}),
		),
		newTargetInterval: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.new-target-interval",
				description: "editor.block-turret.new-target-interval-description",
			}),
		),
		maxAmmo: v.pipe(
			v.optional(v.number(), 30),
			metadata({
				name: "editor.block-turret.max-ammo",
				description: "editor.block-turret.max-ammo-description",
			}),
		),
		ammoPerShot: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-turret.ammo-per-shot",
				description: "editor.block-turret.ammo-per-shot-description",
			}),
		),
		consumeAmmoOnce: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.consume-ammo-once",
				description: "editor.block-turret.consume-ammo-once-description",
			}),
		),
		heatRequirement: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.heat-requirement",
				description: "editor.block-turret.heat-requirement-description",
			}),
		),
		maxHeatEfficiency: v.pipe(
			v.optional(v.number(), 3),
			metadata({
				name: "editor.block-turret.max-heat-efficiency",
				description: "editor.block-turret.max-heat-efficiency-description",
			}),
		),
		inaccuracy: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.inaccuracy",
				description: "editor.block-turret.inaccuracy-description",
			}),
		),
		velocityRnd: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.velocity-rnd",
				description: "editor.block-turret.velocity-rnd-description",
			}),
		),
		scaleLifetimeOffset: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.scale-lifetime-offset",
				description: "editor.block-turret.scale-lifetime-offset-description",
			}),
		),
		shootCone: v.pipe(
			v.optional(v.number(), 8),
			metadata({
				name: "editor.block-turret.shoot-cone",
				description: "editor.block-turret.shoot-cone-description",
			}),
		),
		shootX: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.shoot-x",
				description: "editor.block-turret.shoot-x-description",
			}),
		),
		shootY: v.pipe(
			v.optional(v.number()),
			metadata({
				name: "editor.block-turret.shoot-y",
				description: "editor.block-turret.shoot-y-description",
			}),
		),
		xRand: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.x-rand",
				description: "editor.block-turret.x-rand-description",
			}),
		),
		drawMinRange: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-turret.draw-min-range",
				description: "editor.block-turret.draw-min-range-description",
			}),
		),
		trackingRange: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.tracking-range",
				description: "editor.block-turret.tracking-range-description",
			}),
		),
		minRange: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.min-range",
				description: "editor.block-turret.min-range-description",
			}),
		),
		minWarmup: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.min-warmup",
				description: "editor.block-turret.min-warmup-description",
			}),
		),
		accurateDelay: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.accurate-delay",
				description: "editor.block-turret.accurate-delay-description",
			}),
		),
		moveWhileCharging: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.move-while-charging",
				description: "editor.block-turret.move-while-charging-description",
			}),
		),
		reloadWhileCharging: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.reload-while-charging",
				description: "editor.block-turret.reload-while-charging-description",
			}),
		),
		warmupMaintainTime: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.warmup-maintain-time",
				description: "editor.block-turret.warmup-maintain-time-description",
			}),
		),
		targetAir: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.target-air",
				description: "editor.block-turret.target-air-description",
			}),
		),
		targetGround: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.target-ground",
				description: "editor.block-turret.target-ground-description",
			}),
		),
		targetBlocks: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.target-blocks",
				description: "editor.block-turret.target-blocks-description",
			}),
		),
		targetHealing: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-turret.target-healing",
				description: "editor.block-turret.target-healing-description",
			}),
		),
		playerControllable: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.player-controllable",
				description: "editor.block-turret.player-controllable-description",
			}),
		),
		displayAmmoMultiplier: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.display-ammo-multiplier",
				description: "editor.block-turret.display-ammo-multiplier-description",
			}),
		),
		targetUnderBlocks: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.target-under-blocks",
				description: "editor.block-turret.target-under-blocks-description",
			}),
		),
		alwaysShooting: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-turret.always-shooting",
				description: "editor.block-turret.always-shooting-description",
			}),
		),
		predictTarget: v.pipe(
			v.optional(v.boolean(), true),
			metadata({
				name: "editor.block-turret.predict-target",
				description: "editor.block-turret.predict-target-description",
			}),
		),
		shootSoundVolume: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-turret.shoot-sound-volume",
				description: "editor.block-turret.shoot-sound-volume-description",
			}),
		),
		loopSoundVolume: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({
				name: "editor.block-turret.loop-sound-volume",
				description: "editor.block-turret.loop-sound-volume-description",
			}),
		),
		soundPitchMin: v.pipe(
			v.optional(v.number(), 0.9),
			metadata({
				name: "editor.block-turret.sound-pitch-min",
				description: "editor.block-turret.sound-pitch-min-description",
			}),
		),
		soundPitchMax: v.pipe(
			v.optional(v.number(), 1.1),
			metadata({
				name: "editor.block-turret.sound-pitch-max",
				description: "editor.block-turret.sound-pitch-max-description",
			}),
		),
		ammoEjectBack: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-turret.ammo-eject-back",
				description: "editor.block-turret.ammo-eject-back-description",
			}),
		),
		shootWarmupSpeed: v.pipe(
			v.optional(v.number(), 0.1),
			metadata({
				name: "editor.block-turret.shoot-warmup-speed",
				description: "editor.block-turret.shoot-warmup-speed-description",
			}),
		),
		linearWarmup: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-turret.linear-warmup",
				description: "editor.block-turret.linear-warmup-description",
			}),
		),
		recoil: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.block-turret.recoil",
				description: "editor.block-turret.recoil-description",
			}),
		),
		recoils: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.recoils",
				description: "editor.block-turret.recoils-description",
			}),
		),
		recoilTime: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.recoil-time",
				description: "editor.block-turret.recoil-time-description",
			}),
		),
		recoilPow: v.pipe(
			v.optional(v.number(), 1.8),
			metadata({
				name: "editor.block-turret.recoil-pow",
				description: "editor.block-turret.recoil-pow-description",
			}),
		),
		cooldownTime: v.pipe(
			v.optional(v.number(), 20),
			metadata({
				name: "editor.block-turret.cooldown-time",
				description: "editor.block-turret.cooldown-time-description",
			}),
		),
		elevation: v.pipe(
			v.optional(v.number(), -1),
			metadata({
				name: "editor.block-turret.elevation",
				description: "editor.block-turret.elevation-description",
			}),
		),
		shake: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.block-turret.shake",
				description: "editor.block-turret.shake-description",
			}),
		),
		heatColor: v.optional(MindustryHexColorSchema),
		shootEffect: v.optional(EffectFieldSchema(context)),
		smokeEffect: v.optional(EffectFieldSchema(context)),
		shootSound: v.optional(SoundHjsonSchema),
		chargeSound: v.optional(SoundHjsonSchema),
		loopSound: v.optional(SoundHjsonSchema),
	});

export const powerTurretObjectSchema = (context: ProjectContents) =>
	v.object({
		...turretObjectSchema(context).entries,
		shootType: v.pipe(
			v.optional(BulletHjsonSchema(context)),
			metadata({
				name: "editor.block-power-turret.shoot-type",
				description: "editor.block-power-turret.shoot-type-description",
			}),
		),
	});

export const laserTurretObjectSchema = (context: ProjectContents) =>
	v.object({
		...powerTurretObjectSchema(context).entries,
		firingMoveFract: v.pipe(
			v.optional(v.number(), 0.25),
			metadata({
				name: "editor.block-laser-turret.firing-move-fract",
				description: "editor.block-laser-turret.firing-move-fract-description",
			}),
		),
		shootDuration: v.pipe(
			v.optional(v.number(), 100),
			metadata({
				name: "editor.block-laser-turret.shoot-duration",
				description: "editor.block-laser-turret.shoot-duration-description",
			}),
		),
	});

export const continuousTurretObjectSchema = (context: ProjectContents) =>
	v.object({
		...turretObjectSchema(context).entries,
		shootType: v.pipe(
			v.optional(BulletHjsonSchema(context)),
			metadata({
				name: "editor.block-continuous-turret.shoot-type",
				description: "editor.block-continuous-turret.shoot-type-description",
			}),
		),
		aimChangeSpeed: v.pipe(
			v.optional(v.number()),
			metadata({
				name: "editor.block-continuous-turret.aim-change-speed",
				description: "editor.block-continuous-turret.aim-change-speed-description",
			}),
		),
		scaleDamageEfficiency: v.pipe(
			v.optional(v.boolean(), false),
			metadata({
				name: "editor.block-continuous-turret.scale-damage-efficiency",
				description: "editor.block-continuous-turret.scale-damage-efficiency-description",
			}),
		),
	});

export const continuousLiquidTurretObjectSchema = (context: ProjectContents) =>
	v.object({
		...continuousTurretObjectSchema(context).entries,
		liquidConsumed: v.pipe(
			v.optional(v.number(), 1 / 60),
			metadata({
				name: "editor.block-continuous-liquid-turret.liquid-consumed",
				description: "editor.block-continuous-liquid-turret.liquid-consumed-description",
			}),
		),
	});

export const pointDefenseTurretObjectSchema = v.object({
	baseTexture: TextureFieldSchema("@-base"),
	...reloadTurretObjectSchema.entries,
	retargetTime: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-point-defense-turret.retarget-time",
			description: "editor.block-point-defense-turret.retarget-time-description",
		}),
	),
	shootCone: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-point-defense-turret.shoot-cone",
			description: "editor.block-point-defense-turret.shoot-cone-description",
		}),
	),
	bulletDamage: v.pipe(
		v.optional(v.number(), 10),
		metadata({
			name: "editor.block-point-defense-turret.bullet-damage",
			description: "editor.block-point-defense-turret.bullet-damage-description",
		}),
	),
	shootLength: v.pipe(
		v.optional(v.number(), 3),
		metadata({
			name: "editor.block-point-defense-turret.shoot-length",
			description: "editor.block-point-defense-turret.shoot-length-description",
		}),
	),
});

export const tractorBeamTurretObjectSchema = v.object({
	baseTexture: TextureFieldSchema("@-base"),
	laserTexture: TextureFieldSchema("@-laser"),
	laserStartTexture: TextureFieldSchema("@-laser-start"),
	laserEndTexture: TextureFieldSchema("@-laser-end"),
	...baseTurretObjectSchema.entries,
	retargetTime: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-tractor-beam-turret.retarget-time",
			description: "editor.block-tractor-beam-turret.retarget-time-description",
		}),
	),
	shootCone: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-tractor-beam-turret.shoot-cone",
			description: "editor.block-tractor-beam-turret.shoot-cone-description",
		}),
	),
	shootLength: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-tractor-beam-turret.shoot-length",
			description: "editor.block-tractor-beam-turret.shoot-length-description",
		}),
	),
	laserWidth: v.pipe(
		v.optional(v.number(), 0.6),
		metadata({
			name: "editor.block-tractor-beam-turret.laser-width",
			description: "editor.block-tractor-beam-turret.laser-width-description",
		}),
	),
	force: v.pipe(
		v.optional(v.number(), 0.3),
		metadata({
			name: "editor.block-tractor-beam-turret.force",
			description: "editor.block-tractor-beam-turret.force-description",
		}),
	),
	scaledForce: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-tractor-beam-turret.scaled-force",
			description: "editor.block-tractor-beam-turret.scaled-force-description",
		}),
	),
	damage: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-tractor-beam-turret.damage",
			description: "editor.block-tractor-beam-turret.damage-description",
		}),
	),
	targetAir: v.pipe(
		v.optional(v.boolean(), true),
		metadata({
			name: "editor.block-tractor-beam-turret.target-air",
			description: "editor.block-tractor-beam-turret.target-air-description",
		}),
	),
	targetGround: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-tractor-beam-turret.target-ground",
			description: "editor.block-tractor-beam-turret.target-ground-description",
		}),
	),
	statusDuration: v.pipe(
		v.optional(v.number(), 300),
		metadata({
			name: "editor.block-tractor-beam-turret.status-duration",
			description: "editor.block-tractor-beam-turret.status-duration-description",
		}),
	),
	shootSoundVolume: v.pipe(
		v.optional(v.number(), 0.9),
		metadata({
			name: "editor.block-tractor-beam-turret.shoot-sound-volume",
			description: "editor.block-tractor-beam-turret.shoot-sound-volume-description",
		}),
	),
});

export const buildTurretObjectSchema = v.object({
	...baseTurretObjectSchema.entries,
	baseTexture: TextureFieldSchema("@-base", "block-@size"),
	glowTexture: TextureFieldSchema("@-glow"),
	targetInterval: v.pipe(
		v.optional(v.number(), 15),
		metadata({
			name: "editor.block-build-turret.target-interval",
			description: "editor.block-build-turret.target-interval-description",
		}),
	),
	buildSpeed: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-build-turret.build-speed",
			description: "editor.block-build-turret.build-speed-description",
		}),
	),
	buildBeamOffset: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-build-turret.build-beam-offset",
			description: "editor.block-build-turret.build-beam-offset-description",
		}),
	),
	elevation: v.pipe(
		v.optional(v.number(), -1),
		metadata({
			name: "editor.block-build-turret.elevation",
			description: "editor.block-build-turret.elevation-description",
		}),
	),
});
