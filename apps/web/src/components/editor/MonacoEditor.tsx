import { useRef } from "react";
import Editor, { type BeforeMount } from "@monaco-editor/react";
import { configureMonaco } from "~/lib/monaco/setup";
import { HJSON_LANGUAGE_ID, hjsonMonarchGrammar, hjsonLanguageConfig } from "~/lib/monaco/hjsonLanguage";
import { useMonacoTheme } from "~/lib/monaco/useMonacoTheme";

configureMonaco();

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export function MonacoEditor({ value, onChange, language, readOnly }: MonacoEditorProps) {
  const theme = useMonacoTheme();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleBeforeMount: BeforeMount = (monaco) => {
    const existingLang = monaco.languages.getLanguages().find((l) => l.id === HJSON_LANGUAGE_ID);
    if (!existingLang) {
      monaco.languages.register({ id: HJSON_LANGUAGE_ID });
      monaco.languages.setMonarchTokensProvider(HJSON_LANGUAGE_ID, hjsonMonarchGrammar);
      monaco.languages.setLanguageConfiguration(HJSON_LANGUAGE_ID, hjsonLanguageConfig);
    }
  };

  return (
    <Editor
      theme={theme}
      language={language}
      value={value}
      onChange={(newValue) => onChangeRef.current(newValue ?? "")}
      beforeMount={handleBeforeMount}
      options={{
        readOnly,
        minimap: { enabled: true },
        fontSize: 13,
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
