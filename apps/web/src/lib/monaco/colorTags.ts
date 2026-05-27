import type { editor, languages } from "monaco-editor";

export const MINDUSTRY_COLORS = {
	accent: "#ffd37f",
	white: "#ffffff",
	lightGray: "#bfbfbf",
	gray: "#7f7f7f",
	darkGray: "#3f3f3f",
	black: "#000000",
	clear: "#00000000",
	blue: "#0000ff",
	navy: "#000080",
	royal: "#4169e1",
	slate: "#708090",
	sky: "#87ceeb",
	cyan: "#00ffff",
	teal: "#008080",
	green: "#00ff00",
	acid: "#7fff00",
	lime: "#32cd32",
	forest: "#228b22",
	olive: "#6b8e23",
	yellow: "#ffff00",
	gold: "#ffd700",
	goldenrod: "#daa520",
	orange: "#ffa500",
	brown: "#8b4513",
	tan: "#d2b48c",
	brick: "#b22222",
	red: "#ff0000",
	scarlet: "#ff341c",
	crimson: "#dc143c",
	coral: "#ff7f50",
	salmon: "#fa8072",
	pink: "#ff69b4",
	magenta: "#ff00ff",
	purple: "#a020f0",
	violet: "#ee82ee",
	maroon: "#b03060",
} as const satisfies Record<string, string>;

export const COLOR_NAMES = Object.keys(MINDUSTRY_COLORS) as Array<keyof typeof MINDUSTRY_COLORS>;

export const MONACO_THEME_LIGHT = "mindustry-vs";
export const MONACO_THEME_DARK = "mindustry-vs-dark";
const INLINE_COLOR_STYLE_ID = "mindustry-monaco-inline-colors";
const inlineColorClasses = new Set<string>();
const MINDUSTRY_HEX_COLOR = "#(?:[0-9a-fA-F]{1,6}|[0-9a-fA-F]{8})";
const COLOR_TAG_PATTERN = new RegExp(`^\\[(${MINDUSTRY_HEX_COLOR}|[a-zA-Z]+)\\]`);

export type MindustryColorTagKind = "named" | "hex";

export interface MindustryColorTagMatch {
	type: "color";
	startIndex: number;
	endIndex: number;
	startColumn: number;
	endColumn: number;
	text: string;
	tagValue: string;
	kind: MindustryColorTagKind;
	resolvedColor: string;
}

export interface MindustryResetTagMatch {
	type: "reset";
	startIndex: number;
	endIndex: number;
	startColumn: number;
	endColumn: number;
	text: "[]";
}

export type MindustryStringTagMatch = MindustryColorTagMatch | MindustryResetTagMatch;

export function getColorTagRules(statePrefix: string): languages.IMonarchLanguageRule[] {
	const namedRules = COLOR_NAMES.map(
		(name) =>
			[
				new RegExp(`\\[${name}\\]`),
				{ token: `color-tag.${name}`, next: `@${statePrefix}_${name}` } as languages.IMonarchLanguageAction,
			] as unknown as languages.IMonarchLanguageRule,
	);

	return [
		...namedRules,
		// Hex colors
		[new RegExp(`\\[(${MINDUSTRY_HEX_COLOR})\\]`), { token: "color-tag.hex", next: `@${statePrefix}_hex` }],
		// Reset
		[/\[\]/, { token: "color-tag.reset", next: `@${statePrefix}` }],
	];
}

export function getColorThemeRules(): editor.ITokenThemeRule[] {
	return COLOR_NAMES.flatMap((name) => {
		const foreground = MINDUSTRY_COLORS[name]!.replace("#", "");
		return [
			{ token: `color-tag.${name}`, foreground, fontStyle: "bold" },
			{ token: `color-text.${name}`, foreground },
		];
	});
}

export function isMindustryNamedColor(tag: string): tag is keyof typeof MINDUSTRY_COLORS {
	return tag in MINDUSTRY_COLORS;
}

export function resolveMindustryColor(tag: string): string | null {
	if (isMindustryNamedColor(tag)) {
		return MINDUSTRY_COLORS[tag] ?? null;
	}
	if (new RegExp(`^${MINDUSTRY_HEX_COLOR}$`).test(tag)) {
		const hex = tag.slice(1);
		if (hex.length === 8) {
			return `#${hex}`;
		}
		const rgb = hex.padEnd(6, "0");
		return `#${rgb}ff`;
	}
	return null;
}

export function toPickerColorValue(color: string): string | null {
	const normalized = color.trim().match(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
	if (!normalized) return null;
	return `#${normalized[1]!.slice(0, 6).toLowerCase()}`;
}

export function formatMindustryColorTag(value: string): string | null {
	if (isMindustryNamedColor(value)) {
		return `[${value}]`;
	}

	const pickerColor = toPickerColorValue(value);
	if (!pickerColor) return null;
	return `[${pickerColor}]`;
}

export function parseMindustryStringTags(line: string): MindustryStringTagMatch[] {
	const matches: MindustryStringTagMatch[] = [];
	let quote: '"' | "'" | null = null;

	for (let index = 0; index < line.length; index += 1) {
		const char = line[index];
		if (!char) continue;

		if (!quote) {
			if (char === '"' || char === "'") {
				quote = char;
			}
			continue;
		}

		if (char === "\\") {
			index += 1;
			continue;
		}

		if (char === quote) {
			quote = null;
			continue;
		}

		if (char !== "[") {
			continue;
		}

		if (line.startsWith("[]", index)) {
			matches.push({
				type: "reset",
				startIndex: index,
				endIndex: index + 2,
				startColumn: index + 1,
				endColumn: index + 3,
				text: "[]",
			});
			index += 1;
			continue;
		}

		const colorMatch = line.slice(index).match(COLOR_TAG_PATTERN);
		if (!colorMatch) continue;

		const text = colorMatch[0];
		const tagValue = colorMatch[1] ?? "";
		const resolvedColor = resolveMindustryColor(tagValue);
		if (!resolvedColor) continue;

		matches.push({
			type: "color",
			startIndex: index,
			endIndex: index + text.length,
			startColumn: index + 1,
			endColumn: index + text.length + 1,
			text,
			tagValue,
			kind: tagValue.startsWith("#") ? "hex" : "named",
			resolvedColor,
		});
		index += text.length - 1;
	}

	return matches;
}

export function findEditableColorTagAtColumn(line: string, column: number): MindustryColorTagMatch | null {
	if (column < 1) return null;
	const cursorIndex = column - 1;

	for (const match of parseMindustryStringTags(line)) {
		if (match.type !== "color") continue;
		if (cursorIndex >= match.startIndex && cursorIndex < match.endIndex) {
			return match;
		}
	}

	return null;
}

export function ensureInlineColorClass(color: string): string {
	const className = `mindustry-inline-color-${color.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
	if (typeof document === "undefined" || inlineColorClasses.has(className)) {
		return className;
	}

	let styleElement = document.getElementById(INLINE_COLOR_STYLE_ID) as HTMLStyleElement | null;
	if (!styleElement) {
		styleElement = document.createElement("style");
		styleElement.id = INLINE_COLOR_STYLE_ID;
		document.head.appendChild(styleElement);
	}

	styleElement.appendChild(document.createTextNode(`.monaco-editor .${className} { color: ${color} !important; }`));
	inlineColorClasses.add(className);
	return className;
}
