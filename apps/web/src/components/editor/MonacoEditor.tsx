import { useEffect, useRef, useCallback, useState } from "react";
import type { editor, IDisposable, IPosition } from "monaco-editor";
import Editor, { type BeforeMount, type OnMount, type Monaco } from "@monaco-editor/react";
import { HJSON_LANGUAGE_ID, hjsonMonarchGrammar, hjsonLanguageConfig } from "~/lib/monaco/hjsonLanguage";
import { JSON_MINDUSTRY_LANGUAGE_ID, jsonMindustryMonarchGrammar, jsonMindustryLanguageConfig } from "~/lib/monaco/jsonMindustryLanguage";
import {
	COLOR_NAMES,
	ensureInlineColorClass,
	findEditableColorTagAtColumn,
	formatMindustryColorTag,
	getColorThemeRules,
	MINDUSTRY_COLORS,
	MONACO_THEME_DARK,
	MONACO_THEME_LIGHT,
	parseMindustryStringTags,
	toPickerColorValue,
	type MindustryColorTagMatch,
} from "~/lib/monaco/colorTags";
import { useAppStore, useValidationStore } from "@project/core";
import { useFileStore } from "@project/core";
import { useProjectSession } from "@project/core";
import { useTranslation } from "react-i18next";
import { configureMonaco } from "~/lib/monaco/setup";
import { useMonacoTheme } from "#/lib/monaco/use-monaco-theme";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { ColorPicker, ColorPickerAlpha, ColorPickerFormat, ColorPickerHue, ColorPickerSelection } from "~/components/ui/color-picker";
import { Spinner } from "#/components/ui/spinner";

interface MonacoEditorProps {
	value: string;
	onChange: (value: string) => void;
	language?: string;
	readOnly?: boolean;
	path: string;
}

interface ActiveColorTagState extends MindustryColorTagMatch {
	lineNumber: number;
	top: number;
	left: number;
	pickerColor: string;
}

const ERROR_LENS_STYLE_ID = "el-global-styles";

function ensureErrorLensStyles(): void {
	if (document.getElementById(ERROR_LENS_STYLE_ID)) return;
	const style = document.createElement("style");
	style.id = ERROR_LENS_STYLE_ID;
	style.textContent = `
        .el-bg-error{background:rgba(255,80,80,0.07)}
        .el-bg-warning{background:rgba(255,200,0,0.6)}
        `;
	document.head.appendChild(style);
}

