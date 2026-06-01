import { useCallback } from "react";
import { createEventBus, type ProjectInfo, type ProjectLanguage, type ProjectEventMap } from "@project/core";
import { createProjectFileSystem } from "@project/fs";
import { TreeSnapshot, useAppStore, useProjectSession, useValidationStore, ValidationResults } from "@project/state";
import type { ProjectRecord } from "@project/state";
import { useNavigate, useParams } from "@tanstack/react-router";

export function useProjectActions() {
	const createNewProject = useAppStore((state) => state.createNewProject);
	const setCurrentProject = useProjectSession((state) => state.setCurrentProject);
	const reset = useProjectSession((state) => state.reset);
	const navigate = useNavigate();
	const { lang } = useParams({ strict: false });

	const createProject = useCallback(
		async (name: string, language?: ProjectLanguage) => {
			return await createNewProject(name, language);
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
				onTreeSnapshotChange: (snapshot) => useProjectSession.setState({ treeSnapshot: new TreeSnapshot(snapshot) }),
			});
			useValidationStore.setState({ results: new ValidationResults() });

			setCurrentProject({ project, fs, events });
		},
		[setCurrentProject],
	);

	const closeProject = useCallback(() => {
		if (!lang) {
			throw new Error("lang is not set");
		}
		reset();
		navigate({ to: `/$lang/projects`, params: { lang } });
	}, [reset, navigate, lang]);

	return { closeProject, createProject, openProjectFromRecord };
}
