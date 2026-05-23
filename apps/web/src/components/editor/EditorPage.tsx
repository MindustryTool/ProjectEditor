import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useProjectStore } from "@project/state";
import { getProject } from "@project/storage";
import { NoProjectScreen } from "./NoProjectScreen";
import { EditorShell } from "./EditorShell";
import { useProjectActions } from "./useProjectActions";

export function EditorPage() {
	const [path] = useQueryState("path");

	const projectContext = useProjectStore((state) => state.projectContext);
	const lastProjectId = useProjectStore((state) => state.lastProjectId);
	const { openProjectFromRecord } = useProjectActions();

	useEffect(() => {
		if (projectContext !== null || !lastProjectId) return;
		let cancelled = false;
		(async () => {
			const record = await getProject(lastProjectId);
			if (record && !cancelled) {
				await openProjectFromRecord(record);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [lastProjectId, projectContext, openProjectFromRecord]);

	if (projectContext === null) {
		return <NoProjectScreen />;
	}

	return <EditorShell path={path} />;
}
