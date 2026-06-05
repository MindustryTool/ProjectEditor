import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { ProjectMenu } from "./toolbar/ProjectMenu";
import { EditMenu } from "./toolbar/EditMenu";
import { ViewMenu } from "./toolbar/ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./toolbar/LocalizationMenu";
import { StatusBarLeft } from "./statusbar/StatusBarLeft";
import { StatusBarCenter } from "./statusbar/StatusBarCenter";
import { StatusBarRight } from "./statusbar/StatusBarRight";
import { EditorCenterPanel } from "./EditorCenterPanel";
import { EditorRightPanel } from "./EditorRightPanel";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Panel } from "#/components/editor/Panel";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FileExplorer } from "#/components/editor/file-explorer";

interface EditorMobileLayoutProps {
	path: string | null;
}

export function EditorMobileLayout({ path }: EditorMobileLayoutProps) {
	const { t } = useTranslation();
	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<Fragment>
			<Toolbar>
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger asChild>
						<button className="flex text-nowrap items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent">
							{t("editor.files")}
							<ChevronDown className="h-3 w-3 text-muted-foreground" />
						</button>
					</SheetTrigger>
					<SheetContent side="left" showCloseButton={false} className="w-4/5 sm:max-w-sm max-h-dvh">
						<Panel>
							<FileExplorer />
						</Panel>
					</SheetContent>
				</Sheet>
				<ProjectMenu />
				<EditMenu />
				<ViewMenu />
				<ExportMenu />
				<LocalizationMenu />
			</Toolbar>
			<Tabs defaultValue="center" className="flex min-h-0 flex-1 overflow-hidden w-full">
				<TabsContent value="center" className="flex flex-1 overflow-hidden bg-background w-full">
					{/* Those 2 divs are required for monaco to work, idk why but it work */}
					<div className="flex min-h-0 flex-1 overflow-hidden w-full">
						<div className="flex flex-1 overflow-hidden bg-background w-full">
							<ErrorBoundary>
								<EditorCenterPanel path={path} />
							</ErrorBoundary>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="right" className="flex flex-1 overflow-hidden bg-background w-full h-full">
					{/* Same to above */}
					<div className="flex min-h-0 flex-1 overflow-hidden w-full">
						<div className="flex flex-1 overflow-hidden bg-background w-full">
							{path && (
								<ErrorBoundary>
									<EditorRightPanel path={path} />
								</ErrorBoundary>
							)}
						</div>
					</div>
				</TabsContent>
				<TabsList className="w-full justify-around rounded-none border-t bg-muted shrink-0">
					<TabsTrigger value="center" className="flex-1">
						{t("editor.editor")}
					</TabsTrigger>
					<TabsTrigger value="right" className="flex-1">
						{t("editor.properties")}
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<StatusBar left={<StatusBarLeft />} center={<StatusBarCenter />} right={<StatusBarRight />} />
		</Fragment>
	);
}
