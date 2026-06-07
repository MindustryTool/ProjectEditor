import { useFileStore, isDirty, selectEntry, selectIsSaving } from "@project/core";
import { useShallow } from "zustand/react/shallow";
import { useFileExplorerStore } from "./useFileExplorerState";

interface TreeNodeStatusProps {
	currentPath: string;
	isFolder: boolean;
}

export function TreeNodeStatus({ currentPath, isFolder }: TreeNodeStatusProps) {
	const projectId = useFileExplorerStore((s) => s.projectId);
	const fileEntry = useFileStore(useShallow(selectEntry(projectId, currentPath)));
	const isSaving = useFileStore(useShallow(selectIsSaving(projectId, currentPath)));

	if (isFolder) return null;

	const isDirtyFlag = fileEntry ? isDirty(fileEntry) : false;

	if (isSaving) {
		return <span className="h-2 w-2 shrink-0 rounded-full bg-white mr-2" />;
	}

	if (isDirtyFlag) {
		return <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400 mr-2" />;
	}

	return null;
}
