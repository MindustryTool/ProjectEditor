import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@project/api";

export function useBaseBlocks() {
	return useQuery({
		queryKey: ["blocks"],
		queryFn: () => apiClient.getBlocks().then((res) => res.filter((i) => i.mod === null)),
	});
}
