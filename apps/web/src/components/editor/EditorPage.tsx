import { useQueryState } from "nuqs";
import { useCallback, useEffect } from "react";
import { useProjectStore } from "@project/state";
import { createEventBus, type ProjectInfo, type ProjectLanguage, type ProjectEventMap } from "@project/core";
import { createProjectFileSystem, jsonProjectTree, type TreeNode } from "@project/fs";
import { getProject, saveProject, type ProjectRecord } from "@project/storage";
import { NoProjectScreen } from "./NoProjectScreen";
import { EditorShell } from "./EditorShell";

export function EditorPage() {
	const [path] = useQueryState("path");

	const projectContext = useProjectStore((state) => state.projectContext);
	const lastProjectId = useProjectStore((state) => state.lastProjectId);
	const createNewProject = useProjectStore((state) => state.createNewProject);
	const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
	const closeProject = useProjectStore((state) => state.closeProject);

	const openProjectFromRecord = useCallback(
		async (record: ProjectRecord) => {
			const project: ProjectInfo = {
				id: record.id,
				name: record.name,
				language: (record.language ?? "json") as ProjectLanguage,
				createdAt: new Date(record.createdAt),
				updatedAt: new Date(record.updatedAt),
			};
			const events = createEventBus<ProjectEventMap>();
			const fs = await createProjectFileSystem(project, {
				getTreeSnapshot: () => useProjectStore.getState().treeSnapshot,
				onTreeSnapshotChange: (snapshot) => useProjectStore.setState({ treeSnapshot: snapshot }),
			});
			const ensureNode = async (node: TreeNode, parentPath: string): Promise<void> => {
				const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
				if (node.type === "folder") {
					await fs.mkdir(currentPath).catch();
					for (const child of node.children ?? []) {
						await ensureNode(child, currentPath);
					}
				} else {
					await fs.writeTextFile(currentPath, "");
				}
			};

			for (const node of jsonProjectTree.projectTree) {
				await ensureNode(node, "");
			}

			setCurrentProject({ project, fs, events });
		},
		[setCurrentProject],
	);

	useEffect(() => {
		if (projectContext !== null || !lastProjectId) return;
		let cancelled = false;
		(async () => {
			const record = await getProject(lastProjectId);
			if (record && !cancelled) {
				openProjectFromRecord(record);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [lastProjectId, projectContext, openProjectFromRecord]);

	const handleCreateProject = useCallback(
		async (name: string, language?: ProjectLanguage) => {
			await createNewProject(name, language);
			const ctx = useProjectStore.getState().projectContext;
			if (ctx) {
				await saveProject({
					id: ctx.project.id,
					name: ctx.project.name,
					language: ctx.project.language,
					data: "",
					createdAt: ctx.project.createdAt,
					updatedAt: ctx.project.updatedAt,
				});
			}
		},
		[createNewProject],
	);

	if (projectContext === null) {
		return <NoProjectScreen onCreateProject={handleCreateProject} onOpenProject={openProjectFromRecord} />;
	}

	return (
		<EditorShell
			path={path}
			projectName={projectContext.project.name}
			onCloseProject={closeProject}
			onOpenProject={openProjectFromRecord}
			onCreateProject={handleCreateProject}
		/>
	);
}
