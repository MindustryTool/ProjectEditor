import { useIsDesktop } from "~/hooks/use-is-desktop";
import { ProjectMenu } from "./toolbar/ProjectMenu";
import { EditMenu } from "./toolbar/EditMenu";
import { ViewMenu } from "./toolbar/ViewMenu";
import { ExportMenu } from "./ExportMenu";
import { LocalizationMenu } from "./toolbar/LocalizationMenu";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { SplitView, SplitViewLeft, SplitViewCenter } from "~/components/ui/SplitView";
import { StatusBarLeft } from "./statusbar/StatusBarLeft";
import { StatusBarCenter } from "./statusbar/StatusBarCenter";
import { StatusBarRight } from "./statusbar/StatusBarRight";
import { ValidationProvider } from "#/components/editor/ValidationProvider";
import { Fragment } from "react/jsx-runtime";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { ProjectProvider } from "#/components/editor/ProjectProvider";
import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from "react";
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
  | { type: "text"; path: string };

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

  if (entry.kind === "file") {
    return { type: "text", path };
  }

  return { type: "empty" };
}

function matchPropertiesRoute(path: string | null): PropertiesRoute {
  if (path === null) return { type: "none" };

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

  if (path.replace("sprite:", "").startsWith("content/units") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
    return { type: "unit", path: path.replace("sprite:", "") };
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
			return null;
		case "bundle":
			return <BundleContent path={route.path} />;
		case "mod":
			return <TextEditor path={route.path} />;
		case "image":
			return <ImageWithSize path={route.path} />;
		case "sprite":
			return <UnitSpriteEditor striped={route.striped} />;
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

function EditorProperties({ path }: { path: string }) {
	const route = matchPropertiesRoute(path);

	switch (route.type) {
		case "none":
			return null;
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
	const containerRef = useRef<HTMLDivElement>(null);
	const [rightWidth, setRightWidth] = useState(360);
	const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

	const startResize = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			dragRef.current = { startX: e.clientX, startWidth: rightWidth };
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";
		},
		[rightWidth],
	);

	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			const drag = dragRef.current;
			if (!drag || !containerRef.current) return;

			const containerRect = containerRef.current.getBoundingClientRect();
			const delta = e.clientX - drag.startX;
			const newWidth = Math.max(300, drag.startWidth - delta);
			const maxWidth = containerRect.width - 300;
			setRightWidth(Math.min(newWidth, maxWidth));
		};

		const onMouseUp = () => {
			dragRef.current = null;
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, []);

	return (
		<div ref={containerRef} className="flex min-h-0 flex-1 overflow-hidden w-full">
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden h-full py-1">
				<RecentlyOpenedFilesBar />
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden">{path ? <EditorContent path={path} /> : <NoOpenedFileScreen />}</div>
			</div>
			{path !== null && (
				<>
					<div
						className="group flex w-1.5 shrink-0 cursor-col-resize items-center justify-center transition-colors hover:bg-accent active:bg-accent bg-background"
						onMouseDown={startResize}
					>
						<div className="h-8 w-0.5 rounded-full bg-card-foreground opacity-0 transition-opacity group-hover:opacity-60" />
					</div>
					<div
						style={{ width: rightWidth, minWidth: 300 }}
						className="shrink-0 border-l bg-card overflow-y-auto"
					>
						<EditorProperties path={path} />
					</div>
				</>
			)}
		</div>
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
			<SplitView defaultLeftWidth={260} minPanelWidth={300}>
				<SplitViewLeft>
					<ErrorBoundary>
						<EditorLeftPanel />
					</ErrorBoundary>
				</SplitViewLeft>
				<SplitViewCenter>
					<ErrorBoundary>
						<EditorPanels />
					</ErrorBoundary>
				</SplitViewCenter>
			</SplitView>
			<StatusBar left={<StatusBarLeft />} center={<StatusBarCenter />} right={<StatusBarRight />} />
		</Fragment>
	);
}

function EditorMobileLayout() {
	const { t } = useTranslation();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [path] = usePath();

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
					<div className="flex min-h-0 flex-1 overflow-hidden w-full">
						<div className="flex flex-col flex-1 overflow-hidden bg-background w-full">
							<ErrorBoundary>
								<RecentlyOpenedFilesBar />
								{path ? <EditorContent path={path} /> : <NoOpenedFileScreen />}
							</ErrorBoundary>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="right" className="flex flex-1 overflow-hidden bg-background w-full h-full">
					<div className="flex min-h-0 flex-1 overflow-hidden w-full">
						<div className="flex flex-1 overflow-hidden bg-background w-full">
							<ErrorBoundary>
								{path && <EditorProperties path={path} />}
							</ErrorBoundary>
						</div>
					</div>
				</TabsContent>
				<TabsList className="w-full justify-around rounded-none border-t bg-card shrink-0">
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

export function EditorShell() {
	const [isDesktop] = useIsDesktop();
	const padding = useAppStore((state) => state.settings.padding);

	return (
		<ProjectProvider>
			<ValidationProvider />
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
