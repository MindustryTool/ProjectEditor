import type { editor, languages } from "monaco-editor";

export const MINDUSTRY_COLORS: Record<string, string> = {
	accent: "#ffd37f",
	scarlet: "#ff4c4c",
	cyan: "#00ffff",
	white: "#ffffff",
	gray: "#7f7f7f",
	black: "#000000",
	red: "#ff0000",
	orange: "#ff7f00",
	yellow: "#ffff00",
	green: "#00ff00",
	blue: "#0000ff",
	purple: "#7f00ff",
	magenta: "#ff00ff",
	pink: "#ff7f7f",
};

export const COLOR_NAMES = Object.keys(MINDUSTRY_COLORS) as Array<keyof typeof MINDUSTRY_COLORS>;

export const MONACO_THEME_LIGHT = "mindustry-vs";
export const MONACO_THEME_DARK = "mindustry-vs-dark";
const INLINE_COLOR_STYLE_ID = "mindustry-monaco-inline-colors";
const inlineColorClasses = new Set<string>();
const MINDUSTRY_HEX_COLOR = "#(?:[0-9a-fA-F]{1,6}|[0-9a-fA-F]{8})";

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

export function resolveMindustryColor(tag: string): string | null {
	if (tag in MINDUSTRY_COLORS) {
		return MINDUSTRY_COLORS[tag as keyof typeof MINDUSTRY_COLORS] ?? null;
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
