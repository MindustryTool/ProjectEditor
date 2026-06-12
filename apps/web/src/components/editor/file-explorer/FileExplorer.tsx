import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { TreeNode } from "@project/fs";
import { useCurrentProject, useProjectSession } from "@project/core";
import { cn } from "#/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "#/components/ui/dropdown-menu";
import { buildFileTree } from "./file-tree";
import { TreeNodeChildren } from "./TreeNodeChildren";
import { FileSearchDialog } from "#/components/editor/file-explorer/FileSearchDialog";
import { useFileExplorerStore } from "./useFileExplorerState";
import { Separator } from "#/components/ui/separator";

interface ContextMenuState {
	path: string;
	x: number;
	y: number;
}

interface FileExplorerProps {
	className?: string;
}

export function FileExplorer({ className }: FileExplorerProps) {
	const context = useCurrentProject();
	const treeSnapshot = useProjectSession((state) => state.treeSnapshot);
	const setEditingPath = useFileExplorerStore((s) => s.setEditingPath);
	const setDeleteTargetPath = useFileExplorerStore((s) => s.setDeleteTargetPath);

	const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!contextMenu || !containerRef.current) return;
		const el = containerRef.current;
		const onScroll = () => setContextMenu(null);
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => el.removeEventListener("scroll", onScroll);
	}, [contextMenu]);

	const projectTree = useMemo(() => {
		const rootNode: TreeNode = {
			name: "",
			type: "folder",
			children: buildFileTree(treeSnapshot, context.project.id),
			path: "/",
		};
		return [rootNode];
	}, [context.project.id, treeSnapshot]);

	const handleContextMenu = useCallback(
		(path: string, rect: DOMRect) => {
			const menuWidth = 144;
			const menuHeight = 80;

			const isNearRightEdge = rect.right + menuWidth > window.innerWidth;
			const isNearBottomEdge = rect.top + menuHeight > window.innerHeight;

			const x = isNearRightEdge ? Math.max(8, rect.right - menuWidth) : rect.right;
			const y = isNearBottomEdge ? Math.max(8, rect.bottom - menuHeight) : rect.top;

			if (contextMenu?.path === path) {
				setContextMenu(null);
				return;
			}

			setContextMenu({ path, x, y });
		},
		[contextMenu?.path],
	);

	return (
		<div ref={containerRef} className={cn("h-full w-full overflow-hidden flex-col flex", className)}>
			<FileSearchDialog />
			<Separator />
			<div className="h-full w-full overflow-y-auto pb-10 pt-0 px-1">
				{projectTree.map((node) => (
					<TreeNodeChildren key={node.name} node={node} depth={0} onContextMenu={handleContextMenu} />
				))}
				{contextMenu && (
					<DropdownMenu
						open
						onOpenChange={(open) => {
							if (!open) setContextMenu(null);
						}}
					>
						<DropdownMenuContent
							side="left"
							sideOffset={0}
							className="w-36"
							style={{
								position: "fixed",
								left: contextMenu.x,
								top: contextMenu.y,
							}}
						>
							<DropdownMenuItem
								onClick={() => {
									setEditingPath(contextMenu.path);
									setContextMenu(null);
								}}
							>
								<Pencil className="size-3" />
								Rename
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setDeleteTargetPath(contextMenu.path);
									setContextMenu(null);
								}}
							>
								<Trash2 className="size-3" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	);
}
