import { memo, useEffect } from "react";
import { useFileString, useProjectSession } from "@project/core";
import { getLanguageFromPath } from "~/lib/monaco/languageMap";
import { RecentlyOpenedFilesBar } from "./recently-opened/RecentlyOpenedFilesBar";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { Spinner } from "#/components/ui/spinner";
import { MonacoEditor } from "#/components/editor/MonacoEditor";

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
	const projectContext = useProjectSession((s) => s.projectContext);
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const recordFileAccess = useProjectSession((s) => s.recordFileAccess);

	useEffect(() => {
		if (path && projectContext && treeSnapshot.contains(path)) {
			recordFileAccess(projectContext.project.id, path);
		}
	}, [path, projectContext, treeSnapshot, recordFileAccess]);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden h-full w-full">
			{path && projectContext && <RecentlyOpenedFilesBar />}
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">{path && <EditorContent path={path} />}</div>
		</div>
	);
});
