import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@project/api";

export function useBaseLiquids() {
	return useQuery({
		queryKey: ["liquids"],
		queryFn: () => apiClient.getLiquids().then((res) => res.filter((i) => i.mod === null)),
	});
}
