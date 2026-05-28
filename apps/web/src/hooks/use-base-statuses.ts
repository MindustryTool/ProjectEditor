import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@project/api";

export function useBaseStatuses() {
	return useQuery({
		queryKey: ["statuses"],
		queryFn: () => apiClient.getStatuses().then((res) => res.filter((i) => i.mod === null)),
	});
}
