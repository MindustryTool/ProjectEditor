import { useEffect, useRef, useCallback } from "react";
import { useFileContentStore, isDirty, isError } from "../stores/file-content";
import { useProjectStore } from "../index";
import { getWriteQueue, disposeWriteQueue } from "../services/write-queue";

export interface UseFileContentResult {
  data: string | null;
  currentVersion: number;
  savedVersion: number;
  savedAt: number | null;
  error: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
  isError: boolean;
  update: (content: string) => void;
}

export function useFileContent(path: string): UseFileContentResult {
  const projectContext = useProjectStore((s) => s.projectContext);
  const projectId = projectContext?.project.id;
  const compositeKey = projectId ? `${projectId}::${path}` : "";

  const entry = useFileContentStore((s) => (compositeKey ? s.fileContents[compositeKey] : undefined));

  const savingPaths = useRef(new Set<string>());

  useEffect(() => {
    if (!projectId || !path) return;
    if (entry !== undefined) return;

    useFileContentStore.getState().readFile(projectId, path, projectContext!.fs);
  }, [path, projectId, projectContext, entry]);

  const previousProjectId = useRef(projectId ?? null);
  useEffect(() => {
    if (projectId !== previousProjectId.current) {
      if (previousProjectId.current !== null) {
        disposeWriteQueue(previousProjectId.current);
        savingPaths.current.clear();
      }
      previousProjectId.current = projectId ?? null;
    }
  }, [projectId]);

  const update = useCallback(
    (content: string) => {
      if (!projectId || !projectContext) return;

      const store = useFileContentStore.getState();
      store.writeBuffer(projectId, path, content);

      const currentEntry = store.fileContents[`${projectId}::${path}`];
      const version = currentEntry?.currentVersion ?? 0;

      savingPaths.current.add(path);
      const queue = getWriteQueue(projectId, projectContext.fs);
      queue.enqueue(path, content, version).then(
        () => {
          const updatedEntry = useFileContentStore.getState().fileContents[`${projectId}::${path}`];
          if (!updatedEntry || updatedEntry.currentVersion !== version) return;
          useFileContentStore.getState().markPersisted(projectId, path);
          savingPaths.current.delete(path);
        },
        (err: unknown) => {
          const updatedEntry = useFileContentStore.getState().fileContents[`${projectId}::${path}`];
          if (!updatedEntry || updatedEntry.currentVersion !== version) return;
          console.error(`Failed to write ${path}:`, err);
          useFileContentStore.getState().setBufferError(projectId, path, err instanceof Error ? err.message : String(err));
          savingPaths.current.delete(path);
        },
      );
    },
    [path, projectId, projectContext],
  );

  return {
    data: entry?.data ?? null,
    currentVersion: entry?.currentVersion ?? 0,
    savedVersion: entry?.savedVersion ?? 0,
    savedAt: entry?.savedAt ?? null,
    error: entry?.error ?? null,
    isDirty: isDirty(entry),
    isSaving: savingPaths.current.has(path),
    isLoading: entry?.loading ?? false,
    isError: isError(entry),
    update,
  };
}
