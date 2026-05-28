import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@project/api";

export function useBaseItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => apiClient.getItems(),
  });
}
