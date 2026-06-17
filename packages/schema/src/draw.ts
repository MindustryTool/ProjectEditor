import * as v from "valibot";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { LiquidFieldSchema } from "./liquid";
import { PartHjsonSchema, BlendingModes } from "./part";
import type { SchemaFn } from "./utils";
import { CachedSchema, metadata } from "./utils";
import { ClassMap, classSchema } from "./class";
import { Interps } from "./interps";

export const drawClasses = [
	"DrawBlock",
	"DrawArcSmelt",
	"DrawBlockParts",
	"DrawBlurSpin",
	"DrawBubbles",
	"DrawCells",
	"DrawCircles",
	"DrawCrucibleFlame",
	"DrawCultivator",
	"DrawDefault",
	"DrawFade",
	"DrawFlame",
	"DrawFrames",
	"DrawGlowRegion",
	"DrawHeatInput",
	"DrawHeatOutput",
	"DrawHeatRegion",
	"DrawLiquidOutputs",
	"DrawLiquidRegion",
	"DrawLiquidTile",
	"DrawMulti",
	"DrawMultiWeave",
	"DrawParticles",
	"DrawPistons",
	"DrawPlasma",
	"DrawPower",
	"DrawPulseShape",
	"DrawPumpLiquid",
	"DrawRegion",
	"DrawShape",
	"DrawSideRegion",
	"DrawSoftParticles",
	"DrawSpikes",
	"DrawTurret",
	"DrawWarmupRegion",
	"DrawWeave",
] as const;

export type DrawClass = (typeof drawClasses)[number];

const drawBaseObjectSchema = v.object({
	type: classSchema(drawClasses, "DrawDefault"),

	iconOverride: v.pipe(
		v.optional(v.array(v.string())),
		metadata({ name: "editor.draw.icon-override", description: "editor.draw.icon-override-description" }),
	),
});

const drawRegionSchema = v.object({
	suffix: v.pipe(v.optional(v.string(), ""), metadata({ name: "editor.draw.suffix" })),
	x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.x" })),
	y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.y" })),
	rotateSpeed: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.draw.rotate-speed" }),
	),
	spinSprite: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.draw.spin-sprite" }),
	),
	drawPlan: v.pipe(
		v.optional(v.boolean(), true),
		metadata({ name: "editor.draw.draw-plan" }),
	),
	buildingRotate: v.pipe(
		v.optional(v.boolean(), false),
		metadata({ name: "editor.draw.building-rotate" }),
	),
	rotation: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.draw.rotation" }),
	),
	layer: v.pipe(v.optional(v.number(), -1), metadata({ name: "editor.draw.layer", description: "editor.draw.layer-description" })),
	color: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.draw.color" }),
	),
	name: v.pipe(v.optional(v.string()), metadata({ name: "editor.draw.name", description: "editor.draw.name-description" })),
});

const drawFlameBaseObjectSchema = v.object({
	flameColor: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({ name: "editor.draw.flame-color" }),
	),
	flameRadius: v.pipe(
		v.optional(v.number(), 3),
		metadata({ name: "editor.draw.flame-radius" }),
	),
	flameRadiusIn: v.pipe(
		v.optional(v.number(), 1.9),
		metadata({ name: "editor.draw.flame-radius-in" }),
	),
	flameRadiusScl: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "editor.draw.flame-radius-scl" }),
	),
	flameRadiusMag: v.pipe(
		v.optional(v.number(), 2),
		metadata({ name: "editor.draw.flame-radius-mag" }),
	),
	flameRadiusInMag: v.pipe(
		v.optional(v.number(), 1),
		metadata({ name: "editor.draw.flame-radius-in-mag" }),
	),
	flameX: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.draw.flame-x" }),
	),
	flameY: v.pipe(
		v.optional(v.number(), 0),
		metadata({ name: "editor.draw.flame-y" }),
	),
	lightRadius: v.pipe(
		v.optional(v.number(), 60),
		metadata({ name: "editor.draw.light-radius" }),
	),
	lightAlpha: v.pipe(
		v.optional(v.number(), 0.65),
		metadata({ name: "editor.draw.light-alpha" }),
	),
	lightSinScl: v.pipe(
		v.optional(v.number(), 10),
		metadata({ name: "editor.draw.light-sin-scl" }),
	),
	lightSinMag: v.pipe(
		v.optional(v.number(), 5),
		metadata({ name: "editor.draw.light-sin-mag" }),
	),
});