export function MonacoEditor({ value, onChange, language, readOnly, path }: MonacoEditorProps) {
	const monacoRef = useRef<Monaco | null>(null);
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const colorDecorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
	const errorLensDecorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
	const errorLensStyleRef = useRef<HTMLStyleElement | null>(null);
	const editorDisposablesRef = useRef<IDisposable[]>([]);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const theme = useMonacoTheme();
	const fontSize = useAppStore((s) => s.settings.fontSize);
	const tabSize = useAppStore((s) => s.settings.tabSize);
	const { t } = useTranslation();
	const monacoConfigured = useRef(false);
	const [activeColorTag, setActiveColorTag] = useState<ActiveColorTagState | null>(null);

	if (!monacoConfigured.current) {
		configureMonaco();
		ensureErrorLensStyles();
		monacoConfigured.current = true;
	}

	const results = useValidationStore((s) => s.results.resultsByPath[path]);

	const updateMarkers = useCallback(() => {
		const editorInstance = editorRef.current;
		const monacoInstance = monacoRef.current;
		if (!editorInstance || !monacoInstance) return;

		const model = editorInstance.getModel();
		if (!model) {
			return;
		}

		if (!results || results.length === 0) {
			monacoInstance.editor.setModelMarkers(model, "file-validation", []);
			if (errorLensDecorationsRef.current) {
				errorLensDecorationsRef.current.clear();
			}
			if (errorLensStyleRef.current) {
				errorLensStyleRef.current.textContent = "";
			}
			return;
		}

		const markers: editor.IMarkerData[] = [];
		const lineMessages = new Map<number, { message: string; severity: string }[]>();

		for (const r of results) {
			const monacoSeverity = r.severity === "error" ? 8 : r.severity === "warning" ? 4 : 2;
			const endLineNumber = r.endLine ?? r.startLine;
			const rawEndColumn = r.endColumn ?? r.startColumn;
			const endColumn = endLineNumber === r.startLine && rawEndColumn === r.startColumn ? r.startColumn + 1 : rawEndColumn;
			const message = (t as (key: string, params?: Record<string, unknown>) => string)(r.messageKey, r.messageParams);

			markers.push({
				severity: monacoSeverity as editor.IMarkerData["severity"],
				message,
				startLineNumber: r.startLine,
				startColumn: r.startColumn,
				endLineNumber,
				endColumn,
			});

			const key = r.startLine;
			if (!lineMessages.has(key)) {
				lineMessages.set(key, []);
			}
			lineMessages.get(key)!.push({ message, severity: r.severity });
		}

		monacoInstance.editor.setModelMarkers(model, "file-validation", markers);

		const errorDecorations: editor.IModelDeltaDecoration[] = [];
		const modelId = model.uri.toString().replace(/[^a-zA-Z0-9]/g, "_");
		let cssText = "";

		for (const [line, msgs] of lineMessages) {
			const isError = msgs.some((m) => m.severity === "error");
			const combinedMsg = msgs.map((m) => m.message).join("; ");
			const variant = isError ? "error" : "warning";
			const msgCls = `el-msg-${modelId}-l${line}`;

			errorDecorations.push({
				range: new monacoInstance.Range(line, 1, line, model.getLineMaxColumn(line)),
				options: {
					isWholeLine: true,
					className: `el-bg-${variant}`,
					afterContentClassName: msgCls,
				},
			});

			const color = isError ? "#ff3333" : "#e67e22";
			const escapedMsg = combinedMsg.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
			cssText += `.${msgCls}::after{content:'  ${escapedMsg}';color:${color};font-size:0.85em;font-style:italic;white-space:nowrap;}`;
		}

		if (!errorLensDecorationsRef.current) {
			errorLensDecorationsRef.current = editorInstance.createDecorationsCollection(errorDecorations);
		} else {
			errorLensDecorationsRef.current.set(errorDecorations);
		}

		let styleEl = errorLensStyleRef.current;
		if (!styleEl) {
			styleEl = document.createElement("style");
			styleEl.id = `el-dynamic-${modelId}`;
			document.head.appendChild(styleEl);
			errorLensStyleRef.current = styleEl;
		}
		styleEl.textContent = cssText;
	}, [results, t]);

	useEffect(() => {
		updateMarkers();
	}, [updateMarkers]);

	const clearActiveColorTag = useCallback(() => {
		setActiveColorTag(null);
	}, []);

	const resolveActiveColorTag = useCallback(
		(position?: IPosition | null): ActiveColorTagState | null => {
			if (readOnly) return null;

			const editorInstance = editorRef.current;
			if (!editorInstance) return null;

			const model = editorInstance.getModel();
			const currentPosition = position ?? editorInstance.getPosition();
			if (!model || !currentPosition) return null;

			const line = model.getLineContent(currentPosition.lineNumber);
			const match = findEditableColorTagAtColumn(line, currentPosition.column);
			if (!match) return null;

			const anchor = editorInstance.getScrolledVisiblePosition({
				lineNumber: currentPosition.lineNumber,
				column: match.endColumn,
			});
			if (!anchor) return null;

			return {
				...match,
				lineNumber: currentPosition.lineNumber,
				top: anchor.top + anchor.height + 6,
				left: anchor.left,
				pickerColor: toPickerColorValue(match.resolvedColor) ?? "#ffffff",
			};
		},
		[readOnly],
	);

	const refreshActiveColorTag = useCallback(
		(position?: IPosition | null) => {
			setActiveColorTag(resolveActiveColorTag(position));
		},
		[resolveActiveColorTag],
	);

	const updateColorDecorations = useCallback(() => {
		const editorInstance = editorRef.current;
		const monacoInstance = monacoRef.current;
		if (!editorInstance || !monacoInstance) return;

		const model = editorInstance.getModel();
		if (!model) return;

		const decorations: editor.IModelDeltaDecoration[] = [];

		for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber += 1) {
			const line = model.getLineContent(lineNumber);
			const tagsByStartIndex = new Map(parseMindustryStringTags(line).map((match) => [match.startIndex, match]));
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
						const tagMatch = tagsByStartIndex.get(index);
						if (tagMatch) {
							if (activeClassName && segmentStartColumn !== null && segmentStartColumn < index + 1) {
								decorations.push({
									range: new monacoInstance.Range(lineNumber, segmentStartColumn, lineNumber, index + 1),
									options: { inlineClassName: activeClassName },
								});
							}

							if (tagMatch.type === "reset") {
								activeClassName = null;
								segmentStartColumn = null;
								index = tagMatch.endIndex - 1;
								continue;
							}

							activeClassName = ensureInlineColorClass(tagMatch.resolvedColor);
							segmentStartColumn = index + tagMatch.text.length + 1;
							index = tagMatch.endIndex - 1;
							continue;
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
		refreshActiveColorTag();
	}, [refreshActiveColorTag, value, language, path, readOnly]);

	useEffect(() => {
		if (!path) return;
		const projectContext = useProjectSession.getState().projectContext;
		if (!projectContext) return;

		const projectId = projectContext.project.id;
		const unsub = useFileStore.getState().subscribeToEvents(projectId, path, projectContext.events, projectContext.fs);

		return () => {
			unsub();
			useFileStore.getState().cleanup(projectId, path);
		};
	}, [path]);

	useEffect(() => {
		const handlePointerDown = (event: MouseEvent) => {
			const container = containerRef.current;
			if (!container) return;
			if (container.contains(event.target as Node)) return;
			clearActiveColorTag();
		};

		document.addEventListener("mousedown", handlePointerDown);
		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
		};
	}, [clearActiveColorTag]);

	const replaceActiveColorTag = useCallback(
		(replacement: string) => {
			const editorInstance = editorRef.current;
			const monacoInstance = monacoRef.current;
			const activeTag = activeColorTag;
			if (!editorInstance || !monacoInstance || !activeTag || readOnly) return;

			const range = new monacoInstance.Range(activeTag.lineNumber, activeTag.startColumn, activeTag.lineNumber, activeTag.endColumn);

			editorInstance.pushUndoStop();
			editorInstance.executeEdits("mindustry-color-picker", [{ range, text: replacement, forceMoveMarkers: true }]);
			editorInstance.pushUndoStop();

			const nextPosition = {
				lineNumber: activeTag.lineNumber,
				column: activeTag.startColumn + Math.min(replacement.length - 1, 1),
			};
			editorInstance.setPosition(nextPosition);
			editorInstance.focus();
			refreshActiveColorTag(nextPosition);
		},
		[activeColorTag, readOnly, refreshActiveColorTag],
	);

	const handleNamedColorPick = useCallback(
		(name: keyof typeof MINDUSTRY_COLORS) => {
			const replacement = formatMindustryColorTag(name);
			if (!replacement) return;
			replaceActiveColorTag(replacement);
		},
		[replaceActiveColorTag],
	);

	const handleCustomColorPick = useCallback(
		(nextColor: string) => {
			const replacement = formatMindustryColorTag(nextColor);
			if (!replacement) return;
			replaceActiveColorTag(replacement);
		},
		[replaceActiveColorTag],
	);

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
		editorDisposablesRef.current.forEach((disposable) => disposable.dispose());
		editorDisposablesRef.current = [
			editor.onDidChangeCursorSelection((event) => {
				if (!event.selection.isEmpty()) {
					clearActiveColorTag();
					return;
				}
				refreshActiveColorTag(event.selection.getPosition());
			}),
			editor.onDidScrollChange(() => {
				refreshActiveColorTag();
			}),
			editor.onDidLayoutChange(() => {
				refreshActiveColorTag();
			}),
			editor.onMouseDown((event) => {
				refreshActiveColorTag(event.target.position);
			}),
			editor.onDidChangeModel(() => {
				clearActiveColorTag();
			}),
		];
	};

	useEffect(() => {
		return () => {
			editorDisposablesRef.current.forEach((disposable) => disposable.dispose());
			editorDisposablesRef.current = [];
			if (errorLensDecorationsRef.current) {
				errorLensDecorationsRef.current.clear();
				errorLensDecorationsRef.current = null;
			}
			if (errorLensStyleRef.current) {
				errorLensStyleRef.current.remove();
				errorLensStyleRef.current = null;
			}
		};
	}, []);

	return (
		<div ref={containerRef} className="relative h-full w-full flex">
			<Editor
				key={path}
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
					fontSize,
					lineNumbers: "on",
					renderWhitespace: "selection",
					bracketPairColorization: { enabled: true },
					autoClosingBrackets: "always",
					autoClosingQuotes: "always",
					scrollBeyondLastLine: false,
					wordWrap: "on",
					tabSize,
					insertSpaces: true,
					padding: { top: 8 },
					automaticLayout: true,
				}}
				loading={
					<div className="flex h-full items-center justify-center text-xs text-muted-foreground">
						<Spinner />
					</div>
				}
			/>
			{activeColorTag ? (
				<div
					className="absolute z-20 w-64 rounded-md border border-border bg-background p-3 shadow-lg"
					style={{
						top: activeColorTag.top,
						left: Math.max(8, activeColorTag.left),
					}}
				>
					<div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
						<span>{activeColorTag.text}</span>
						<Popover>
							<PopoverTrigger asChild>
								<button
									type="button"
									className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent p-0"
									style={{ backgroundColor: activeColorTag.pickerColor }}
								/>
							</PopoverTrigger>
							<PopoverContent className="w-64 p-3" side="bottom" align="start">
								<ColorPicker value={activeColorTag.pickerColor} onChange={(val) => handleCustomColorPick(val)}>
									<ColorPickerSelection className="h-40 rounded-lg" />
									<ColorPickerHue />
									<ColorPickerAlpha />
									<ColorPickerFormat />
								</ColorPicker>
							</PopoverContent>
						</Popover>
					</div>
					<div className="grid grid-cols-6 gap-2">
						{COLOR_NAMES.map((name) => (
							<button
								key={name}
								type="button"
								className="h-8 rounded border border-border"
								style={{ backgroundColor: MINDUSTRY_COLORS[name] }}
								title={name}
								onClick={() => {
									handleNamedColorPick(name);
								}}
							/>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}
