import { lazy, memo, Suspense, useState, useCallback } from "react";
import { useFileString, useProjectSession, isBundleFilename } from "@project/core";
import { getLanguageFromPath } from "~/lib/monaco/languageMap";
import { RecentlyOpenedFilesBar } from "./recently-opened/RecentlyOpenedFilesBar";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { Spinner } from "#/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { usePath } from "#/hooks/use-path";
import { ErrorBoundary } from "#/components/ui/error-boundary";

const UnitSpriteEditor = lazy(() => import("#/components/editor/sprite/UnitSpritEdior").then((mod) => ({ default: mod.UnitSpriteEditor })));
const MonacoEditor = lazy(() => import("#/components/editor/monaco/MonacoEditor").then((mod) => ({ default: mod.MonacoEditor })));
const BundleGrid = lazy(() => import("#/components/editor/bundle").then((mod) => ({ default: mod.BundleGrid })));

type BundleView = "editor" | "grid";

function TextEditor({ path }: { path: string }) {
	const { data, isLoading, write } = useFileString(path);
	const language = getLanguageFromPath(path);

	if (isLoading) {
		return (
			<div className="flex w-full h-full items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (data === null) {
		return <div className="flex w-full h-full items-center justify-center">File not found</div>;
	}

	return (
		<Suspense>
			<ErrorBoundary>
				<MonacoEditor path={path} value={data} onChange={write} language={language} />
			</ErrorBoundary>
		</Suspense>
	);
}

function BundleContent({ path }: { path: string }) {
	const { t } = useTranslation();
	const [view, setView] = useState<BundleView>("grid");
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const allEntries = treeSnapshot.getEntries();

	const contentKeys = allEntries
		.filter((e) => e.kind === "file" && e.path.startsWith("content/") && (e.path.endsWith(".json") || e.path.endsWith(".hjson")))
		.map((e) => (e.path.split("/").pop() ?? "").replace(/\.(json|hjson)$/, ""))
		.filter(Boolean);

	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex items-center justify-end shrink-0">
				<div className="flex items-center gap-px bg-muted/60 p-0.5">
					<button
						type="button"
						onClick={() => setView("editor")}
						className={`px-2.5 py-0.5 text-[11px] font-medium rounded-[3px] transition-all ${
							view === "editor" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground/50 hover:text-foreground"
						}`}
					>
						{t("bundle-editor.editor-tab")}
					</button>
					<button
						type="button"
						onClick={() => setView("grid")}
						className={`px-2.5 py-0.5 text-[11px] font-medium rounded-[3px] transition-all ${
							view === "grid" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground/50 hover:text-foreground"
						}`}
					>
						{t("bundle-editor.grid-tab")}
					</button>
				</div>
			</div>
			<div className="flex-1 min-h-0">
				{view === "editor" ? (
					<TextEditor path={path} />
				) : (
					<Suspense
						fallback={
							<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
								{t("bundle-editor.loading")}
							</div>
						}
					>
						<BundleGrid path={path} contentKeys={contentKeys} />
					</Suspense>
				)}
			</div>
		</div>
	);
}

function EditorContent({ path }: { path: string }) {
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const striped = path.replace("sprite:", "");
	const entry = treeSnapshot.getEntry(striped);

	if (entry === undefined) {
		return null;
	}

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

function ImageWithSize({ path }: { path: string }) {
	const [size, setSize] = useState([0, 0]);
	const handleSize = useCallback((width: number, height: number) => setSize([width, height]), []);
	return (
		<div className="relative flex justify-center items-center h-full w-full overflow-hidden">
			<ImageFilePreview path={path} onSize={handleSize} />
			<div className="absolute bottom-0.5 backdrop-blur-xs backdrop-brightness-75 p-0.5 right-0.5 text-xs text-muted-foreground">
				{size[0]}x{size[1]}
			</div>
		</div>
	);
}

export const EditorCenterPanel = memo(function EditorCenterPanel() {
	const [path] = usePath();

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden h-full w-full">
			<RecentlyOpenedFilesBar />
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">{path ? <EditorContent path={path} /> : <NoOpenedFileScreen />}</div>
		</div>
	);
});

function NoOpenedFileScreen() {
	const { t } = useTranslation();
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const contentFiles = treeSnapshot
		.getEntries()
		.filter((entry) => entry.path.startsWith("content") && (entry.path.endsWith(".json") || entry.path.endsWith(".hjson")))
		.slice(0, 4)
		.map((file) => file.path);

	const [, setPath] = usePath();

	const files = ["mod.json", "mod.hjson", "README.md", "icon.png", ...contentFiles];

	return (
		<div className="flex flex-col gap-1 w-full h-full items-center justify-center">
			<div className="grid">
				<span className="font-semibold text-base">{t("editor.no-opened-file")}</span>
				<div className="grid justify-start">
					{files
						.filter((file) => treeSnapshot.contains(file))
						.map((file) => (
							<span key={file} className="text-sm text-muted-foreground underline cursor-pointer" onClick={() => setPath(file)}>
								{file}
							</span>
						))}
				</div>
			</div>
		</div>
	);
}
