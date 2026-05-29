import { ProjectInfoSchema } from "@project/schema";
import { sanitizeFilename } from "@project/utils";
import * as v from "valibot";

export type ProjectLanguage = "json" | "java" | "javascript";

export interface ProjectInfo {
	id: string;
	name: string;
	language: ProjectLanguage;
	createdAt: Date;
	updatedAt: Date;
}

export function createProjectInfo(name: string, language: ProjectLanguage = "json"): ProjectInfo {
	return {
		id: crypto.randomUUID(),
		name,
		language,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}

export function validateProject(data: unknown): ProjectInfo {
	const parsed = v.safeParse(ProjectInfoSchema, data);
	if (parsed.success) return parsed.output as ProjectInfo;

	if (typeof data === "object" && data !== null && "name" in data && typeof (data as { name: unknown }).name === "string") {
		const originalName = (data as { name: string }).name;
		const sanitizedName = sanitizeFilename(originalName, { maxLength: 100, fallback: "project" });

		if (sanitizedName !== originalName) {
			console.warn(`Project name "${originalName}" contained invalid characters; sanitized to "${sanitizedName}".`);
			return v.parse(ProjectInfoSchema, { ...(data as object), name: sanitizedName }) as ProjectInfo;
		}
	}

	return v.parse(ProjectInfoSchema, data) as ProjectInfo;
}

// EventBus

export type Unsubscribe = () => void;

export type EventMap = Record<string, unknown[]>;

export interface EventBus<T extends { [K in keyof T]: unknown[] }> {
	on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe;
	off<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void;
	once<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe;
	emit<K extends keyof T>(event: K, ...args: T[K]): void;
}

export function createEventBus<T extends { [K in keyof T]: unknown[] }>(): EventBus<T> {
	const handlers = new Map<string, Set<(...args: unknown[]) => void>>();

	function on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe {
		const key = String(event);
		if (!handlers.has(key)) handlers.set(key, new Set());
		handlers.get(key)!.add(handler as (...args: unknown[]) => void);
		return () => {
			handlers.get(key)?.delete(handler as (...args: unknown[]) => void);
		};
	}

	function off<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void {
		const key = String(event);
		handlers.get(key)?.delete(handler as (...args: unknown[]) => void);
	}

	function once<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe {
		const wrapped = (...args: T[K]) => {
			off(event, wrapped as (...args: T[K]) => void);
			handler(...args);
		};
		return on(event, wrapped as (...args: T[K]) => void);
	}

	function emit<K extends keyof T>(event: K, ...args: T[K]): void {
		const key = String(event);
		const set = handlers.get(key);
		if (!set) return;
		for (const h of [...set]) {
			try {
				h(...args);
			} catch (e) {
				console.error(e);
			}
		}
		console.log(`Emitted ${key} with ${JSON.stringify(args)}`);
	}

	return { on, off, once, emit };
}

export { getExporter } from "./exporter.js";
export type { Exporter, ExportContext, ExportFs } from "./exporter.js";
export { JsonExporter } from "./json-exporter.js";
export { importProject } from "./importer.js";
export type { ImportResult } from "./importer.js";

export interface ProjectEventMap {
	"file:write": [{ path: string }];
	"file:delete": [{ path: string }];
	"file:rename": [{ oldPath: string; newPath: string }];
	"file:create": [{ path: string }];
	"file:mkdir": [{ path: string }];
}
