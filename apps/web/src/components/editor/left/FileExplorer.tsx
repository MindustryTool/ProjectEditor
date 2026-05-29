import { useMemo, useState, useRef, useEffect, createContext, useContext } from "react";
import { File, Folder, FolderOpen, ChevronRight, ChevronDown, Pencil, Trash2, Plus, MoreHorizontal } from "lucide-react";
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
import { usePath } from "#/hooks/use-path";
import { resolveContentSprite } from "@project/utils";
import { useIssues } from "#/hooks/use-issue";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { InputGroup, InputGroupInput, InputGroupAddon } from "#/components/ui/input-group";
import { TemplateSelector, EffectSelector } from "./TemplateSelector";

interface FileExplorerContextValue {
	selectedPath: string | null;
	editingPath: string | null;
	onSelect: (value: string | null) => void;
	onEditingPathChange: (path: string | null) => void;
	onDeleteRequest: (path: string) => void;
	onCreateRequest: (path: string) => void;
	totalIssueCount: Record<string, { error: number; warning: number }>;
	projectId: string;
}

const FileExplorerCtx = createContext<FileExplorerContextValue | null>(null);

function useFileExplorer() {
	const ctx = useContext(FileExplorerCtx);
	if (!ctx) throw new Error("useFileExplorer must be used within FileExplorer");
	return ctx;
}

interface FileExplorerProps {
	className?: string;
}

