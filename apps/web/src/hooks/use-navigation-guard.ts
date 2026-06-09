import { useCallback } from "react";
import { useBlocker } from "@tanstack/react-router";

export function useNavigationGuard(projectId: string | null) {
	const shouldBlockFn = useCallback(() => {
		return !!projectId && process.env.NODE_ENV !== "development";
	}, [projectId]);

	const blocker = useBlocker({
		shouldBlockFn,
		enableBeforeUnload: shouldBlockFn,
		withResolver: true,
	});

	return blocker;
}
