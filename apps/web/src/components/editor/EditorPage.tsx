import { useTranslation } from "react-i18next";
import { useQueryState } from "nuqs";
import { ProjectMenu } from "./ProjectMenu";
import { ViewMenu } from "./ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./LocalizationMenu";
import { FileExplorer } from "./FileExplorer";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { SplitView } from "./SplitView";
import { Panel } from "./Panel";
import { ModHjsonPanel } from "./ModHjsonPanel";
import { ProjectPickerScreen } from "./ProjectPickerScreen";
import { FileJson, Image } from "lucide-react";
import { HjsonEditor } from "#/components/editor/HjsonEditor";
import { useCallback, useState, Suspense, lazy } from "react";
import { useProjectStore } from "@project/state";
import { createEventBus, type ProjectInfo, type ProjectEventMap } from "@project/core";
import { createOPFSAdapter } from "@project/fs";
import { saveProject, type ProjectRecord } from "@project/storage";
import { projectTree, type TreeNode } from "./file-explorer-data";

const ProjectPickerDialog = lazy(() =>
  import("./ProjectPickerDialog").then((m) => ({ default: m.ProjectPickerDialog }))
);

export function EditorPage() {
	const { t } = useTranslation();
	const [path] = useQueryState("path");

	const [value, setValue] = useState("");
	const [pickerOpen, setPickerOpen] = useState(false);
	const [pickerMode, setPickerMode] = useState<"create" | "open" | "change">("open");

	const { projectContext } = useProjectStore((state) => state);
	const createNewProject = useProjectStore((state) => state.createNewProject);
	const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
	const closeProject = useProjectStore((state) => state.closeProject);

	const openProjectFromRecord = useCallback(async (record: ProjectRecord) => {
		const project: ProjectInfo = {
			id: record.id,
			name: record.name,
			createdAt: new Date(record.createdAt),
			updatedAt: new Date(record.updatedAt),
		};
		const events = createEventBus<ProjectEventMap>();
		const fs = await createOPFSAdapter();
		setCurrentProject({ project, fs, events });
	}, [setCurrentProject]);

	function handleOpenPicker() {
		setPickerMode("open");
		setPickerOpen(true);
	}

	function handleChangePicker() {
		setPickerMode("change");
		setPickerOpen(true);
	}

	function handleCreatePicker() {
		setPickerMode("create");
		setPickerOpen(true);
	}

	async function handleCreateProject(name: string) {
		await createNewProject(name);
		const ctx = useProjectStore.getState().projectContext;
		if (ctx) {
			await saveProject({
				id: ctx.project.id,
				name: ctx.project.name,
				data: "",
				createdAt: ctx.project.createdAt,
				updatedAt: ctx.project.updatedAt,
			});
		}
	}

	function handleSelectProject(record: ProjectRecord) {
		if (pickerMode === "change") {
			closeProject();
		}
		openProjectFromRecord(record);
	}

	function countFiles(nodes: TreeNode[]): number {
		return nodes.reduce((acc, node) => {
			if (node.type === "file") return acc + 1;
			if (node.children) return acc + countFiles(node.children);
			return acc;
		}, 0);
	}

	const fileCount = countFiles(projectTree);

	function handleCreateAndOpen(name: string) {
		handleCreateProject(name);
	}

	function renderCenter() {
		if (path === "mod.hjson") {
			return <HjsonEditor value={value} onChange={setValue} />;
		}

		return (
			<Panel header={t("editor.editor")}>
				<div className="flex h-full items-center justify-center text-xs text-muted-foreground">{path}</div>
			</Panel>
		);
	}

	function renderRight() {
		if (path === "mod.hjson") {
			return <ModHjsonPanel />;
		}
	}

	function renderLeft() {
		return (
			<Panel header={t("editor.explorer")}>
				<FileExplorer />
			</Panel>
		);
	}

	if (projectContext === null) {
		return (
			<div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
				<ProjectPickerScreen
					onCreateProject={handleCreateAndOpen}
					onOpenProject={handleSelectProject}
				/>
			</div>
		);
	}

	const projectName = projectContext.project.name;

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
			<Toolbar>
				<ProjectMenu
					hasProject={true}
					onCreateProject={handleCreatePicker}
					onOpenProject={handleOpenPicker}
					onChangeProject={handleChangePicker}
					onCloseProject={closeProject}
				/>
				<ViewMenu />
				<ExportMenu />
				<LocalizationMenu />
			</Toolbar>

			<SplitView
				defaultLeftWidth={260}
				defaultRightWidth={360}
				minPanelWidth={300}
				left={renderLeft()}
				center={renderCenter()}
				right={renderRight()}
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
}
