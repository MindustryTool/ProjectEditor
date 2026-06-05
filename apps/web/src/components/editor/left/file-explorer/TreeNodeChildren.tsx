import type { TreeNode } from "@project/fs";
import { useLocalStorage } from "usehooks-ts";
import { TreeNodeRow } from "./TreeNodeRow";

interface TreeNodeChildrenProps {
	node: TreeNode;
	depth: number;
}

export function TreeNodeChildren({ node, depth = 0 }: TreeNodeChildrenProps) {
	const [expanded, setExpanded] = useLocalStorage<boolean>(node.path, node.path === "/");

	return (
		<div>
			<TreeNodeRow node={node} depth={depth} expanded={expanded} onToggle={() => setExpanded(!expanded)} />
			{node.type === "folder" && expanded && node.children && (
				<div>
					{node.children.map((child) => (
						<TreeNodeChildren key={child.name} node={child} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	);
}
