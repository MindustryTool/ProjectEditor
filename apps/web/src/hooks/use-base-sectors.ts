import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@project/api";

export function useBaseSectors() {
	return useQuery({
		queryKey: ["sectors"],
		queryFn: () => apiClient.getSectors().then((res) => res.filter((i) => i.mod === null)),
	});
}
