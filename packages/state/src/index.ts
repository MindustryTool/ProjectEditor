import { create } from "zustand";
import { createProjectInfo, createEventBus, type ProjectInfo, type EventBus, type ProjectEventMap } from "@project/core";
import { createOPFSAdapter, type VirtualFileSystem } from "@project/fs";
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
  fs: VirtualFileSystem;
  events: EventBus<ProjectEventMap>;
}

interface ProjectState {
  projectContext: ProjectContext | null;
  projects: ProjectInfo[];
  settings: AppSettings;

  createNewProject: (name: string) => void;
  setCurrentProject: (context: ProjectContext | null) => void;
  closeProject: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectContext: null,
  projects: [],
  settings: DEFAULT_SETTINGS as AppSettings,

  createNewProject: async (name: string) => {
    const project = createProjectInfo(name);
    const events = createEventBus<ProjectEventMap>();
    const fs = await createOPFSAdapter();
    const context: ProjectContext = { project, fs, events };
    set((state) => ({
      projects: [...state.projects, project],
      projectContext: context,
    }));
  },

  setCurrentProject: (context) => {
    set({ projectContext: context });
  },

  closeProject: () => {
    set({ projectContext: null });
  },

  updateSettings: (settings) => {
    set((state) => ({
      settings: { ...state.settings, ...settings },
    }));
  },
}));
