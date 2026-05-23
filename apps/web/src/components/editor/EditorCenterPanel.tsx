import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Panel } from "./Panel";
import { HjsonEditor } from "#/components/editor/center/HjsonEditor";
import { JsonEditor } from "#/components/editor/center/JsonEditor";
import { ContentList } from "#/components/editor/center/ContentList";

interface EditorCenterPanelProps {
	path: string | null;
}

export const EditorCenterPanel = memo(function EditorCenterPanel({ path }: EditorCenterPanelProps) {
	const { t } = useTranslation();

	if (path === null) {
		return null;
	}

	if (path === "mod.hjson") {
		return <HjsonEditor path={path} />;
	}

	if (path.startsWith("content")) {
		if (path.endsWith(".json")) {
			return <JsonEditor path={path} />;
		} else {
			return <ContentList path={path} />;
		}
	}

	return (
		<Panel header={t("editor.editor")}>
			<div className="flex h-full items-center justify-center text-xs text-muted-foreground">{path}</div>
		</Panel>
	);
});
