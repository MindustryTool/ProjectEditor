import type { languages } from "monaco-editor";
import { COLOR_NAMES, getColorTagRules } from "./colorTags";

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

		whitespace: [[/[ \t\r\n]+/, "white"]],

		string_double: [
			...getColorTagRules("string_double"),
			[/[^\\"[\]]+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
		],

		string_single: [
			...getColorTagRules("string_single"),
			[/[^\\'[\]]+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/'/, { token: "string.quote", bracket: "@close", next: "@pop" }],
		],

		// Color tag states
		...COLOR_NAMES.reduce(
			(acc: Record<string, languages.IMonarchLanguageRule[]>, name) => {
				acc[`string_double_${name}`] = [
					...getColorTagRules("string_double"),
					[/[^\\"[\]]+/, `color-text.${name}`],
					[/@escapes/, `color-text.${name}`],
					[/\\./, `color-text.${name}`],
					[/"/, { token: "string.quote", bracket: "@close", next: "@popall" }],
				];
				acc[`string_single_${name}`] = [
					...getColorTagRules("string_single"),
					[/[^\\'[\]]+/, `color-text.${name}`],
					[/@escapes/, `color-text.${name}`],
					[/\\./, `color-text.${name}`],
					[/'/, { token: "string.quote", bracket: "@close", next: "@popall" }],
				];
				return acc;
			},
			{},
		),

		string_double_hex: [
			...getColorTagRules("string_double"),
			[/[^\\"[\]]+/, "color-text.hex"],
			[/@escapes/, "color-text.hex"],
			[/\\./, "color-text.hex"],
			[/"/, { token: "string.quote", bracket: "@close", next: "@popall" }],
		],

		string_single_hex: [
			...getColorTagRules("string_single"),
			[/[^\\'[\]]+/, "color-text.hex"],
			[/@escapes/, "color-text.hex"],
			[/\\./, "color-text.hex"],
			[/'/, { token: "string.quote", bracket: "@close", next: "@popall" }],
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
