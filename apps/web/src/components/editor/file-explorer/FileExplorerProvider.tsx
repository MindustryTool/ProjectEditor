import { useCallback, useEffect, type ReactNode } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import { useCurrentProject, useProjectSession } from "@project/core";
import { useFileExplorerStore } from "./useFileExplorerState";
import { DeleteFileDialog } from "./DeleteFileDialog";
import { CreateFileDialog } from "./CreateFileDialog";
import { RenameDialog } from "./RenameDialog";
import { dndOptions } from "./dnd-backend";

export function FileExplorerProvider({ children }: { children: ReactNode }) {
	const context = useCurrentProject();
	const deleteTargetPath = useFileExplorerStore((s) => s.deleteTargetPath);
	const createTargetPath = useFileExplorerStore((s) => s.createTargetPath);
	const renameTargetPath = useFileExplorerStore((s) => s.renameTargetPath);
	const setDeleteTargetPath = useFileExplorerStore((s) => s.setDeleteTargetPath);
	const setCreateTargetPath = useFileExplorerStore((s) => s.setCreateTargetPath);
	const setRenameTargetPath = useFileExplorerStore((s) => s.setRenameTargetPath);
	const setProjectId = useFileExplorerStore((s) => s.setProjectId);
	const setSelectedPath = useProjectSession((s) => s.setSelectedPath);

	useEffect(() => {
		setProjectId(context.project.id);
	}, [context.project.id, setProjectId]);

	const handleCreateSuccess = useCallback(
		(newPath: string) => {
			setSelectedPath({ path: newPath, type: "text", jsonPath: null });
			setCreateTargetPath(null);
		},
		[setSelectedPath, setCreateTargetPath],
	);

	return (
		<DndProvider options={dndOptions}>
			{children}
			<DeleteFileDialog targetPath={deleteTargetPath} onClose={() => setDeleteTargetPath(null)} />
			<CreateFileDialog targetPath={createTargetPath} onClose={() => setCreateTargetPath(null)} onSuccess={handleCreateSuccess} />
			<RenameDialog targetPath={renameTargetPath} onClose={() => setRenameTargetPath(null)} />
			<PathListener />
		</DndProvider>
	);
}

function PathListener() {
	const setManyExpanded = useProjectSession((s) => s.setManyExpanded);
	const selectedPath = useProjectSession((s) => s.selectedPath);
	const path = selectedPath?.path;

	useEffect(() => {
		if (path) {
			const segments = path.split("/");
			if (segments.length === 0) return;
			const updates: Record<string, boolean> = {};
			let current = segments[0]!;
			for (let i = 1; i < segments.length; i++) {
				updates[current] = true;
				current += "/" + segments[i];
			}
			setManyExpanded(updates);
		}
	}, [path, setManyExpanded]);

	return null;
}
