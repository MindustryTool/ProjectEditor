import { useEffect } from "react";
import { useFileStore, useProjectSession } from "@project/core";

export function useFileEventSubscription(path: string) {
	useEffect(() => {
		if (!path) return;

		const projectContext = useProjectSession.getState().projectContext;
		if (!projectContext) return;

		const projectId = projectContext.project.id;
		const unsub = useFileStore.getState().subscribeToEvents(projectId, path, projectContext.events, projectContext.fs);

		return () => {
			unsub();
			useFileStore.getState().cleanup(projectId, path);
		};
	}, [path]);
}
