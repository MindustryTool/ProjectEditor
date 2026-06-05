import type { TreeNode } from "@project/fs";
import { useLocalStorage } from "usehooks-ts";
import { TreeNodeRow } from "./TreeNodeRow";
import { usePath } from "#/hooks/use-path";
import { useEffect } from "react";

interface TreeNodeChildrenProps {
	node: TreeNode;
	depth: number;
}

export function TreeNodeChildren({ node, depth = 0 }: TreeNodeChildrenProps) {
	const [expanded, setExpanded] = useLocalStorage<Record<string, boolean>>("file-explorer-expand", {
		"/": true,
	});

	const [path] = usePath();

	useEffect(() => {
		if (path) {
			const segments = path.split("/");
			if (segments.length === 0) {
				return;
			}

			let current = segments[0]!;
			for (let i = 1; i < segments.length; i++) {
				setExpanded((prev) => ({ ...prev, [current]: true }));
				current += "/" + segments[i];
			}
		}
	}, [path, setExpanded]);

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
