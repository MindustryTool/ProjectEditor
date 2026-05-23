import { useTranslation } from "react-i18next";
import { useQueryState } from "nuqs";
import { FilesMenu } from "./FilesMenu";
import { ViewMenu } from "./ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./LocalizationMenu";
import { FileExplorer } from "./FileExplorer";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { SplitView } from "./SplitView";
import { Panel } from "./Panel";
import { ModHjsonPanel } from "./ModHjsonPanel";
import { FileJson, Image } from "lucide-react";
import { HjsonEditor } from "#/components/editor/HjsonEditor";
import { useState } from "react";

export function EditorPage() {
	const { t } = useTranslation();
	const [path] = useQueryState("path");

	const [value, setValue] = useState("");

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

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
			<Toolbar>
				<FilesMenu />
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
						<span>{t("statusBar.project", { name: "My Project" })}</span>
						<span className="text-muted-foreground">|</span>
						<span>{t("statusBar.files", { count: 3 })}</span>
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
		</div>
	);
}
