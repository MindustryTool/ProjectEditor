import { useProjectSession } from "@project/core";

export function usePath(): [string | null, (path: string | null) => void] {
	const selectedPath = useProjectSession((s) => s.selectedPath);
	const setSelectedPath = useProjectSession((s) => s.setSelectedPath);
	return [selectedPath, setSelectedPath];
}

export function useFileName(): string | null {
	const selectedPath = useProjectSession((s) => s.selectedPath);
	return selectedPath?.split("/").pop() || null;
}
