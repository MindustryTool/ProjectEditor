import type { TreeNode } from "@project/fs";
import { TreeNodeRow } from "./TreeNodeRow";
import { useExpanded } from "#/components/editor/file-explorer/use-expaned";
import React, { useCallback } from "react";

interface TreeNodeChildrenProps {
	node: TreeNode;
	depth: number;
	onContextMenu?: (path: string, rect: DOMRect) => void;
}

export const TreeNodeChildren = React.memo(function TreeNodeChildren({ node, depth = 0, onContextMenu }: TreeNodeChildrenProps) {
	const [expanded, setExpanded] = useExpanded();

	const isExpanded = Boolean(expanded[node.path] || false);

	const toggle = useCallback(() => {
		setExpanded((prev) => ({ ...prev, [node.path]: !isExpanded }));
	}, [isExpanded, node.path, setExpanded]);

	return (
		<div>
			<TreeNodeRow
				node={node}
				depth={depth}
				expanded={isExpanded}
				onToggle={toggle}
				onContextMenu={onContextMenu}
			/>
			{node.type === "folder" && isExpanded && node.children && (
				<div>
					{node.children.map((child) => (
						<TreeNodeChildren key={child.name} node={child} depth={depth + 1} onContextMenu={onContextMenu} />
					))}
				</div>
			)}
		</div>
	);
});
