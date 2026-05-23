import { ProjectInfoSchema } from "@project/validation"
import { sanitizeFilename } from "@project/utils"
import * as v from "valibot"

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

export interface EventBus<T extends EventMap = EventMap> {
  on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe;
  emit<K extends keyof T>(event: K, ...args: T[K]): void;
}

export function createEventBus<T extends EventMap = EventMap>(): EventBus<T> {
  const handlers = new Map<string, Set<(...args: unknown[]) => void>>();

  function on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe {
    const key = String(event);
    if (!handlers.has(key)) handlers.set(key, new Set());
    handlers.get(key)!.add(handler as (...args: unknown[]) => void);
    return () => { handlers.get(key)?.delete(handler as (...args: unknown[]) => void); };
  }

  function emit<K extends keyof T>(event: K, ...args: T[K]): void {
    const key = String(event);
    handlers.get(key)?.forEach((h) => h(...args));
  }

  return { on, emit };
}

export { getExporter } from "./exporter.js";
export type { Exporter, ExportContext, ExportFs } from "./exporter.js";
export { JsonExporter } from "./json-exporter.js";

export interface ProjectEventMap extends EventMap {
  "file:changed": [{ path: string; kind: "write" | "delete" | "rename" }];
  "project:saved": [];
  "project:opened": [{ projectId: string }];
}
