import type { TreeNode } from "@project/fs";
import { useLocalStorage } from "usehooks-ts";
import { TreeNodeRow } from "./TreeNodeRow";
import { usePath } from "#/hooks/use-path";

interface TreeNodeChildrenProps {
	node: TreeNode;
	depth: number;
}

export function TreeNodeChildren({ node, depth = 0 }: TreeNodeChildrenProps) {
	const [expanded, setExpanded] = useLocalStorage<Record<string, boolean>>("file-explorer-expand", {
		"/": true,
	});

	const [path] = usePath();

	const isExpanded = Boolean(expanded[node.path] || false) || !!path?.startsWith(node.path);

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
