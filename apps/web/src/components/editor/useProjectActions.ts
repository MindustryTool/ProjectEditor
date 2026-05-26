import { useCallback } from "react";
import { createEventBus, type ProjectInfo, type ProjectLanguage, type ProjectEventMap } from "@project/core";
import { createProjectFileSystem } from "@project/fs";
import { useProjectStore } from "@project/state";
import type { ProjectRecord } from "@project/storage";

export function useProjectActions() {
	const createNewProject = useProjectStore((state) => state.createNewProject);
	const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
	const closeProject = useProjectStore((state) => state.closeProject);

	const createProject = useCallback(
		async (name: string, language?: ProjectLanguage) => {
			await createNewProject(name, language);
		},
		[createNewProject],
	);

	const openProjectFromRecord = useCallback(
		async (record: ProjectRecord) => {
			const project: ProjectInfo = {
				id: record.id,
				name: record.name,
				language: (record.language ?? "json") as ProjectLanguage,
				createdAt: new Date(record.createdAt),
				updatedAt: new Date(record.updatedAt),
			};

			const events = createEventBus<ProjectEventMap>();
			const fs = await createProjectFileSystem(project, events, {
				onTreeSnapshotChange: (snapshot) => useProjectStore.setState({ treeSnapshot: snapshot }),
			});

			setCurrentProject({ project, fs, events });
		},
		[setCurrentProject],
	);

	return { closeProject, createProject, openProjectFromRecord };
}
