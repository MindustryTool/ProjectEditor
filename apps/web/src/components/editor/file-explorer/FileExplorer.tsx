import { useMemo } from "react";
import type { TreeNode } from "@project/fs";
import { useCurrentProject, useProjectSession } from "@project/core";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { cn } from "~/lib/utils";
import { buildFileTree } from "./file-tree";
import { TreeNodeChildren } from "./TreeNodeChildren";
import { FileSearchDialog } from "#/components/editor/file-explorer/FileSearchDialog";

interface FileExplorerProps {
	className?: string;
}

export function FileExplorer({ className }: FileExplorerProps) {
	const { metadata } = useProjectContext();
	const context = useCurrentProject();
	const treeSnapshot = useProjectSession((state) => state.treeSnapshot);

	const projectTree = useMemo(() => {
		const rootNode: TreeNode = {
			name: metadata.name.toUpperCase(),
			type: "folder",
			children: buildFileTree(treeSnapshot, context.project.id),
			path: "/",
		};
		return [rootNode];
	}, [context.project.id, metadata.name, treeSnapshot]);

	return (
		<div className={cn("h-full w-full", className)}>
			<FileSearchDialog />
			{projectTree.map((node) => (
				<TreeNodeChildren key={node.name} node={node} depth={0} />
			))}
		</div>
	);
}
