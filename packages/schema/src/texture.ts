import * as v from "valibot";
import { metadata } from "./utils";

export const TextureFieldSchema = (format: string, fallback?: string) =>
	v.nullish(
		v.pipe(
			v.string(),
			v.minLength(1),
			v.maxLength(127),
			metadata({
				type: "texture",
				category: "texture",
			}),
			v.metadata({ format, fallback }),
		),
	);
