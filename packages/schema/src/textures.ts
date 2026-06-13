import * as v from "valibot";
import { CachedSchema, metadata } from "./utils";

export const ArrayTextureSchema = CachedSchema((format: string, length: number | number[]) =>
	v.nullish(
		v.pipe(
			v.string(),
			v.minLength(1),
			v.maxLength(127),
			metadata({
				type: "textures",
			}),
			v.metadata({ format, length }),
		),
	),
);
