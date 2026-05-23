import { memo } from "react";
import { ModHjsonPanel } from "./panel/ModHjsonPanel";

interface EditorRightPanelProps {
	path: string | null;
}

export const EditorRightPanel = memo(function EditorRightPanel({ path }: EditorRightPanelProps) {
	if (path === null) {
		return null;
	}

	if (path === "mod.hjson") {
		return <ModHjsonPanel path={path} />;
	}

	if (path.startsWith("content")) {
		return null;
	}
});
