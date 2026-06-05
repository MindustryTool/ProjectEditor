import { useState, createContext, useContext, type ReactNode } from "react";
import { usePath } from "#/hooks/use-path";

export interface FileExplorerUiValue {
	selectedPath: string | null;
	editingPath: string | null;
}

export interface FileExplorerActionsValue {
	onSelect: (value: string | null) => void;
	onEditingPathChange: (path: string | null) => void;
	onDeleteRequest: (path: string) => void;
	onCreateRequest: (path: string) => void;
	projectId: string;
}

export const FileExplorerUiCtx = createContext<FileExplorerUiValue | null>(null);
export const FileExplorerActionsCtx = createContext<FileExplorerActionsValue | null>(null);

export function useFileExplorerUi(): FileExplorerUiValue {
	const ctx = useContext(FileExplorerUiCtx);
	if (!ctx) throw new Error("useFileExplorerUi must be used within FileExplorer");
	return ctx;
}

export function useFileExplorerActions(): FileExplorerActionsValue {
	const ctx = useContext(FileExplorerActionsCtx);
	if (!ctx) throw new Error("useFileExplorerActions must be used within FileExplorer");
	return ctx;
}

export function useFileExplorerState() {
	const [path, setPath] = usePath();
	const [editingPath, setEditingPath] = useState<string | null>(null);
	const [deleteTargetPath, setDeleteTargetPath] = useState<string | null>(null);
	const [createTargetPath, setCreateTargetPath] = useState<string | null>(null);

	return {
		selectedPath: path ?? null,
		editingPath,
		deleteTargetPath,
		createTargetPath,
		setSelectedPath: setPath,
		setEditingPath,
		setDeleteTargetPath,
		setCreateTargetPath,
	};
}

export function FileExplorerUiProvider({ selectedPath, editingPath, children }: FileExplorerUiValue & { children: ReactNode }) {
	return <FileExplorerUiCtx.Provider value={{ selectedPath, editingPath }}>{children}</FileExplorerUiCtx.Provider>;
}

export function FileExplorerActionsProvider({ value, children }: { value: FileExplorerActionsValue; children: ReactNode }) {
	return <FileExplorerActionsCtx.Provider value={value}>{children}</FileExplorerActionsCtx.Provider>;
}
