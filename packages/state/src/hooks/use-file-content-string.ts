import { useMemo, useCallback } from "react";
import { useFileContent } from "./use-file-content";

export interface UseFileContentStringResult {
  data: string | null;
  currentVersion: number;
  savedVersion: number;
  savedAt: number | null;
  error: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
  isError: boolean;
  write: (content: string) => void;
}

export function useFileContentString(path: string): UseFileContentStringResult {
  const result = useFileContent(path);

  const data = useMemo<string | null>(() => {
    if (result.data === null) return null;
    if (result.data.byteLength === 0) return "";
    return new TextDecoder().decode(result.data);
  }, [result.data]);

  const write = useCallback(
    (content: string) => {
      const encoded = new TextEncoder().encode(content).buffer as ArrayBuffer;
      result.write(encoded);
    },
    [result.write],
  );

  return {
    data,
    currentVersion: result.currentVersion,
    savedVersion: result.savedVersion,
    savedAt: result.savedAt,
    error: result.error,
    isDirty: result.isDirty,
    isSaving: result.isSaving,
    isLoading: result.isLoading,
    isError: result.isError,
    write,
  };
}
