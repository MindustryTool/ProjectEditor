import { useValidationStore } from "@project/core";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export function useIssues() {
	const results = useValidationStore(useShallow((s) => s.results));

	return useMemo(() => results.getRollup(), [results]);
}
