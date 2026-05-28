import * as v from "valibot";

export const ContentNameSchema = v.pipe(
	v.string(),
	v.regex(/^[a-z][a-z0-9-]*$/, "Must be lowercase letters, digits, hyphens"),
	v.minLength(2),
	v.maxLength(127),
);

export const MindustryHexColorSchema = v.pipe(v.string(), v.regex(/^[#]{0,1}(?:[0-9a-fA-F]{1,6}|[0-9a-fA-F]{8})$/, "Must be a valid hex color"));
