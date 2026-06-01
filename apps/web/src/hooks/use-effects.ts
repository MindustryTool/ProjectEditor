import { apiClient } from "@project/api";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Effect } from "@project/api";

export function useEffects(): UseQueryResult<NoInfer<Effect[]>, Error> {
	const data = useQuery({
		queryKey: ["effects"],
		queryFn: () => apiClient.getEffects(),
	});

	return data;
}
