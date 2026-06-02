import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createProjectInfo,
	createEventBus,
	type ProjectLanguage,
	type ProjectEventMap,
	importProject,
	type ProjectInfo,
} from "../index.js";
import { createProjectFileSystem } from "../fs/project-file-system.js";
import { TreeSnapshot, useProjectSession } from "./session";

export interface AppSettings {
	theme: "light" | "dark" | "system";
	fontSize: number;
	tabSize: number;
	validation: {
		validationDelayMs: number;
	};
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
	importProject: (file: ArrayBuffer, callback: (path: string) => void) => Promise<ProjectInfo>;
}

export const useAppStore = create<AppState>()(
	persist(
		(set, get) => ({
			hydrated: false,
			projects: {},
			settings: { theme: "system" as const, fontSize: 14, tabSize: 2, validation: { validationDelayMs: 500 } },

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
						useProjectSession.setState({ treeSnapshot: new TreeSnapshot(snapshot) });
					},
				});
				const hasModJson = await fs.exists("/mod.json");
				const hasModHjson = await fs.exists("/mod.hjson");

				if (!hasModJson && !hasModHjson) {
					await fs.createFile("/mod.hjson");
				}

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
			importProject: async (buffer, callback) => {
				const result = await importProject(new Uint8Array(buffer));
				const project = createProjectInfo(result.name, result.language);

				await useAppStore.getState().saveProject({
					id: project.id,
					name: project.name,
					language: project.language,
					createdAt: project.createdAt,
					updatedAt: project.updatedAt,
				});

				const events = createEventBus<ProjectEventMap>();
				const fs = await createProjectFileSystem(project, events, {
					onTreeSnapshotChange: (snapshot) => useProjectSession.setState({ treeSnapshot: new TreeSnapshot(snapshot) }),
				});

				const unsubscribe = events.on("file:write", (event) => {
					callback(event.path);
				});

				await fs.writeFiles(result.entries);

				unsubscribe();

				useProjectSession.getState().setCurrentProject({ project, fs, events });

				return project;
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
