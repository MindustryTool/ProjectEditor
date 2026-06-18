import { useIsDesktop } from "#/hooks/use-is-desktop";
import { NavigationGuardDialog } from "./NavigationGuardDialog";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "#/components/ui/resizable";
import { StatusBarLeft } from "./statusbar/StatusBarLeft";
import { StatusBarCenter } from "./statusbar/StatusBarCenter";
import { StatusBarRight } from "./statusbar/StatusBarRight";
import { ValidationProvider } from "#/components/editor/ValidationProvider";
import { Fragment } from "react/jsx-runtime";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { ProjectProvider } from "#/components/editor/ProjectProvider";
import { lazy, memo, Suspense, useState } from "react";
import { FileExplorerProvider } from "./file-explorer/FileExplorerProvider";
import { useAppStore, useProjectSession, isBundleFilename, type PathEntry } from "@project/core";
import { FileExplorer } from "#/components/editor/file-explorer";
import { Spinner } from "#/components/ui/spinner";
import { usePath } from "#/hooks/use-path";
import { RecentlyOpenedFilesBar } from "./recently-opened/RecentlyOpenedFilesBar";
import { TextEditor } from "./TextEditor";
import { BundleContent } from "./bundle/BundleContent";
import { NoOpenedFileScreen } from "./NoOpenedFileScreen";
import { ChevronDown, MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetTrigger } from "#/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { SchematicMapPreview } from "#/components/editor/SchematicMapPreview";
import { Button } from "#/components/ui/button";
import { EditorMenuList } from "./toolbar/EditorMenuList";
import { Separator } from "#/components/ui/separator";
import { ExportMenu } from "#/components/editor/toolbar/ExportMenu";

const PixelEditor = lazy(() => import("./pixel-editor/PixelEditor").then((m) => ({ default: m.PixelEditor })));
const ModHjsonPanel = lazy(() => import("./right/ModHjsonPanel").then((m) => ({ default: m.ModHjsonPanel })));
const ItemPanel = lazy(() => import("./right/ItemPanel").then((m) => ({ default: m.ItemPanel })));
const LiquidPanel = lazy(() => import("./right/LiquidPanel").then((m) => ({ default: m.LiquidPanel })));
const SectorPanel = lazy(() => import("./right/SectorPanel").then((m) => ({ default: m.SectorPanel })));
const StatusPanel = lazy(() => import("./right/StatusPanel").then((m) => ({ default: m.StatusPanel })));
const UnitPanel = lazy(() => import("./right/UnitPanel").then((m) => ({ default: m.UnitPanel })));
const BlockPanel = lazy(() => import("./right/BlockPanel").then((m) => ({ default: m.BlockPanel })));
const UnitPositionEditor = lazy(() =>
	import("#/components/editor/position-editor/UnitPositionEditor").then((mod) => ({ default: mod.UnitPositionEditor })),
);

type EditorRoute =
	| { type: "empty" }
	| { type: "bundle"; path: string }
	| { type: "mod"; path: string }
	| { type: "image"; path: string }
	| { type: "sprite"; path: string }
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

function matchEditorRoute(entry: PathEntry | null, treeEntry: { kind: string } | undefined): EditorRoute {
	if (entry === null || treeEntry === undefined) return { type: "empty" };

	if (entry.type === "sprite") {
		return { type: "sprite", path: entry.path };
	}

	const path = entry.path;

	if (path.startsWith("bundles/") && isBundleFilename(path.split("/").pop() ?? "")) {
		return { type: "bundle", path };
	}

	if (path === "mod.hjson" || (path.startsWith("content") && path.endsWith(".json"))) {
		return { type: "mod", path };
	}

	if (path.endsWith(".png")) {
		return { type: "image", path };
	}

	if (path.endsWith(".msav")) {
		return { type: "msav", path };
	}

	if (path.endsWith(".msch")) {
		return { type: "msch", path };
	}

	return { type: "text", path };
}

