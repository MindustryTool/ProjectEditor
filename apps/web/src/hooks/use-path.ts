import { useQueryState } from "nuqs";

export function usePath() {
	const result = useQueryState("path", { history: "push",     clearOnDefault: true });

	return result;
}

export function useFileName() {
	const [path] = usePath();

	return path?.split("/").pop() || null;
}
