import { useMemo, useState } from "react";
import { useQueryState } from "nuqs";
import { File, Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import type { FileEntry, TreeNode } from "@project/fs";
import { useCurrentProject, useProjectStore } from "@project/state";
import { useValidationStore } from "@project/state";
import { cn } from "~/lib/utils";

interface FileExplorerProps {
	className?: string;
}

export function FileExplorer({ className }: FileExplorerProps) {
	const context = useCurrentProject();
	const [path, setPath] = useQueryState("path");
	const treeSnapshot = useProjectStore((state) => state.treeSnapshot);
	const projectTree = useMemo(() => buildTreeFromSnapshot(treeSnapshot, context.project.id), [context.project.id, treeSnapshot]);

	return (
		<div className={cn("space-y-0.5 px-1 py-1", className)}>
			{projectTree.map((node) => (
				<TreeNodeItem key={node.name} node={node} parentPath="" selectedPath={path ?? null} onSelect={setPath} />
			))}
		</div>
	);
}

function getIcon(node: TreeNode, expanded: boolean) {
	if (node.type === "folder") {
		return expanded ? (
			<FolderOpen className="h-3.5 w-3.5 shrink-0 text-amber-500" />
		) : (
			<Folder className="h-3.5 w-3.5 shrink-0 text-amber-500" />
		);
	}
	return <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />;
}

interface TreeNodeItemProps {
	node: TreeNode;
	parentPath: string;
	selectedPath: string | null;
	onSelect: (value: string | null) => void;
	depth?: number;
}

function buildTreeFromSnapshot(snapshot: FileEntry[], projectId: string): TreeNode[] {
	const basePrefix = `/projects/${projectId}/`;
	const roots: TreeNode[] = [];
	const nodeByPath = new Map<string, TreeNode>();

	for (const entry of snapshot) {
		const relative = entry.path.startsWith(basePrefix) ? entry.path.slice(basePrefix.length) : entry.path;
		const parts = relative.split("/").filter(Boolean);
		if (parts.length === 0) continue;

		let parentPath = "";
		let siblings = roots;

		for (let i = 0; i < parts.length; i++) {
			const name = parts[i]!;
			const currentPath = parentPath ? `${parentPath}/${name}` : name;
			const isLast = i === parts.length - 1;
			const expectedType: TreeNode["type"] = isLast ? (entry.kind === "directory" ? "folder" : "file") : "folder";

			const existing = nodeByPath.get(currentPath);
			let node: TreeNode;

			if (existing) {
				node = existing;
				if (node.type !== expectedType) {
					node.type = expectedType;
					if (expectedType === "folder") node.children = node.children ?? [];
					else delete node.children;
				}
			} else {
				node = expectedType === "folder" ? { name, type: "folder", children: [] } : { name, type: "file" };
				nodeByPath.set(currentPath, node);
				siblings.push(node);
			}

			if (node.type !== "folder") break;

			parentPath = currentPath;
			node.children = node.children ?? [];
			siblings = node.children;
		}
	}

	sortTreeNodes(roots);
	return roots;
}

function sortTreeNodes(nodes: TreeNode[]) {
	nodes.sort((a, b) => {
		if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
	for (const node of nodes) {
		if (node.type === "folder" && node.children) sortTreeNodes(node.children);
	}
}

function TreeNodeItem({ node, parentPath, selectedPath, onSelect, depth = 0 }: TreeNodeItemProps) {
	const [expanded, setExpanded] = useState(depth === 0 && node.type === "folder");
	const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
	const isSelected = selectedPath === currentPath;
	const isFolder = node.type === "folder";

	const fileResults = useValidationStore((s) => (isFolder ? null : s.resultsByPath[currentPath]));
	const errorCount = fileResults?.filter((r) => r.severity === 0).length ?? 0;
	const warningCount = fileResults?.filter((r) => r.severity === 1).length ?? 0;

	function handleClick() {
		if (isFolder) {
			setExpanded(!expanded);
			return;
		}
		onSelect(currentPath);
	}

	return (
		<div>
			<button
				onClick={handleClick}
				className={cn(
					"flex w-full cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm text-foreground hover:bg-accent",
					isSelected && "bg-accent font-medium",
				)}
				style={{ paddingLeft: `${8 + depth * 16}px` }}
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
				<span className="truncate">{node.name}</span>
				{!isFolder && errorCount > 0 && (
					<span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
						{errorCount}
					</span>
				)}
				{!isFolder && errorCount === 0 && warningCount > 0 && (
					<span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-500 px-1 text-[10px] font-bold text-white">
						{warningCount}
					</span>
				)}
			</button>
			{isFolder && expanded && node.children && (
				<div>
					{node.children.map((child) => (
						<TreeNodeItem
							key={child.name}
							node={child}
							parentPath={currentPath}
							selectedPath={selectedPath}
							onSelect={onSelect}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}
