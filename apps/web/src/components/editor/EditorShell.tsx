import { memo, useCallback, useState, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { type ProjectRecord } from "@project/storage";
import { ProjectMenu } from "./ProjectMenu";
import { ViewMenu } from "./ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./LocalizationMenu";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { SplitView } from "./SplitView";
import { EditorToolPanel } from "./EditorToolPanel";
import { EditorCenterPanel } from "./EditorCenterPanel";
import { EditorRightPanel } from "./EditorRightPanel";
import { FileJson, Image } from "lucide-react";

const ProjectPickerDialog = lazy(() =>
  import("./ProjectPickerDialog").then((m) => ({ default: m.ProjectPickerDialog }))
);

interface EditorShellProps {
  path: string | null;
  value: string;
  onChange: (value: string) => void;
  projectName: string;
  fileCount: number;
  onCloseProject: () => void;
  onOpenProject: (record: ProjectRecord) => void;
  onCreateProject: (name: string) => void;
}

export const EditorShell = memo(function EditorShell({
  path,
  value,
  onChange,
  projectName,
  fileCount,
  onCloseProject,
  onOpenProject,
  onCreateProject,
}: EditorShellProps) {
  const { t } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"create" | "open" | "change">("open");

  const handleOpenPicker = useCallback(() => {
    setPickerMode("open");
    setPickerOpen(true);
  }, []);

  const handleChangePicker = useCallback(() => {
    setPickerMode("change");
    setPickerOpen(true);
  }, []);

  const handleCreatePicker = useCallback(() => {
    setPickerMode("create");
    setPickerOpen(true);
  }, []);

  const handleCreateProject = useCallback((name: string) => {
    onCreateProject(name);
  }, [onCreateProject]);

  const handleSelectProject = useCallback((record: ProjectRecord) => {
    if (pickerMode === "change") {
      onCloseProject();
    }
    onOpenProject(record);
  }, [pickerMode, onCloseProject, onOpenProject]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
      <Toolbar>
        <ProjectMenu
          hasProject={true}
          onCreateProject={handleCreatePicker}
          onOpenProject={handleOpenPicker}
          onChangeProject={handleChangePicker}
          onCloseProject={onCloseProject}
        />
        <ViewMenu />
        <ExportMenu />
        <LocalizationMenu />
      </Toolbar>

      <SplitView
        defaultLeftWidth={260}
        defaultRightWidth={360}
        minPanelWidth={300}
        left={<EditorToolPanel />}
        center={<EditorCenterPanel path={path} value={value} onChange={onChange} />}
        right={<EditorRightPanel path={path} />}
      />

      <StatusBar
        left={
          <>
            <span>{t("statusBar.project", { name: projectName })}</span>
            <span className="text-muted-foreground">|</span>
            <span>{t("statusBar.files", { count: fileCount })}</span>
          </>
        }
        center={<span>{t("statusBar.ready")}</span>}
        right={
          <div className="flex items-center gap-2">
            <FileJson className="h-3 w-3" />
            <Image className="h-3 w-3" />
          </div>
        }
      />

      <Suspense fallback={null}>
        <ProjectPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
          mode={pickerMode}
        />
      </Suspense>
    </div>
  );
});
