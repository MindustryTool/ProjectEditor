import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Panel } from "./Panel";
import { FileExplorer } from "./FileExplorer";

export const EditorToolPanel = memo(function EditorToolPanel() {
  const { t } = useTranslation();
  return (
    <Panel header={t("editor.explorer")}>
      <FileExplorer />
    </Panel>
  );
});
