import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Panel } from "./Panel";
import { HjsonEditor } from "#/components/editor/HjsonEditor";

interface EditorCenterPanelProps {
	path: string | null;
	value: string | null;
	onChange: (value: string) => void;
}

export const EditorCenterPanel = memo(function EditorCenterPanel({ path, value, onChange }: EditorCenterPanelProps) {
	const { t } = useTranslation();

	if (path === null) {
		return null;
	}

	if (path === "mod.hjson") {
		return <HjsonEditor value={value} onChange={onChange} />;
	}

	return (
		<Panel header={t("editor.editor")}>
			<div className="flex h-full items-center justify-center text-xs text-muted-foreground">{path}</div>
		</Panel>
	);
});
