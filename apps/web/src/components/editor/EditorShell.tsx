import { useIsDesktop } from "~/hooks/use-is-desktop";
import { NavigationGuardDialog } from "./NavigationGuardDialog";
import { ProjectMenu } from "./toolbar/ProjectMenu";
import { EditMenu } from "./toolbar/EditMenu";
import { ViewMenu } from "./toolbar/ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./toolbar/LocalizationMenu";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "~/components/ui/resizable";
import { StatusBarLeft } from "./statusbar/StatusBarLeft";
import { StatusBarCenter } from "./statusbar/StatusBarCenter";
import { StatusBarRight } from "./statusbar/StatusBarRight";
import { ValidationProvider } from "#/components/editor/ValidationProvider";
import { Fragment } from "react/jsx-runtime";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { ProjectProvider } from "#/components/editor/ProjectProvider";
import { lazy, memo, Suspense, useState } from "react";
import { FileExplorerProvider } from "./file-explorer/FileExplorerProvider";
import { useAppStore, useProjectSession, isBundleFilename } from "@project/core";
import { Panel } from "./Panel";
import { FileExplorer } from "#/components/editor/file-explorer";
import { Spinner } from "#/components/ui/spinner";
import { usePath } from "#/hooks/use-path";
import { RecentlyOpenedFilesBar } from "./recently-opened/RecentlyOpenedFilesBar";
import { TextEditor } from "./TextEditor";
import { BundleContent } from "./bundle/BundleContent";
import { ImageWithSize } from "./ImageWithSize";
import { NoOpenedFileScreen } from "./NoOpenedFileScreen";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SchematicMapPreview } from "#/components/editor/SchematicMapPreview";

const ModHjsonPanel = lazy(() => import("./right/ModHjsonPanel").then((m) => ({ default: m.ModHjsonPanel })));
const ItemPanel = lazy(() => import("./right/ItemPanel").then((m) => ({ default: m.ItemPanel })));
const LiquidPanel = lazy(() => import("./right/LiquidPanel").then((m) => ({ default: m.LiquidPanel })));
const SectorPanel = lazy(() => import("./right/SectorPanel").then((m) => ({ default: m.SectorPanel })));
const StatusPanel = lazy(() => import("./right/StatusPanel").then((m) => ({ default: m.StatusPanel })));
const UnitPanel = lazy(() => import("./right/UnitPanel").then((m) => ({ default: m.UnitPanel })));
const BlockPanel = lazy(() => import("./right/BlockPanel").then((m) => ({ default: m.BlockPanel })));
const UnitSpriteEditor = lazy(() => import("#/components/editor/sprite/UnitSpritEdior").then((mod) => ({ default: mod.UnitSpriteEditor })));

type EditorRoute =
	| { type: "empty" }
	| { type: "bundle"; path: string }
	| { type: "mod"; path: string }
	| { type: "image"; path: string }
	| { type: "sprite"; path: string; striped: string }
	| { type: "text"; path: string }
	| { type: "msav"; path: string }
	| { type: "msch"; path: string };

type PropertiesRoute =
	| { type: "none" }
	| { type: "mod"; path: string }
	| { type: "item"; path: string }
	| { type: "liquid"; path: string }
	| { type: "sector"; path: string }
	| { type: "status"; path: string }
	| { type: "unit"; path: string }
	| { type: "block"; path: string };

function matchEditorRoute(path: string | null, entry: { kind: string } | undefined): EditorRoute {
	if (path === null || entry === undefined) return { type: "empty" };

	path = path.toLowerCase();

	if (path.startsWith("bundles/") && isBundleFilename(path.split("/").pop() ?? "")) {
		return { type: "bundle", path };
	}

	if (path === "mod.hjson" || (path.startsWith("content") && path.endsWith(".json"))) {
		return { type: "mod", path };
	}

	if (path.endsWith(".png")) {
		return { type: "image", path };
	}

	if (path.startsWith("sprite:")) {
		return { type: "sprite", path, striped: path.replace("sprite:", "") };
	}

    if (path.endsWith(".msav")) {
        return { type: "msav", path };
    }

    if (path.endsWith(".msch")) {
        return { type: "msch", path };
    }

	if ([".json", ".hjson", ".md", ".txt"].some((k) => path.endsWith(k))) {
		return { type: "text", path };
	}

	return { type: "empty" };
}

function matchPropertiesRoute(path: string | null): PropertiesRoute {
	if (path === null) return { type: "none" };

    path = path.toLowerCase();

	if (path.startsWith("sprite:")) return { type: "none" };

	if (path === "mod.hjson" || path === "mod.json") {
		return { type: "mod", path };
	}

	if (path.startsWith("content/items") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return { type: "item", path };
	}

	if (path.startsWith("content/liquids") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return { type: "liquid", path };
	}

	if (path.startsWith("content/sectors") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return { type: "sector", path };
	}

	if (path.startsWith("content/status") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return { type: "status", path };
	}

	if (path.startsWith("content/units") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return { type: "unit", path };
	}

	if (path.startsWith("content/blocks") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return { type: "block", path };
	}

	if (path.startsWith("content")) {
		return { type: "none" };
	}

	return { type: "none" };
}

function EditorContent({ path }: { path: string }) {
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const striped = path.replace("sprite:", "");
	const entry = treeSnapshot.getEntry(striped);
	const route = matchEditorRoute(path, entry);

	switch (route.type) {
		case "empty":
			return <div className="flex h-full w-full items-center justify-center font-semibold">Nothing here</div>;
		case "bundle":
			return <BundleContent path={route.path} />;
		case "mod":
			return <TextEditor path={route.path} />;
		case "image":
			return <ImageWithSize path={route.path} />;
		case "sprite":
			return <UnitSpriteEditor striped={route.striped} />;
        case "msav":
            return <SchematicMapPreview path={route.path} type="map" />;
        case "msch":
            return <SchematicMapPreview path={route.path} type="schematic" />;
		case "text":
			return <TextEditor path={route.path} />;
	}
}

