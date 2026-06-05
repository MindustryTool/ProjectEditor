import { memo } from "react";
import { Panel } from "./Panel";
import { FileExplorer } from "#/components/editor/file-explorer";

export const EditorLeftPanel = memo(function EditorLeftPanel() {
	return (
		<Panel>
			<FileExplorer />
		</Panel>
	);
});
