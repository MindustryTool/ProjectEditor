import { useCallback, useEffect, type ReactNode } from "react";
import { useCurrentProject } from "@project/core";
import { useFileExplorerStore } from "./useFileExplorerState";
import { DeleteFileDialog } from "./DeleteFileDialog";
import { CreateFileDialog } from "./CreateFileDialog";
import { useExpanded } from "#/components/editor/file-explorer/use-expaned";
import { usePath } from "#/hooks/use-path";

export function FileExplorerProvider({ children }: { children: ReactNode }) {
	const context = useCurrentProject();
	const deleteTargetPath = useFileExplorerStore((s) => s.deleteTargetPath);
	const createTargetPath = useFileExplorerStore((s) => s.createTargetPath);
	const setDeleteTargetPath = useFileExplorerStore((s) => s.setDeleteTargetPath);
	const setCreateTargetPath = useFileExplorerStore((s) => s.setCreateTargetPath);
	const setProjectId = useFileExplorerStore((s) => s.setProjectId);
	const [, setPath] = usePath();

	useEffect(() => {
		setProjectId(context.project.id);
	}, [context.project.id, setProjectId]);

	const handleCreateSuccess = useCallback(
		(newPath: string) => {
			setPath(newPath);
			setCreateTargetPath(null);
		},
		[setPath, setCreateTargetPath],
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
	const [, setExpanded] = useExpanded();
	const [path] = usePath();

	useEffect(() => {
		if (path) {
			const segments = path.split("/");
			if (segments.length === 0) return;
			let current = segments[0]!;
			for (let i = 1; i < segments.length; i++) {
				setExpanded((prev) => ({ ...prev, [current]: true }));
				current += "/" + segments[i];
			}
		}
	}, [path, setExpanded]);

	return null;
}
