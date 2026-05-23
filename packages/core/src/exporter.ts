import type { ProjectInfo, ProjectLanguage, ProjectEventMap, EventBus } from "./index.js";
import { JsonExporter } from "./json-exporter.js";

export interface ExportFs {
	readdir(path: string): Promise<{ name: string; path: string; kind: "file" | "directory" }[]>;
	listFiles(dir: string, options?: { recursive?: boolean }): Promise<{ name: string; path: string; kind: "file" | "directory" }[]>;
	readFile(path: string): Promise<ArrayBuffer>;
	readTextFile(path: string): Promise<string>;
}

export interface ExportContext {
	project: ProjectInfo;
	fs: ExportFs;
	events: EventBus<ProjectEventMap>;
}

export interface Exporter {
	export(context: ExportContext): Promise<Uint8Array>;
}

export function getExporter(language: ProjectLanguage): Exporter {
	switch (language) {
		case "json":
			return new JsonExporter();
		default:
			throw new Error(`Export not yet supported for language: ${language}`);
	}
}
