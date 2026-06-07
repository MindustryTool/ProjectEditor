import * as v from "valibot";
import { metadata } from "./utils";

export const ArrayTextureSchema = (format: string, length: number | number[]) =>
	v.nullish(
		v.pipe(
			v.string(),
			v.minLength(1),
			v.maxLength(127),
			metadata({
				type: "textures",
				category: "texture",
			}),
			v.metadata({ format, length }),
		),
	);