function matchPropertiesRoute(entry: PathEntry | null): PropertiesRoute {
	if (entry === null) return { type: "none" };

	if (entry.type === "sprite") return { type: "none" };

	const path = entry.path;

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

function EditorContent({ entry }: { entry: PathEntry }) {
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const treeEntry = treeSnapshot.getEntry(entry.path);
	const route = matchEditorRoute(entry, treeEntry);

	switch (route.type) {
		case "empty":
			return <div className="flex h-full w-full items-center justify-center font-semibold">Nothing here</div>;
		case "bundle":
			return <BundleContent path={route.path} />;
		case "mod":
			return <TextEditor path={route.path} />;
		case "image":
			return (
				<Suspense
					fallback={
						<div className="flex h-full w-full items-center justify-center">
							<Spinner />
						</div>
					}
				>
					<PixelEditor path={route.path} />
				</Suspense>
			);
		case "sprite":
			return <UnitPositionEditor striped={route.path} />;
		case "msav":
			return <SchematicMapPreview path={route.path} type="map" />;
		case "msch":
			return <SchematicMapPreview path={route.path} type="schematic" />;
		case "text":
			return <TextEditor path={route.path} />;
	}
}

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
	const [entry] = usePath();
	const propertiesRoute = entry ? matchPropertiesRoute(entry) : { type: "none" as const };

	return (
		<>
			<ResizablePanel defaultSize="70%" minSize="30%">
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden h-full p-1 gap-1">
					<RecentlyOpenedFilesBar />
					<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
						<ErrorBoundary>
							<Suspense>{entry ? <EditorContent entry={entry} /> : <NoOpenedFileScreen />}</Suspense>
						</ErrorBoundary>
					</div>
				</div>
			</ResizablePanel>
			{propertiesRoute.type !== "none" && (
				<>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="30%" minSize="20%">
						<div className="h-full overflow-hidden bg-card flex flex-col">
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
				<EditorMenuList />
			</Toolbar>
			<ResizablePanelGroup orientation="horizontal" className="flex min-h-0 flex-1">
				<ResizablePanel defaultSize="30%" minSize="20%">
					<ErrorBoundary>
						<Suspense>
							<FileExplorer />
						</Suspense>
					</ErrorBoundary>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<EditorPanels />
			</ResizablePanelGroup>
			<Suspense>
				<StatusBar left={<StatusBarLeft />} center={<StatusBarCenter />} right={<StatusBarRight />} />
			</Suspense>
		</Fragment>
	);
}

function EditorMobileLayout() {
	const { t } = useTranslation();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [entry] = usePath();
	const propertiesRoute = entry ? matchPropertiesRoute(entry) : { type: "none" as const };
	const tab = useProjectSession((s) => s.selectedTab);
	const setTab = useProjectSession((s) => s.setSelectedTab);

	return (
		<Fragment>
			<Toolbar>
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost">
							<MenuIcon className="size-4" />
							{t("editor.menu")}
						</Button>
					</SheetTrigger>
					<SheetContent side="bottom" className="h-[320px] p-0 gap-0 overflow-hidden" showCloseButton={false}>
						<EditorMenuList onClose={() => setSheetOpen(false)} />
					</SheetContent>
				</Sheet>
				<ExportMenu>
					<ChevronDown className="size-4" />
				</ExportMenu>
			</Toolbar>
			<Tabs
				value={tab}
				onValueChange={(v) => setTab(v as "editor" | "file" | "property")}
				className="flex min-h-0 flex-1 overflow-hidden w-full gap-0"
			>
				<TabsContent value="file" className="flex flex-1 overflow-hidden bg-background w-full">
					<div className="flex min-h-0 flex-1 overflow-hidden w-full">
						<div className="flex flex-col flex-1 overflow-hidden bg-background w-full gap-1">
							<ErrorBoundary>
								<Suspense>
									<FileExplorer />
								</Suspense>
							</ErrorBoundary>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="editor" className="flex flex-1 overflow-hidden bg-background w-full">
					<div className="flex min-h-0 flex-1 overflow-hidden w-full">
						<div className="flex flex-col flex-1 overflow-hidden bg-background w-full gap-1">
							<ErrorBoundary>
								<Suspense>
									<RecentlyOpenedFilesBar />
									{entry ? <EditorContent entry={entry} /> : <NoOpenedFileScreen />}
								</Suspense>
							</ErrorBoundary>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="property" className="flex flex-1 overflow-hidden bg-background w-full h-full">
					<div className="flex min-h-0 flex-1 overflow-hidden w-full">
						<div className="flex flex-1 overflow-hidden bg-background w-full flex-col">
							<ErrorBoundary>
								<Suspense>
									<PropertiesPanel route={propertiesRoute} />
								</Suspense>
							</ErrorBoundary>
						</div>
					</div>
				</TabsContent>
				<TabsList className="w-full justify-around rounded-none border-t bg-card shrink-0 min-h-10 max-h-10 mt-auto p-0">
					<TabsTrigger value="file" className="flex-1 px-2 h-full border-none rounded-none text-sm">
						{t("editor.files")}
					</TabsTrigger>
					<Separator orientation="vertical" />
					<TabsTrigger value="editor" className="flex-1 px-2 h-full border-none rounded-none text-sm">
						{t("editor.editor")}
					</TabsTrigger>
					<Separator orientation="vertical" />
					<TabsTrigger value="property" className="flex-1 px-2 h-full border-none rounded-none text-sm">
						{t("editor.properties")}
					</TabsTrigger>
				</TabsList>
			</Tabs>
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
				<div
					className="flex min-h-0 flex-1 flex-col bg-background text-foreground overflow-hidden w-full h-dvh max-h-dvh"
					style={{ padding }}
				>
					{isDesktop ? <EditorDesktopLayout /> : <EditorMobileLayout />}
				</div>
			</FileExplorerProvider>
		</ProjectProvider>
	);
}
