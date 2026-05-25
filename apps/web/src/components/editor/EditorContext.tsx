import { createContext, useContext, useEffect, useRef, useCallback } from "react";
import type { editor } from "monaco-editor";
import { useValidationStore, Severity } from "@project/state";
import { useFileContentStore } from "@project/state";
import { useProjectStore } from "@project/state";
import { useTranslation } from "react-i18next";
import { configureMonaco } from "~/lib/monaco/setup";
import { useMonacoTheme } from "~/lib/monaco/useMonacoTheme";

interface EditorContextValue {
	monacoRef: React.MutableRefObject<{ editor: typeof editor } | null>;
	editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
	path: string;
	theme: "vs-dark" | "vs";
	updateMarkers: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditorContext() {
	const ctx = useContext(EditorContext);
	if (!ctx) throw new Error("useEditorContext must be used within EditorProvider");
	return ctx;
}

interface EditorProviderProps {
	path: string;
	children: React.ReactNode;
}

export function EditorProvider({ path, children }: EditorProviderProps) {
	const monacoRef = useRef<{ editor: typeof editor } | null>(null);
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const theme = useMonacoTheme();
	const { t } = useTranslation();
	const monacoConfigured = useRef(false);

	if (!monacoConfigured.current) {
		configureMonaco();
		monacoConfigured.current = true;
	}

	const resultsByPath = useValidationStore((s) => s.resultsByPath);

	const updateMarkers = useCallback(() => {
		const editorInstance = editorRef.current;
		const monacoInstance = monacoRef.current;
		if (!editorInstance || !monacoInstance) return;

		const model = editorInstance.getModel();
		if (!model) return;

		const results = resultsByPath[path];
		if (!results || results.length === 0) {
			monacoInstance.editor.setModelMarkers(model, "file-validation", []);
			return;
		}

		const markers: editor.IMarkerData[] = [];

		for (const r of results) {
			if (r.line === undefined) continue;

			const monacoSeverity = r.severity === Severity.error ? 8 : r.severity === Severity.warning ? 4 : 2;

			markers.push({
				severity: monacoSeverity as editor.IMarkerData["severity"],
				message: t(r.messageKey, r.messageParams),
				startLineNumber: r.line,
				startColumn: r.column ?? 1,
				endLineNumber: r.line,
				endColumn: (r.column ?? 1) + 1,
			});
		}

		monacoInstance.editor.setModelMarkers(model, "file-validation", markers);
	}, [resultsByPath, path, t]);

	useEffect(() => {
		updateMarkers();
	}, [updateMarkers]);

	useEffect(() => {
		const projectContext = useProjectStore.getState().projectContext;
		if (!projectContext) return;

		const projectId = projectContext.project.id;
		const unsub = useFileContentStore.getState().subscribeToEvents(projectId, path, projectContext.events, projectContext.fs);

		return () => {
			unsub();
			useFileContentStore.getState().cleanup(projectId, path);
		};
	}, [path]);

	return <EditorContext.Provider value={{ monacoRef, editorRef, path, theme, updateMarkers }}>{children}</EditorContext.Provider>;
}
