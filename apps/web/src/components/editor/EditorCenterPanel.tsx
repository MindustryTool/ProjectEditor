import { lazy, memo, Suspense, useEffect } from "react";
import { useFileContentString, useProjectSession } from "@project/state";
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
	const projectContext = useProjectSession((s) => s.projectContext);
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const recordFileAccess = useProjectSession((s) => s.recordFileAccess);

	useEffect(() => {
		if (path && projectContext && treeSnapshot.contains(path)) {
			recordFileAccess(projectContext.project.id, path);
		}
	}, [path, projectContext, treeSnapshot, recordFileAccess]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			{path && projectContext && <RecentlyOpenedFilesBar />}
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">{path && <EditorContent path={path} />}</div>
		</div>
	);
});