export const DrawHjsonSchema = new ClassMap<DrawClass>(
	{
		DrawBlock: (_context) => ({}),
		DrawArcSmelt: (_context) => ({
			flameColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.draw.arc-smelt.flame-color" }),
			),
			midColor: v.pipe(
				v.optional(MindustryHexColorSchema),
				metadata({ name: "editor.draw.arc-smelt.mid-color" }),
			),
			flameRad: v.pipe(
				v.optional(v.number(), 1),
				metadata({ name: "editor.draw.arc-smelt.flame-rad" }),
			),
			circleSpace: v.pipe(
				v.optional(v.number(), 2),
				metadata({ name: "editor.draw.arc-smelt.circle-space" }),
			),
			flameRadiusScl: v.pipe(
				v.optional(v.number(), 3),
				metadata({ name: "editor.draw.arc-smelt.flame-radius-scl" }),
			),
			flameRadiusMag: v.pipe(
				v.optional(v.number(), 0.3),
				metadata({ name: "editor.draw.arc-smelt.flame-radius-mag" }),
			),
			circleStroke: v.pipe(
				v.optional(v.number(), 1.5),
				metadata({ name: "editor.draw.arc-smelt.circle-stroke" }),
			),
			x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.arc-smelt.x" })),
			y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.arc-smelt.y" })),
			alpha: v.pipe(
				v.optional(v.number(), 0.68),
				metadata({ name: "editor.draw.arc-smelt.alpha" }),
			),
			particles: v.pipe(
				v.optional(v.number(), 25),
				metadata({ name: "editor.draw.arc-smelt.particles" }),
			),
			particleLife: v.pipe(
				v.optional(v.number(), 40),
				metadata({ name: "editor.draw.arc-smelt.particle-life" }),
			),
			particleRad: v.pipe(
				v.optional(v.number(), 7),
				metadata({ name: "editor.draw.arc-smelt.particle-rad" }),
			),
			particleStroke: v.pipe(
				v.optional(v.number(), 1.1),
				metadata({ name: "editor.draw.arc-smelt.particle-stroke" }),
			),
			particleLen: v.pipe(
				v.optional(v.number(), 3),
				metadata({ name: "editor.draw.arc-smelt.particle-len" }),
			),
			drawCenter: v.pipe(
				v.optional(v.boolean(), true),
				metadata({ name: "editor.draw.arc-smelt.draw-center" }),
			),
			blending: v.pipe(
				v.optional(v.picklist(BlendingModes), "additive"),
				metadata({ name: "editor.draw.arc-smelt.blending" }),
			),
		}),
		DrawBlurSpin: (_context) => ({
				suffix: v.pipe(v.optional(v.string(), ""), metadata({ name: "editor.draw.blur-spin.suffix" })),
				rotateSpeed: v.pipe(
					v.optional(v.number(), 1),
					metadata({ name: "editor.draw.blur-spin.rotate-speed" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.blur-spin.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.blur-spin.y" })),
				blurThresh: v.pipe(
					v.optional(v.number(), 0.7),
					metadata({ name: "editor.draw.blur-spin.blur-thresh" }),
				),
			}),
			DrawBubbles: (_context) => ({
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.bubbles.color" }),
				),
				amount: v.pipe(
					v.optional(v.number(), 12),
					metadata({ name: "editor.draw.bubbles.amount" }),
				),
				sides: v.pipe(
					v.optional(v.number(), 8),
					metadata({ name: "editor.draw.bubbles.sides" }),
				),
				strokeMin: v.pipe(
					v.optional(v.number(), 0.2),
					metadata({ name: "editor.draw.bubbles.stroke-min" }),
				),
				spread: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.bubbles.spread" }),
				),
				timeScl: v.pipe(
					v.optional(v.number(), 30),
					metadata({ name: "editor.draw.bubbles.time-scl" }),
				),
				recurrence: v.pipe(
					v.optional(v.number(), 6),
					metadata({ name: "editor.draw.bubbles.recurrence" }),
				),
				radius: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.bubbles.radius" }),
				),
				fill: v.pipe(
					v.optional(v.boolean(), false),
					metadata({ name: "editor.draw.bubbles.fill" }),
				),
			}),
			DrawBlockParts: (context) => ({
				parts: v.pipe(
					v.optional(v.array(PartHjsonSchema(context))),
					metadata({ name: "editor.draw.block-parts.parts" }),
				),
			}),
			DrawCells: (_context) => ({
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.cells.color" }),
				),
				particleColorFrom: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.cells.particle-color-from" }),
				),
				particleColorTo: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.cells.particle-color-to" }),
				),
				particles: v.pipe(
					v.optional(v.number(), 12),
					metadata({ name: "editor.draw.cells.particles" }),
				),
				range: v.pipe(
					v.optional(v.number(), 4),
					metadata({ name: "editor.draw.cells.range" }),
				),
				recurrence: v.pipe(
					v.optional(v.number(), 2),
					metadata({ name: "editor.draw.cells.recurrence" }),
				),
				radius: v.pipe(
					v.optional(v.number(), 1.8),
					metadata({ name: "editor.draw.cells.radius" }),
				),
				lifetime: v.pipe(
					v.optional(v.number(), 180),
					metadata({ name: "editor.draw.cells.lifetime" }),
				),
			}),
			DrawCircles: (_context) => ({
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.circles.color" }),
				),
				amount: v.pipe(
					v.optional(v.number(), 5),
					metadata({ name: "editor.draw.circles.amount" }),
				),
				sides: v.pipe(
					v.optional(v.number(), 15),
					metadata({ name: "editor.draw.circles.sides" }),
				),
				strokeMin: v.pipe(
					v.optional(v.number(), 0.2),
					metadata({ name: "editor.draw.circles.stroke-min" }),
				),
				strokeMax: v.pipe(
					v.optional(v.number(), 2),
					metadata({ name: "editor.draw.circles.stroke-max" }),
				),
				timeScl: v.pipe(
					v.optional(v.number(), 160),
					metadata({ name: "editor.draw.circles.time-scl" }),
				),
				radius: v.pipe(
					v.optional(v.number(), 12),
					metadata({ name: "editor.draw.circles.radius" }),
				),
				radiusOffset: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.circles.radius-offset" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.circles.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.circles.y" })),
				strokeInterp: v.pipe(
					v.optional(v.picklist(Interps), "pow3In"),
					metadata({ name: "editor.draw.circles.stroke-interp" }),
				),
			}),
			DrawCrucibleFlame: (_context) => ({
				flameColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.crucible-flame.flame-color" }),
				),
				midColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.crucible-flame.mid-color" }),
				),
				flameRad: v.pipe(
					v.optional(v.number(), 1),
					metadata({ name: "editor.draw.crucible-flame.flame-rad" }),
				),
				circleSpace: v.pipe(
					v.optional(v.number(), 2),
					metadata({ name: "editor.draw.crucible-flame.circle-space" }),
				),
				flameRadiusScl: v.pipe(
					v.optional(v.number(), 10),
					metadata({ name: "editor.draw.crucible-flame.flame-radius-scl" }),
				),
				flameRadiusMag: v.pipe(
					v.optional(v.number(), 0.6),
					metadata({ name: "editor.draw.crucible-flame.flame-radius-mag" }),
				),
				circleStroke: v.pipe(
					v.optional(v.number(), 1.5),
					metadata({ name: "editor.draw.crucible-flame.circle-stroke" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.crucible-flame.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.crucible-flame.y" })),
				alpha: v.pipe(
					v.optional(v.number(), 0.5),
					metadata({ name: "editor.draw.crucible-flame.alpha" }),
				),
				particles: v.pipe(
					v.optional(v.number(), 30),
					metadata({ name: "editor.draw.crucible-flame.particles" }),
				),
				particleLife: v.pipe(
					v.optional(v.number(), 70),
					metadata({ name: "editor.draw.crucible-flame.particle-life" }),
				),
				particleRad: v.pipe(
					v.optional(v.number(), 7),
					metadata({ name: "editor.draw.crucible-flame.particle-rad" }),
				),
				particleSize: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.crucible-flame.particle-size" }),
				),
				fadeMargin: v.pipe(
					v.optional(v.number(), 0.4),
					metadata({ name: "editor.draw.crucible-flame.fade-margin" }),
				),
				rotateScl: v.pipe(
					v.optional(v.number(), 1.5),
					metadata({ name: "editor.draw.crucible-flame.rotate-scl" }),
				),
				particleInterp: v.pipe(
					v.optional(v.picklist(Interps), "pow2In"),
					metadata({ name: "editor.draw.crucible-flame.particle-interp" }),
				),
			}),
			DrawCultivator: (_context) => ({
				plantColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.cultivator.plant-color" }),
				),
				plantColorLight: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.cultivator.plant-color-light" }),
				),
				bottomColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.cultivator.bottom-color" }),
				),
				bubbles: v.pipe(
					v.optional(v.number(), 12),
					metadata({ name: "editor.draw.cultivator.bubbles" }),
				),
				sides: v.pipe(
					v.optional(v.number(), 8),
					metadata({ name: "editor.draw.cultivator.sides" }),
				),
				strokeMin: v.pipe(
					v.optional(v.number(), 0.2),
					metadata({ name: "editor.draw.cultivator.stroke-min" }),
				),
				spread: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.cultivator.spread" }),
				),
				timeScl: v.pipe(
					v.optional(v.number(), 70),
					metadata({ name: "editor.draw.cultivator.time-scl" }),
				),
				recurrence: v.pipe(
					v.optional(v.number(), 6),
					metadata({ name: "editor.draw.cultivator.recurrence" }),
				),
				radius: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.cultivator.radius" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.cultivator.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.cultivator.y" })),
			}),
			DrawDefault: (_context) => ({}),
			DrawFade: (_context) => ({
				suffix: v.pipe(
					v.optional(v.string(), "-top"),
					metadata({ name: "editor.draw.fade.suffix" }),
				),
				alpha: v.pipe(
					v.optional(v.number(), 0.6),
					metadata({ name: "editor.draw.fade.alpha" }),
				),
				scale: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.fade.scale" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.fade.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.fade.y" })),
			}),
			DrawFlame: (_context) => drawFlameBaseObjectSchema.entries,
			DrawFrames: (_context) => ({
				frames: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.frames.frames", description: "editor.draw.frames.frames-description" }),
				),
				interval: v.pipe(
					v.optional(v.number(), 5),
					metadata({ name: "editor.draw.frames.interval", description: "editor.draw.frames.interval-description" }),
				),
				sine: v.pipe(
					v.optional(v.boolean(), true),
					metadata({ name: "editor.draw.frames.sine", description: "editor.draw.frames.sine-description" }),
				),
			}),
			DrawGlowRegion: (_context) => ({
				blending: v.pipe(
					v.optional(v.picklist(BlendingModes), "additive"),
					metadata({ name: "editor.draw.glow-region.blending" }),
				),
				suffix: v.pipe(
					v.optional(v.string(), "-glow"),
					metadata({ name: "editor.draw.glow-region.suffix" }),
				),
				alpha: v.pipe(
					v.optional(v.number(), 0.9),
					metadata({ name: "editor.draw.glow-region.alpha" }),
				),
				glowScale: v.pipe(
					v.optional(v.number(), 10),
					metadata({ name: "editor.draw.glow-region.glow-scale" }),
				),
				glowIntensity: v.pipe(
					v.optional(v.number(), 0.5),
					metadata({ name: "editor.draw.glow-region.glow-intensity" }),
				),
				rotateSpeed: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.glow-region.rotate-speed" }),
				),
				layer: v.pipe(
					v.optional(v.number(), 120),
					metadata({ name: "editor.draw.glow-region.layer" }),
				),
				rotate: v.pipe(
					v.optional(v.boolean(), false),
					metadata({ name: "editor.draw.glow-region.rotate" }),
				),
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.glow-region.color" }),
				),
			}),
			DrawHeatInput: (_context) => ({
				suffix: v.pipe(
					v.optional(v.string(), "-heat"),
					metadata({ name: "editor.draw.heat-input.suffix" }),
				),
				heatColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.heat-input.heat-color" }),
				),
				heatPulse: v.pipe(
					v.optional(v.number(), 0.3),
					metadata({ name: "editor.draw.heat-input.heat-pulse" }),
				),
				heatPulseScl: v.pipe(
					v.optional(v.number(), 10),
					metadata({ name: "editor.draw.heat-input.heat-pulse-scl" }),
				),
			}),
			DrawHeatOutput: (_context) => ({
				heatColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.heat-output.heat-color" }),
				),
				heatPulse: v.pipe(
					v.optional(v.number(), 0.3),
					metadata({ name: "editor.draw.heat-output.heat-pulse" }),
				),
				heatPulseScl: v.pipe(
					v.optional(v.number(), 10),
					metadata({ name: "editor.draw.heat-output.heat-pulse-scl" }),
				),
				glowMult: v.pipe(
					v.optional(v.number(), 1.2),
					metadata({ name: "editor.draw.heat-output.glow-mult" }),
				),
				rotOffset: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.heat-output.rot-offset" }),
				),
				drawGlow: v.pipe(
					v.optional(v.boolean(), true),
					metadata({ name: "editor.draw.heat-output.draw-glow" }),
				),
			}),
			DrawHeatRegion: (_context) => ({
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.heat-region.color" }),
				),
				pulse: v.pipe(
					v.optional(v.number(), 0.3),
					metadata({ name: "editor.draw.heat-region.pulse" }),
				),
				pulseScl: v.pipe(
					v.optional(v.number(), 10),
					metadata({ name: "editor.draw.heat-region.pulse-scl" }),
				),
				layer: v.pipe(
					v.optional(v.number(), 120),
					metadata({ name: "editor.draw.heat-region.layer" }),
				),
				suffix: v.pipe(
					v.optional(v.string(), "-glow"),
					metadata({ name: "editor.draw.heat-region.suffix" }),
				),
			}),
			DrawLiquidOutputs: (_context) => ({}),
			DrawLiquidRegion: (context) => ({
				drawLiquid: v.pipe(
					v.optional(LiquidFieldSchema(context)),
					metadata({ name: "editor.draw.liquid-region.draw-liquid" }),
				),
				suffix: v.pipe(
					v.optional(v.string(), "-liquid"),
					metadata({ name: "editor.draw.liquid-region.suffix" }),
				),
				alpha: v.pipe(
					v.optional(v.number(), 1),
					metadata({ name: "editor.draw.liquid-region.alpha" }),
				),
			}),
			DrawLiquidTile: (context) => ({
				drawLiquid: v.pipe(
					v.optional(LiquidFieldSchema(context)),
					metadata({ name: "editor.draw.liquid-tile.draw-liquid" }),
				),
				padding: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.liquid-tile.padding" }),
				),
				padLeft: v.pipe(
					v.optional(v.number(), -1),
					metadata({ name: "editor.draw.liquid-tile.pad-left" }),
				),
				padRight: v.pipe(
					v.optional(v.number(), -1),
					metadata({ name: "editor.draw.liquid-tile.pad-right" }),
				),
				padTop: v.pipe(
					v.optional(v.number(), -1),
					metadata({ name: "editor.draw.liquid-tile.pad-top" }),
				),
				padBottom: v.pipe(
					v.optional(v.number(), -1),
					metadata({ name: "editor.draw.liquid-tile.pad-bottom" }),
				),
				alpha: v.pipe(
					v.optional(v.number(), 1),
					metadata({ name: "editor.draw.liquid-tile.alpha" }),
				),
			}),
			DrawMulti: (context) => ({
				drawers: v.pipe(
					v.optional(v.array(DrawFieldSchema(context))),
					metadata({ name: "editor.draw.multi.drawers" }),
				),
			}),
			DrawMultiWeave: (_context) => ({
				rotateSpeed: v.pipe(
					v.optional(v.number(), 1),
					metadata({ name: "editor.draw.multi-weave.rotate-speed" }),
				),
				rotateSpeed2: v.pipe(
					v.optional(v.number(), -0.9),
					metadata({ name: "editor.draw.multi-weave.rotate-speed-2" }),
				),
				fadeWeave: v.pipe(
					v.optional(v.boolean(), false),
					metadata({ name: "editor.draw.multi-weave.fade-weave" }),
				),
				glowColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.multi-weave.glow-color" }),
				),
				weaveColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.multi-weave.weave-color" }),
				),
				pulse: v.pipe(
					v.optional(v.number(), 0.3),
					metadata({ name: "editor.draw.multi-weave.pulse" }),
				),
				pulseScl: v.pipe(
					v.optional(v.number(), 10),
					metadata({ name: "editor.draw.multi-weave.pulse-scl" }),
				),
			}),
			DrawParticles: (_context) => ({
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.particles.color" }),
				),
				sides: v.pipe(
					v.optional(v.number(), 12),
					metadata({ name: "editor.draw.particles.sides" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.particles.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.particles.y" })),
				alpha: v.pipe(
					v.optional(v.number(), 0.5),
					metadata({ name: "editor.draw.particles.alpha" }),
				),
				particles: v.pipe(
					v.optional(v.number(), 30),
					metadata({ name: "editor.draw.particles.particles" }),
				),
				particleRotation: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.particles.particle-rotation" }),
				),
				particleLife: v.pipe(
					v.optional(v.number(), 70),
					metadata({ name: "editor.draw.particles.particle-life" }),
				),
				particleRad: v.pipe(
					v.optional(v.number(), 7),
					metadata({ name: "editor.draw.particles.particle-rad" }),
				),
				particleSize: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.particles.particle-size" }),
				),
				fadeMargin: v.pipe(
					v.optional(v.number(), 0.4),
					metadata({ name: "editor.draw.particles.fade-margin" }),
				),
				rotateScl: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.particles.rotate-scl" }),
				),
				reverse: v.pipe(
					v.optional(v.boolean(), false),
					metadata({ name: "editor.draw.particles.reverse" }),
				),
				poly: v.pipe(
					v.optional(v.boolean(), false),
					metadata({ name: "editor.draw.particles.poly" }),
				),
				particleInterp: v.pipe(
					v.optional(v.picklist(Interps), "pow2In"),
					metadata({ name: "editor.draw.particles.particle-interp" }),
				),
				particleSizeInterp: v.pipe(
					v.optional(v.picklist(Interps), "slope"),
					metadata({ name: "editor.draw.particles.particle-size-interp" }),
				),
				blending: v.pipe(
					v.optional(v.picklist(BlendingModes), "normal"),
					metadata({ name: "editor.draw.particles.blending" }),
				),
			}),
			DrawPistons: (_context) => ({
				sinMag: v.pipe(
					v.optional(v.number(), 4),
					metadata({ name: "editor.draw.pistons.sin-mag" }),
				),
				sinScl: v.pipe(
					v.optional(v.number(), 6),
					metadata({ name: "editor.draw.pistons.sin-scl" }),
				),
				sinOffset: v.pipe(
					v.optional(v.number(), 50),
					metadata({ name: "editor.draw.pistons.sin-offset" }),
				),
				sideOffset: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.pistons.side-offset" }),
				),
				lenOffset: v.pipe(
					v.optional(v.number(), -1),
					metadata({ name: "editor.draw.pistons.len-offset" }),
				),
				horiOffset: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.pistons.hori-offset" }),
				),
				angleOffset: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.pistons.angle-offset" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.pistons.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.pistons.y" })),
				sides: v.pipe(
					v.optional(v.number(), 4),
					metadata({ name: "editor.draw.pistons.sides" }),
				),
				suffix: v.pipe(
					v.optional(v.string(), "-piston"),
					metadata({ name: "editor.draw.pistons.suffix" }),
				),
			}),
			DrawPlasma: (_context) => ({
				...drawFlameBaseObjectSchema.entries,
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.plasma.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.plasma.y" })),
				suffix: v.pipe(
					v.optional(v.string(), "-plasma-"),
					metadata({ name: "editor.draw.plasma.suffix" }),
				),
				plasmas: v.pipe(
					v.optional(v.number(), 4),
					metadata({ name: "editor.draw.plasma.plasmas" }),
				),
				plasma1: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.plasma.plasma-1" }),
				),
				plasma2: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.plasma.plasma-2" }),
				),
			}),
			DrawPower: (_context) => ({
				suffix: v.pipe(
					v.optional(v.string(), "-power"),
					metadata({ name: "editor.draw.power.suffix" }),
				),
				drawPlan: v.pipe(
					v.optional(v.boolean(), true),
					metadata({ name: "editor.draw.power.draw-plan" }),
				),
				mixcol: v.pipe(
					v.optional(v.boolean(), true),
					metadata({ name: "editor.draw.power.mixcol", description: "editor.draw.power.mixcol-description" }),
				),
				emptyLightColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.power.empty-light-color" }),
				),
				fullLightColor: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.power.full-light-color" }),
				),
				layer: v.pipe(
					v.optional(v.number(), -1),
					metadata({ name: "editor.draw.power.layer", description: "editor.draw.power.layer-description" }),
				),
			}),
			DrawPulseShape: (_context) => ({
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.pulse-shape.color" }),
				),
				stroke: v.pipe(
					v.optional(v.number(), 2),
					metadata({ name: "editor.draw.pulse-shape.stroke" }),
				),
				timeScl: v.pipe(
					v.optional(v.number(), 100),
					metadata({ name: "editor.draw.pulse-shape.time-scl" }),
				),
				minStroke: v.pipe(
					v.optional(v.number(), 0.2),
					metadata({ name: "editor.draw.pulse-shape.min-stroke" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.pulse-shape.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.pulse-shape.y" })),
				radiusScl: v.pipe(
					v.optional(v.number(), 1),
					metadata({ name: "editor.draw.pulse-shape.radius-scl" }),
				),
				layer: v.pipe(
					v.optional(v.number(), -1),
					metadata({ name: "editor.draw.pulse-shape.layer" }),
				),
				square: v.pipe(
					v.optional(v.boolean(), true),
					metadata({ name: "editor.draw.pulse-shape.square" }),
				),
			}),
			DrawPumpLiquid: (_context) => ({}),
			DrawRegion: (_context) => drawRegionSchema.entries,
			DrawShape: (_context) => ({
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.shape.color" }),
				),
				sides: v.pipe(
					v.optional(v.number(), 4),
					metadata({ name: "editor.draw.shape.sides" }),
				),
				radius: v.pipe(
					v.optional(v.number(), 2),
					metadata({ name: "editor.draw.shape.radius" }),
				),
				timeScl: v.pipe(
					v.optional(v.number(), 1),
					metadata({ name: "editor.draw.shape.time-scl" }),
				),
				layer: v.pipe(
					v.optional(v.number(), -1),
					metadata({ name: "editor.draw.shape.layer" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.shape.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.shape.y" })),
				useWarmupRadius: v.pipe(
					v.optional(v.boolean(), false),
					metadata({ name: "editor.draw.shape.use-warmup-radius" }),
				),
			}),
			DrawSideRegion: (_context) => ({}),
			DrawSoftParticles: (_context) => ({
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.soft-particles.color" }),
				),
				color2: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.soft-particles.color-2" }),
				),
				x: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.soft-particles.x" }),
				),
				y: v.pipe(
					v.optional(v.number(), 0),
					metadata({ name: "editor.draw.soft-particles.y" }),
				),
				alpha: v.pipe(
					v.optional(v.number(), 0.5),
					metadata({ name: "editor.draw.soft-particles.alpha" }),
				),
				particles: v.pipe(
					v.optional(v.number(), 30),
					metadata({ name: "editor.draw.soft-particles.particles" }),
				),
				particleLife: v.pipe(
					v.optional(v.number(), 70),
					metadata({ name: "editor.draw.soft-particles.particle-life" }),
				),
				particleRad: v.pipe(
					v.optional(v.number(), 7),
					metadata({ name: "editor.draw.soft-particles.particle-rad" }),
				),
				particleSize: v.pipe(
					v.optional(v.number(), 3),
					metadata({ name: "editor.draw.soft-particles.particle-size" }),
				),
				fadeMargin: v.pipe(
					v.optional(v.number(), 0.4),
					metadata({ name: "editor.draw.soft-particles.fade-margin" }),
				),
				rotateScl: v.pipe(
					v.optional(v.number(), 1.5),
					metadata({ name: "editor.draw.soft-particles.rotate-scl" }),
				),
				particleInterp: v.pipe(
					v.optional(v.picklist(Interps), "pow2In"),
					metadata({ name: "editor.draw.soft-particles.particle-interp" }),
				),
			}),
			DrawSpikes: (_context) => ({
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.spikes.color" }),
				),
				amount: v.pipe(
					v.optional(v.number(), 10),
					metadata({ name: "editor.draw.spikes.amount" }),
				),
				layers: v.pipe(
					v.optional(v.number(), 1),
					metadata({ name: "editor.draw.spikes.layers" }),
				),
				stroke: v.pipe(
					v.optional(v.number(), 2),
					metadata({ name: "editor.draw.spikes.stroke" }),
				),
				rotateSpeed: v.pipe(
					v.optional(v.number(), 0.8),
					metadata({ name: "editor.draw.spikes.rotate-speed" }),
				),
				radius: v.pipe(
					v.optional(v.number(), 6),
					metadata({ name: "editor.draw.spikes.radius" }),
				),
				length: v.pipe(
					v.optional(v.number(), 4),
					metadata({ name: "editor.draw.spikes.length" }),
				),
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.spikes.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.spikes.y" })),
				layerSpeed: v.pipe(
					v.optional(v.number(), -1),
					metadata({ name: "editor.draw.spikes.layer-speed" }),
				),
			}),
			DrawTurret: (context) => ({
				parts: v.pipe(
					v.optional(v.array(PartHjsonSchema(context))),
					metadata({ name: "editor.draw.turret.parts" }),
				),
				basePrefix: v.pipe(
					v.optional(v.string(), ""),
					metadata({ name: "editor.draw.turret.base-prefix", description: "editor.draw.turret.base-prefix-description" }),
				),
				liquidDraw: v.pipe(
					v.optional(LiquidFieldSchema(context)),
					metadata({ name: "editor.draw.turret.liquid-draw", description: "editor.draw.turret.liquid-draw-description" }),
				),
				turretLayer: v.pipe(
					v.optional(v.number(), 114),
					metadata({ name: "editor.draw.turret.turret-layer" }),
				),
				shadowLayer: v.pipe(
					v.optional(v.number(), 113.5),
					metadata({ name: "editor.draw.turret.shadow-layer" }),
				),
				heatLayer: v.pipe(
					v.optional(v.number(), 115),
					metadata({ name: "editor.draw.turret.heat-layer" }),
				),
			}),
			DrawWarmupRegion: (_context) => ({
				sinMag: v.pipe(
					v.optional(v.number(), 0.6),
					metadata({ name: "editor.draw.warmup-region.sin-mag" }),
				),
				sinScl: v.pipe(
					v.optional(v.number(), 8),
					metadata({ name: "editor.draw.warmup-region.sin-scl" }),
				),
				color: v.pipe(
					v.optional(MindustryHexColorSchema),
					metadata({ name: "editor.draw.warmup-region.color" }),
				),
			}),
			DrawWeave: (_context) => ({
				x: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.weave.x" })),
				y: v.pipe(v.optional(v.number(), 0), metadata({ name: "editor.draw.weave.y" })),
			}),
		},
		{
			baseSchema: drawBaseObjectSchema.entries,
		},
	).schema;

export const DrawFieldSchema: SchemaFn = CachedSchema((context) =>
	v.pipe(
		v.lazy((input) => {
			if (typeof input === "string") {
				return v.string();
			}

			return DrawHjsonSchema(context);
		}),
		metadata({ type: "options", options: [v.string(), DrawHjsonSchema(context)] }),
	),
);

