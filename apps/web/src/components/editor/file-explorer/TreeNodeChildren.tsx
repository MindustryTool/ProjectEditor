import type { TreeNode } from "@project/fs";
import { TreeNodeRow } from "./TreeNodeRow";
import { useExpanded } from "#/components/editor/file-explorer/use-expaned";

interface TreeNodeChildrenProps {
	node: TreeNode;
	depth: number;
}

export function TreeNodeChildren({ node, depth = 0 }: TreeNodeChildrenProps) {
	const [expanded, setExpanded] = useExpanded();

	const isExpanded = Boolean(expanded[node.path] || false);

	return (
		<div>
			<TreeNodeRow
				node={node}
				depth={depth}
				expanded={isExpanded}
				onToggle={() => setExpanded({ ...expanded, [node.path]: !isExpanded })}
			/>
			{node.type === "folder" && isExpanded && node.children && (
				<div>
					{node.children.map((child) => (
						<TreeNodeChildren key={child.name} node={child} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	);
}
