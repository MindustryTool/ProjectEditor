import { useCallback, useEffect } from "react";
import { useProjectSession, useCurrentProject } from "@project/core";
import { usePath } from "#/hooks/use-path";

const EMPTY: never[] = [];

export function useRecentlyOpened() {
	const [path, setPath] = usePath();
	const context = useCurrentProject();
	const projectId = context.project.id;

	const projectContext = useProjectSession((s) => s.projectContext);
	const treeSnapshot = useProjectSession((state) => state.treeSnapshot);
	const recentFiles = useProjectSession((state) => state.recentlyOpenedFiles[projectId]) ?? EMPTY;
	const recordFileAccess = useProjectSession((state) => state.recordFileAccess);
	const removeFromRecentFiles = useProjectSession((state) => state.removeFromRecentFiles);
	const clearRecentFiles = useProjectSession((state) => state.clearRecentFiles);

	useEffect(() => {
		if (path && projectContext && treeSnapshot.contains(path)) {
			recordFileAccess(projectContext.project.id, path);
		}
	}, [path, projectContext, treeSnapshot, recordFileAccess]);

	const handleTabClick = useCallback(
		(filePath: string) => {
			if (treeSnapshot.contains(filePath)) {
				recordFileAccess(projectId, filePath);
			}
			setPath(filePath);
		},
		[projectId, recordFileAccess, setPath, treeSnapshot],
	);

	const handleClose = useCallback(
		(filePath: string) => {
			removeFromRecentFiles(projectId, filePath);
			if (filePath.trim() === path?.trim()) {
				const first = recentFiles.filter((e) => e.path !== filePath)[0];
				if (first) {
					setPath(first.path);
				} else {
					setPath(null);
				}
			}
		},
		[projectId, path, recentFiles, removeFromRecentFiles, setPath],
	);

	const handleClear = useCallback(() => {
		clearRecentFiles(projectId);
		setPath(null);
	}, [clearRecentFiles, projectId, setPath]);

	const isFileMissing = useCallback((filePath: string) => !treeSnapshot.contains(filePath), [treeSnapshot]);

	return { recentFiles, path, handleTabClick, handleClose, handleClear, isFileMissing };
}
