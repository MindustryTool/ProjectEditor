import * as v from "valibot";
import type { SchemaFn } from "./utils";

export const EngineHjsonSchema: SchemaFn = () =>
	v.object({
		x: v.number(),
		y: v.number(),
		radius: v.number(),
		rotation: v.number(),
	});
