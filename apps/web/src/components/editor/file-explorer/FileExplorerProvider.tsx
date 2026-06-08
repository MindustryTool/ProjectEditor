import { useCallback, useEffect, type ReactNode } from "react";
import { useCurrentProject, useProjectSession, useExpandedStore } from "@project/core";
import { useFileExplorerStore } from "./useFileExplorerState";
import { DeleteFileDialog } from "./DeleteFileDialog";
import { CreateFileDialog } from "./CreateFileDialog";

export function FileExplorerProvider({ children }: { children: ReactNode }) {
	const context = useCurrentProject();
	const deleteTargetPath = useFileExplorerStore((s) => s.deleteTargetPath);
	const createTargetPath = useFileExplorerStore((s) => s.createTargetPath);
	const setDeleteTargetPath = useFileExplorerStore((s) => s.setDeleteTargetPath);
	const setCreateTargetPath = useFileExplorerStore((s) => s.setCreateTargetPath);
	const setProjectId = useFileExplorerStore((s) => s.setProjectId);
	const setSelectedPath = useProjectSession((s) => s.setSelectedPath);

	useEffect(() => {
		setProjectId(context.project.id);
	}, [context.project.id, setProjectId]);

	const handleCreateSuccess = useCallback(
		(newPath: string) => {
			setSelectedPath(newPath);
			setCreateTargetPath(null);
		},
		[setSelectedPath, setCreateTargetPath],
	);

	return (
		<>
			{children}
			<DeleteFileDialog targetPath={deleteTargetPath} onClose={() => setDeleteTargetPath(null)} />
			<CreateFileDialog targetPath={createTargetPath} onClose={() => setCreateTargetPath(null)} onSuccess={handleCreateSuccess} />
			<PathListener />
		</>
	);
}

function PathListener() {
	const setManyExpanded = useExpandedStore((s) => s.setManyExpanded);
	const path = useProjectSession((s) => s.selectedPath);

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
