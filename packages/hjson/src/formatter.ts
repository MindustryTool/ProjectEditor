import { Parser } from "./parser.js";
import { stringify, type Space } from "./serializer.js";

export interface HJSONFormatOptions {
	/**
	 * Indent used for normalized output.
	 * Default: `2`.
	 */
	indent?: Space;
	/**
	 * Line ending used for normalized output.
	 * Default: dominant line ending from input, else `\n`.
	 */
	eol?: "\n" | "\r\n";
}

function detectDominantEol(text: string): "\n" | "\r\n" {
	return text.includes("\r\n") ? "\r\n" : "\n";
}

function normalizeEol(text: string, eol: "\n" | "\r\n"): string {
	if (eol === "\n") {
		return text.replace(/\r\n/g, "\n");
	}
	return text.replace(/\r?\n/g, "\r\n");
}

function hasProtectedLayout(text: string): boolean {
	return text.includes("'''") || /(^|[^\w])#/.test(text) || text.includes("//") || text.includes("/*");
}

function isLegacyRootObject(text: string): boolean {
	const trimmed = text.trimStart();
	if (!trimmed) return false;
	return !trimmed.startsWith("{") && !trimmed.startsWith("[") && trimmed.includes(":");
}

function hasTrailingSource(text: string, parsedEndIndex: number | undefined): boolean {
	if (parsedEndIndex === undefined) return false;
	return text.slice(parsedEndIndex).trim().length > 0;
}

function hasUnsafeSeparatorPattern(text: string): boolean {
	return /,\s*,/.test(text);
}

export function format(text: string, options: HJSONFormatOptions = {}): string {
	const tolerant = Parser.parseStructuredTolerant(text);
	if (tolerant.issues.length > 0) {
		return text;
	}

	const eol = options.eol ?? detectDominantEol(text);
	const parsedEndIndex = tolerant.node?.info()?.end.index;

	// Keep source intact when comments, multiline strings, or root-style layout
	// would otherwise be rewritten by serializer and lose authored text.
	if (hasProtectedLayout(text) || isLegacyRootObject(text) || hasTrailingSource(text, parsedEndIndex) || hasUnsafeSeparatorPattern(text)) {
		return normalizeEol(text, eol);
	}

	const parsed = Parser.parse(text);
	const formatted = stringify(parsed, null, options.indent ?? 2);
	return normalizeEol(formatted, eol);
}
