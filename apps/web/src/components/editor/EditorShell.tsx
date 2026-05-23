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
import { useFileContent } from "@project/state";

const ProjectPickerDialog = lazy(() => import("./ProjectPickerDialog").then((m) => ({ default: m.ProjectPickerDialog })));
const ProjectSettingsDialog = lazy(() => import("./ProjectSettingsDialog").then((m) => ({ default: m.ProjectSettingsDialog })));

interface EditorShellProps {
	path: string | null;
	projectName: string;
	fileCount: number;
	onCloseProject: () => void;
	onOpenProject: (record: ProjectRecord) => void;
	onCreateProject: (name: string) => void;
}

export const EditorShell = memo(function EditorShell({
	path,
	projectName,
	fileCount,
	onCloseProject,
	onOpenProject,
	onCreateProject,
}: EditorShellProps) {
	const { t } = useTranslation();
	const [pickerOpen, setPickerOpen] = useState(false);
	const [pickerMode, setPickerMode] = useState<"create" | "open" | "change">("open");
	const [settingsOpen, setSettingsOpen] = useState(false);

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

	const handleOpenSettings = useCallback(() => {
		setSettingsOpen(true);
	}, []);

	const handleCreateProject = useCallback(
		(name: string) => {
			onCreateProject(name);
		},
		[onCreateProject],
	);

	const handleSelectProject = useCallback(
		(record: ProjectRecord) => {
			if (pickerMode === "change") {
				onCloseProject();
			}
			onOpenProject(record);
		},
		[pickerMode, onCloseProject, onOpenProject],
	);

	const { data, update } = useFileContent(path || "");

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
			<Toolbar>
				<ProjectMenu
					hasProject={true}
					onCreateProject={handleCreatePicker}
					onOpenProject={handleOpenPicker}
					onChangeProject={handleChangePicker}
					onProjectSettings={handleOpenSettings}
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
				center={<EditorCenterPanel path={path} value={data} onChange={update} />}
				right={<EditorRightPanel path={path} value={data} onChange={update} />}
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

			<Suspense fallback={null}>
				<ProjectSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} onCloseProject={onCloseProject} />
			</Suspense>
		</div>
	);
});
