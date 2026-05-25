import { useRef } from "react";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { HJSON_LANGUAGE_ID, hjsonMonarchGrammar, hjsonLanguageConfig } from "~/lib/monaco/hjsonLanguage";
import { useEditorContext } from "./EditorContext";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  filePath?: string;
}

export function MonacoEditor({ value, onChange, language, readOnly }: MonacoEditorProps) {
  const { monacoRef, editorRef, theme, updateMarkers } = useEditorContext();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

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
        onChangeRef.current(next);
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
      loading={
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          Loading editor...
        </div>
      }
    />
  );
}
