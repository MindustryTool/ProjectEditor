import { memo } from "react";
import { ModHjsonPanel } from "./panel/ModHjsonPanel";
import { ItemPanel } from "#/components/editor/panel/ItemPanel";
import { LiquidPanel } from "#/components/editor/panel/LiquidPanel";
import { SectorPanel } from "#/components/editor/panel/SectorPanel";
import { StatusPanel } from "#/components/editor/panel/StatusPanel";

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

	if (path.startsWith("content/liquids") && path.endsWith(".json")) {
		return <LiquidPanel path={path} />;
	}

	if (path.startsWith("content/sectors") && path.endsWith(".json")) {
		return <SectorPanel path={path} />;
	}

	if (path.startsWith("content/status") && path.endsWith(".json")) {
		return <StatusPanel path={path} />;
	}

	if (path.startsWith("content")) {
		return null;
	}
});
