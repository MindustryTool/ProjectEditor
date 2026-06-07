import * as v from "valibot";
import { metadata } from "./utils";

export const SoundHjsonSchema = v.pipe(
	v.string(),
	v.minLength(1),
	v.maxLength(127),
	metadata({
		type: "sound",
	}),
);
