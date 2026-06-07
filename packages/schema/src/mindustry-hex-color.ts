import * as v from "valibot";
import { metadata } from "./utils";

export const MindustryHexColorSchema = v.pipe(
	v.string(),
	v.regex(/^[#]{0,1}(?:[0-9a-fA-F]{1,8})$/, "Must be a valid hex color"),
	metadata({
		type: "color",
	}),
);
