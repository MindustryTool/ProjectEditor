import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createProjectInfo,
	createEventBus,
	type ProjectInfo,
	type ProjectLanguage,
	type EventBus,
	type ProjectEventMap,
} from "@project/core";
import { createProjectFileSystem, type FileEntry, type ProjectFileSystem } from "@project/fs";
import { DEFAULT_SETTINGS } from "@project/config";
import { saveProject } from "@project/storage";

export interface AppSettings {
	theme: "light" | "dark" | "system";
	fontSize: number;
	tabSize: number;
	autoSave: boolean;
	autoSaveDelay: number;
}

export interface ProjectContext {
	project: ProjectInfo;
	fs: ProjectFileSystem;
	events: EventBus<ProjectEventMap>;
}

interface ProjectState {
	hydrated: boolean;
	projectContext: ProjectContext | null;
	projects: ProjectInfo[];
	settings: AppSettings;
	lastProjectId: string | null;
	treeSnapshot: FileEntry[];

	createNewProject: (name: string, language?: ProjectLanguage) => Promise<void>;
	setCurrentProject: (context: ProjectContext | null) => void;
	updateCurrentProject: (patch: Partial<ProjectInfo>) => void;
	closeProject: () => void;
	updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useProjectStore = create<ProjectState>()(
	persist(
		(set) => ({
			hydrated: false,
			projectContext: null,
			projects: [],
			settings: DEFAULT_SETTINGS as AppSettings,
			lastProjectId: null,
			treeSnapshot: [],

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
						set({ treeSnapshot: snapshot });
					},
				});
				const context: ProjectContext = { project, fs, events };
				set((state) => ({
					projects: [...state.projects, project],
					projectContext: context,
					lastProjectId: project.id,
				}));
			},

			setCurrentProject: (context) => {
				set((state) => ({
					projectContext: context,
					lastProjectId: context?.project.id ?? null,
					treeSnapshot: context ? state.treeSnapshot : [],
				}));
			},

			updateCurrentProject: (patch) => {
				set((state) => {
					if (!state.projectContext) return state;
					const nextProject: ProjectInfo = { ...state.projectContext.project, ...patch };
					return {
						projectContext: { ...state.projectContext, project: nextProject },
						projects: state.projects.map((p) => (p.id === nextProject.id ? nextProject : p)),
					};
				});
			},

			closeProject: () => {
				set({ projectContext: null, lastProjectId: null, treeSnapshot: [] });
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

export function useCurrentProject() {
	const state = useProjectStore((state) => state.projectContext);

	if (state === null) throw new Error("No project project context");

	return state;
}

export type { FileContentEntry, FileContentStore } from "./stores/file-content";
export { useFileContentStore, isDirty, selectEntry, selectIsSaving } from "./stores/file-content";

export { WriteQueue, getWriteQueue, disposeWriteQueue } from "./services/write-queue";
export type { UseFileContentResult } from "./hooks/use-file-content";
export { useFileContent } from "./hooks/use-file-content";
export { registerValidationListener } from "./validation/listener";

export { Severity, severityLabel, isErrorOrWarning } from "./validation/types";
export type {
  SeverityLevel,
  ValidationResult,
  ValidatorFn,
  ValidatorRegistration,
  ValidatorRegistry,
  ValidationSummary,
  ValidationStore,
} from "./validation/types";
export { createValidatorRegistry } from "./validation/registry";
export { createValidationRunner } from "./validation/runner";
export type { ValidationRunner } from "./validation/runner";
export { useValidationStore } from "./validation/store";
export { createDefaultValidators } from "./validation/validators";
