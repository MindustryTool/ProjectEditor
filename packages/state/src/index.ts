import { create } from "zustand";
import { createProject, type Project } from "@project/core";
import { DEFAULT_SETTINGS } from "@project/config";

export interface AppSettings {
  theme: "light" | "dark" | "system";
  fontSize: number;
  tabSize: number;
  autoSave: boolean;
  autoSaveDelay: number;
}

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  settings: AppSettings;

  createNewProject: (name: string) => void;
  setCurrentProject: (project: Project | null) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  projects: [],
  settings: DEFAULT_SETTINGS as AppSettings,

  createNewProject: (name: string) => {
    const project = createProject(name);
    set((state) => ({
      projects: [...state.projects, project],
      currentProject: project,
    }));
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  updateSettings: (settings) => {
    set((state) => ({
      settings: { ...state.settings, ...settings },
    }));
  },
}));
