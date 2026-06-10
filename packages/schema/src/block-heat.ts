import * as v from "valibot";
import { metadata } from "./utils";

// Heat variant schemas
export const heatConductorObjectSchema = v.object({
	visualMaxHeat: v.pipe(
		v.optional(v.number(), 15),
		metadata({
			name: "editor.block-heat-conductor.visual-max-heat",
			description: "editor.block-heat-conductor.visual-max-heat-description",
		}),
	),
	splitHeat: v.pipe(
		v.optional(v.boolean(), false),
		metadata({
			name: "editor.block-heat-conductor.split-heat",
			description: "editor.block-heat-conductor.split-heat-description",
		}),
	),
});
