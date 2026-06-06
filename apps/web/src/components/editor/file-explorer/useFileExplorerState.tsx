import { create } from "zustand";

export interface FileExplorerStore {
	editingPath: string | null;
	deleteTargetPath: string | null;
	createTargetPath: string | null;
	projectId: string;
	setEditingPath: (path: string | null) => void;
	setDeleteTargetPath: (path: string | null) => void;
	setCreateTargetPath: (path: string | null) => void;
	setProjectId: (id: string) => void;
}

export const useFileExplorerStore = create<FileExplorerStore>()((set) => ({
	editingPath: null,
	deleteTargetPath: null,
	createTargetPath: null,
	projectId: "",
	setEditingPath: (path) => set({ editingPath: path }),
	setDeleteTargetPath: (path) => set({ deleteTargetPath: path }),
	setCreateTargetPath: (path) => set({ createTargetPath: path }),
	setProjectId: (id) => set({ projectId: id }),
}));
