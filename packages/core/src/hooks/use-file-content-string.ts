import { useMemo, useCallback } from "react";
import { useFile, type UseFileResult } from "./use-file-content";

export type UseFileStringResult = UseFileResult<string>;

export function useFileString(path: string): { data: string | null; isLoading: boolean; write: (content: string) => void } {
	const result = useFile(path);

	const data = useMemo<string | null>(() => {
		if (result.data === null) {
			return null;
		}

		if (result.data.byteLength === 0) {
			return "";
		}

		return new TextDecoder().decode(result.data);
	}, [result.data]);

	const { write: resultWrite } = result;

	const write = useCallback(
		(content: string) => {
			const encoded = new TextEncoder().encode(content).buffer;
			resultWrite(encoded);
		},
		[resultWrite],
	);

	return {
		data,
		isLoading: result.isLoading,
		write,
	};
}
