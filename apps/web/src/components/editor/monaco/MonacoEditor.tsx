import { useMemo, useRef } from "react";
import { debounce } from "@project/utils";
import type { editor, IDisposable } from "monaco-editor";
import Editor, { type BeforeMount, type OnMount, type Monaco } from "@monaco-editor/react";
import { HJSON_LANGUAGE_ID, hjsonMonarchGrammar, hjsonLanguageConfig } from "~/lib/monaco/hjsonLanguage";
import { JSON_MINDUSTRY_LANGUAGE_ID, jsonMindustryMonarchGrammar, jsonMindustryLanguageConfig } from "~/lib/monaco/jsonMindustryLanguage";
import { getColorThemeRules, MONACO_THEME_DARK, MONACO_THEME_LIGHT } from "~/lib/monaco/colorTags";
import { useAppStore } from "@project/core";
import { configureMonaco } from "~/lib/monaco/setup";
import { useMonacoTheme } from "#/lib/monaco/use-monaco-theme";
import { Spinner } from "#/components/ui/spinner";
import { useEditorValidation } from "./useEditorValidation";
import { useColorTagDecorations } from "./useColorTagDecorations";
import { useColorTagPicker } from "./useColorTagPicker";
import { useFileEventSubscription } from "./useFileEventSubscription";
import { ColorTagPopover } from "./ColorTagPopover";

interface MonacoEditorProps {
	value: string;
	onChange: (value: string) => void;
	language?: string;
	readOnly?: boolean;
	path: string;
}

const ERROR_LENS_STYLE_ID = "el-global-styles";

function ensureErrorLensStyles(): void {
	if (document.getElementById(ERROR_LENS_STYLE_ID)) return;
	const style = document.createElement("style");
	style.id = ERROR_LENS_STYLE_ID;
	style.textContent = `
    .el-bg-error{background:rgba(255,80,80,0.1)}
    .el-bg-warning{background:rgba(255,200,0,0.06)}
  `;
	document.head.appendChild(style);
}

export function MonacoEditor({ value, onChange, language, readOnly, path }: MonacoEditorProps) {
	const monacoRef = useRef<Monaco | null>(null);
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const editorDisposablesRef = useRef<IDisposable[]>([]);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	const debouncedOnChange = useMemo(
		() => debounce((value: string) => onChangeRef.current(value), 50),
		[],
	);
	const theme = useMonacoTheme();
	const fontSize = useAppStore((s) => s.settings.fontSize);
	const tabSize = useAppStore((s) => s.settings.tabSize);
	const monacoConfigured = useRef(false);

	if (!monacoConfigured.current) {
		configureMonaco();
		ensureErrorLensStyles();
		monacoConfigured.current = true;
	}

	const { updateMarkers } = useEditorValidation({ editorRef, monacoRef, path });

	const { updateColorDecorations } = useColorTagDecorations({ editorRef, monacoRef, value, language });

	const { activeColorTag, setupColorTagDisposables, handleNamedColorPick, handleCustomColorPick } = useColorTagPicker({
		editorRef,
		monacoRef,
		readOnly,
		containerRef,
		value,
		language,
	});

	useFileEventSubscription(path);

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

		const existingHjson = monaco.languages.getLanguages().find((l) => l.id === HJSON_LANGUAGE_ID);
		if (!existingHjson) {
			monaco.languages.register({ id: HJSON_LANGUAGE_ID });
			monaco.languages.setMonarchTokensProvider(HJSON_LANGUAGE_ID, hjsonMonarchGrammar);
			monaco.languages.setLanguageConfiguration(HJSON_LANGUAGE_ID, hjsonLanguageConfig);
		}

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
		editorDisposablesRef.current.forEach((d) => d.dispose());
		editorDisposablesRef.current = setupColorTagDisposables(editor);
	};

	return (
		<div ref={containerRef} className="relative h-full w-full flex">
			<Editor
				className="rounded overflow-hidden bg-card"
				key={path}
				theme={theme}
				language={language}
				value={value}
				onChange={(newValue) => debouncedOnChange(newValue ?? "")}
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
			{activeColorTag && (
				<ColorTagPopover
					activeColorTag={activeColorTag}
					onNamedColorPick={handleNamedColorPick}
					onCustomColorPick={handleCustomColorPick}
				/>
			)}
		</div>
	);
}
