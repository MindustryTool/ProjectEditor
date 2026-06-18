import type { ModHjsonData } from "@project/schema";
import type { ContentEntry, ProjectContents } from "@project/types";
import { createContext, useContext } from "react";

export interface ProjectContextValue {
	metadata: ModHjsonData;
	contents: ProjectContents;
	findContent: (name: string, entries: readonly (readonly ContentEntry[])[]) => ContentEntry | null;
}

export const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProjectContext(): ProjectContextValue {
	const ctx = useContext(ProjectContext);

	if (!ctx) throw new Error("useProjectContext() must be used within a ProjectProvider");

	return ctx;
}
