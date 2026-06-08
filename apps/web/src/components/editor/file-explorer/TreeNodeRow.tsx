import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { type TreeNode } from "@project/fs";
import { useTreeNodeActions } from "./useTreeNodeActions";
import { getIcon } from "./file-tree";
import { RootName } from "./RootName";
import { TreeNodeRenameInput } from "./TreeNodeRenameInput";
import { TreeNodeLabel } from "./TreeNodeLabel";
import { TreeNodeActions } from "./TreeNodeActions";
import { TreeNodeStatus } from "./TreeNodeStatus";
import React from "react";

interface TreeNodeRowProps {
	node: TreeNode;
	depth: number;
	expanded: boolean;
	onToggle: () => void;
	onContextMenu?: (path: string, rect: DOMRect) => void;
}

export const TreeNodeRow = React.memo(function TreeNodeRow({ node, depth, expanded, onToggle, onContextMenu }: TreeNodeRowProps) {
	const { currentPath, isSelected, isEditing, isFolder, handleClick, handleCreateClick, handleRenameConfirm, handleInputKeyDown } =
		useTreeNodeActions(node, onToggle);

	const isRoot = depth === 0 && currentPath === "";

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
				{isEditing ? (
					<TreeNodeRenameInput defaultValue={node.name} onConfirm={handleRenameConfirm} onKeyDown={handleInputKeyDown} />
				) : (
					<TreeNodeLabel name={isRoot ? <RootName /> : node.name} currentPath={currentPath} isFolder={isFolder} />
				)}
				<TreeNodeActions
					currentPath={currentPath}
					depth={depth}
					isFolder={isFolder}
					isEditing={isEditing}
					isSelected={isSelected}
					onCreateClick={handleCreateClick}
					onContextMenu={onContextMenu}
				/>
				<TreeNodeStatus currentPath={currentPath} isFolder={isFolder} />
			</div>
		</div>
	);
});
