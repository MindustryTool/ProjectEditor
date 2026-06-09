import * as v from "valibot";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useValidationStore } from "#/validation/store";
import { ValidationResults } from "#/validation/types";
import { TreeSnapshot, useProjectSession } from "#/project/session";
import { AppSettingsSchema, ProjectRecordSchema, type AppSettings, type ProjectRecord } from "@project/schema";
import { createProjectFileSystem } from "#/project-file-system";
import { importProject } from "#/importer";
import type { EventBus, ProjectEventMap, ProjectInfo, Unsubscribe, ProjectLanguage } from "#/types";
import type { ProjectContext } from "#/project/session";

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
			settings: {
				firstTime: true,
				theme: "system" as const,
				fontSize: 14,
				tabSize: 2,
				padding: 0,
				validation: { validationDelayMs: 500 },
			},

			createNewProject: async (name: string, language: ProjectLanguage) => {
				const project = {
					id: crypto.randomUUID(),
					name,
					language,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				await get().saveProject(project);

				const events = createEventBus<ProjectEventMap>();
				const fs = await createProjectFileSystem(project, events, {
					onTreeSnapshotChange: (snapshot) => {
						useProjectSession.setState((prev) => ({ treeSnapshot: new TreeSnapshot(snapshot, prev.treeSnapshot) }));
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
					onTreeSnapshotChange: (snapshot) =>
						useProjectSession.setState((prev) => ({ treeSnapshot: new TreeSnapshot(snapshot, prev.treeSnapshot) })),
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
				const project = {
					id: crypto.randomUUID(),
					name: result.name,
					language: result.language,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				await useAppStore.getState().saveProject(project);

				const events = createEventBus<ProjectEventMap>();
				const fs = await createProjectFileSystem(project, events, {
					onTreeSnapshotChange: (snapshot) =>
						useProjectSession.setState((prev) => ({ treeSnapshot: new TreeSnapshot(snapshot, prev.treeSnapshot) })),
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

export function createEventBus<T extends { [K in keyof T]: unknown[] }>(): EventBus<T> {
	const handlers = new Map<string, Set<(...args: unknown[]) => void>>();

	function on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe {
		const key = String(event);
		if (!handlers.has(key)) handlers.set(key, new Set());
		handlers.get(key)!.add(handler as (...args: unknown[]) => void);
		return () => {
			handlers.get(key)?.delete(handler as (...args: unknown[]) => void);
		};
	}

	function off<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void {
		const key = String(event);
		handlers.get(key)?.delete(handler as (...args: unknown[]) => void);
	}

	function once<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe {
		const wrapped = (...args: T[K]) => {
			off(event, wrapped as (...args: T[K]) => void);
			handler(...args);
		};
		return on(event, wrapped as (...args: T[K]) => void);
	}

	function emit<K extends keyof T>(event: K, ...args: T[K]): void {
		const key = String(event);
		const set = handlers.get(key);
		if (!set) return;
		for (const h of [...set]) {
			try {
				h(...args);
			} catch (e) {
				console.error(e);
			}
		}
		console.log(`Emitted ${key} with ${JSON.stringify(args)}`);
	}

	return { on, off, once, emit };
}
