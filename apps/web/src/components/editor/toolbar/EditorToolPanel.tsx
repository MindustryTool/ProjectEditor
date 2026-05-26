import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Panel } from "../Panel";
import { FileExplorer } from "../left/FileExplorer";

export const EditorToolPanel = memo(function EditorToolPanel() {
	const { t } = useTranslation();
	return (
		<Panel className="p-0" header={t("editor.explorer")}>
			<FileExplorer />
		</Panel>
	);
});
