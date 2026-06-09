import * as v from "valibot";
import { cached, metadata } from "./utils";
import type { ProjectContents } from "@project/types";

export const SoundHjsonSchema = cached((context: ProjectContents) =>
	v.pipe(
		v.string(),
		v.minLength(1),
		v.maxLength(127),
		v.picklist(context.sounds.map((s) => s.name)),
		metadata({
			type: "sound",
		}),
	),
);
