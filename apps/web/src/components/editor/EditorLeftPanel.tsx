import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Panel } from "./Panel";
import { FileExplorer } from "./left/FileExplorer";

export const EditorLeftPanel = memo(function EditorLeftPanel() {
	const { t } = useTranslation();
	return (
		<Panel header={t("editor.explorer")}>
			<FileExplorer />
		</Panel>
	);
});
