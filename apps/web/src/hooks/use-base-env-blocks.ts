import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@project/api";

export function useBaseEnvBlocks() {
	return useQuery({
		queryKey: ["env-blocks"],
		queryFn: () => apiClient.getEnvBlocks().then((res) => res.filter((i) => i.mod === null)),
	});
}
