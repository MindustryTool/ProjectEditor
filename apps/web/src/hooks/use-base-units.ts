import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@project/api";

export function useBaseUnits() {
	return useQuery({
		queryKey: ["units"],
		queryFn: () => apiClient.getUnits().then((res) => res.filter((i) => i.mod === null)),
	});
}
