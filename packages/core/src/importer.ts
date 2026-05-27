import { extractZip, getTextContent, type ZipEntry } from "@project/zip";

export interface ImportResult {
	name: string;
	language: "json";
	entries: ZipEntry[];
}

function isGitPath(name: string): boolean {
	return (
		name.startsWith(".git/") ||
		name === ".gitignore" ||
		name.endsWith("/.gitignore") ||
		name === ".gitattributes" ||
		name.endsWith("/.gitattributes") ||
		name === ".gitmodules" ||
		name.endsWith("/.gitmodules")
	);
}

export async function importProject(zipData: Uint8Array): Promise<ImportResult> {
	const entries = await extractZip(zipData);

	const modHjsonEntry =
		entries.find((e) => e.name === "mod.hjson" || e.name === "mod.json") ??
		entries.find((e) => e.name.endsWith("/mod.hjson") || e.name.endsWith("/mod.json"));

	if (!modHjsonEntry) {
		throw new Error("No mod.hjson found in zip");
	}

	const rootFolder =
		modHjsonEntry.name === "mod.hjson" || modHjsonEntry.name === "mod.json"
			? ""
			: modHjsonEntry.name.slice(0, modHjsonEntry.name.lastIndexOf("/") + 1);

	const content = getTextContent(modHjsonEntry);
	const nameMatch = content.match(/name:\s*"?([^"\n\r]+)"?/);
	const name = nameMatch?.[1]?.trim() ?? "Imported Project";

	const scopedEntries = entries
		.filter((e) => e.name !== modHjsonEntry.name)
		.map((e) => ({
			...e,
			name: rootFolder ? e.name.slice(rootFolder.length) : e.name,
		}))
		.filter((e) => e.name.length > 0 && !e.name.endsWith("/") && !isGitPath(e.name));

	return { name, language: "json", entries: scopedEntries };
}
