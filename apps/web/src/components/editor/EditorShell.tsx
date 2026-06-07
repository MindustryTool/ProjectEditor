import { useIsDesktop } from "~/hooks/use-is-desktop";
import { ProjectMenu } from "./toolbar/ProjectMenu";
import { EditMenu } from "./toolbar/EditMenu";
import { ViewMenu } from "./toolbar/ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./toolbar/LocalizationMenu";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { SplitView, SplitViewLeft, SplitViewCenter, SplitViewRight } from "~/components/ui/SplitView";
import { StatusBarLeft } from "./statusbar/StatusBarLeft";
import { StatusBarCenter } from "./statusbar/StatusBarCenter";
import { StatusBarRight } from "./statusbar/StatusBarRight";
import { ValidationProvider } from "#/components/editor/ValidationProvider";
import { Fragment } from "react/jsx-runtime";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { ProjectProvider } from "#/components/editor/ProjectProvider";
import { lazy } from "react";
import { EditorLeftPanel } from "./EditorLeftPanel";
import { EditorCenterPanel } from "./EditorCenterPanel";
import { EditorRightPanel } from "./EditorRightPanel";
import { FileExplorerProvider } from "./file-explorer/FileExplorerProvider";
import { useAppStore } from "@project/core";

const EditorMobileLayout = lazy(() =>
	import("#/components/editor/EditorMobileLayout").then((mod) => ({ default: mod.EditorMobileLayout })),
);

export function EditorShell() {
	const [isDesktop] = useIsDesktop();
	const padding = useAppStore((state) => state.settings.padding);

	return (
		<ProjectProvider>
			<ValidationProvider>
				<FileExplorerProvider>
					<ErrorBoundary>
						<div
							className="flex min-h-0 flex-1 flex-col bg-background text-foreground overflow-hidden w-full h-dvh max-h-dvh"
							style={{ padding }}
						>
							{isDesktop ? (
								<Fragment>
									<Toolbar>
										<ProjectMenu />
										<EditMenu />
										<ViewMenu />
										<ExportMenu />
										<LocalizationMenu />
									</Toolbar>
									<SplitView defaultLeftWidth={260} defaultRightWidth={360} minPanelWidth={300}>
										<SplitViewLeft>
											<ErrorBoundary>
												<EditorLeftPanel />
											</ErrorBoundary>
										</SplitViewLeft>
										<SplitViewCenter>
											<ErrorBoundary>
												<EditorCenterPanel />
											</ErrorBoundary>
										</SplitViewCenter>
										<SplitViewRight>
											<ErrorBoundary>
												<EditorRightPanel />
											</ErrorBoundary>
										</SplitViewRight>
									</SplitView>
									<StatusBar left={<StatusBarLeft />} center={<StatusBarCenter />} right={<StatusBarRight />} />
								</Fragment>
							) : (
								<EditorMobileLayout />
							)}
						</div>
					</ErrorBoundary>
				</FileExplorerProvider>
			</ValidationProvider>
		</ProjectProvider>
	);
}
