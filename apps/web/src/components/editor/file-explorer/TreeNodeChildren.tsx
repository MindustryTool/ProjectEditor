import type { TreeNode } from "@project/fs";
import { TreeNodeRow } from "./TreeNodeRow";
import { useExpandedStore, selectIsExpanded } from "@project/core";
import React, { useCallback } from "react";

interface TreeNodeChildrenProps {
	node: TreeNode;
	depth: number;
	onContextMenu?: (path: string, rect: DOMRect) => void;
}

export const TreeNodeChildren = React.memo(function TreeNodeChildren({ node, depth = 0, onContextMenu }: TreeNodeChildrenProps) {
	const isExpanded = useExpandedStore(selectIsExpanded(node.path));
	const toggleExpanded = useExpandedStore((s) => s.toggleExpanded);

	const toggle = useCallback(() => {
		toggleExpanded(node.path);
	}, [node.path, toggleExpanded]);

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
