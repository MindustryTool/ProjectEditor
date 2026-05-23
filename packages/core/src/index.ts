import { ProjectInfoSchema } from "@project/validation"
import * as v from "valibot"

export interface ProjectInfo {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/** @deprecated Use ProjectInfo instead */
export type Project = ProjectInfo

export function createProjectInfo(name: string): ProjectInfo {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/** @deprecated Use createProjectInfo instead */
export const createProject = createProjectInfo

export function validateProject(data: unknown): ProjectInfo {
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

export interface ProjectEventMap extends EventMap {
  "file:changed": [{ path: string; kind: "write" | "delete" | "rename" }];
  "project:saved": [];
  "project:opened": [{ projectId: string }];
}
