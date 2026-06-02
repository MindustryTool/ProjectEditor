import { useIsDesktop } from "~/hooks/use-is-desktop";
import { ProjectMenu } from "./toolbar/ProjectMenu";
import { EditMenu } from "./toolbar/EditMenu";
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
import { ValidationProvider } from "#/components/editor/ValidationProvider";
import { EditorMobileLayout } from "#/components/editor/EditorMobileLayout";
import { Fragment } from "react/jsx-runtime";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { ProjectProvider } from "#/components/editor/ProjectProvider";

interface EditorShellProps {
	path: string | null;
}

export function EditorShell({ path }: EditorShellProps) {
	const isDesktop = useIsDesktop();

	return (
		<ProjectProvider>
			<ValidationProvider>
				<div className="flex min-h-0 flex-1 flex-col bg-background text-foreground overflow-hidden h-dvh max-h-dvh">
					{isDesktop ? (
						<Fragment>
							<Toolbar>
								<ProjectMenu />
								<EditMenu />
								<ViewMenu />
								<ExportMenu />
								<LocalizationMenu />
							</Toolbar>
							<SplitView
								defaultLeftWidth={260}
								defaultRightWidth={360}
								minPanelWidth={300}
								left={
									<ErrorBoundary>
										<EditorLeftPanel />
									</ErrorBoundary>
								}
								center={
									<ErrorBoundary>
										<EditorCenterPanel path={path} />
									</ErrorBoundary>
								}
								right={
									<ErrorBoundary>
										<EditorRightPanel path={path} />
									</ErrorBoundary>
								}
							/>
							<StatusBar left={<StatusBarLeft />} center={<StatusBarCenter />} right={<StatusBarRight />} />
						</Fragment>
					) : (
						<EditorMobileLayout path={path} />
					)}
				</div>
			</ValidationProvider>
		</ProjectProvider>
	);
}
