import { memo } from "react";
import { ModHjsonPanel } from "./ModHjsonPanel";

interface EditorRightPanelProps {
	path: string | null;
	value: string | null;
	onChange: (value: string) => void;
}

export const EditorRightPanel = memo(function EditorRightPanel({ path, value, onChange }: EditorRightPanelProps) {
	if (path === "mod.hjson") {
		return <ModHjsonPanel value={value} onChange={onChange} />;
	}

	return null;
});
