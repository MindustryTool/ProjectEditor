import { useEffect, useRef, useCallback } from "react";
import { useFileContentStore } from "./file-content-store";
import { useProjectStore } from "./index";

export interface UseFileContentOptions {
  debounceMs?: number;
}

export interface UseFileContentResult {
  data: string | null;
  isLoading: boolean;
  error: string | null;
  update: (content: string) => void;
}

export function useFileContent(path: string, options?: UseFileContentOptions): UseFileContentResult {
  const debounceMs = options?.debounceMs ?? 500;
  const entry = useFileContentStore((s) => s.fileContents[path]);
  const setFileContent = useFileContentStore((s) => s.setFileContent);
  const setFileLoading = useFileContentStore((s) => s.setFileLoading);
  const setFileError = useFileContentStore((s) => s.setFileError);
  const clearFileContent = useFileContentStore((s) => s.clearFileContent);
  const clearAllFileContents = useFileContentStore((s) => s.clearAllFileContents);
  const projectContext = useProjectStore((s) => s.projectContext);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!projectContext || !path) return;
    if (entry !== undefined) return;

    setFileLoading(path);
    projectContext.fs.readTextFile(path).then(
      (data) => setFileContent(path, data),
      (err: unknown) => setFileError(path, err instanceof Error ? err.message : String(err)),
    );
  }, [path, projectContext]);

  useEffect(() => {
    if (!projectContext || !path) return;

    const unsub = projectContext.events.on("file:changed", (event) => {
      if (event.path !== path) return;
      if (event.kind === "delete") {
        clearFileContent(path);
      } else {
        setFileLoading(path);
        projectContext.fs.readTextFile(path).then(
          (data) => setFileContent(path, data),
          (err: unknown) => setFileError(path, err instanceof Error ? err.message : String(err)),
        );
      }
    });

    return unsub;
  }, [path, projectContext]);

  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const previousProjectId = useRef(projectContext?.project.id ?? null);
  useEffect(() => {
    const currentId = projectContext?.project.id ?? null;
    if (currentId !== previousProjectId.current) {
      clearAllFileContents();
      previousProjectId.current = currentId;
    }
  }, [projectContext?.project.id, clearAllFileContents]);

  const update = useCallback(
    (content: string) => {
      if (!projectContext) return;
      setFileContent(path, content);
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        projectContext.fs.writeTextFile(path, content).catch((err: unknown) => {
          console.error(`Failed to write ${path}:`, err);
        });
      }, debounceMs);
    },
    [path, projectContext, debounceMs, setFileContent],
  );

  return {
    data: entry?.data ?? null,
    isLoading: entry?.isLoading ?? false,
    error: entry?.error ?? null,
    update,
  };
}
