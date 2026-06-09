import type { EventBus, ProjectEventMap, ProjectInfo } from "#/types";

export interface ExportFs {
	readdir(path: string): Promise<{ name: string; path: string; kind: "file" | "directory" }[]>;
	listFiles(dir: string, options?: { recursive?: boolean }): Promise<{ name: string; path: string; kind: "file" | "directory" }[]>;
	readFile(path: string): Promise<ArrayBuffer | null>;
	readTextFile(path: string): Promise<string | null>;
}

export interface ExportContext {
	project: ProjectInfo;
	fs: ExportFs;
	events: EventBus<ProjectEventMap>;
}

export interface Exporter {
	export(context: ExportContext): Promise<Uint8Array>;
}
