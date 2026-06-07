import * as v from "valibot";
import type { ProjectContents } from "@project/types";
import { LiquidFieldSchema } from "./liquid";

export const LiquidStackSchema = (context: ProjectContents) =>
	v.object({
		liquid: LiquidFieldSchema(context),
		amount: v.pipe(v.number(), v.integer(), v.minValue(0)),
	});
