import type { languages } from "monaco-editor";
import { COLOR_NAMES, getColorTagRules } from "./colorTags";

export const JSON_MINDUSTRY_LANGUAGE_ID = "json-mindustry";

export const jsonMindustryMonarchGrammar: languages.IMonarchLanguage = {
	defaultToken: "",
	tokenPostfix: ".json",

	brackets: [
		{ open: "{", close: "}", token: "delimiter.curly" },
		{ open: "[", close: "]", token: "delimiter.square" },
	],

	keywords: ["true", "false", "null"],

	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	tokenizer: {
		root: [
			{ include: "@whitespace" },

			[/"/, { token: "string.quote", bracket: "@open", next: "@string_double" }],

			[/[+\-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+\-]?\d+)?/, "number"],

			[/[{}\[\]]/, "@brackets"],

			[/[a-zA-Z_$][\w$]*/, { cases: { "@keywords": "keyword", "@default": "identifier" } }],

			[/:/, "delimiter"],
			[/,/, "delimiter.comma"],
		],

		whitespace: [[/[ \t\r\n]+/, "white"]],

		string_double: [
			...getColorTagRules("string_double"),
			[/[^\\"[\]]+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
		],

		// Color tag states
		...COLOR_NAMES.reduce(
			(acc, name) => {
				acc[`string_double_${name}`] = [
					...getColorTagRules("string_double"),
					[/[^\\"[\]]+/, `color-text.${name}`],
					[/@escapes/, `color-text.${name}`],
					[/\\./, `color-text.${name}`],
					[/"/, { token: "string.quote", bracket: "@close", next: "@popall" }],
				];
				return acc;
			},
			{} as Record<string, languages.IMonarchLanguageRule[]>,
		),

		string_double_hex: [
			...getColorTagRules("string_double"),
			[/[^\\"[\]]+/, "color-text.hex"],
			[/@escapes/, "color-text.hex"],
			[/\\./, "color-text.hex"],
			[/"/, { token: "string.quote", bracket: "@close", next: "@popall" }],
		],
	},
};

export const jsonMindustryLanguageConfig: languages.LanguageConfiguration = {
	brackets: [
		["{", "}"],
		["[", "]"],
	],
	autoClosingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: '"', close: '"', notIn: ["string"] },
	],
	surroundingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: '"', close: '"' },
	],
};
