import { useEffect, type ReactNode } from "react";
import { useCurrentProject } from "@project/core";
import { useFileExplorerState, FileExplorerUiProvider, FileExplorerActionsProvider } from "./useFileExplorerState";
import { DeleteFileDialog } from "./DeleteFileDialog";
import { CreateFileDialog } from "./CreateFileDialog";
import { useExpanded } from "#/components/editor/file-explorer/use-expaned";
import { usePath } from "#/hooks/use-path";

export function FileExplorerProvider({ children }: { children: ReactNode }) {
	const context = useCurrentProject();
	const state = useFileExplorerState();

	return (
		<FileExplorerUiProvider selectedPath={state.selectedPath} editingPath={state.editingPath}>
			<FileExplorerActionsProvider
				value={{
					onSelect: state.setSelectedPath,
					onEditingPathChange: state.setEditingPath,
					onDeleteRequest: state.setDeleteTargetPath,
					onCreateRequest: state.setCreateTargetPath,
					projectId: context.project.id,
				}}
			>
				{children}
				<DeleteFileDialog targetPath={state.deleteTargetPath} onClose={() => state.setDeleteTargetPath(null)} />
				<CreateFileDialog
					targetPath={state.createTargetPath}
					onClose={() => state.setCreateTargetPath(null)}
					onSuccess={(newPath) => {
						state.setSelectedPath(newPath);
						state.setCreateTargetPath(null);
					}}
				/>
			</FileExplorerActionsProvider>
            <PathListener />
		</FileExplorerUiProvider>
	);
}

function PathListener() {
	const [, setExpanded] = useExpanded();
	const [path] = usePath();

	useEffect(() => {
		if (path) {
			const segments = path.split("/");
			if (segments.length === 0) {
				return;
			}

			let current = segments[0]!;
			for (let i = 1; i < segments.length; i++) {
				setExpanded((prev) => ({ ...prev, [current]: true }));
				current += "/" + segments[i];
			}
		}
	}, [path, setExpanded]);

    return null;
}
