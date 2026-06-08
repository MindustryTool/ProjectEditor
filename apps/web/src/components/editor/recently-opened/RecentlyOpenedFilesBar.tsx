import { useCallback } from "react";
import { useProjectSession, useCurrentProject } from "@project/core";
import { useRecentFiles } from "./useRecentFiles";
import { useRecentFileRecorder } from "./useRecentFileRecorder";
import { RecentFileTab } from "./RecentFileTab";
import { Trash } from "lucide-react";

export function RecentlyOpenedFilesBar() {
	const recentFiles = useRecentFiles();
	const projectId = useCurrentProject().project.id;

	useRecentFileRecorder();

	const handleTabClick = useCallback(
		(filePath: string) => {
			const state = useProjectSession.getState();
			if (state.treeSnapshot.contains(filePath)) {
				state.recordFileAccess(projectId, filePath);
			}
			state.setSelectedPath(filePath);
		},
		[projectId],
	);

	const handleClose = useCallback(
		(filePath: string) => {
			const state = useProjectSession.getState();
			state.removeFromRecentFiles(projectId, filePath);
			const currentPath = state.selectedPath;
			if (filePath.trim() === currentPath?.trim()) {
				const files = state.recentlyOpenedFiles[projectId] ?? [];
				const first = files.filter((e) => e.path !== filePath)[0];
				if (first) {
					state.setSelectedPath(first.path);
				} else {
					state.setSelectedPath(null);
				}
			}
		},
		[projectId],
	);

	const handleClear = useCallback(() => {
		const state = useProjectSession.getState();
		state.clearRecentFiles(projectId);
		state.setSelectedPath(null);
	}, [projectId]);

	if (recentFiles.length === 0) return null;

	return (
		<div className="flex items-center gap-1 overflow-x-auto min-h-8 max-h-8">
			{recentFiles.map((entry) => (
				<RecentFileTab
					key={entry.path}
					entry={entry}
					onClick={handleTabClick}
					onClose={handleClose}
				/>
			))}
			{recentFiles.length > 2 && (
				<button
					className="h-full rounded flex aspect-square items-center gap-1 justify-center text-xs transition-colors bg-accent/40 text-destructive"
					onClick={handleClear}
				>
					<Trash className="size-3" />
				</button>
			)}
		</div>
	);
}
