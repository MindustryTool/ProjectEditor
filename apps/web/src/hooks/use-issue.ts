import { useValidationStore } from "@project/state";
import { useMemo } from "react";

export function useIssues() {
	const results = useValidationStore((s) => s.results);

	return useMemo(() => results.getRollup(), [results]);
}
