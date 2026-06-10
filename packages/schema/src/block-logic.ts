import * as v from "valibot";
import { TextureFieldSchema } from "./texture";
import { ArrayTextureSchema } from "./textures";
import { metadata } from "./utils";

// Logic variant schemas
export const logicBlockObjectSchema = v.object({
	maxInstructionScale: v.pipe(
		v.optional(v.number(), 5),
		metadata({
			name: "editor.block-logic-block.max-instruction-scale",
			description: "editor.block-logic-block.max-instruction-scale-description",
		}),
	),
	instructionsPerTick: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-logic-block.instructions-per-tick",
			description: "editor.block-logic-block.instructions-per-tick-description",
		}),
	),
	maxInstructionsPerTick: v.pipe(
		v.optional(v.number(), 40),
		metadata({
			name: "editor.block-logic-block.max-instructions-per-tick",
			description: "editor.block-logic-block.max-instructions-per-tick-description",
		}),
	),
	range: v.pipe(
		v.optional(v.number(), 80),
		metadata({
			name: "editor.block-logic-block.range",
			description: "editor.block-logic-block.range-description",
		}),
	),
});

export const logicDisplayObjectSchema = v.object({
	maxSides: v.pipe(
		v.optional(v.number(), 25),
		metadata({
			name: "editor.block-logic-display.max-sides",
			description: "editor.block-logic-display.max-sides-description",
		}),
	),
	displaySize: v.pipe(
		v.optional(v.number(), 64),
		metadata({
			name: "editor.block-logic-display.display-size",
			description: "editor.block-logic-display.display-size-description",
		}),
	),
	scaleFactor: v.pipe(
		v.optional(v.number(), 1),
		metadata({
			name: "editor.block-logic-display.scale-factor",
			description: "editor.block-logic-display.scale-factor-description",
		}),
	),
});

export const tileableLogicDisplayObjectSchema = v.object({
	...logicDisplayObjectSchema.entries,
	backTexture: TextureFieldSchema("@-back"),
	displayTextures: ArrayTextureSchema("@-#", 47),
	maxDisplayDimensions: v.pipe(
		v.optional(v.number(), 16),
		metadata({
			name: "editor.block-tileable-logic-display.max-display-dimensions",
			description: "editor.block-tileable-logic-display.max-display-dimensions-description",
		}),
	),
	frameSize: v.pipe(
		v.optional(v.number(), 6),
		metadata({
			name: "editor.block-tileable-logic-display.frame-size",
			description: "editor.block-tileable-logic-display.frame-size-description",
		}),
	),
});

export const messageBlockObjectSchema = v.object({
	maxTextLength: v.pipe(
		v.optional(v.number(), 400),
		metadata({
			name: "editor.block-message-block.max-text-length",
			description: "editor.block-message-block.max-text-length-description",
		}),
	),
	maxNewlines: v.pipe(
		v.optional(v.number(), 24),
		metadata({
			name: "editor.block-message-block.max-newlines",
			description: "editor.block-message-block.max-newlines-description",
		}),
	),
});

export const memoryBlockObjectSchema = v.object({
	memoryCapacity: v.pipe(
		v.optional(v.number(), 32),
		metadata({
			name: "editor.block-memory-block.memory-capacity",
			description: "editor.block-memory-block.memory-capacity-description",
		}),
	),
});

export const canvasBlockObjectSchema = v.object({
	sideTexture1: TextureFieldSchema("@-side1"),
	sideTexture2: TextureFieldSchema("@-side2"),
	cornerTexture1: TextureFieldSchema("@-corner1"),
	cornerTexture2: TextureFieldSchema("@-corner2"),
	padding: v.pipe(
		v.optional(v.number(), 0),
		metadata({
			name: "editor.block-canvas-block.padding",
			description: "editor.block-canvas-block.padding-description",
		}),
	),
	canvasSize: v.pipe(
		v.optional(v.number(), 8),
		metadata({
			name: "editor.block-canvas-block.canvas-size",
			description: "editor.block-canvas-block.canvas-size-description",
		}),
	),
	palette: v.pipe(
		v.optional(v.array(v.number())),
		metadata({
			name: "editor.block-canvas-block.palette",
			description: "editor.block-canvas-block.palette-description",
		}),
	),
	bitsPerPixel: v.pipe(
		v.optional(v.number()),
		metadata({
			name: "editor.block-canvas-block.bits-per-pixel",
			description: "editor.block-canvas-block.bits-per-pixel-description",
		}),
	),
});
