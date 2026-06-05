import { Folder, FolderOpen } from "lucide-react";
import type { TreeNode } from "@project/fs";
import type { TreeSnapshot } from "@project/core";
import { FileIcon } from "#/components/editor/FileIcon";

export function getIcon(node: TreeNode, expanded: boolean) {
	if (node.path === "/") {
		return null;
	}

	if (node.type === "folder") {
		return expanded ? (
			<FolderOpen className="h-3.5 w-3.5 shrink-0 text-amber-500" />
		) : (
			<Folder className="h-3.5 w-3.5 shrink-0 text-amber-500" />
		);
	}

	return <FileIcon path={node.path} />;
}

export function buildFileTree(snapshot: TreeSnapshot, projectId: string): TreeNode[] {
	const basePrefix = `/projects/${projectId}/`;
	const roots: TreeNode[] = [];
	const nodeByPath = new Map<string, TreeNode>();

	for (const entry of snapshot.getEntries()) {
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
				node =
					expectedType === "folder"
						? { name, type: "folder", children: [], path: currentPath }
						: { name, type: "file", path: currentPath };
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
