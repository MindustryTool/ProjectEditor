import { useProjectSession, useCurrentProject } from "@project/core";

const EMPTY: never[] = [];

export function useRecentFiles() {
	const projectId = useCurrentProject().project.id;
	return useProjectSession((state) => state.recentlyOpenedFiles[projectId]) ?? EMPTY;
}
