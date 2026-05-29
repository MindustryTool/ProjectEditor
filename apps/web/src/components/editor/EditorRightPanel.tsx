import { memo } from "react";
import { ModHjsonPanel } from "./panel/ModHjsonPanel";
import { ItemPanel } from "#/components/editor/panel/ItemPanel";

interface EditorRightPanelProps {
	path: string | null;
}

export const EditorRightPanel = memo(function EditorRightPanel({ path }: EditorRightPanelProps) {
	if (path === null) {
		return null;
	}

	if (path === "mod.hjson" || path === "mod.json") {
		return <ModHjsonPanel path={path} />;
	}

	if (path.startsWith("content/items") && path.endsWith(".json")) {
		return <ItemPanel path={path} />;
	}

	if (path.startsWith("content")) {
		return null;
	}
});
