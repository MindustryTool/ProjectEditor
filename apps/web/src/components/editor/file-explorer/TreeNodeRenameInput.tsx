import { useRef, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { useCurrentProject, useProjectSession } from "@project/core";
import { useFileExplorerStore } from "./useFileExplorerState";

interface TreeNodeRenameInputProps {
	currentPath: string;
	nodeName: string;
	children: ReactNode;
}

export function TreeNodeRenameInput({ currentPath, nodeName, children }: TreeNodeRenameInputProps) {
	const editingPath = useFileExplorerStore((s) => s.editingPath);

	if (editingPath !== currentPath) return <>{children}</>;

	return <RenameInputInner currentPath={currentPath} nodeName={nodeName} />;
}

function RenameInputInner({ currentPath, nodeName }: { currentPath: string; nodeName: string }) {
	const inputRef = useRef<HTMLInputElement>(null);
	const setEditingPath = useFileExplorerStore((s) => s.setEditingPath);
	const context = useCurrentProject();
	const selectedPath = useProjectSession((s) => s.selectedPath);
	const setSelectedPath = useProjectSession((s) => s.setSelectedPath);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, []);

	function handleConfirm(value: string) {
		const trimmed = value.trim();
		if (!trimmed || trimmed === nodeName) {
			setEditingPath(null);
			return;
		}

		const parentDir = currentPath.slice(0, currentPath.length - nodeName.length);
		const newPath = `${parentDir}${trimmed}`;

		context.fs
			.rename(currentPath, newPath)
			.then(() => {
				if (selectedPath === currentPath) setSelectedPath(newPath);
			})
			.catch((err: unknown) => {
				toast.error(`Rename failed: ${err instanceof Error ? err.message : "Unknown error"}`);
			});
		setEditingPath(null);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
			handleConfirm(e.currentTarget.value);
		} else if (e.key === "Escape") {
			e.preventDefault();
			setEditingPath(null);
		}
	}

	return (
		<input
			ref={inputRef}
			defaultValue={nodeName}
			className="min-w-0 flex-1 rounded border border-border bg-background px-1 py-0 text-sm outline-none"
			onKeyDown={handleKeyDown}
			onBlur={(e) => handleConfirm(e.target.value)}
			onClick={(e) => e.stopPropagation()}
		/>
	);
}
