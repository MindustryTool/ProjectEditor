import { useCallback } from "react";
import { X } from "lucide-react";
import { useProjectSession, useCurrentProject } from "@project/core";
import { cn } from "~/lib/utils";
import { usePath } from "#/hooks/use-path";
import { FileIcon } from "#/components/editor/FileIcon";

const EMPTY: never[] = [];

export function RecentlyOpenedFilesBar() {
	const [path, setPath] = usePath();
	const context = useCurrentProject();
	const projectId = context.project.id;

	const treeSnapshot = useProjectSession((state) => state.treeSnapshot);
	const recentFiles = useProjectSession((state) => state.recentlyOpenedFiles[projectId]) ?? EMPTY;
	const recordFileAccess = useProjectSession((state) => state.recordFileAccess);
	const removeFromRecentFiles = useProjectSession((state) => state.removeFromRecentFiles);

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
		(e: React.MouseEvent, filePath: string) => {
			e.stopPropagation();
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

	if (recentFiles.length === 0) return null;

	return (
		<div className="flex items-center gap-px overflow-x-auto bg-muted/30 py-0.5">
			{recentFiles.map((entry) => {
				const isActive = entry.path === path;
				const isMissing = !treeSnapshot.contains(entry.path);
				const name = entry.path.split("/").pop() ?? entry.path;

				return (
					<button
						key={entry.path}
						className={cn(
							"group flex items-center gap-1 px-2 py-1 text-xs transition-colors bg-accent/40",
							isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
							isMissing && "line-through text-destructive",
						)}
						onClick={() => handleTabClick(entry.path)}
						onContextMenu={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleClose(e, entry.path);
						}}
					>
						<FileIcon path={entry.path} />
						<span className="truncate">{name}</span>
						<span
							role="button"
							tabIndex={-1}
							onClick={(e) => handleClose(e, entry.path)}
							className={cn(
								"flex ml-auto size-4 items-center justify-center rounded hover:bg-muted-foreground/20",
								isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
							)}
						>
							<X className="size-3" />
						</span>
					</button>
				);
			})}
		</div>
	);
}
