import { useQuery } from "@tanstack/react-query";
import { apiClient, type Sound } from "@project/api";

export function useBaseSounds() {
	return useQuery<Sound[]>({
		queryKey: ["sounds"],
		queryFn: () => apiClient.getSounds(),
	});
}