const EditorLeftPanel = memo(function EditorLeftPanel() {
	return (
		<Panel>
			<FileExplorer />
		</Panel>
	);
});

const panelFallback = (
	<div className="flex h-full w-full items-center justify-center">
		<Spinner />
	</div>
);

function PropertiesPanel({ route }: { route: PropertiesRoute }) {
	switch (route.type) {
		case "none":
			return <div className="flex h-full w-full items-center justify-center font-semibold">No properties</div>;

		case "mod":
			return (
				<Suspense fallback={panelFallback}>
					<ModHjsonPanel path={route.path} />
				</Suspense>
			);
		case "item":
			return (
				<Suspense fallback={panelFallback}>
					<ItemPanel path={route.path} />
				</Suspense>
			);
		case "liquid":
			return (
				<Suspense fallback={panelFallback}>
					<LiquidPanel path={route.path} />
				</Suspense>
			);
		case "sector":
			return (
				<Suspense fallback={panelFallback}>
					<SectorPanel path={route.path} />
				</Suspense>
			);
		case "status":
			return (
				<Suspense fallback={panelFallback}>
					<StatusPanel path={route.path} />
				</Suspense>
			);
		case "unit":
			return (
				<Suspense fallback={panelFallback}>
					<UnitPanel path={route.path} />
				</Suspense>
			);
		case "block":
			return (
				<Suspense fallback={panelFallback}>
					<BlockPanel path={route.path} />
				</Suspense>
			);
	}
}

const EditorPanels = memo(function EditorPanels() {
	const [path] = usePath();
	const propertiesRoute = path ? matchPropertiesRoute(path) : { type: "none" as const };

	return (
		<>
			<ResizablePanel defaultSize="70%" minSize="30%">
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden h-full p-1 gap-1">
					<RecentlyOpenedFilesBar />
					<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
						<Suspense>{path ? <EditorContent path={path} /> : <NoOpenedFileScreen />}</Suspense>
					</div>
				</div>
			</ResizablePanel>
			{propertiesRoute.type !== "none" && (
				<>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="30%" minSize="20%">
						<div className="h-full overflow-y-auto bg-card">
							<Suspense>
								<PropertiesPanel route={propertiesRoute} />
							</Suspense>
						</div>
					</ResizablePanel>
				</>
			)}
		</>
	);
});

function EditorDesktopLayout() {
	return (
		<Fragment>
			<Toolbar>
				<ProjectMenu />
				<EditMenu />
				<ViewMenu />
				<ExportMenu />
				<LocalizationMenu />
			</Toolbar>
			<ResizablePanelGroup orientation="horizontal" className="flex min-h-0 flex-1">
				<ResizablePanel defaultSize="30%" minSize="20%">
					<ErrorBoundary>
						<EditorLeftPanel />
					</ErrorBoundary>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<EditorPanels />
			</ResizablePanelGroup>
			<StatusBar left={<StatusBarLeft />} center={<StatusBarCenter />} right={<StatusBarRight />} />
		</Fragment>
	);
}

function EditorMobileLayout() {
	const { t } = useTranslation();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [path] = usePath();
	const propertiesRoute = path ? matchPropertiesRoute(path) : { type: "none" as const };

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
			<Tabs defaultValue="right" className="flex min-h-0 flex-1 overflow-hidden w-full">
				<TabsContent value="center" className="flex flex-1 overflow-hidden bg-background w-full p-1">
					<div className="flex min-h-0 flex-1 overflow-hidden w-full">
						<div className="flex flex-col flex-1 overflow-hidden bg-background w-full gap-1">
							<ErrorBoundary>
								<Suspense>
									<RecentlyOpenedFilesBar />
									{path ? <EditorContent path={path} /> : <NoOpenedFileScreen />}
								</Suspense>
							</ErrorBoundary>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="right" className="flex flex-1 overflow-hidden bg-background w-full h-full p-1">
					<div className="flex min-h-0 flex-1 overflow-hidden w-full">
						<div className="flex flex-1 overflow-hidden bg-background w-full">
							<ErrorBoundary>
								<Suspense>
									<PropertiesPanel route={propertiesRoute} />
								</Suspense>
							</ErrorBoundary>
						</div>
					</div>
				</TabsContent>
				<TabsList className="w-full justify-around rounded-none border-t bg-card shrink-0 min-h-10 max-h-10">
					<TabsTrigger value="right" className="flex-1">
						{t("editor.properties")}
					</TabsTrigger>
					<TabsTrigger value="center" className="flex-1">
						{t("editor.editor")}
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<StatusBar left={<StatusBarLeft />} center={<StatusBarCenter />} right={<StatusBarRight />} />
		</Fragment>
	);
}

export function EditorShell() {
	const [isDesktop] = useIsDesktop();
	const padding = useAppStore((state) => state.settings.padding);
	const projectId = useProjectSession((s) => s.projectContext?.project.id ?? null);

	return (
		<ProjectProvider>
			<ValidationProvider />
			<NavigationGuardDialog projectId={projectId} />
			<FileExplorerProvider>
				<ErrorBoundary>
					<div
						className="flex min-h-0 flex-1 flex-col bg-background text-foreground overflow-hidden w-full h-dvh max-h-dvh"
						style={{ padding }}
					>
						{isDesktop ? <EditorDesktopLayout /> : <EditorMobileLayout />}
					</div>
				</ErrorBoundary>
			</FileExplorerProvider>
		</ProjectProvider>
	);
}
