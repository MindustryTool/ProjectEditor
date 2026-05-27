import { useEffect, useRef, useCallback } from "react";
import type { editor } from "monaco-editor";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { HJSON_LANGUAGE_ID, hjsonMonarchGrammar, hjsonLanguageConfig } from "~/lib/monaco/hjsonLanguage";
import { JSON_MINDUSTRY_LANGUAGE_ID, jsonMindustryMonarchGrammar, jsonMindustryLanguageConfig } from "~/lib/monaco/jsonMindustryLanguage";
import {
	ensureInlineColorClass,
	getColorThemeRules,
	MONACO_THEME_DARK,
	MONACO_THEME_LIGHT,
	resolveMindustryColor,
} from "~/lib/monaco/colorTags";
import { useValidationStore, Severity } from "@project/state";
import { useFileContentStore } from "@project/state";
import { useProjectSession } from "@project/state";
import { useTranslation } from "react-i18next";
import { configureMonaco } from "~/lib/monaco/setup";
import { useMonacoTheme } from "#/lib/monaco/use-monaco-theme";

interface MonacoEditorProps {
	value: string;
	onChange: (value: string) => void;
	language?: string;
	readOnly?: boolean;
	filePath: string;
}

export function MonacoEditor({ value, onChange, language, readOnly, filePath }: MonacoEditorProps) {
	const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const colorDecorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
	const theme = useMonacoTheme();
	const { t } = useTranslation();
	const monacoConfigured = useRef(false);

	if (!monacoConfigured.current) {
		configureMonaco();
		monacoConfigured.current = true;
	}

	const results = useValidationStore((s) => s.resultsByPath[filePath]);

	const updateMarkers = useCallback(() => {
		const editorInstance = editorRef.current;
		const monacoInstance = monacoRef.current;
		if (!editorInstance || !monacoInstance) return;

		const model = editorInstance.getModel();
		if (!model) return;

		if (!results || results.length === 0) {
			monacoInstance.editor.setModelMarkers(model, "file-validation", []);
			return;
		}

		const markers: editor.IMarkerData[] = [];

		for (const r of results) {
			const monacoSeverity = r.severity === Severity.error ? 8 : r.severity === Severity.warning ? 4 : 2;
			const endLineNumber = r.endLine ?? r.startLine;
			const rawEndColumn = r.endColumn ?? r.startColumn;
			const endColumn = endLineNumber === r.startLine && rawEndColumn === r.startColumn ? r.startColumn + 1 : rawEndColumn;

			markers.push({
				severity: monacoSeverity as editor.IMarkerData["severity"],
				message: t(r.messageKey as any, r.messageParams),
				startLineNumber: r.startLine,
				startColumn: r.startColumn,
				endLineNumber,
				endColumn,
			});
		}

		monacoInstance.editor.setModelMarkers(model, "file-validation", markers);
	}, [results, filePath, t]);

	useEffect(() => {
		updateMarkers();
	}, [updateMarkers]);

	const updateColorDecorations = useCallback(() => {
		const editorInstance = editorRef.current;
		const monacoInstance = monacoRef.current;
		if (!editorInstance || !monacoInstance) return;

		const model = editorInstance.getModel();
		if (!model) return;

		const decorations: editor.IModelDeltaDecoration[] = [];

		for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber += 1) {
			const line = model.getLineContent(lineNumber);
			let quote: '"' | "'" | null = null;
			let activeClassName: string | null = null;
			let segmentStartColumn: number | null = null;

			for (let index = 0; index < line.length; index += 1) {
				const char = line[index];
				if (!char) continue;

				if (quote) {
					if (char === "\\") {
						index += 1;
						continue;
					}

					if (char === quote) {
						if (activeClassName && segmentStartColumn !== null && segmentStartColumn < index + 1) {
							decorations.push({
								range: new monacoInstance.Range(lineNumber, segmentStartColumn, lineNumber, index + 1),
								options: { inlineClassName: activeClassName },
							});
						}
						quote = null;
						activeClassName = null;
						segmentStartColumn = null;
						continue;
					}

					if (char === "[") {
						const remaining = line.slice(index);
						const resetMatch = remaining.match(/^\[\]/);
						const colorMatch = remaining.match(/^\[(#(?:[0-9a-fA-F]{1,6}|[0-9a-fA-F]{8})|[a-zA-Z]+)\]/);

						if (resetMatch || colorMatch) {
							if (activeClassName && segmentStartColumn !== null && segmentStartColumn < index + 1) {
								decorations.push({
									range: new monacoInstance.Range(lineNumber, segmentStartColumn, lineNumber, index + 1),
									options: { inlineClassName: activeClassName },
								});
							}

							if (resetMatch) {
								activeClassName = null;
								segmentStartColumn = null;
								index += resetMatch[0].length - 1;
								continue;
							}

							if (colorMatch) {
								const colorValue = resolveMindustryColor(colorMatch[1] ?? "");
								activeClassName = colorValue ? ensureInlineColorClass(colorValue) : null;
								segmentStartColumn = activeClassName ? index + colorMatch[0].length + 1 : null;
								index += colorMatch[0].length - 1;
								continue;
							}
						}
					}

					continue;
				}

				if (char === '"' || char === "'") {
					quote = char;
				}
			}
		}

		if (!colorDecorationsRef.current) {
			colorDecorationsRef.current = editorInstance.createDecorationsCollection(decorations);
			return;
		}

		colorDecorationsRef.current.set(decorations);
	}, []);

	useEffect(() => {
		updateColorDecorations();
	}, [updateColorDecorations, value, language]);

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

		const colorThemeRules = getColorThemeRules();
		monaco.editor.defineTheme(MONACO_THEME_LIGHT, {
			base: "vs",
			inherit: true,
			rules: colorThemeRules,
			colors: {},
		});
		monaco.editor.defineTheme(MONACO_THEME_DARK, {
			base: "vs-dark",
			inherit: true,
			rules: colorThemeRules,
			colors: {},
		});

		// Register HJSON
		const existingHjson = monaco.languages.getLanguages().find((l) => l.id === HJSON_LANGUAGE_ID);
		if (!existingHjson) {
			monaco.languages.register({ id: HJSON_LANGUAGE_ID });
			monaco.languages.setMonarchTokensProvider(HJSON_LANGUAGE_ID, hjsonMonarchGrammar);
			monaco.languages.setLanguageConfiguration(HJSON_LANGUAGE_ID, hjsonLanguageConfig);
		}

		// Register JSON with Mindustry color tags
		const existingJsonMindustry = monaco.languages.getLanguages().find((l) => l.id === JSON_MINDUSTRY_LANGUAGE_ID);
		if (!existingJsonMindustry) {
			monaco.languages.register({ id: JSON_MINDUSTRY_LANGUAGE_ID });
			monaco.languages.setMonarchTokensProvider(JSON_MINDUSTRY_LANGUAGE_ID, jsonMindustryMonarchGrammar);
			monaco.languages.setLanguageConfiguration(JSON_MINDUSTRY_LANGUAGE_ID, jsonMindustryLanguageConfig);
		}
	};

	const handleMount: OnMount = (editor) => {
		editorRef.current = editor;
		updateMarkers();
		updateColorDecorations();
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
				wordWrap: "on",
				tabSize: 2,
				insertSpaces: true,
				padding: { top: 8 },
			}}
			loading={<div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading editor...</div>}
		/>
	);
}
