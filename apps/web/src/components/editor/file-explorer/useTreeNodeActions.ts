import { toast } from "sonner";
import type { TreeNode } from "@project/fs";
import { useCurrentProject } from "@project/core";
import { useFileExplorerStore } from "./useFileExplorerState";
import { usePath } from "#/hooks/use-path";

export function useTreeNodeActions(node: TreeNode, onToggle?: () => void) {
	const context = useCurrentProject();
	const [selectedPath, setPath] = usePath();
	const editingPath = useFileExplorerStore((s) => s.editingPath);
	const setEditingPath = useFileExplorerStore((s) => s.setEditingPath);
	const setCreateTargetPath = useFileExplorerStore((s) => s.setCreateTargetPath);

	const currentPath = node.path === "/" ? "" : node.path;
	const isSelected = selectedPath === currentPath;
	const isEditing = editingPath === currentPath;
	const isFolder = node.type === "folder";

	function handleClick() {
		if (isFolder) {
			onToggle?.();
		} else {
			setPath(currentPath);
		}
	}

	function handleCreateClick(e: React.MouseEvent) {
		e.stopPropagation();
		setCreateTargetPath(currentPath);
	}

	function handleRenameConfirm(newName: string) {
		const newNameTrimmed = newName.trim();
		if (!newNameTrimmed || newNameTrimmed === node.name) {
			setEditingPath(null);
			return;
		}

		const parentDir = currentPath.slice(0, currentPath.length - node.name.length);
		const newPath = `${parentDir}${newNameTrimmed}`;

		context.fs
			.rename(currentPath, newPath)
			.then(() => {
				if (selectedPath === currentPath) setPath(newPath);
			})
			.catch((err) => {
				toast.error(`Rename failed: ${err instanceof Error ? err.message : "Unknown error"}`);
			});
		setEditingPath(null);
	}

	function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
			handleRenameConfirm(e.currentTarget.value);
		} else if (e.key === "Escape") {
			e.preventDefault();
			setEditingPath(null);
		}
	}

	return {
		currentPath,
		isSelected,
		isEditing,
		isFolder,
		handleClick,
		handleCreateClick,
		handleRenameConfirm,
		handleInputKeyDown,
	};
}
