import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createProjectInfo, createEventBus, type ProjectInfo, type EventBus, type ProjectEventMap } from "@project/core";
import { createProjectFileSystem, type ProjectFileSystem } from "@project/fs";
import { DEFAULT_SETTINGS } from "@project/config";

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
  projectContext: ProjectContext | null;
  projects: ProjectInfo[];
  settings: AppSettings;
  lastProjectId: string | null;

  createNewProject: (name: string) => void;
  setCurrentProject: (context: ProjectContext | null) => void;
  closeProject: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projectContext: null,
      projects: [],
      settings: DEFAULT_SETTINGS as AppSettings,
      lastProjectId: null,

      createNewProject: async (name: string) => {
        const project = createProjectInfo(name);
        const events = createEventBus<ProjectEventMap>();
        const fs = await createProjectFileSystem(project);
        const context: ProjectContext = { project, fs, events };
        set((state) => ({
          projects: [...state.projects, project],
          projectContext: context,
          lastProjectId: project.id,
        }));
      },

      setCurrentProject: (context) => {
        set({ projectContext: context, lastProjectId: context?.project.id ?? null });
      },

      closeProject: () => {
        set({ projectContext: null, lastProjectId: null });
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
    },
  ),
);
