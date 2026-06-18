import { useCallback } from "react";
import { useProjectSession, useCurrentProject } from "@project/core";
import { useRecentFiles } from "./useRecentFiles";
import { useRecentFileRecorder } from "./useRecentFileRecorder";
import { RecentFileTab } from "./RecentFileTab";
import { BrushCleaning } from "lucide-react";

export function RecentlyOpenedFilesBar() {
	const recentFiles = useRecentFiles();
	const projectId = useCurrentProject().project.id;

	useRecentFileRecorder();

	const handleTabClick = useCallback(
		(filePath: string) => {
			const state = useProjectSession.getState();
			const existing = state.recentlyOpenedFiles[projectId]?.find((e) => e.path === filePath);
			const type = existing?.type ?? "text";
			const jsonPath = existing?.jsonPath ?? null;
			if (state.treeSnapshot.contains(filePath)) {
				state.recordFileAccess(projectId, filePath, type, jsonPath);
			}
			state.setSelectedPath({ path: filePath, type, jsonPath });
		},
		[projectId],
	);

	const handleClose = useCallback(
		(filePath: string) => {
			const state = useProjectSession.getState();
			state.removeFromRecentFiles(projectId, filePath);
			const currentPath = state.selectedPath?.path;
			if (filePath.trim() === currentPath?.trim()) {
				const files = state.recentlyOpenedFiles[projectId] ?? [];
				const first = files.filter((e) => e.path !== filePath)[0];
				if (first) {
					state.setSelectedPath({ path: first.path, type: first.type, jsonPath: first.jsonPath });
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
			{recentFiles.length > 2 && (
				<button
					className="h-full rounded flex aspect-square items-center gap-1 justify-center text-xs transition-colors bg-accent cursor-pointer"
					onClick={handleClear}
				>
					<BrushCleaning className="size-3" />
				</button>
			)}
			{recentFiles.map((entry) => (
				<RecentFileTab key={entry.path} entry={entry} onClick={handleTabClick} onClose={handleClose} />
			))}
		</div>
	);
}
