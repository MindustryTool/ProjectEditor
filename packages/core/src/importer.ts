import { extractZip, getTextContent, type ZipEntry } from "@project/zip";

export interface ImportResult {
	name: string;
	language: "json";
	entries: ZipEntry[];
}

export async function importProject(zipData: Uint8Array): Promise<ImportResult> {
	const entries = await extractZip(zipData);

	const modHjsonEntry = entries.find((e) => e.name === "mod.hjson")
		?? entries.find((e) => e.name.endsWith("/mod.hjson"));

	if (!modHjsonEntry) {
		throw new Error("No mod.hjson found in zip");
	}

	const rootFolder = modHjsonEntry.name === "mod.hjson"
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
		.filter((e) => e.name.length > 0 && !e.name.endsWith("/"));

	return { name, language: "json", entries: scopedEntries };
}
