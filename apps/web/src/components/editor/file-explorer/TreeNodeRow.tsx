import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "#/lib/utils";
import { isDefaultPath, type TreeNode } from "@project/fs";
import { getIcon } from "./file-tree";
import { RootName } from "./RootName";
import { TreeNodeLabel } from "./TreeNodeLabel";
import { TreeNodeActions } from "./TreeNodeActions";
import { TreeNodeStatus } from "./TreeNodeStatus";
import { useCurrentProject, useProjectSession } from "@project/core";
import { toast } from "sonner";
import React, { useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";

const FILE_TREE_ITEM = "FILE_TREE_ITEM";

interface DragItem {
	path: string;
	name: string;
	isFolder: boolean;
}

interface TreeNodeRowProps {
	node: TreeNode;
	depth: number;
	expanded: boolean;
	onToggle: () => void;
	onContextMenu?: (path: string, rect: DOMRect) => void;
}

export const TreeNodeRow = React.memo(function TreeNodeRow({ node, depth, expanded, onToggle, onContextMenu }: TreeNodeRowProps) {
	const context = useCurrentProject();
	const currentPath = node.path === "/" ? "" : node.path;
	const isSelected = useProjectSession((s) => s.selectedPath?.path === currentPath);
	const setSelectedPath = useProjectSession((s) => s.setSelectedPath);
	const setSelectedTab = useProjectSession((s) => s.setSelectedTab);
	const isFolder = node.type === "folder";
	const isRoot = depth === 0 && currentPath === "";
	const isDefault = isDefaultPath(context.fs.defaultProjectTree, currentPath);
	const canDrag = !isDefault && !isRoot;

	const selectedPath = useProjectSession((s) => s.selectedPath);

	const [{ isDragging }, dragRef] = useDrag(() => ({
		type: FILE_TREE_ITEM,
		canDrag: () => canDrag,
		item: { path: currentPath, name: node.name, isFolder } satisfies DragItem,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}), [currentPath, node.name, isFolder, canDrag]);

	const [dropProps, dropRef] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
		accept: FILE_TREE_ITEM,
		canDrop: (item) => {
			if (!isFolder) return false;
			if (item.path === currentPath) return false;
			if (item.isFolder && currentPath.startsWith(item.path + "/")) return false;
			return true;
		},
		drop: (item) => {
			const targetBase = currentPath || "";
			const targetPath = targetBase ? `${targetBase}/${item.name}` : item.name;
			context.fs.rename(item.path, targetPath).then(() => {
				if (selectedPath?.path === item.path) {
					setSelectedPath({ path: targetPath, type: "text", jsonPath: null });
				}
			}).catch((err: unknown) => {
				toast.error(`Move failed: ${err instanceof Error ? err.message : "Unknown error"}`);
			});
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	}), [currentPath, isFolder, context, selectedPath, setSelectedPath]);

	const dragDropRef = useCallback((el: HTMLDivElement | null) => {
		dragRef(el);
		dropRef(el);
	}, [dragRef, dropRef]);

	const handleClick = useCallback(() => {
		if (isFolder) {
			onToggle?.();
		} else {
			setSelectedPath({ path: currentPath, type: "text", jsonPath: null });
			setSelectedTab("editor");
		}
	}, [isFolder, onToggle, setSelectedPath, setSelectedTab, currentPath]);

	const showDropHighlight = isFolder && dropProps.canDrop && dropProps.isOver;

	return (
		<div>
			<div
				ref={dragDropRef}
				className={cn(
					"group flex cursor-pointer items-center gap-1 rounded py-1 text-sm hover:bg-accent",
					isSelected && "bg-accent font-medium",
					isDragging && "opacity-50",
					showDropHighlight && "bg-accent/60 ring-1 ring-accent",
				)}
				role="button"
				tabIndex={0}
				aria-selected={isSelected}
				onClick={handleClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleClick();
					}
				}}
				style={{ paddingLeft: `${depth * 12}px` }}
			>
				{isFolder && (
					<span className="shrink-0">
						{expanded ? (
							<ChevronDown className="h-3 w-3 text-muted-foreground" />
						) : (
							<ChevronRight className="h-3 w-3 text-muted-foreground" />
						)}
					</span>
				)}
				{getIcon(node, expanded)}
				<TreeNodeLabel name={isRoot ? <RootName /> : node.name} currentPath={currentPath} isFolder={isFolder} />
				<TreeNodeActions
					currentPath={currentPath}
					depth={depth}
					isFolder={isFolder}
					isSelected={isSelected}
					onContextMenu={onContextMenu}
				/>
				<TreeNodeStatus currentPath={currentPath} isFolder={isFolder} />
			</div>
		</div>
	);
});
