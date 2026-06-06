import { useLocalStorage } from "usehooks-ts";

export function useExpanded() {
	return useLocalStorage<Record<string, boolean>>("file-explorer-expand", {
		"/": true,
	});
}
