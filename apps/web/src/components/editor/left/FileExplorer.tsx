import { useMemo, useState, useRef, useEffect } from "react";
import { useQueryState } from "nuqs";
import { File, Folder, FolderOpen, ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { isDefaultPath, type TreeNode } from "@project/fs";
import {
	useCurrentProject,
	useProjectSession,
	useFileContentStore,
	isDirty,
	selectEntry,
	selectIsSaving,
	TreeSnapshot,
} from "@project/state";
import { useValidationStore } from "@project/state";
import { cn } from "~/lib/utils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface FileExplorerProps {
	className?: string;
}

export function FileExplorer({ className }: FileExplorerProps) {
	const context = useCurrentProject();
	const [path, setPath] = useQueryState("path");
	const treeSnapshot = useProjectSession((state) => state.treeSnapshot);
	const projectTree = useMemo(() => buildTreeFromSnapshot(treeSnapshot, context.project.id), [context.project.id, treeSnapshot]);

	const [editingPath, setEditingPath] = useState<string | null>(null);
	const [deleteTargetPath, setDeleteTargetPath] = useState<string | null>(null);
	const deleteTargetName = useMemo(() => {
		if (!deleteTargetPath) return "";
		const parts = deleteTargetPath.split("/");
		return parts[parts.length - 1] ?? "";
	}, [deleteTargetPath]);

	function handleDeleteConfirm() {
		if (!deleteTargetPath) return;
		context.fs.delete(deleteTargetPath).catch((err) => {
			toast.error(`Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`);
		});
		setDeleteTargetPath(null);
	}

	return (
		<div className={cn("space-y-0.5 h-full overflow-y-auto", className)}>
			{projectTree.map((node) => (
				<TreeNodeItem
					key={node.name}
					node={node}
					parentPath=""
					selectedPath={path ?? null}
					onSelect={setPath}
					projectId={context.project.id}
					editingPath={editingPath}
					onEditingPathChange={setEditingPath}
					onDeleteRequest={setDeleteTargetPath}
				/>
			))}
			<AlertDialog
				open={deleteTargetPath !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTargetPath(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete {deleteTargetName}?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone.{" "}
							{deleteTargetPath && deleteTargetPath.split("/").length > 1 ? "All contents will be deleted." : ""}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleDeleteConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
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
	return <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4" />;
}

interface TreeNodeItemProps {
	node: TreeNode;
	parentPath: string;
	selectedPath: string | null;
	onSelect: (value: string | null) => void;
	projectId: string;
	depth?: number;
	editingPath: string | null;
	onEditingPathChange: (path: string | null) => void;
	onDeleteRequest: (path: string) => void;
}

function buildTreeFromSnapshot(snapshot: TreeSnapshot, projectId: string): TreeNode[] {
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

function TreeNodeItem({
	node,
	parentPath,
	selectedPath,
	onSelect,
	projectId,
	depth = 0,
	editingPath,
	onEditingPathChange,
	onDeleteRequest,
}: TreeNodeItemProps) {
	const context = useCurrentProject();
	const [expanded, setExpanded] = useState(false);
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

	const isDefault = isDefaultPath(context.fs.defaultProjectTree, currentPath);
	const isEditing = editingPath === currentPath;
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	function handleClick() {
		if (isFolder) {
			setExpanded(!expanded);
		}
		onSelect(currentPath);
	}

	function handleRenameClick(e: React.MouseEvent) {
		e.stopPropagation();
		onEditingPathChange(currentPath);
	}

	function handleDeleteClick(e: React.MouseEvent) {
		e.stopPropagation();
		onDeleteRequest(currentPath);
	}

	function handleRenameConfirm(newName: string) {
		if (!newName.trim() || newName.trim() === node.name) {
			onEditingPathChange(null);
			return;
		}

		const parentDir = currentPath.slice(0, currentPath.length - node.name.length);
		const newNameTrimmed = newName.trim();

		if (isFolder) {
			const newPath = `${parentDir}${newNameTrimmed}`;
			context.fs
				.rename(currentPath, newPath)
				.then(() => {
					if (selectedPath === currentPath) onSelect(newPath);
				})
				.catch((err) => {
					toast.error(`Rename failed: ${err instanceof Error ? err.message : "Unknown error"}`);
				});
		} else {
			const dotIndex = node.name.lastIndexOf(".");
			const ext = dotIndex > 0 ? node.name.substring(dotIndex) : "";
			const newPath = `${parentDir}${newNameTrimmed}${ext}`;
			context.fs
				.rename(currentPath, newPath)
				.then(() => {
					if (selectedPath === currentPath) onSelect(newPath);
				})
				.catch((err) => {
					toast.error(`Rename failed: ${err instanceof Error ? err.message : "Unknown error"}`);
				});
		}
		onEditingPathChange(null);
	}

	function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
			handleRenameConfirm(e.currentTarget.value);
		} else if (e.key === "Escape") {
			e.preventDefault();
			onEditingPathChange(null);
		}
	}

	function getRenameInitialValue(): string {
		if (isFolder) return node.name;
		const dotIndex = node.name.lastIndexOf(".");
		return dotIndex > 0 ? node.name.substring(0, dotIndex) : node.name;
	}

	const showActions = !isEditing;

	return (
		<div>
			<div
				className={cn(
					"group flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm hover:bg-accent",
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
				{isEditing ? (
					<input
						ref={inputRef}
						defaultValue={getRenameInitialValue()}
						className="min-w-0 flex-1 rounded border border-border bg-background px-1 py-0 text-sm outline-none"
						onKeyDown={handleInputKeyDown}
						onBlur={(e) => handleRenameConfirm(e.target.value)}
						onClick={(e) => e.stopPropagation()}
					/>
				) : (
					<span className={cn("flex-1 truncate", filenameColor)}>{node.name}</span>
				)}
				{showActions && !isDefault && (
					<div className={cn("flex items-center gap-0.5", !isSelected && "invisible group-hover:visible", isSelected && "visible")}>
						<button
							onClick={handleRenameClick}
							className="flex size-6 items-center justify-center rounded hover:bg-accent"
							title="Rename"
						>
							<Pencil className="size-3 text-muted-foreground" />
						</button>
						<button
							onClick={handleDeleteClick}
							className="flex size-6 items-center justify-center rounded hover:bg-accent"
							title="Delete"
						>
							<Trash2 className="size-3 text-muted-foreground" />
						</button>
					</div>
				)}
				{!isFolder && isItemSaving && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />}
				{!isFolder && !isItemSaving && isItemDirty && <span className="h-2 w-2 shrink-0 rounded-full bg-white" />}
			</div>
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
							editingPath={editingPath}
							onEditingPathChange={onEditingPathChange}
							onDeleteRequest={onDeleteRequest}
						/>
					))}
				</div>
			)}
		</div>
	);
}
