import { apiClient } from "@project/api";
import { useQuery } from "@tanstack/react-query";
import type { Effect } from "@project/api";

export function useEffects(): Effect[]{
	const data = useQuery({
		queryKey: ["effects"],
		queryFn: () => apiClient.getEffects(),
	});

	return data.data || [];
}
