import { memo } from "react";
import { ProjectMenu } from "./toolbar/ProjectMenu";
import { ViewMenu } from "./toolbar/ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./toolbar/LocalizationMenu";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { SplitView } from "./SplitView";
import { EditorLeftPanel } from "./EditorLeftPanel";
import { EditorCenterPanel } from "./EditorCenterPanel";
import { EditorRightPanel } from "./EditorRightPanel";
import { StatusBarLeft } from "./statusbar/StatusBarLeft";
import { StatusBarCenter } from "./statusbar/StatusBarCenter";
import { StatusBarRight } from "./statusbar/StatusBarRight";

interface EditorShellProps {
	path: string | null;
}

export const EditorShell = memo(function EditorShell({ path }: EditorShellProps) {
	return (
		<div className="flex min-h-0 flex-1 flex-col bg-background text-foreground overflow-hidden h-dvh max-h-dvh">
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
				left={<EditorLeftPanel />}
				center={<EditorCenterPanel path={path} />}
				right={<EditorRightPanel path={path} />}
			/>

			<StatusBar left={<StatusBarLeft />} center={<StatusBarCenter />} right={<StatusBarRight />} />
		</div>
	);
});
