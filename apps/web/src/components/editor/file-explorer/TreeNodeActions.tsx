import { useCallback } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "~/lib/utils";
import { isDefaultPath } from "@project/fs";
import { useCurrentProject } from "@project/core";
import { useFileExplorerStore } from "./useFileExplorerState";

interface TreeNodeActionsProps {
	currentPath: string;
	depth: number;
	isFolder: boolean;
	isSelected: boolean;
	onContextMenu?: (path: string, rect: DOMRect) => void;
}

export function TreeNodeActions({
	currentPath,
	depth,
	isFolder,
	isSelected,
	onContextMenu,
}: TreeNodeActionsProps) {
	const context = useCurrentProject();
	const isDefault = isDefaultPath(context.fs.defaultProjectTree, currentPath);
	const isRoot = depth === 0 && currentPath === "";
	const setCreateTargetPath = useFileExplorerStore((s) => s.setCreateTargetPath);
	const editingPath = useFileExplorerStore((s) => s.editingPath);
	const isEditing = editingPath === currentPath;

	const handleCreateClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setCreateTargetPath(currentPath);
	}, [currentPath, setCreateTargetPath]);

	const handleMoreClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		onContextMenu?.(currentPath, e.currentTarget.getBoundingClientRect());
	}, [currentPath, onContextMenu]);

	if (isEditing) return null;

	return (
		<div
			className={cn(
				"flex items-center gap-0.5 ml-auto",
				!isSelected && "md:invisible group-hover:visible",
				isSelected && "visible",
			)}
		>
			{isFolder && (
				<button
					onClick={handleCreateClick}
					className="flex size-6 items-center justify-center rounded hover:bg-accent"
					title="Create"
				>
					<Plus className="size-3 text-muted-foreground" />
				</button>
			)}
			{!isRoot && !isDefault && (
				<button
					onClick={handleMoreClick}
					className="flex size-6 items-center justify-center rounded hover:bg-accent"
					title="More actions"
				>
					<MoreHorizontal className="size-3 text-muted-foreground" />
				</button>
			)}
		</div>
	);
}
