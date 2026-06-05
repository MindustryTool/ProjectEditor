import { useState, useCallback, useEffect } from "react";
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

			const anchor = editor.getScrolledVisiblePosition({
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
		[readOnly, editorRef],
	);

	const refreshActiveColorTag = useCallback(
		(position?: IPosition | null) => {
			setActiveColorTag(resolveActiveColorTag(position));
		},
		[resolveActiveColorTag],
	);

	const replaceActiveColorTag = useCallback(
		(replacement: string) => {
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
					refreshActiveColorTag(event.selection.getPosition());
				}),
				editor.onDidScrollChange(() => refreshActiveColorTag()),
				editor.onDidLayoutChange(() => refreshActiveColorTag()),
				editor.onMouseDown((event) => refreshActiveColorTag(event.target.position)),
				editor.onDidChangeModel(() => clearActiveColorTag()),
			];
		},
		[clearActiveColorTag, refreshActiveColorTag],
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
