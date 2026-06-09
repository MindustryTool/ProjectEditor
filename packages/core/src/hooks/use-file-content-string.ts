import { useMemo, useCallback } from "react";
import { useFile, type UseFileResult } from "./use-file-content";
import { useProjectSession } from "#/stores/session";
import { getEntry } from "#/stores/file";

export type UseFileStringResult = UseFileResult<string>;

export function useFileString(path: string): {
	data: string | null;
	isLoading: boolean;
	write: (content: string | ((prev: string | null) => string)) => void;
} {
	const result = useFile(path);
	const projectId = useProjectSession((s) => s.projectContext?.project.id);
	const { write: resultWrite, isLoading } = result;

	const data = useMemo<string | null>(() => {
		if (result.data === null) {
			return null;
		}

		if (result.data.byteLength === 0) {
			return "";
		}

		return new TextDecoder().decode(result.data);
	}, [result.data]);


	const write = useCallback(
		(contentOrUpdater: string | ((prev: string | null) => string)) => {
			let content: string;
			if (typeof contentOrUpdater === "function") {
				const buffer = projectId ? getEntry(projectId, path)?.data : undefined;
				const prev = buffer !== null && buffer !== undefined ? new TextDecoder().decode(buffer) : null;
				content = contentOrUpdater(prev);
			} else {
				content = contentOrUpdater;
			}
			const encoded = new TextEncoder().encode(content).buffer;
			resultWrite(encoded);
		},
		[resultWrite, projectId, path],
	);

	return {
		data,
		isLoading,
		write,
	};
}