export function FileExplorer({ className }: FileExplorerProps) {
	const context = useCurrentProject();
	const [path, setPath] = usePath();
	const treeSnapshot = useProjectSession((state) => state.treeSnapshot);
	const rawTree = useMemo(() => buildFileTree(treeSnapshot, context.project.id), [context.project.id, treeSnapshot]);
	const projectTree = useMemo(() => {
		const rootNode: TreeNode = {
			name: context.project.name,
			type: "folder",
			children: rawTree,
			path: "/",
		};
		return [rootNode];
	}, [rawTree, context.project.name]);

	const [editingPath, setEditingPath] = useState<string | null>(null);
	const [deleteTargetPath, setDeleteTargetPath] = useState<string | null>(null);
	const [createTargetPath, setCreateTargetPath] = useState<string | null>(null);

	const totalIssueCount = useIssues();

	const deleteTargetName = useMemo(() => {
		if (!deleteTargetPath) return "";
		const parts = deleteTargetPath.split("/");
		return parts[parts.length - 1] ?? "";
	}, [deleteTargetPath]);

	async function handleDeleteConfirm() {
		if (!deleteTargetPath) {
			return;
		}

		await context.fs.delete(deleteTargetPath).catch((err) => {
			toast.error(`Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`);
		});

		setDeleteTargetPath(null);
	}

	return (
		<div className={cn("space-y-0.5 h-full", className)}>
			<FileExplorerCtx.Provider
				value={{
					selectedPath: path ?? null,
					editingPath,
					onSelect: setPath,
					onEditingPathChange: setEditingPath,
					onDeleteRequest: setDeleteTargetPath,
					onCreateRequest: setCreateTargetPath,
					totalIssueCount,
					projectId: context.project.id,
				}}
			>
				{projectTree.map((node) => (
					<TreeNodeItem key={node.name} node={node} depth={0} />
				))}
			</FileExplorerCtx.Provider>
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
			<Dialog
				open={createTargetPath !== null}
				onOpenChange={(open) => {
					if (!open) setCreateTargetPath(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New</DialogTitle>
						<DialogDescription>Create a new file or folder in {createTargetPath || "project root"}.</DialogDescription>
					</DialogHeader>
					<CreateFileForm
						targetPath={createTargetPath ?? ""}
						context={context}
						onSuccess={(newPath) => {
							setPath(newPath);
							setCreateTargetPath(null);
						}}
						onCancel={() => setCreateTargetPath(null)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

const contentTypes = new Set(["item", "block", "unit", "liquid", "status", "sector", "env-block", "effect"]);

function CreateFileForm({
	targetPath,
	context,
	onSuccess,
	onCancel,
}: {
	targetPath: string;
	context: ReturnType<typeof useCurrentProject>;
	onSuccess: (path: string) => void;
	onCancel: () => void;
}) {
	const EXTENSION_MAP: Record<string, string> = {
		file: "",
		folder: "",
		item: ".hjson",
		block: ".hjson",
		unit: ".hjson",
		liquid: ".hjson",
		status: ".hjson",
		sector: ".hjson",
		"env-block": ".hjson",
		effect: ".hjson",
	};

	const [name, setName] = useState("");
	const [type, setType] = useState("file");
	const [error, setError] = useState("");

	const isContentType = contentTypes.has(type);
	const [getTemplateContent, setGetTemplateContent] = useState<() => Promise<string>>(async () => "");

	async function handleCreate() {
		const trimmed = name.trim();
		if (!trimmed) {
			setError("Name cannot be empty");
			return;
		}
		setError("");

		const ext = EXTENSION_MAP[type] ?? "";
		const fullPath = `${targetPath || ""}/${trimmed}${ext}`;

		try {
			if (type === "folder") {
				await context.fs.mkdir(fullPath);
				onSuccess(fullPath);
			} else {
				const content = await getTemplateContent();
				await context.fs.writeTextFile(fullPath, content);
				onSuccess(fullPath);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create");
		}
	}

	return (
		<div className="space-y-4 h-full w-full">
			<div className="space-y-2">
				<Label htmlFor="name">Name</Label>
				<InputGroup>
					<InputGroupInput id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
					{isContentType && <InputGroupAddon align="inline-end">{EXTENSION_MAP[type]}</InputGroupAddon>}
				</InputGroup>
			</div>
			<div className="space-y-2">
				<Label htmlFor="type">Type</Label>
				<Select value={type} onValueChange={setType}>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="file">File</SelectItem>
						<SelectItem value="folder">Folder</SelectItem>
						<SelectItem value="item">Item</SelectItem>
						<SelectItem value="block">Block</SelectItem>
						<SelectItem value="unit">Unit</SelectItem>
						<SelectItem value="liquid">Liquid</SelectItem>
						<SelectItem value="status">Status</SelectItem>
						<SelectItem value="sector">Sector</SelectItem>
						<SelectItem value="env-block">Env Block</SelectItem>
						<SelectItem value="effect">Effect</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{isContentType &&
				(type === "effect" ? (
					<EffectSelector name={name} onContentReady={setGetTemplateContent} />
				) : (
					<TemplateSelector type={type} onContentReady={setGetTemplateContent} />
				))}
			{error && <p className="text-sm text-red-400">{error}</p>}
			<DialogFooter>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button onClick={handleCreate}>Create</Button>
			</DialogFooter>
		</div>
	);
}

function getIcon(node: TreeNode, expanded: boolean) {
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

	if (node.name.endsWith(".png")) {
		return <ImageFilePreview path={node.path} showSize={false} className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4" />;
	}

	const assetPath = resolveContentSprite(node.path);

	if (assetPath) {
		return (
			<ImageFilePreview
				path={assetPath}
				showSize={false}
				className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4"
				fallback={<File />}
			/>
		);
	}

	return <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4" />;
}

interface TreeNodeItemProps {
	node: TreeNode;
	depth?: number;
}

function TreeNodeItem({ node, depth = 0 }: TreeNodeItemProps) {
	const context = useCurrentProject();
	const { selectedPath, editingPath, onSelect, onEditingPathChange, onDeleteRequest, onCreateRequest, totalIssueCount, projectId } =
		useFileExplorer();
	const [expanded, setExpanded] = useState(node.path === "/");
	const currentPath = node.path === "/" ? "" : node.path;
	const isSelected = selectedPath === currentPath;
	const isFolder = node.type === "folder";

	const errorCount = totalIssueCount[currentPath]?.error ?? 0;
	const warningCount = totalIssueCount[currentPath]?.warning ?? 0;

	const bufferEntry = useFileContentStore(isFolder ? () => undefined : selectEntry(projectId, currentPath));
	const isItemDirty = !isFolder && isDirty(bufferEntry);
	const isItemSaving = useFileContentStore(isFolder ? () => false : selectIsSaving(projectId, currentPath));

	const filenameClass =
		errorCount > 0
			? "text-red-400 underline decoration-wavy"
			: !isFolder && warningCount > 0 && errorCount === 0
				? "text-yellow-400 underline decoration-wavy"
				: "text-foreground";

	const isDefault = isDefaultPath(context.fs.defaultProjectTree, currentPath);
	const isRoot = depth === 0 && currentPath === "";
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
		} else {
			onSelect(currentPath);
		}
	}

	function handleCreateClick(e: React.MouseEvent) {
		e.stopPropagation();
		onCreateRequest(currentPath);
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
		const newNameTrimmed = newName.trim();
		if (!newNameTrimmed || newNameTrimmed === node.name) {
			onEditingPathChange(null);
			return;
		}

		const parentDir = currentPath.slice(0, currentPath.length - node.name.length);
		const newPath = `${parentDir}${newNameTrimmed}`;

		context.fs
			.rename(currentPath, newPath)
			.then(() => {
				if (selectedPath === currentPath) onSelect(newPath);
			})
			.catch((err) => {
				toast.error(`Rename failed: ${err instanceof Error ? err.message : "Unknown error"}`);
			});
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
		return node.name;
	}

	const showActions = !isEditing;

	return (
		<div>
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
						defaultValue={getRenameInitialValue()}
						className="min-w-0 flex-1 rounded border border-border bg-background px-1 py-0 text-sm outline-none"
						onKeyDown={handleInputKeyDown}
						onBlur={(e) => handleRenameConfirm(e.target.value)}
						onClick={(e) => e.stopPropagation()}
					/>
				) : (
					<span className={cn("flex-1 truncate", filenameClass)}>{node.name}</span>
				)}
				{showActions && (isFolder || !isDefault) && (
					<div className={cn("flex items-center gap-0.5", !isSelected && "invisible group-hover:visible", isSelected && "visible")}>
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
			{isFolder && expanded && node.children && (
				<div>
					{node.children.map((child) => (
						<TreeNodeItem key={child.name} node={child} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	);
}

function buildFileTree(snapshot: TreeSnapshot, projectId: string): TreeNode[] {
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
