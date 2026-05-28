import { memo, useState } from "react";
import { FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { ProjectMenu } from "./toolbar/ProjectMenu";
import { ViewMenu } from "./toolbar/ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./toolbar/LocalizationMenu";
import { StatusBarLeft } from "./statusbar/StatusBarLeft";
import { StatusBarCenter } from "./statusbar/StatusBarCenter";
import { StatusBarRight } from "./statusbar/StatusBarRight";
import { EditorCenterPanel } from "./EditorCenterPanel";
import { EditorRightPanel } from "./EditorRightPanel";
import { FileExplorer } from "./left/FileExplorer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";

interface EditorMobileLayoutProps {
	path: string | null;
}

export const EditorMobileLayout = memo(function EditorMobileLayout({ path }: EditorMobileLayoutProps) {
	const { t } = useTranslation();
	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-background text-foreground overflow-hidden h-dvh max-h-dvh">
			<Toolbar>
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon-sm" className="shrink-0">
							<FolderOpen className="size-4" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" showCloseButton={false} className="w-4/5 sm:max-w-sm">
						<SheetHeader>
							<SheetTitle>{t("editor.explorer")}</SheetTitle>
						</SheetHeader>
						<FileExplorer />
					</SheetContent>
				</Sheet>
				<ProjectMenu />
				<ViewMenu />
				<ExportMenu />
				<LocalizationMenu />
			</Toolbar>
			<Tabs defaultValue="center" className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<TabsContent value="center" className="flex flex-col h-full w-full overflow-hidden">
					<EditorCenterPanel path={path} />
				</TabsContent>
				<TabsContent value="right" className="flex flex-col h-full w-full overflow-hidden">
					{path ? (
						<EditorRightPanel path={path} />
					) : (
						<div className="flex h-full items-center justify-center text-xs text-muted-foreground">
							{t("editor.propertiesPlaceholder")}
						</div>
					)}
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
		</div>
	);
});
