import { create } from "zustand";

export interface FileExplorerStore {
	renameTargetPath: string | null;
	deleteTargetPath: string | null;
	createTargetPath: string | null;
	projectId: string;
	setRenameTargetPath: (path: string | null) => void;
	setDeleteTargetPath: (path: string | null) => void;
	setCreateTargetPath: (path: string | null) => void;
	setProjectId: (id: string) => void;
}

export const useFileExplorerStore = create<FileExplorerStore>()((set) => ({
	renameTargetPath: null,
	deleteTargetPath: null,
	createTargetPath: null,
	projectId: "",
	setRenameTargetPath: (path) => set({ renameTargetPath: path }),
	setDeleteTargetPath: (path) => set({ deleteTargetPath: path }),
	setCreateTargetPath: (path) => set({ createTargetPath: path }),
	setProjectId: (id) => set({ projectId: id }),
}));
