import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectInfo, EventBus, ProjectEventMap } from "@project/core";
import type { FileEntry, ProjectFileSystem } from "@project/fs";

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
	constructor(private readonly entries: FileEntry[]) {}

	getEntries() {
		return this.entries;
	}

	contains(path: string) {
		return this.entries.some((e) => e.path === path);
	}

	getEntry(path: string) {
		return this.entries.find((e) => e.path === path);
	}
}
interface ProjectSession {
	projectContext: ProjectContext | null;
	treeSnapshot: TreeSnapshot;
	recentlyOpenedFiles: Record<string, RecentFileEntry[]>;

	setCurrentProject: (context: ProjectContext | null) => void;
	updateCurrentProject: (patch: Partial<ProjectInfo>) => void;
	reset: () => void;
	recordFileAccess: (projectId: string, path: string) => void;
	removeFromRecentFiles: (projectId: string, path: string) => void;
	clearRecentFiles: (projectId: string) => void;
}

export const useProjectSession = create<ProjectSession>()(
	persist(
		(set) => ({
			projectContext: null,
			treeSnapshot: new TreeSnapshot([]),
			recentlyOpenedFiles: {},

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
					const { [projectId]: _, ...rest } = state.recentlyOpenedFiles;
					return { recentlyOpenedFiles: rest };
				});
			},
		}),
		{
			name: "project-session",
			partialize: (state) => ({
				recentlyOpenedFiles: state.recentlyOpenedFiles,
			}),
		},
	),
);

export function useCurrentProject() {
	const state = useProjectSession((state) => state.projectContext);
	if (state === null) throw new Error("No project project context");
	return state;
}
