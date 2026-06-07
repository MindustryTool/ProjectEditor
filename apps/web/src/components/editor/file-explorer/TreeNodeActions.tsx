import { useCallback } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "~/lib/utils";
import { isDefaultPath } from "@project/fs";
import { useCurrentProject } from "@project/core";

interface TreeNodeActionsProps {
	currentPath: string;
	depth: number;
	isFolder: boolean;
	isEditing: boolean;
	isSelected: boolean;
	onCreateClick: (e: React.MouseEvent) => void;
	onContextMenu?: (path: string, rect: DOMRect) => void;
}

export function TreeNodeActions({
	currentPath,
	depth,
	isFolder,
	isEditing,
	isSelected,
	onCreateClick,
	onContextMenu,
}: TreeNodeActionsProps) {
	const context = useCurrentProject();
	const isDefault = isDefaultPath(context.fs.defaultProjectTree, currentPath);
	const isRoot = depth === 0 && currentPath === "";
	const showActions = !isEditing;

	const handleMoreClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		onContextMenu?.(currentPath, e.currentTarget.getBoundingClientRect());
	}, [currentPath, onContextMenu]);

	if (!showActions || (!isFolder && isDefault)) return null;

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
					onClick={onCreateClick}
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
