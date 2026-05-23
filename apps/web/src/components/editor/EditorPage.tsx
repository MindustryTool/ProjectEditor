import { useQueryState } from "nuqs";
import { useState, useCallback } from "react";
import { useProjectStore } from "@project/state";
import { createEventBus, type ProjectInfo, type ProjectEventMap } from "@project/core";
import { createOPFSAdapter } from "@project/fs";
import { saveProject, type ProjectRecord } from "@project/storage";
import { projectTree, type TreeNode } from "./file-explorer-data";
import { NoProjectScreen } from "./NoProjectScreen";
import { EditorShell } from "./EditorShell";

function countFiles(nodes: TreeNode[]): number {
  return nodes.reduce((acc, node) => {
    if (node.type === "file") return acc + 1;
    if (node.children) return acc + countFiles(node.children);
    return acc;
  }, 0);
}

const fileCount = countFiles(projectTree);

export function EditorPage() {
  const [path] = useQueryState("path");
  const [value, setValue] = useState("");

  const { projectContext } = useProjectStore((state) => state);
  const createNewProject = useProjectStore((state) => state.createNewProject);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const closeProject = useProjectStore((state) => state.closeProject);

  const openProjectFromRecord = useCallback(async (record: ProjectRecord) => {
    const project: ProjectInfo = {
      id: record.id,
      name: record.name,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    };
    const events = createEventBus<ProjectEventMap>();
    const fs = await createOPFSAdapter();
    setCurrentProject({ project, fs, events });
  }, [setCurrentProject]);

  const handleCreateProject = useCallback(async (name: string) => {
    await createNewProject(name);
    const ctx = useProjectStore.getState().projectContext;
    if (ctx) {
      await saveProject({
        id: ctx.project.id,
        name: ctx.project.name,
        data: "",
        createdAt: ctx.project.createdAt,
        updatedAt: ctx.project.updatedAt,
      });
    }
  }, [createNewProject]);

  if (projectContext === null) {
    return (
      <NoProjectScreen
        onCreateProject={handleCreateProject}
        onOpenProject={openProjectFromRecord}
      />
    );
  }

  return (
    <EditorShell
      path={path}
      value={value}
      onChange={setValue}
      projectName={projectContext.project.name}
      fileCount={fileCount}
      onCloseProject={closeProject}
      onOpenProject={openProjectFromRecord}
      onCreateProject={handleCreateProject}
    />
  );
}
