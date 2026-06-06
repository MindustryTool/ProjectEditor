import { lazy, memo, Suspense, useState } from "react";
import { useFileString, useProjectSession } from "@project/core";
import { getLanguageFromPath } from "~/lib/monaco/languageMap";
import { RecentlyOpenedFilesBar } from "./recently-opened/RecentlyOpenedFilesBar";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { Spinner } from "#/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { usePath } from "#/hooks/use-path";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { SpriteEditor } from "#/components/editor/center/SpriteEditor";
import { UnitHjsonSchema } from "@project/schema";

const MonacoEditor = lazy(() => import("#/components/editor/monaco/MonacoEditor").then((mod) => ({ default: mod.MonacoEditor })));

interface EditorCenterPanelProps {
	path: string | null;
}

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

function EditorContent({ path }: { path: string }) {
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const striped = path.replace("sprite:", "");
	const entry = treeSnapshot.getEntry(striped);

	if (entry === undefined) {
		return null;
	}

	if (path === "mod.hjson" || (path.startsWith("content") && path.endsWith(".json"))) {
		return <TextEditor path={path} />;
	}

	if (path.endsWith(".png")) {
		return <ImageWithSize path={path} />;
	}

	if (path.startsWith("sprite:")) {
		return <SpriteEditor path={striped} schema={UnitHjsonSchema} />;
	}

	if (entry.kind === "file") {
		return <TextEditor path={path} />;
	}

	return null;
}

function ImageWithSize({ path }: { path: string }) {
	const [size, setSize] = useState([0, 0]);
	return (
		<div className="relative flex justify-center items-center h-full w-full overflow-hidden">
			<ImageFilePreview path={path} onSize={(width, height) => setSize([width, height])} />
			<div className="absolute bottom-0.5 backdrop-blur-xs backdrop-brightness-75 p-0.5 right-0.5 text-xs text-muted-foreground">
				{size[0]}x{size[1]}
			</div>
		</div>
	);
}

export const EditorCenterPanel = memo(function EditorCenterPanel({ path }: EditorCenterPanelProps) {
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
	const [, setPath] = usePath();

	const files = ["mod.json", "mod.hjson", "README.md", "icon.png"];

	return (
		<div className="flex flex-col gap-1 w-full h-full items-center justify-center">
			<div className="grid">
				<span className="font-semibold text-sm">{t("editor.no-opened-file")}</span>
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
