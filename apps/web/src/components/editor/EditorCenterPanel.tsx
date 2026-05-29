import { lazy, memo, Suspense, useEffect, useMemo } from "react";
import { useFileContentString, useProjectSession } from "@project/state";
import { ContentList } from "#/components/editor/center/ContentList";
import { getLanguageFromPath } from "~/lib/monaco/languageMap";
import { RecentlyOpenedFilesBar } from "./recently-opened/RecentlyOpenedFilesBar";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";

const MonacoEditor = lazy(() => import("./MonacoEditor").then((m) => ({ default: m.MonacoEditor })));

interface EditorCenterPanelProps {
	path: string | null;
}

function EditorWithMonaco({ path }: { path: string }) {
	const { data, write } = useFileContentString(path);
	const language = getLanguageFromPath(path);

	return (
		<Suspense fallback={<div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading editor...</div>}>
			<MonacoEditor path={path} value={data ?? ""} onChange={write} language={language} />
		</Suspense>
	);
}

function EditorContent({ path }: { path: string }) {
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);

	if (path === "mod.hjson" || (path.startsWith("content") && path.endsWith(".json"))) {
		return <EditorWithMonaco path={path} />;
	}

	if (
		path.startsWith("content") &&
		(path.endsWith("blocks") || path.endsWith("items") || path.endsWith("liquids") || path.endsWith("units"))
	) {
		return <ContentList path={path} />;
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

	return <ContentList path={path} />;
}

export const EditorCenterPanel = memo(function EditorCenterPanel({ path }: EditorCenterPanelProps) {
	const projectContext = useProjectSession((s) => s.projectContext);
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const recordFileAccess = useProjectSession((s) => s.recordFileAccess);

	const filePaths = useMemo(() => {
		return new Set(
			treeSnapshot
				.getEntries()
				.filter((e) => e.kind === "file")
				.map((e) => e.path),
		);
	}, [treeSnapshot]);

	useEffect(() => {
		if (path && projectContext && filePaths.has(path)) {
			recordFileAccess(projectContext.project.id, path);
		}
	}, [path, projectContext, filePaths, recordFileAccess]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			{path && projectContext && <RecentlyOpenedFilesBar />}
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">{path && <EditorContent path={path} />}</div>
		</div>
	);
});
