import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useProjectStore } from "@project/state";
import { useValidationStore } from "@project/state";
import { ProjectMenu } from "./toolbar/ProjectMenu";
import { ViewMenu } from "./toolbar/ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./toolbar/LocalizationMenu";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { SplitView } from "./SplitView";
import { EditorToolPanel } from "./toolbar/EditorToolPanel";
import { EditorCenterPanel } from "./EditorCenterPanel";
import { EditorRightPanel } from "./EditorRightPanel";
import { FileJson, Image } from "lucide-react";

interface EditorShellProps {
	path: string | null;
}

export const EditorShell = memo(function EditorShell({ path }: EditorShellProps) {
	const { t } = useTranslation();

	const projectName = useProjectStore((state) => state.projectContext?.project.name ?? "");
	const validationSummary = useValidationStore((s) => s.summary);

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
			<Toolbar>
				<ProjectMenu />
				<ViewMenu />
				<ExportMenu />
				<LocalizationMenu />
			</Toolbar>

			<SplitView
				defaultLeftWidth={260}
				defaultRightWidth={360}
				minPanelWidth={300}
				left={<EditorToolPanel />}
				center={<EditorCenterPanel path={path} />}
				right={<EditorRightPanel path={path} />}
			/>

			<StatusBar
				left={
					<>
						<span>{t("statusBar.project", { name: projectName })}</span>
						<span className="text-muted-foreground">|</span>
						<span>{t("statusBar.files", { count: 0 })}</span>
					</>
				}
				center={<span>{t("statusBar.ready")}</span>}
				right={
					<div className="flex items-center gap-2">
						{validationSummary.errors > 0 && (
							<span className="text-red-500">{t("statusBar.validationErrors", { count: validationSummary.errors })}</span>
						)}
						{validationSummary.warnings > 0 && (
							<span className="text-yellow-500">{t("statusBar.validationWarnings", { count: validationSummary.warnings })}</span>
						)}
						<FileJson className="h-3 w-3" />
						<Image className="h-3 w-3" />
					</div>
				}
			/>
		</div>
	);
});
