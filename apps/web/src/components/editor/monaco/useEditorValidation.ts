import { useCallback, useEffect, useRef, useTransition } from "react";
import type { editor } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import { useValidationStore } from "@project/core";
import { useTranslation } from "react-i18next";

interface UseEditorValidationOptions {
	editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
	monacoRef: React.RefObject<Monaco | null>;
	path: string;
}

export function useEditorValidation({ editorRef, monacoRef, path }: UseEditorValidationOptions) {
	const errorLensDecorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
	const errorLensStyleRef = useRef<HTMLStyleElement | null>(null);
	const results = useValidationStore((s) => s.results.resultsByPath[path]);
	const { t } = useTranslation();
	const [, startTransition] = useTransition();

	const updateMarkers = useCallback(
		(monaco: Monaco | null, editor: editor.IStandaloneCodeEditor | null) => {
			if (!editor || !monaco) {
				return;
			}

			const model = editor.getModel();

			if (!model) {
				return;
			}

			startTransition(() => {
				const start = Date.now();

				if (!results || results.length === 0) {
					monaco.editor.setModelMarkers(model, "file-validation", []);
					errorLensDecorationsRef.current?.clear();
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

				monaco.editor.setModelMarkers(model, "file-validation", markers);

				const errorDecorations: editor.IModelDeltaDecoration[] = [];
				const modelId = model.uri.toString().replace(/[^a-zA-Z0-9]/g, "_");
				let cssText = "";

				for (const [line, msgs] of lineMessages) {
					const isError = msgs.some((m) => m.severity === "error");
					const combinedMsg = msgs.map((m) => m.message).join("; ");
					const variant = isError ? "error" : "warning";
					const msgCls = `el-msg-${modelId}-l${line}`;

					errorDecorations.push({
						range: new monaco.Range(line, 1, line, model.getLineMaxColumn(line)),
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
					errorLensDecorationsRef.current = editor.createDecorationsCollection(errorDecorations);
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

				const duration = Date.now() - start;
				if (duration > 10) {
					console.warn(`updateMarkers took ${duration}ms`);
				}
			});
		},
		[results, t],
	);

	const monaco = monacoRef.current;
	const editor = editorRef.current;

	useEffect(() => {
		updateMarkers(monaco, editor);
	}, [updateMarkers, startTransition, monaco, editor]);

	useEffect(() => {
		return () => {
			errorLensDecorationsRef.current?.clear();
			errorLensDecorationsRef.current = null;
			errorLensStyleRef.current?.remove();
			errorLensStyleRef.current = null;
		};
	}, []);

	return { updateMarkers };
}
