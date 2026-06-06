import { useRef, useEffect } from "react";
import { Pencil, Trash2, Plus, MoreHorizontal, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { isDefaultPath, type TreeNode } from "@project/fs";
import { useFileStore, isDirty, selectIsSaving, useValidationStore, useCurrentProject } from "@project/core";
import { useShallow } from "zustand/react/shallow";
import { useFileExplorerActions } from "./useFileExplorerState";
import { useTreeNodeActions } from "./useTreeNodeActions";
import { getIcon } from "./file-tree";

interface TreeNodeRowProps {
	node: TreeNode;
	depth: number;
	expanded: boolean;
	onToggle: () => void;
}

export function TreeNodeRow({ node, depth, expanded, onToggle }: TreeNodeRowProps) {
	const context = useCurrentProject();
	const { projectId } = useFileExplorerActions();
	const {
		currentPath,
		isSelected,
		isEditing,
		isFolder,
		handleClick,
		handleCreateClick,
		handleRenameClick,
		handleDeleteClick,
		handleRenameConfirm,
		handleInputKeyDown,
	} = useTreeNodeActions(node, onToggle);

	const errorCount = useValidationStore(useShallow((s) => s.results.getRollup()[currentPath]?.error ?? 0));
	const warningCount = useValidationStore(useShallow((s) => s.results.getRollup()[currentPath]?.warning ?? 0));

	const isItemDirty = useFileStore(isFolder ? () => false : (state) => isDirty(state.getEntry(projectId, currentPath)));
	const isItemSaving = useFileStore(isFolder ? () => false : selectIsSaving(projectId, currentPath));
	const loadFile = useFileStore((s) => s.loadFile);

	const filenameClass =
		errorCount > 0
			? "text-red-400 underline decoration-wavy"
			: !isFolder && warningCount > 0 && errorCount === 0
				? "text-yellow-400 underline decoration-wavy"
				: "text-foreground";

	const isDefault = isDefaultPath(context.fs.defaultProjectTree, currentPath);
	const isRoot = depth === 0 && currentPath === "";
	const showActions = !isEditing;
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	return (
		<div
			onPointerEnter={() => {
				if (!isFolder) {
					loadFile(context.project.id, currentPath, context.fs);
				}
			}}
		>
			<div
				className={cn(
					"group flex cursor-pointer items-center gap-1 rounded py-1 text-sm hover:bg-accent",
					isSelected && "bg-accent font-medium",
				)}
				role="button"
				tabIndex={0}
				aria-selected={isSelected}
				onClick={handleClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleClick();
					}
				}}
				style={{ paddingLeft: `${depth * 12}px` }}
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
				{isEditing ? (
					<input
						ref={inputRef}
						defaultValue={node.name}
						className="min-w-0 flex-1 rounded border border-border bg-background px-1 py-0 text-sm outline-none"
						onKeyDown={handleInputKeyDown}
						onBlur={(e) => handleRenameConfirm(e.target.value)}
						onClick={(e) => e.stopPropagation()}
					/>
				) : (
					<span className={cn("flex-1 truncate", filenameClass)}>{node.name}</span>
				)}
				{showActions && (isFolder || !isDefault) && (
					<div
						className={cn(
							"flex items-center gap-0.5 ml-auto",
							!isSelected && "md:invisible group-hover:visible",
							isSelected && "visible",
						)}
					>
						{isFolder && (
							<button
								onClick={handleCreateClick}
								className="flex size-6 items-center justify-center rounded hover:bg-accent"
								title="Create"
							>
								<Plus className="size-3 text-muted-foreground" />
							</button>
						)}
						{!isRoot && !isDefault && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="flex size-6 items-center justify-center rounded hover:bg-accent" title="More actions">
										<MoreHorizontal className="size-3 text-muted-foreground" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={handleRenameClick}>
										<Pencil className="size-3" />
										Rename
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleDeleteClick}>
										<Trash2 className="size-3" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				)}
				{!isFolder && isItemSaving && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />}
				{!isFolder && !isItemSaving && isItemDirty && <span className="h-2 w-2 shrink-0 rounded-full bg-white" />}
			</div>
		</div>
	);
}
