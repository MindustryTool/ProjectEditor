import { HJSON } from "@project/hjson";

function detectEol(content: string): "\n" | "\r\n" {
	return content.includes("\r\n") ? "\r\n" : "\n";
}

export function canFormatFilePath(path: string | null | undefined): boolean {
	if (!path) return false;

	const loweredPath = path.toLowerCase();
	return loweredPath.endsWith(".json") || loweredPath.endsWith(".hjson");
}

export function formatFileContent(path: string, content: string, options?: { indent: number }): string {
	const loweredPath = path.toLowerCase();
	const eol = detectEol(content);

	if (loweredPath.endsWith(".hjson") || loweredPath.endsWith(".json")) {
		return HJSON.format(content, { eol, indent: options?.indent });
	}

	throw new Error(`Unsupported file type for formatting: ${path}`);
}
