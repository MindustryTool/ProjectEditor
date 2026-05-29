import { useCallback } from "react";
import { File, X } from "lucide-react";
import { useProjectSession, useCurrentProject } from "@project/state";
import { cn } from "~/lib/utils";
import { usePath } from "#/hooks/use-path";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { resolveContentSprite } from "@project/utils";

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
		[projectId, path, recentFiles, removeFromRecentFiles],
	);

	if (recentFiles.length === 0) return null;

	return (
		<div className="flex items-center gap-px overflow-x-hidden flex-wrap bg-muted/30 py-0.5 divide-x">
			{recentFiles.map((entry) => {
				const isActive = entry.path === path;
				const isMissing = !treeSnapshot.contains(entry.path);
				const name = entry.path.split("/").pop() ?? entry.path;

				return (
					<button
						key={entry.path}
						className={cn(
							"group flex flex-1 shrink-0 items-center gap-1 px-2 py-1 text-xs transition-colors max-w-40",
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
						{getIcon(entry.path)}
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

function getIcon(path: string) {
	if (path.endsWith(".png")) {
		return <ImageFilePreview path={path} showSize={false} className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4" />;
	}

	const assetPath = resolveContentSprite(path);

	if (assetPath) {
		return (
			<ImageFilePreview
				path={assetPath}
				showSize={false}
				className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4"
				fallback={<File />}
			/>
		);
	}

	return <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4" />;
}
