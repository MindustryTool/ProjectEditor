import { useCallback, useEffect, useRef, useTransition } from "react";
import type { editor } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import { ensureInlineColorClass, parseMindustryStringTags } from "~/lib/monaco/colorTags";

interface UseColorTagDecorationsOptions {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  monacoRef: React.MutableRefObject<Monaco | null>;
  value: string;
  language?: string;
}

export function useColorTagDecorations({ editorRef, monacoRef, value, language }: UseColorTagDecorationsOptions) {
  const colorDecorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const [, startTransition] = useTransition();

  const updateColorDecorations = useCallback(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const model = editor.getModel();
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
                range: new monaco.Range(lineNumber, segmentStartColumn, lineNumber, index + 1),
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
                  range: new monaco.Range(lineNumber, segmentStartColumn, lineNumber, index + 1),
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
      colorDecorationsRef.current = editor.createDecorationsCollection(decorations);
      return;
    }

    colorDecorationsRef.current.set(decorations);
  }, [editorRef, monacoRef]);

  useEffect(() => {
    startTransition(() => {
      updateColorDecorations();
    });
  }, [updateColorDecorations, value, language, startTransition]);

  useEffect(() => {
    return () => {
      colorDecorationsRef.current?.clear();
      colorDecorationsRef.current = null;
    };
  }, []);

  return { updateColorDecorations };
}
