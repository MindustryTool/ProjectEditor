import * as v from "valibot";

export const rectSchema = v.object({
	x: v.number(),
	y: v.number(),
	width: v.number(),
	height: v.number(),
});
