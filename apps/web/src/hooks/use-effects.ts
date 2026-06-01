import { apiClient } from "@project/api";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Effect } from "../../../../packages/api/src/types";

export function useEffects(): UseQueryResult<NoInfer<Effect[]>, Error> {
	const data = useQuery({
		queryKey: ["effects"],
		queryFn: () => apiClient.getEffects(),
	});

	return data;
}
