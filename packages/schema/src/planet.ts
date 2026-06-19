import * as v from "valibot";
import { databaseContent } from "./content";
import { cached, metadata } from "./utils";
import { SectorFieldSchema } from "./sector";
import type { ProjectContents } from "@project/types";

const singleMeshSchema = v.pipe(v.object({}), metadata({ option: "mesh" }));
const multiMeshSchema = v.pipe(v.array(singleMeshSchema), metadata({ option: "multimesh" }));

const meshSchema = v.pipe(
	v.lazy((input) => {
		if (Array.isArray(input)) {
			return multiMeshSchema;
		}

		return singleMeshSchema;
	}),
	metadata({
		type: "options",
		options: [singleMeshSchema, multiMeshSchema],
	}),
);

export const PlanetSchema = cached((context: ProjectContents) =>
	v.object({
		...databaseContent,
		mesh: v.optional(meshSchema),
		cloudMesh: v.optional(meshSchema),
		radius: v.optional(v.pipe(v.number(), v.gtValue(0)), 1),
		sectorSize: v.optional(v.pipe(v.number(), v.minValue(0), v.integer()), 0),
		rules: v.optional(v.object({})),
		position: v.optional(v.object({ x: v.number(), y: v.number(), z: v.number() })),
		sectors: v.optional(v.array(SectorFieldSchema(context))),
		orbitSpacing: v.optional(v.number(), 12),
		camRadius: v.optional(v.number(), 0),
	}),
);
