import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProjectLanguage, ProjectEventMap, ProjectInfo, ProjectContext } from "@project/core";
import { createProjectInfo, createEventBus, importProject, ValidationResults, useValidationStore } from "@project/core";
import { createProjectFileSystem } from "@project/core";
import { TreeSnapshot, useProjectSession } from "./session";
import { AppSettingsSchema, ProjectRecordSchema, type AppSettings, type ProjectRecord } from "@project/schema";
import * as v from "valibot";

export type { ProjectContext, RecentFileEntry } from "./session";

interface AppState {
	projects: Record<string, ProjectRecord>;
	settings: AppSettings;
	createNewProject: (name: string, language: ProjectLanguage) => Promise<ProjectContext>;
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
			settings: { firstTime: true, theme: "system" as const, fontSize: 14, tabSize: 2, validation: { validationDelayMs: 500 } },

			createNewProject: async (name: string, language: ProjectLanguage) => {
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

				const context = { project, fs, events };
				useValidationStore.setState({ results: new ValidationResults() });
				useProjectSession.getState().setCurrentProject(context);

				return context;
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
			storage: createJSONStorage(() => localStorage, {
				reviver: (key, value) => {
					if (key === "settings") {
						return v.parse(AppSettingsSchema, value);
					}

					if (key === "projects") {
                        const schema = v.fallback(v.record(v.string(), ProjectRecordSchema), {});
						return v.parse(schema, value);
					}

					return value;
				},
			}),
			partialize: (state) => ({
				settings: state.settings,
				projects: state.projects,
			}),
		},
	),
);
