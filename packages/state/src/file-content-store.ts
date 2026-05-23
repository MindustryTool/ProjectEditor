import { create } from "zustand";

export interface FileContentEntry {
  data: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface FileContentStore {
  fileContents: Record<string, FileContentEntry>;
  setFileContent: (path: string, data: string) => void;
  setFileLoading: (path: string) => void;
  setFileError: (path: string, error: string) => void;
  clearFileContent: (path: string) => void;
  clearAllFileContents: () => void;
}

export const useFileContentStore = create<FileContentStore>()((set) => ({
  fileContents: {},
  setFileContent: (path, data) =>
    set((state) => ({
      fileContents: {
        ...state.fileContents,
        [path]: { data, isLoading: false, error: null },
      },
    })),
  setFileLoading: (path) =>
    set((state) => ({
      fileContents: {
        ...state.fileContents,
        [path]: { data: state.fileContents[path]?.data ?? null, isLoading: true, error: null },
      },
    })),
  setFileError: (path, error) =>
    set((state) => ({
      fileContents: {
        ...state.fileContents,
        [path]: { data: null, isLoading: false, error },
      },
    })),
  clearFileContent: (path) =>
    set((state) => {
      const { [path]: _, ...rest } = state.fileContents;
      return { fileContents: rest };
    }),
  clearAllFileContents: () => set({ fileContents: {} }),
}));
