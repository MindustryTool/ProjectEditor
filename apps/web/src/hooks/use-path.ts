import { useProjectSession } from "@project/core";
import type { PathEntry } from "@project/core";

export function usePath(): [PathEntry | null, (entry: PathEntry | null) => void] {
	const selectedPath = useProjectSession((s) => s.selectedPath);
	const setSelectedPath = useProjectSession((s) => s.setSelectedPath);
	return [selectedPath, setSelectedPath];
}

export function useFileName(): string | null {
	const selectedPath = useProjectSession((s) => s.selectedPath);
	return selectedPath?.path.split("/").pop() || null;
}
