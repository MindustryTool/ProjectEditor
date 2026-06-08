import { useCallback } from "react";
import { useBlocker } from "@tanstack/react-router";

export function useNavigationGuard(projectId: string | null) {
	const shouldBlockFn = useCallback(() => {
		return !!projectId;
	}, [projectId]);

	const blocker = useBlocker({
		shouldBlockFn,
		enableBeforeUnload: shouldBlockFn,
		withResolver: true,
	});

	return blocker;
}
