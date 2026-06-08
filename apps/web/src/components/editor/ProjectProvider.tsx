import { useBlocks } from "#/hooks/use-blocks";
import { useEffects } from "#/hooks/use-effects";
import { useItems } from "#/hooks/use-items";
import { useLiquids } from "#/hooks/use-liquids";
import { useSectors } from "#/hooks/use-sectors";
import { useSprites } from "#/hooks/use-sprites";
import { useStatuses } from "#/hooks/use-statuses";
import { useUnits } from "#/hooks/use-units";
import { useFileStore, useFileString, useProjectSession } from "@project/core";
import { HJSON, HjsonObjectNode } from "@project/hjson";
import { type ModHjsonData } from "@project/schema";
import type { ContentEntry, ProjectContents } from "@project/types";
import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";

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
		object = HJSON.parseWithCache(json);

		if (!(object instanceof HjsonObjectNode)) {
			throw new Error("Invalid mod.json");
		}
	} catch (e1) {
		try {
			object = HJSON.parseWithCache(hjson);
		} catch (e2) {
			console.error("Failed to read mod.(h)json " + e2 + " " + e1);
		}
	}

	const mod: ModHjsonData = {
		author: "",
		dependencies: [],
		description: "",
		displayName: "",
		minGameVersion: "158",
		name: "new-mod",
		version: "",
	};

	if (object && object instanceof HjsonObjectNode) {
		if (object.get("name")) {
			mod.name = object.get("name").asString()!;
		}

		if (object.get("version")) {
			mod.version = object.get("version").asString()!;
		}

		if (object.get("author")) {
			mod.author = object.get("author").asString()!;
		}

		const deps = object.get("dependencies");
		if (deps && deps.isArray()) {
			mod.dependencies = deps.valueOf() as string[];
		}

		if (object.get("description")) {
			mod.description = object.get("description").asString()!;
		}

		if (object.get("displayName")) {
			mod.displayName = object.get("displayName").asString()!;
		}

		if (object.get("minGameVersion")) {
			mod.minGameVersion = object.get("minGameVersion").asString()!;
		}
	}

	return mod;
};

export function ProjectProvider({ children }: { children: ReactNode }) {
	const { data: jsonText } = useFileString("mod.json");
	const { data: hjsonText } = useFileString("mod.hjson");

	const projectId = useProjectSession((s) => s.projectContext?.project?.id);

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

	const findContent = useCallback(
		(name: string, entries: readonly (readonly ContentEntry[])[]) => {
			const normalizedName = name.replace(metadata.name + "-", "");

			for (const entry of entries) {
				for (const item of entry) {
					if (item.name === normalizedName || item.name.replace(metadata.name + "-", "") === normalizedName) {
						return item;
					}
				}
			}

			return null;
		},
		[metadata.name],
	);

	const contextValue = useMemo(() => ({ contents, metadata, findContent }), [contents, metadata, findContent]);

	useEffect(() => {
		if (projectId) {
			return () => {
				useFileStore.getState().clearAllFiles(projectId);
			};
		}
	}, [projectId]);

	return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>;
}
