import type { Exporter, ExportContext } from "./exporter.js";
import { createZip, type ZipEntry } from "@project/zip";

export class JsonExporter implements Exporter {
	async export(context: ExportContext): Promise<Uint8Array> {
		const entriesInProject = await context.fs.listFiles("", { recursive: true });
		const projectRootPrefix = `/projects/${context.project.id}/`;
		const entries: ZipEntry[] = [];
		for (const entry of entriesInProject) {
			if (entry.kind !== "file") continue;
			const relativePath = entry.path.startsWith(projectRootPrefix) ? entry.path.slice(projectRootPrefix.length) : entry.path;
			const data = await context.fs.readFile(entry.path);
			if (data === null) {
				console.warn(`File not found ${entry.path}`);
				continue;
			}
			entries.push({ name: `${context.project.name}/${relativePath}`, data: new Uint8Array(data) });
		}
		return createZip(entries);
	}
}
