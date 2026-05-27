import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createProjectInfo, createEventBus, type ProjectLanguage, type ProjectEventMap } from "@project/core";
import { createProjectFileSystem } from "@project/fs";
import { DEFAULT_SETTINGS } from "@project/config";
import { useProjectSession } from "./session";

export interface AppSettings {
	theme: "light" | "dark" | "system";
	fontSize: number;
	tabSize: number;
	autoSave: boolean;
	autoSaveDelay: number;
}

export interface ProjectRecord {
	id: string;
	name: string;
	language?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type { ProjectContext, RecentFileEntry } from "./session";

interface AppState {
	hydrated: boolean;
	projects: Record<string, ProjectRecord>;
	settings: AppSettings;

	createNewProject: (name: string, language?: ProjectLanguage) => Promise<string>;
	updateSettings: (settings: Partial<AppSettings>) => void;
	saveProject: (record: ProjectRecord) => Promise<void>;
	getAllProjects: () => ProjectRecord[];
	deleteProject: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>()(
	persist(
		(set, get) => ({
			hydrated: false,
			projects: {},
			settings: DEFAULT_SETTINGS as AppSettings,

			createNewProject: async (name: string, language?: ProjectLanguage) => {
				const project = createProjectInfo(name, language);
				get().saveProject({
					id: project.id,
					name: project.name,
					language: project.language,
					createdAt: project.createdAt,
					updatedAt: project.updatedAt,
				});
				const events = createEventBus<ProjectEventMap>();
				const fs = await createProjectFileSystem(project, events, {
					onTreeSnapshotChange: (snapshot) => {
						useProjectSession.setState({ treeSnapshot: snapshot });
					},
				});
				useProjectSession.getState().setCurrentProject({ project, fs, events });
				return project.id;
			},

			updateSettings: (settings) => {
				set((state) => ({
					settings: { ...state.settings, ...settings },
				}));
			},

			saveProject: async (record) => {
				set((state) => ({
					projects: { ...state.projects, [record.id]: record },
				}));
			},

			getAllProjects: () => {
				return Object.values(get().projects);
			},

			deleteProject: async (id) => {
				set((state) => {
					delete state.projects[id];
					return { projects: { ...state.projects } };
				});
			},
		}),
		{
			name: "project-store",
			partialize: (state) => ({
				settings: state.settings,
				projects: state.projects,
			}),
			onRehydrateStorage(state) {
				if (state) state.hydrated = true;
			},
		},
	),
);
