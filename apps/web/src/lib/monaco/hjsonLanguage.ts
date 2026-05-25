import type { languages } from "monaco-editor";

export const HJSON_LANGUAGE_ID = "hjson";

export const hjsonMonarchGrammar: languages.IMonarchLanguage = {
  defaultToken: "",
  tokenPostfix: ".hjson",

  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
  ],

  keywords: ["true", "false", "null"],

  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      { include: "@whitespace" },
      { include: "@comments" },

      [/"/, { token: "string.quote", bracket: "@open", next: "@string_double" }],
      [/'/, { token: "string.quote", bracket: "@open", next: "@string_single" }],

      [/[+\-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+\-]?\d+)?/, "number"],

      [/[{}\[\]]/, "@brackets"],

      [/[a-zA-Z_$][\w$]*/, { cases: { "@keywords": "keyword", "@default": "identifier" } }],

      [/:|=/, "delimiter"],
      [/,/, "delimiter.comma"],
    ],

    comments: [
      [/#.*$/, "comment"],
      [/\/\/.*$/, "comment"],
      [/\/\*/, "comment", "@comment_block"],
    ],

    comment_block: [
      [/\*\//, "comment", "@pop"],
      [/./, "comment"],
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
    ],

    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],

    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],
  },
};

export const hjsonLanguageConfig: languages.LanguageConfiguration = {
  comments: { lineComment: "#" },
  brackets: [
    ["{", "}"],
    ["[", "]"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string"] },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};
