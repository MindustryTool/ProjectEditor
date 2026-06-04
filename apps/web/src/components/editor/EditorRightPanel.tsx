import { memo } from "react";
import { ModHjsonPanel } from "./right/ModHjsonPanel";
import { ItemPanel } from "#/components/editor/right/ItemPanel";
import { LiquidPanel } from "#/components/editor/right/LiquidPanel";
import { SectorPanel } from "#/components/editor/right/SectorPanel";
import { StatusPanel } from "#/components/editor/right/StatusPanel";
import { UnitPanel } from "#/components/editor/right/UnitPanel";
import { BlockPanel } from "#/components/editor/right/BlockPanel";

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

	if (path.startsWith("content/units") && path.endsWith(".json")) {
		return <UnitPanel path={path} />;
	}

    if (path.startsWith("content/blocks") && path.endsWith(".json")) {
		return <BlockPanel path={path} />;
	}

	if (path.startsWith("content")) {
		return null;
	}
});
