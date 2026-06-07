import * as v from "valibot";
import { CachedSchema } from "./utils";
import { metadata } from "./utils";
import type { SchemaFn } from "./utils";

export const SpriteFieldSchema: SchemaFn = CachedSchema((context) =>
	v.pipe(
		v.picklist([...new Set(context.sprites.map((sprite) => sprite.name))]),
		v.minLength(1),
		v.maxLength(127),
		metadata({
			type: "sprite",
		}),
	),
);
