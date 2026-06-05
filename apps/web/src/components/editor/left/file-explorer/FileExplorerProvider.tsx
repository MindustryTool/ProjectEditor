import type { ReactNode } from "react";
import { useCurrentProject } from "@project/core";
import { useFileExplorerState, FileExplorerUiProvider, FileExplorerActionsProvider } from "./useFileExplorerState";
import { DeleteFileDialog } from "./DeleteFileDialog";
import { CreateFileDialog } from "./CreateFileDialog";

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
		</FileExplorerUiProvider>
	);
}
