import { useEffect, useRef, useCallback } from "react";
import type { editor } from "monaco-editor";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { HJSON_LANGUAGE_ID, hjsonMonarchGrammar, hjsonLanguageConfig } from "~/lib/monaco/hjsonLanguage";
import { useValidationStore, Severity } from "@project/state";
import { useFileContentStore } from "@project/state";
import { useProjectSession } from "@project/state";
import { useTranslation } from "react-i18next";
import { configureMonaco } from "~/lib/monaco/setup";
import { useMonacoTheme } from "~/lib/monaco/useMonacoTheme";

interface MonacoEditorProps {
	value: string;
	onChange: (value: string) => void;
	language?: string;
	readOnly?: boolean;
	filePath?: string;
}

export function MonacoEditor({ value, onChange, language, readOnly, filePath }: MonacoEditorProps) {
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

		const results = filePath ? resultsByPath[filePath] : undefined;
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
				message: t(r.messageKey as any, r.messageParams),
				startLineNumber: r.line,
				startColumn: r.column ?? 1,
				endLineNumber: r.line,
				endColumn: (r.column ?? 1) + 1,
			});
		}

		monacoInstance.editor.setModelMarkers(model, "file-validation", markers);
	}, [resultsByPath, filePath, t]);

	useEffect(() => {
		updateMarkers();
	}, [updateMarkers]);

	useEffect(() => {
		if (!filePath) return;
		const projectContext = useProjectSession.getState().projectContext;
		if (!projectContext) return;

		const projectId = projectContext.project.id;
		const unsub = useFileContentStore.getState().subscribeToEvents(projectId, filePath, projectContext.events, projectContext.fs);

		return () => {
			unsub();
			useFileContentStore.getState().cleanup(projectId, filePath);
		};
	}, [filePath]);

	const handleBeforeMount: BeforeMount = (monaco) => {
		monacoRef.current = monaco;
		const existingLang = monaco.languages.getLanguages().find((l) => l.id === HJSON_LANGUAGE_ID);
		if (!existingLang) {
			monaco.languages.register({ id: HJSON_LANGUAGE_ID });
			monaco.languages.setMonarchTokensProvider(HJSON_LANGUAGE_ID, hjsonMonarchGrammar);
			monaco.languages.setLanguageConfiguration(HJSON_LANGUAGE_ID, hjsonLanguageConfig);
		}
	};

	const handleMount: OnMount = (editor) => {
		editorRef.current = editor;
		updateMarkers();
	};

	return (
		<Editor
			theme={theme}
			language={language}
			value={value}
			onChange={(newValue) => {
				const next = newValue ?? "";
				onChange(next);
			}}
			beforeMount={handleBeforeMount}
			onMount={handleMount}
			options={{
				readOnly,
				minimap: { enabled: false },
				fontSize: 15,
				lineNumbers: "on",
				renderWhitespace: "selection",
				bracketPairColorization: { enabled: true },
				autoClosingBrackets: "always",
				autoClosingQuotes: "always",
				scrollBeyondLastLine: false,
				wordWrap: "off",
				tabSize: 2,
				insertSpaces: true,
				padding: { top: 8 },
			}}
			loading={<div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading editor...</div>}
		/>
	);
}
