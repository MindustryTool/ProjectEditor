import { apiClient } from "@project/api";
import { useQuery } from "@tanstack/react-query";
import type { Effect } from "@project/api";
import type { ModHjsonData } from "@project/schema";

export function useEffects(_metadata: ModHjsonData): Effect[]{
	const data = useQuery({
		queryKey: ["effects"],
		queryFn: () => apiClient.getEffects(),
	});

	return data.data || [];
}
