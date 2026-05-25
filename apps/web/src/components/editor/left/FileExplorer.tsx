import { useMemo, useState } from "react";
import { useQueryState } from "nuqs";
import { File, Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import type { FileEntry, TreeNode } from "@project/fs";
import { useCurrentProject, useProjectStore, useFileContentStore, isDirty, selectEntry, selectIsSaving } from "@project/state";
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
				<TreeNodeItem
					key={node.name}
					node={node}
					parentPath=""
					selectedPath={path ?? null}
					onSelect={setPath}
					projectId={context.project.id}
				/>
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
	projectId: string;
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

function TreeNodeItem({ node, parentPath, selectedPath, onSelect, projectId, depth = 0 }: TreeNodeItemProps) {
	const [expanded, setExpanded] = useState(depth === 0 && node.type === "folder");
	const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
	const isSelected = selectedPath === currentPath;
	const isFolder = node.type === "folder";
	const fileResults = useValidationStore((s) => (isFolder ? null : s.resultsByPath[currentPath]));
	const errorCount = fileResults?.filter((r) => r.severity === 0).length ?? 0;
	const warningCount = fileResults?.filter((r) => r.severity === 1).length ?? 0;

	const bufferEntry = useFileContentStore(isFolder ? () => undefined : selectEntry(projectId, currentPath));
	const isItemDirty = !isFolder && isDirty(bufferEntry);
	const isItemSaving = useFileContentStore(isFolder ? () => false : selectIsSaving(projectId, currentPath));

	const isItemError = !isFolder && bufferEntry?.error != null && bufferEntry.currentVersion === bufferEntry.savedVersion;
	const filenameColor = isItemError
		? "text-red-500"
		: !isFolder && warningCount > 0 && errorCount === 0
			? "text-yellow-400"
			: "text-foreground";

	function handleClick() {
		if (isFolder) {
			setExpanded(!expanded);
		}
		onSelect(currentPath);
	}

	return (
		<div>
			<button
				onClick={handleClick}
				className={cn(
					"flex w-full cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm hover:bg-accent",
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
				<span className={cn("truncate", filenameColor)}>{node.name}</span>
				{!isFolder && isItemSaving && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400 ml-auto" />}
				{!isFolder && !isItemSaving && isItemDirty && <span className="h-2 w-2 shrink-0 rounded-full bg-white ml-auto" />}
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
							projectId={projectId}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}
