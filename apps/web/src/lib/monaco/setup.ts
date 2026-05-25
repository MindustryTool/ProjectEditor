import { loader } from "@monaco-editor/react";

const MONACO_CDN = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs";

export function configureMonaco() {
  loader.config({
    paths: { vs: MONACO_CDN },
    "vs/nls": { availableLanguages: {} },
  });
}
