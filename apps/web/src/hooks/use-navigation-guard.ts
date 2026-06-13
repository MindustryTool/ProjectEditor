import { useCallback } from "react";
import { useBlocker } from "@tanstack/react-router";
import { useFileStore } from "@project/core";

export function useNavigationGuard(projectId: string | null) {
	const shouldBlockFn = useCallback(() => {
		return !!projectId && useFileStore.getState().hasDirtyFiles();
	}, [projectId]);

	const blocker = useBlocker({
		shouldBlockFn,
		enableBeforeUnload: shouldBlockFn,
		withResolver: true,
	});

	return blocker;
}
