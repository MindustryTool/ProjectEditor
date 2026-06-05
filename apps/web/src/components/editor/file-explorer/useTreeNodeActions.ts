import { toast } from "sonner";
import type { TreeNode } from "@project/fs";
import { useCurrentProject } from "@project/core";
import { useFileExplorerUi, useFileExplorerActions } from "./useFileExplorerState";

export function useTreeNodeActions(node: TreeNode, onToggle?: () => void) {
	const context = useCurrentProject();
	const { selectedPath, editingPath } = useFileExplorerUi();
	const { onSelect, onEditingPathChange, onDeleteRequest, onCreateRequest } = useFileExplorerActions();

	const currentPath = node.path === "/" ? "" : node.path;
	const isSelected = selectedPath === currentPath;
	const isEditing = editingPath === currentPath;
	const isFolder = node.type === "folder";

	function handleClick() {
		if (isFolder) {
			onToggle?.();
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

	return {
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
	};
}
