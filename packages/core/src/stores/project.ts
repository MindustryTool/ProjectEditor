import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectLanguage, ProjectEventMap, ProjectInfo } from "@project/core";
import { createProjectInfo, createEventBus, importProject, ValidationResults, useValidationStore } from "@project/core";
import { createProjectFileSystem } from "@project/core";
import { TreeSnapshot, useProjectSession } from "./session";
import { type AppSettings, type ProjectRecord } from "@project/schema";
import { HJSON } from "@project/hjson";

export type { ProjectContext, RecentFileEntry } from "./session";

interface AppState {
	projects: Record<string, ProjectRecord>;
	settings: AppSettings;
	createNewProject: (name: string, language?: ProjectLanguage) => Promise<string>;
	updateSettings: (settings: Partial<AppSettings>) => void;
	saveProject: (record: ProjectRecord) => Promise<void>;
	openProject: (record: ProjectRecord) => Promise<void>;
	getAllProjects: () => ProjectRecord[];
	deleteProject: (id: string) => Promise<void>;
	importProject: (file: ArrayBuffer, callback: (path: string) => void) => Promise<ProjectInfo>;
}

export const useAppStore = create<AppState>()(
	persist(
		(set, get) => ({
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

				try {
					await fs.writeTextFile(
						"/mod.hjson",
						HJSON.stringify({
							displayName: "[cyan]Example",
							name: "example",
							author: "[blue]Your name",
							description: "A mod that adds in a butt load of content",
							minGameVersion: "158",
							version: "[#00ff00]1.0.0",
						}),
					);

					await fs.writeTextFile(
						"/content/items/test-item.hjson",
						HJSON.stringify({
							hardness: 8,
							cost: 7,
							charge: 0.9,
							color: "FFF861FF",
							research: {
								parent: "copper",
								requirements: ["copper/200"],
							},
						}),
					);

					await fs.writeTextFile("/README.md", "# This is an example mod");

					await fs.refreshTree();
				} catch (e) {
					console.error(e);
				}

				useValidationStore.setState({ results: new ValidationResults() });
				useProjectSession.getState().setCurrentProject({ project, fs, events });
				return project.id;
			},

			openProject: async (record) => {
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
				useProjectSession.getState().setCurrentProject({ project, fs, events });
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

				useValidationStore.setState({ results: new ValidationResults() });
				useProjectSession.getState().setCurrentProject({ project, fs, events });

				return project;
			},
		}),
		{
			name: "projects-store",
			partialize: (state) => ({
				settings: state.settings,
				projects: state.projects,
			}),
		},
	),
);
