import * as v from "valibot";
import { CachedSchema, metadata } from "./utils";

export const TextureFieldSchema = CachedSchema((format: string, fallback?: string) =>
	v.nullish(
		v.pipe(
			v.string(),
			v.minLength(1),
			v.maxLength(127),
			metadata({
				type: "texture",
			}),
			v.metadata({ format, fallback }),
		),
	),
);
