import { lazy, memo, Suspense } from "react";
import { useFileContent } from "@project/state";
import { useTranslation } from "react-i18next";
import { Panel } from "./Panel";
import { ContentList } from "#/components/editor/center/ContentList";
import { getLanguageFromPath } from "~/lib/monaco/languageMap";

const MonacoEditor = lazy(() => import("./MonacoEditor").then((m) => ({ default: m.MonacoEditor })));

interface EditorCenterPanelProps {
	path: string | null;
}

function EditorWithMonaco({ path }: { path: string }) {
	const { data, update } = useFileContent(path);
	const language = getLanguageFromPath(path);

	return (
		<Suspense fallback={<div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading editor...</div>}>
			<MonacoEditor value={data ?? ""} onChange={update} language={language} filePath={path} />
		</Suspense>
	);
}

export const EditorCenterPanel = memo(function EditorCenterPanel({ path }: EditorCenterPanelProps) {
	const { t } = useTranslation();

	if (path === null) {
		return null;
	}

	if (path === "mod.hjson" || (path.startsWith("content") && path.endsWith(".json"))) {
		return <EditorWithMonaco path={path} />;
	}

	if (
		path.startsWith("content") &&
		(path.endsWith("blocks") || path.endsWith("items") || path.endsWith("liquids") || path.endsWith("units"))
	) {
		return <ContentList path={path} />;
	}

	return (
		<Panel header={t("editor.editor")}>
			<div className="flex h-full items-center justify-center text-xs text-muted-foreground">{path}</div>
		</Panel>
	);
});
