import * as v from "valibot";
import type { FileEntry } from "@project/fs";

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

export class TreeSnapshot {
	readonly items: FileEntry[];
	readonly blocks: FileEntry[];
	readonly liquids: FileEntry[];
	readonly sectors: FileEntry[];
	readonly statuses: FileEntry[];
	readonly units: FileEntry[];
	readonly sounds: FileEntry[];
	readonly sprites: FileEntry[];

	constructor(
		private readonly entries: FileEntry[],
		private readonly old?: TreeSnapshot,
	) {
		const items: FileEntry[] = [];
		const blocks: FileEntry[] = [];
		const liquids: FileEntry[] = [];
		const sectors: FileEntry[] = [];
		const statuses: FileEntry[] = [];
		const units: FileEntry[] = [];
		const sounds: FileEntry[] = [];
		const sprites: FileEntry[] = [];

		for (const entry of this.entries) {
			if (entry.kind === "file") {
				if (entry.path.includes("content/items") && entry.name.endsWith(".json")) {
					items.push(entry);
				} else if (entry.path.includes("content/blocks") && entry.name.endsWith(".json")) {
					blocks.push(entry);
				} else if (entry.path.includes("content/liquids") && entry.name.endsWith(".json")) {
					liquids.push(entry);
				} else if (entry.path.includes("content/sectors") && entry.name.endsWith(".json")) {
					sectors.push(entry);
				} else if (entry.path.includes("content/status") && entry.name.endsWith(".json")) {
					statuses.push(entry);
				} else if (entry.path.includes("content/units") && entry.name.endsWith(".json")) {
					units.push(entry);
				} else if (
					entry.path.includes("sounds/") &&
					(entry.name.endsWith(".mp3") || entry.name.endsWith(".ogg") || entry.name.endsWith(".wav"))
				) {
					sounds.push(entry);
				} else if (entry.path.includes("sprites") && entry.name.endsWith(".png")) {
					sprites.push(entry);
				}
			}
		}

		function compare<T>(target: T[], source: T[]) {
			if (target.length !== source.length) return false;
			for (let i = 0; i < target.length; i++) {
				if (target[i] !== source[i]) return false;
			}
			return true;
		}

		if (this.old) {
			if (compare(items, this.old.items)) {
				this.items = this.old.items;
			} else {
				this.items = items;
			}

			if (compare(blocks, this.old.blocks)) {
				this.blocks = this.old.blocks;
			} else {
				this.blocks = blocks;
			}

			if (compare(liquids, this.old.liquids)) {
				this.liquids = this.old.liquids;
			} else {
				this.liquids = liquids;
			}

			if (compare(sectors, this.old.sectors)) {
				this.sectors = this.old.sectors;
			} else {
				this.sectors = sectors;
			}

			if (compare(statuses, this.old.statuses)) {
				this.statuses = this.old.statuses;
			} else {
				this.statuses = statuses;
			}

			if (compare(units, this.old.units)) {
				this.units = this.old.units;
			} else {
				this.units = units;
			}

			if (compare(sounds, this.old.sounds)) {
				this.sounds = this.old.sounds;
			} else {
				this.sounds = sounds;
			}

			if (compare(sprites, this.old.sprites)) {
				this.sprites = this.old.sprites;
			} else {
				this.sprites = sprites;
			}
		} else {
			this.items = items;
			this.blocks = blocks;
			this.liquids = liquids;
			this.sectors = sectors;
			this.statuses = statuses;
			this.units = units;
			this.sounds = sounds;
			this.sprites = sprites;
		}
	}

	getEntries() {
		return this.entries;
	}

	contains(path: string) {
		return this.entries.some((e) => e.path === path);
	}

	getEntry(path: string) {
		return this.entries.find((e) => e.path === path);
	}

	findContentSpritePath(path: string) {
		const filename = path.split("/").pop()?.replace(".json", "")?.replace(".hjson", "") || null;

		if (!filename) {
			return null;
		}

		return this.entries.find((e) => e.name === filename + ".png")?.path || null;
	}
}
