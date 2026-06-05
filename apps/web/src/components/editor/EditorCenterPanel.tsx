import { lazy, memo } from "react";
import { useFileString, useProjectSession } from "@project/core";
import { getLanguageFromPath } from "~/lib/monaco/languageMap";
import { RecentlyOpenedFilesBar } from "./recently-opened/RecentlyOpenedFilesBar";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { Spinner } from "#/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { usePath } from "#/hooks/use-path";

const MonacoEditor = lazy(() => import("#/components/editor/MonacoEditor").then((mod) => ({ default: mod.MonacoEditor })));

interface EditorCenterPanelProps {
	path: string | null;
}

function EditorWithMonaco({ path }: { path: string }) {
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

	return <MonacoEditor path={path} value={data} onChange={write} language={language} />;
}

function EditorContent({ path }: { path: string }) {
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);

	if (path === "mod.hjson" || (path.startsWith("content") && path.endsWith(".json"))) {
		return <EditorWithMonaco path={path} />;
	}

	if (path.endsWith(".png")) {
		return <ImageFilePreview path={path} />;
	}

	const entry = treeSnapshot.getEntry(path);

	if (entry === undefined) {
		return null;
	}

	if (entry.kind === "file") {
		return <EditorWithMonaco path={path} />;
	}

	return null;
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
