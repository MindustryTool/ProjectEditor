import * as v from "valibot";
import { metadata } from "./utils";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { floorObjectSchema } from "./block-environment";

// Sandbox variant schemas
export const itemSourceObjectSchema = v.object({
	itemsPerSecond: v.pipe(
		v.optional(v.number(), 100),
		metadata({
			name: "editor.block-item-source.items-per-second",
			description: "editor.block-item-source.items-per-second-description",
		}),
	),
});

export const overlayFloorObjectSchema = v.object({
	...floorObjectSchema.entries,
	color: v.pipe(
		v.optional(MindustryHexColorSchema),
		metadata({
			name: "editor.block-overlay-floor.color",
			description: "editor.block-overlay-floor.color-description",
		}),
	),
});
