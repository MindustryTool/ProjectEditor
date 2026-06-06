import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { debounce } from "@project/utils";
import type { editor, IDisposable, IPosition } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import {
	findEditableColorTagAtColumn,
	formatMindustryColorTag,
	toPickerColorValue,
	type MINDUSTRY_COLORS,
	type MindustryColorTagMatch,
} from "~/lib/monaco/colorTags";

export interface ActiveColorTagState extends MindustryColorTagMatch {
	lineNumber: number;
	top: number;
	left: number;
	pickerColor: string;
}

interface UseColorTagPickerOptions {
	editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
	monacoRef: React.MutableRefObject<Monaco | null>;
	readOnly?: boolean;
	containerRef: React.RefObject<HTMLDivElement | null>;
	value: string;
	language?: string;
}

export function useColorTagPicker({ editorRef, monacoRef, readOnly, containerRef, value, language }: UseColorTagPickerOptions) {
	const [activeColorTag, setActiveColorTag] = useState<ActiveColorTagState | null>(null);

	const clearActiveColorTag = useCallback(() => {
		setActiveColorTag(null);
	}, []);

	const resolveActiveColorTag = useCallback(
		(position?: IPosition | null): ActiveColorTagState | null => {
			if (readOnly) return null;

			const editor = editorRef.current;
			if (!editor) return null;

			const model = editor.getModel();
			const currentPosition = position ?? editor.getPosition();
			if (!model || !currentPosition) return null;

			const line = model.getLineContent(currentPosition.lineNumber);
			const match = findEditableColorTagAtColumn(line, currentPosition.column);
			if (!match) return null;

			const start = Date.now();

			const anchor = editor.getScrolledVisiblePosition({
				lineNumber: currentPosition.lineNumber,
				column: match.endColumn,
			});
			if (!anchor) return null;

			const duration = Date.now() - start;
			
            if (duration > 10) {
				console.warn(`resolveActiveColorTag took ${duration}ms`);
			}

			return {
				...match,
				lineNumber: currentPosition.lineNumber,
				top: anchor.top + anchor.height + 6,
				left: anchor.left,
				pickerColor: toPickerColorValue(match.resolvedColor) ?? "#ffffff",
			};
		},
		[readOnly, editorRef],
	);

	const refreshActiveColorTag = useCallback(
		(position?: IPosition | null) => {
            const start = Date.now();
			setActiveColorTag(resolveActiveColorTag(position));
			const duration = Date.now() - start;
			if (duration > 10) {
				console.warn(`refreshActiveColorTag took ${duration}ms`);
			}
		},
		[resolveActiveColorTag],
	);

	const refreshActiveColorTagRef = useRef(refreshActiveColorTag);
	refreshActiveColorTagRef.current = refreshActiveColorTag;

	const debouncedRefresh = useMemo(() => debounce((position?: IPosition | null) => refreshActiveColorTagRef.current(position), 50), []);

	const replaceActiveColorTag = useCallback(
		(replacement: string) => {
            const start = Date.now();
			const editor = editorRef.current;
			const monaco = monacoRef.current;
			const activeTag = activeColorTag;
			if (!editor || !monaco || !activeTag || readOnly) return;

			const range = new monaco.Range(activeTag.lineNumber, activeTag.startColumn, activeTag.lineNumber, activeTag.endColumn);

			editor.pushUndoStop();
			editor.executeEdits("mindustry-color-picker", [{ range, text: replacement, forceMoveMarkers: true }]);
			editor.pushUndoStop();

			const nextPosition = {
				lineNumber: activeTag.lineNumber,
				column: activeTag.startColumn + Math.min(replacement.length - 1, 1),
			};
			editor.setPosition(nextPosition);
			editor.focus();
			refreshActiveColorTag(nextPosition);
			const duration = Date.now() - start;
			if (duration > 10) {
				console.warn(`replaceActiveColorTag took ${duration}ms`);
			}
		},
		[activeColorTag, readOnly, editorRef, monacoRef, refreshActiveColorTag],
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

	const setupColorTagDisposables = useCallback(
		(editor: editor.IStandaloneCodeEditor): IDisposable[] => {
			return [
				editor.onDidChangeCursorSelection((event) => {
					if (!event.selection.isEmpty()) {
						clearActiveColorTag();
						return;
					}
					debouncedRefresh(event.selection.getPosition());
				}),
				editor.onDidScrollChange(() => debouncedRefresh()),
				editor.onDidLayoutChange(() => debouncedRefresh()),
				editor.onMouseDown((event) => debouncedRefresh(event.target.position)),
				editor.onDidChangeModel(() => clearActiveColorTag()),
			];
		},
		[clearActiveColorTag, debouncedRefresh],
	);

	useEffect(() => {
		refreshActiveColorTag();
	}, [refreshActiveColorTag, value, language]);

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
	}, [clearActiveColorTag, containerRef]);

	return {
		activeColorTag,
		setupColorTagDisposables,
		handleNamedColorPick,
		handleCustomColorPick,
	};
}
