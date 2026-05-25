import { useCallback } from "react";
import { createEventBus, type ProjectInfo, type ProjectLanguage, type ProjectEventMap } from "@project/core";
import { createProjectFileSystem, jsonProjectTree, type TreeNode } from "@project/fs";
import { useProjectStore } from "@project/state";
import type { ProjectRecord } from "@project/storage";

export function useProjectActions() {
	const createNewProject = useProjectStore((state) => state.createNewProject);
	const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
	const closeProject = useProjectStore((state) => state.closeProject);

	const createProject = useCallback(
		async (name: string, language?: ProjectLanguage) => {
			await createNewProject(name, language);
		},
		[createNewProject],
	);

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
				onTreeSnapshotChange: (snapshot) => useProjectStore.setState({ treeSnapshot: snapshot }),
			});

			const ensureNode = async (node: TreeNode, parentPath: string): Promise<void> => {
				const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;

				if (node.type === "folder") {
					await fs.mkdir(currentPath).catch((e) => console.error(e));
					for (const child of node.children ?? []) {
						await ensureNode(child, currentPath);
					}
				} else {
					const exists = await fs.exists(currentPath);
					if (!exists) {
						await fs.writeTextFile(currentPath, "");
					}
				}
			};

			for (const node of jsonProjectTree.projectTree) {
				await ensureNode(node, "");
			}

			setCurrentProject({ project, fs, events });
		},
		[setCurrentProject],
	);

	return { closeProject, createProject, openProjectFromRecord };
}
