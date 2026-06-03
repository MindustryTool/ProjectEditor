import { useBlocks } from "#/hooks/use-blocks";
import { useEffects } from "#/hooks/use-effects";
import { useItems } from "#/hooks/use-items";
import { useLiquids } from "#/hooks/use-liquids";
import { useSectors } from "#/hooks/use-sectors";
import { useSprites } from "#/hooks/use-sprites";
import { useStatuses } from "#/hooks/use-statuses";
import { useUnits } from "#/hooks/use-units";
import type { ProjectContents } from "@project/types";
import { createContext, useContext, useMemo, type ReactNode } from "react";

export interface ProjectContextValue {
	contents: ProjectContents;
}
const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProjectContext(): ProjectContextValue {
	const ctx = useContext(ProjectContext);

	if (!ctx) throw new Error("useProjectContext() must be used within a ProjectProvider");

	return ctx;
}

export function ProjectProvider({ children }: { children: ReactNode }) {
	const items = useItems({ base: true, project: true });
	const blocks = useBlocks();
	const liquids = useLiquids();
	const sectors = useSectors();
	const statuses = useStatuses();
	const units = useUnits();
	const sprites = useSprites();
	const effects = useEffects();

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

	return <ProjectContext.Provider value={{ contents }}>{children}</ProjectContext.Provider>;
}
