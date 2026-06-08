import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { type TreeNode } from "@project/fs";
import { getIcon } from "./file-tree";
import { RootName } from "./RootName";
import { TreeNodeRenameInput } from "./TreeNodeRenameInput";
import { TreeNodeLabel } from "./TreeNodeLabel";
import { TreeNodeActions } from "./TreeNodeActions";
import { TreeNodeStatus } from "./TreeNodeStatus";
import { useProjectSession } from "@project/core";
import React, { useCallback } from "react";

interface TreeNodeRowProps {
	node: TreeNode;
	depth: number;
	expanded: boolean;
	onToggle: () => void;
	onContextMenu?: (path: string, rect: DOMRect) => void;
}

export const TreeNodeRow = React.memo(function TreeNodeRow({ node, depth, expanded, onToggle, onContextMenu }: TreeNodeRowProps) {
	const currentPath = node.path === "/" ? "" : node.path;
	const isSelected = useProjectSession((s) => s.selectedPath === currentPath);
	const setSelectedPath = useProjectSession((s) => s.setSelectedPath);
	const isFolder = node.type === "folder";
	const isRoot = depth === 0 && currentPath === "";

	const handleClick = useCallback(() => {
		if (isFolder) {
			onToggle?.();
		} else {
			setSelectedPath(currentPath);
		}
	}, [isFolder, onToggle, setSelectedPath, currentPath]);

	return (
		<div>
			<div
				className={cn(
					"group flex cursor-pointer items-center gap-1 rounded py-1 text-sm hover:bg-accent",
					isSelected && "bg-accent font-medium",
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
				<TreeNodeRenameInput currentPath={currentPath} nodeName={node.name}>
					<TreeNodeLabel name={isRoot ? <RootName /> : node.name} currentPath={currentPath} isFolder={isFolder} />
				</TreeNodeRenameInput>
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
