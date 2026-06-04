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
import type { ContentEntry, ProjectContents } from "@project/types";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import * as v from "valibot";

export interface ProjectContextValue {
	metadata: ModHjsonData;
	contents: ProjectContents;
	findContent: (name: string, entries: readonly (readonly ContentEntry[])[]) => ContentEntry | null;
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
	const { data: jsonText } = useFileString("mod.json");
	const { data: hjsonText } = useFileString("mod.hjson");

	const metadata = useMemo(() => readModMetadata(jsonText || "", hjsonText || ""), [jsonText, hjsonText]);

	const items = useItems(metadata);
	const blocks = useBlocks(metadata);
	const liquids = useLiquids(metadata);
	const sectors = useSectors(metadata);
	const statuses = useStatuses(metadata);
	const units = useUnits(metadata);
	const effects = useEffects(metadata);
	const sprites = useSprites();

	const contents = useMemo<ProjectContents>(
		() => ({
			name: metadata.name,
			items,
			blocks,
			liquids,
			sectors,
			statuses,
			units,
			sprites,
			effects,
		}),
		[items, blocks, liquids, sectors, statuses, units, sprites, effects, metadata.name],
	);

	const findContent = useCallback((name: string, entries: readonly (readonly ContentEntry[])[]) => {
		const normalizedName = name.replace(metadata.name + "-", "");

		for (const entry of entries) {
			for (const item of entry) {
				if (item.name === normalizedName || item.name.replace(metadata.name + "-", "") === normalizedName) {
					return item;
				}
			}
		}

		return null;
	}, [metadata.name]);

	return <ProjectContext.Provider value={{ contents, metadata, findContent }}>{children}</ProjectContext.Provider>;
}
