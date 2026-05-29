import { useMemo, useCallback } from "react";
import { useFile, type UseFileResult } from "./use-file-content";

export interface UseFileStringResult extends UseFileResult<string> {}

export function useFileString(path: string): UseFileStringResult {
	const result = useFile(path);

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
