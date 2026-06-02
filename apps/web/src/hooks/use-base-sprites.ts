import { useQuery } from "@tanstack/react-query";

export function useBaseSprites() {
	return useQuery({
		queryKey: ["sprites"],
        // TODO: Api mpl
		queryFn: () => [] as { name: string }[],
	});
}
