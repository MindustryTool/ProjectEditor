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

const ModHjsonPanel = lazy(() => import("./right/ModHjsonPanel").then((m) => ({ default: m.ModHjsonPanel })));
const ItemPanel = lazy(() => import("./right/ItemPanel").then((m) => ({ default: m.ItemPanel })));
const LiquidPanel = lazy(() => import("./right/LiquidPanel").then((m) => ({ default: m.LiquidPanel })));
const SectorPanel = lazy(() => import("./right/SectorPanel").then((m) => ({ default: m.SectorPanel })));
const StatusPanel = lazy(() => import("./right/StatusPanel").then((m) => ({ default: m.StatusPanel })));
const UnitPanel = lazy(() => import("./right/UnitPanel").then((m) => ({ default: m.UnitPanel })));
const BlockPanel = lazy(() => import("./right/BlockPanel").then((m) => ({ default: m.BlockPanel })));
const UnitSpriteEditor = lazy(() => import("#/components/editor/sprite/UnitSpritEdior").then((mod) => ({ default: mod.UnitSpriteEditor })));

function EditorContent({ path }: { path: string }) {
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const striped = path.replace("sprite:", "");
	const entry = treeSnapshot.getEntry(striped);

	if (entry === undefined) return null;

	if (path.startsWith("bundles/") && isBundleFilename(path.split("/").pop() ?? "")) {
		return <BundleContent path={path} />;
	}

	if (path === "mod.hjson" || (path.startsWith("content") && path.endsWith(".json"))) {
		return <TextEditor path={path} />;
	}

	if (path.endsWith(".png")) {
		return <ImageWithSize path={path} />;
	}

	if (path.startsWith("sprite:")) {
		return <UnitSpriteEditor striped={striped} />;
	}

	if (entry.kind === "file") {
		return <TextEditor path={path} />;
	}

	return null;
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
	if (path === "mod.hjson" || path === "mod.json") {
		return (
			<Suspense fallback={panelFallback}>
				<ModHjsonPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content/items") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<ItemPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content/liquids") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<LiquidPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content/sectors") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<SectorPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content/status") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<StatusPanel path={path} />
			</Suspense>
		);
	}

	if (path.replace("sprite:", "").startsWith("content/units") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<UnitPanel path={path.replace("sprite:", "")} />
			</Suspense>
		);
	}

	if (path.startsWith("content/blocks") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<BlockPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content")) {
		return null;
	}

	return null;
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
			<div className="flex min-h-0 flex-1 overflow-hidden w-full">
				<div className="flex flex-1 overflow-hidden bg-background w-full">
					<ErrorBoundary>
						<EditorPanels />
					</ErrorBoundary>
				</div>
			</div>
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
