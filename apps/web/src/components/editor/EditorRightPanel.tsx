import { memo } from "react";
import { ModHjsonPanel } from "./ModHjsonPanel";

interface EditorRightPanelProps {
  path: string | null;
}

export const EditorRightPanel = memo(function EditorRightPanel({
  path,
}: EditorRightPanelProps) {
  if (path === "mod.hjson") {
    return <ModHjsonPanel />;
  }
  return null;
});
