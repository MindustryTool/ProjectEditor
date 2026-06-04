import { useBlocks } from "#/hooks/use-blocks";
import { useEffects } from "#/hooks/use-effects";
import { useItems } from "#/hooks/use-items";
import { useLiquids } from "#/hooks/use-liquids";
import { useSectors } from "#/hooks/use-sectors";
import { useSprites } from "#/hooks/use-sprites";
import { useStatuses } from "#/hooks/use-statuses";
import { useUnits } from "#/hooks/use-units";
import { useFileString } from "@project/core";
import { HJSON } from "@project/hjson";
import { ModHjsonSchema, type ModHjsonData } from "@project/schema";
import type { ProjectContents } from "@project/types";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import * as v from "valibot";

export interface ProjectContextValue {
	metadata: ModHjsonData;
	contents: ProjectContents;
}
const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProjectContext(): ProjectContextValue {
	const ctx = useContext(ProjectContext);

	if (!ctx) throw new Error("useProjectContext() must be used within a ProjectProvider");

	return ctx;
}

const readModMetadata = (json: string, hjson: string) => {
	let object = null;
	try {
		object = HJSON.parse(json);
	} catch (e1) {
		try {
			object = HJSON.parse(hjson);
		} catch (e2) {
			throw new Error("Failed to read mod.(h)json " + e2 + " " + e1);
		}
	}

	const result = v.safeParse(ModHjsonSchema, object);

	console.log(result);

	let mod: ModHjsonData = {
		author: "",
		dependencies: [],
		description: "",
		displayName: "",
		minGameVersion: "158",
		name: "new-mod",
		version: "",
	};

	if (result.success) {
		mod = result.output;
	}

	return mod;
};

export function ProjectProvider({ children }: { children: ReactNode }) {
	const items = useItems({ base: true, project: true });
	const blocks = useBlocks();
	const liquids = useLiquids();
	const sectors = useSectors();
	const statuses = useStatuses();
	const units = useUnits();
	const sprites = useSprites();
	const effects = useEffects();
	const { data: jsonText } = useFileString("mod.json");
	const { data: hjsonText } = useFileString("mod.hjson");

	const contents = useMemo<ProjectContents>(
		() => ({
			items,
			blocks,
			liquids,
			sectors,
			statuses,
			units,
			sprites,
			effects,
		}),
		[items, blocks, liquids, sectors, statuses, units, sprites, effects],
	);

	const metadata = useMemo(() => readModMetadata(jsonText || "", hjsonText || ""), [jsonText, hjsonText]);

	return <ProjectContext.Provider value={{ contents, metadata }}>{children}</ProjectContext.Provider>;
}
