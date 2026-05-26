import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createProjectInfo,
	createEventBus,
	type ProjectInfo,
	type ProjectLanguage,
	type ProjectEventMap,
} from "@project/core";
import { createProjectFileSystem } from "@project/fs";
import { DEFAULT_SETTINGS } from "@project/config";
import { saveProject } from "@project/storage";
import { useProjectSession } from "./session";

export interface AppSettings {
	theme: "light" | "dark" | "system";
	fontSize: number;
	tabSize: number;
	autoSave: boolean;
	autoSaveDelay: number;
}

export type { ProjectContext, RecentFileEntry } from "./session";

interface AppState {
	hydrated: boolean;
	projects: ProjectInfo[];
	settings: AppSettings;
	lastProjectId: string | null;

	createNewProject: (name: string, language?: ProjectLanguage) => Promise<void>;
	updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			hydrated: false,
			projects: [],
			settings: DEFAULT_SETTINGS as AppSettings,
			lastProjectId: null,

			createNewProject: async (name: string, language?: ProjectLanguage) => {
				const project = createProjectInfo(name, language);
				await saveProject({
					id: project.id,
					name: project.name,
					language: project.language,
					data: "",
					createdAt: project.createdAt,
					updatedAt: project.updatedAt,
				});
				const events = createEventBus<ProjectEventMap>();
				const fs = await createProjectFileSystem(project, events, {
					onTreeSnapshotChange: (snapshot) => {
						useProjectSession.setState({ treeSnapshot: snapshot });
					},
				});
				set((state) => ({
					projects: [...state.projects, project],
					lastProjectId: project.id,
				}));
				useProjectSession.getState().setCurrentProject({ project, fs, events });
			},

			updateSettings: (settings) => {
				set((state) => ({
					settings: { ...state.settings, ...settings },
				}));
			},
		}),
		{
			name: "project-store",
			partialize: (state) => ({
				settings: state.settings,
				projects: state.projects,
				lastProjectId: state.lastProjectId,
			}),
			onRehydrateStorage(state) {
				if (state) state.hydrated = true;
			},
		},
	),
);
