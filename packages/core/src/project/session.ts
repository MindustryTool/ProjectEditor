import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FileEntry } from "@project/fs";
import type { ProjectFileSystem } from "#/project-file-system";
import type { EventBus, ProjectEventMap, ProjectInfo } from "#/types";

export interface ProjectContext {
	project: ProjectInfo;
	fs: ProjectFileSystem;
	events: EventBus<ProjectEventMap>;
}

export interface RecentFileEntry {
	path: string;
	lastAccessedAt: number;
}

const MAX_RECENT_FILES = 50;

interface ProjectSession {
	projectContext: ProjectContext | null;
	treeSnapshot: TreeSnapshot;
	recentlyOpenedFiles: Record<string, RecentFileEntry[]>;
	selectedPath: string | null;
	expanded: Record<string, boolean>;

	setExpanded: (path: string, isExpanded: boolean) => void;
	toggleExpanded: (path: string) => void;
	setManyExpanded: (updates: Record<string, boolean>) => void;
	setCurrentProject: (context: ProjectContext | null) => void;
	updateCurrentProject: (patch: Partial<ProjectInfo>) => void;
	reset: () => void;
	recordFileAccess: (projectId: string, path: string) => void;
	removeFromRecentFiles: (projectId: string, path: string) => void;
	clearRecentFiles: (projectId: string) => void;
	setSelectedPath: (path: string | null) => void;
}

export const useProjectSession = create<ProjectSession>()(
	persist(
		(set) => ({
			projectContext: null,
			treeSnapshot: new TreeSnapshot([]),
			recentlyOpenedFiles: {},
			selectedPath: null,
			expanded: { "/": true },

			setExpanded: (path, isExpanded) => {
				set((state) => ({
					expanded: { ...state.expanded, [path]: isExpanded },
				}));
			},

			toggleExpanded: (path) => {
				set((state) => ({
					expanded: { ...state.expanded, [path]: !state.expanded[path] },
				}));
			},

			setManyExpanded: (updates) => {
				set((state) => ({
					expanded: { ...state.expanded, ...updates },
				}));
			},

			setCurrentProject: (context) => {
				set((state) => ({
					projectContext: context,
					treeSnapshot: context ? state.treeSnapshot : new TreeSnapshot([]),
				}));
			},

			updateCurrentProject: (patch) => {
				set((state) => {
					if (!state.projectContext) return state;
					const nextProject: ProjectInfo = { ...state.projectContext.project, ...patch };
					return {
						projectContext: { ...state.projectContext, project: nextProject },
					};
				});
			},

			reset: () => {
				set({ projectContext: null, treeSnapshot: new TreeSnapshot([]) });
			},

			recordFileAccess: (projectId, path) => {
				set((state) => {
					const projectFiles = state.recentlyOpenedFiles[projectId] ?? [];
					return {
						recentlyOpenedFiles: {
							...state.recentlyOpenedFiles,
							[projectId]: touchEntry(projectFiles, path, Date.now()),
						},
					};
				});
			},

			removeFromRecentFiles: (projectId, path) => {
				set((state) => {
					const projectFiles = state.recentlyOpenedFiles[projectId] ?? [];
					return {
						recentlyOpenedFiles: {
							...state.recentlyOpenedFiles,
							[projectId]: removeEntry(projectFiles, path),
						},
					};
				});
			},

			clearRecentFiles: (projectId) => {
				set((state) => {
					const rest = { ...state.recentlyOpenedFiles };
					delete rest[projectId];
					return { recentlyOpenedFiles: rest };
				});
			},

			setSelectedPath: (path) => {
				set({ selectedPath: path });
			},
		}),
		{
			name: "project-session",
			partialize: (state) => ({
				recentlyOpenedFiles: state.recentlyOpenedFiles,
				selectedPath: state.selectedPath,
			}),
		},
	),
);

export function useCurrentProject() {
	const state = useProjectSession((state) => state.projectContext);

	if (state === null) {
		throw new Error("No project project context");
	}

	return state;
}

export function selectIsExpanded(path: string) {
	return (state: ProjectSession) => Boolean(state.expanded[path] || false);
}

function evictLRU(entries: RecentFileEntry[]): RecentFileEntry[] {
	if (entries.length <= MAX_RECENT_FILES) return entries;
	const sorted = [...entries].sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
	return sorted.slice(0, MAX_RECENT_FILES);
}

function touchEntry(entries: RecentFileEntry[], path: string, now: number): RecentFileEntry[] {
	const idx = entries.findIndex((e) => e.path === path);
	if (idx >= 0) {
		const updated = [...entries];
		updated[idx] = { ...updated[idx]!, lastAccessedAt: now };
		return evictLRU(updated);
	}
	return evictLRU([...entries, { path, lastAccessedAt: now }]);
}

function removeEntry(entries: RecentFileEntry[], path: string): RecentFileEntry[] {
	return entries.filter((e) => e.path !== path);
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
