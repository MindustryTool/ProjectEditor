import * as v from "valibot";

export type Unsubscribe = () => void;

export type EventMap = Record<string, unknown[]>;

export interface EventBus<T extends { [K in keyof T]: unknown[] }> {
	on<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe;
	off<K extends keyof T>(event: K, handler: (...args: T[K]) => void): void;
	once<K extends keyof T>(event: K, handler: (...args: T[K]) => void): Unsubscribe;
	emit<K extends keyof T>(event: K, ...args: T[K]): void;
}

export interface ProjectEventMap {
	"file:write": [{ path: string }];
	"file:delete": [{ path: string }];
	"file:rename": [{ oldPath: string; newPath: string }];
	"file:create": [{ path: string }];
	"file:mkdir": [{ path: string }];
}

const LANGUAGE_VALUES = ["json", "java", "javascript"] as const;

export const ProjectInfoSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	name: v.pipe(v.string(), v.minLength(1), v.maxLength(100), v.regex(/^[a-zA-Z0-9._-]+$/)),
	language: v.optional(v.picklist(LANGUAGE_VALUES), "json"),
	createdAt: v.pipe(v.unknown(), v.toDate()),
	updatedAt: v.pipe(v.unknown(), v.toDate()),
});

export type ProjectLanguage = (typeof LANGUAGE_VALUES)[number];

export interface ProjectInfo {
	id: string;
	name: string;
	language: ProjectLanguage;
	createdAt: Date;
	updatedAt: Date;
}
