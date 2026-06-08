import { useEffect } from "react";
import { useProjectSession, useCurrentProject } from "@project/core";
import { usePath } from "#/hooks/use-path";

export function useRecentFileRecorder() {
	const [path] = usePath();
	const context = useCurrentProject();

	useEffect(() => {
		if (!path) return;
		const state = useProjectSession.getState();
		if (state.projectContext && state.treeSnapshot.contains(path)) {
			state.recordFileAccess(context.project.id, path);
		}
	}, [path, context.project.id]);
}
